import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { validateFile, createRateLimiter, RATE_LIMITS, logSecurityEvent, extractClientIP } from '@/lib/security'
import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Rate limiting for file uploads
const uploadLimiter = createRateLimiter(RATE_LIMITS.upload)

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await uploadLimiter(request as any, {} as any)
    if (rateLimitResult) {
      return NextResponse.json(
        { error: 'Too many upload attempts' },
        { status: 429 }
      )
    }

    // Verify authentication
    const session = await verifySessionFromRequest(request)
    if (!session) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: extractClientIP(request),
        userAgent: request.headers.get('user-agent') || '',
        timestamp: new Date(),
        details: { action: 'unauthorized_upload_attempt' }
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const claimId = formData.get('claimId') as string
    const documentType = formData.get('type') as string || 'OTHER'
    const description = formData.get('description') as string

    // Validate input
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 files allowed per upload' },
        { status: 400 }
      )
    }

    // Validate each file
    const validationErrors: string[] = []
    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        validationErrors.push(`${file.name}: ${validation.error}`)
      }
    }

    if (validationErrors.length > 0) {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId: session.userId,
        ip: extractClientIP(request),
        userAgent: request.headers.get('user-agent') || '',
        timestamp: new Date(),
        details: { 
          action: 'invalid_file_upload',
          errors: validationErrors,
          fileNames: files.map(f => f.name)
        }
      })
      return NextResponse.json(
        { error: 'File validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Verify claim ownership if claimId provided
    if (claimId) {
      const claim = await prisma.claim.findFirst({
        where: {
          id: claimId,
          OR: [
            { adjusterId: session.userId },
            { firm: { claims: { some: { adjusterId: session.userId } } } }
          ]
        }
      })

      if (!claim) {
        logSecurityEvent({
          type: 'suspicious_activity',
          userId: session.userId,
          ip: extractClientIP(request),
          userAgent: request.headers.get('user-agent') || '',
          timestamp: new Date(),
          details: { 
            action: 'unauthorized_claim_access',
            claimId 
          }
        })
        return NextResponse.json(
          { error: 'Claim not found or access denied' },
          { status: 403 }
        )
      }
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), 'uploads', 'documents')
    await mkdir(uploadDir, { recursive: true })

    const uploadedFiles = []

    // Process each file
    for (const file of files) {
      try {
        // Generate secure filename
        const fileExtension = file.name.split('.').pop()
        const secureFilename = `${uuidv4()}.${fileExtension}`
        const filePath = join(uploadDir, secureFilename)

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Additional security: scan file content for malicious patterns
        const fileContent = buffer.toString('utf8', 0, Math.min(1024, buffer.length))
        const maliciousPatterns = [
          /<script/i,
          /javascript:/i,
          /vbscript:/i,
          /onload=/i,
          /onerror=/i,
          /<iframe/i,
          /<object/i,
          /<embed/i
        ]

        const isSuspicious = maliciousPatterns.some(pattern => pattern.test(fileContent))
        if (isSuspicious) {
          logSecurityEvent({
            type: 'suspicious_activity',
            userId: session.userId,
            ip: extractClientIP(request),
            userAgent: request.headers.get('user-agent') || '',
            timestamp: new Date(),
            details: { 
              action: 'malicious_file_upload_attempt',
              filename: file.name,
              secureFilename
            }
          })
          continue // Skip this file
        }

        // Write file to disk
        await writeFile(filePath, buffer)

        // Save file metadata to database
        const document = await prisma.document.create({
          data: {
            filename: secureFilename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            type: documentType as any,
            description: description || `Uploaded file: ${file.name}`,
            url: `/uploads/documents/${secureFilename}`,
            userId: session.userId,
            claimId: claimId || null,
            isPublic: false
          }
        })

        uploadedFiles.push({
          id: document.id,
          filename: document.filename,
          originalName: document.originalName,
          size: document.size,
          type: document.type,
          url: document.url
        })

        // Log successful upload
        logSecurityEvent({
          type: 'file_upload',
          userId: session.userId,
          ip: extractClientIP(request),
          userAgent: request.headers.get('user-agent') || '',
          timestamp: new Date(),
          details: {
            documentId: document.id,
            filename: file.name,
            size: file.size,
            type: file.type,
            claimId
          }
        })

      } catch (error) {
        console.error('File upload error:', error)
        // Continue with other files
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'No files were successfully uploaded' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Upload API error:', error)
    
    logSecurityEvent({
      type: 'suspicious_activity',
      ip: extractClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date(),
      details: { 
        action: 'upload_api_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })

    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve file metadata
export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const claimId = searchParams.get('claimId')
    const type = searchParams.get('type')

    const where: any = {
      userId: session.userId
    }

    if (claimId) {
      where.claimId = claimId
    }

    if (type) {
      where.type = type
    }

    const documents = await prisma.document.findMany({
      where,
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        type: true,
        description: true,
        url: true,
        createdAt: true,
        claimId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Document retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove files
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.userId
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      )
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId }
    })

    // TODO: Delete physical file from storage
    // await unlink(join(process.cwd(), 'uploads', 'documents', document.filename))

    logSecurityEvent({
      type: 'file_upload',
      userId: session.userId,
      ip: extractClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date(),
      details: {
        action: 'file_deleted',
        documentId,
        filename: document.originalName
      }
    })

    return NextResponse.json({ message: 'Document deleted successfully' })

  } catch (error) {
    console.error('Document deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
