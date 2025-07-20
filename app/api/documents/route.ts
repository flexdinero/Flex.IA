import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'
import { uploadFile, deleteFile } from '@/lib/storage'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  type: z.string().optional(),
  claimId: z.string().optional(),
  search: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { page, limit, type, claimId, search } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId: user.userId }

    if (type) where.type = type
    if (claimId) where.claimId = claimId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          claim: {
            select: {
              id: true,
              claimNumber: true,
              title: true
            }
          }
        }
      }),
      prisma.document.count({ where })
    ])

    // Calculate storage statistics
    const storageStats = await prisma.document.aggregate({
      where: { userId: user.userId },
      _sum: { size: true },
      _count: { size: true }
    })

    const typeBreakdown = await prisma.document.groupBy({
      by: ['type'],
      where: { userId: user.userId },
      _count: { type: true },
      _sum: { size: true }
    })

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalSize: storageStats._sum.size || 0,
        totalCount: storageStats._count.size || 0,
        typeBreakdown
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Documents fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const claimId = formData.get('claimId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Verify claim belongs to user if claimId is provided
    if (claimId) {
      const claim = await prisma.claim.findFirst({
        where: {
          id: claimId,
          adjusterId: user.userId
        }
      })

      if (!claim) {
        return NextResponse.json(
          { error: 'Claim not found or not assigned to you' },
          { status: 404 }
        )
      }
    }

    // Upload file to storage
    let uploadResult
    try {
      uploadResult = await uploadFile(file, user.userId)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'File upload failed' },
        { status: 500 }
      )
    }

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        name: name || file.name,
        description,
        type: type || 'OTHER',
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        url: uploadResult.url,
        storageKey: uploadResult.pathname,
        userId: user.userId,
        claimId: claimId || null
      },
      include: {
        claim: {
          select: {
            id: true,
            claimNumber: true,
            title: true
          }
        }
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'Document Uploaded',
        content: `Document "${document.name}" has been uploaded successfully`,
        type: 'DOCUMENT_UPLOADED',
        userId: user.userId
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
