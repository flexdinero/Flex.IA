import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

interface Params {
  path: string[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { path: filePath } = await params
    const user = await requireAuth(request)

    if (!filePath || filePath.length < 2) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    const [userId, fileName] = filePath
    const fullPath = path.join(process.env.UPLOAD_DIR || './uploads', userId, fileName)

    // Security check: ensure user can only access their own files or files they have permission to view
    if (userId !== user.userId) {
      // Check if user has permission to view this file (e.g., shared claim documents)
      const document = await prisma.document.findFirst({
        where: {
          storageKey: `${userId}/${fileName}`,
          OR: [
            { userId: user.userId }, // User owns the file
            { 
              claim: { 
                adjusterId: user.userId // User is assigned to the claim
              }
            }
          ]
        }
      })

      if (!document) {
        return NextResponse.json(
          { error: 'File not found or access denied' },
          { status: 404 }
        )
      }
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Get file stats
    const fileStats = await stat(fullPath)
    const fileBuffer = await readFile(fullPath)

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase()
    let contentType = 'application/octet-stream'

    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }

    if (mimeTypes[ext]) {
      contentType = mimeTypes[ext]
    }

    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Length', fileStats.size.toString())
    headers.set('Cache-Control', 'private, max-age=3600') // Cache for 1 hour
    headers.set('Last-Modified', fileStats.mtime.toUTCString())

    // Handle range requests for large files
    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileStats.size - 1
      const chunkSize = (end - start) + 1

      headers.set('Content-Range', `bytes ${start}-${end}/${fileStats.size}`)
      headers.set('Accept-Ranges', 'bytes')
      headers.set('Content-Length', chunkSize.toString())

      const chunk = fileBuffer.slice(start, end + 1)
      return new NextResponse(chunk, {
        status: 206,
        headers
      })
    }

    // For images, add additional headers
    if (contentType.startsWith('image/')) {
      headers.set('X-Content-Type-Options', 'nosniff')
    }

    // For downloads, set content-disposition
    const download = request.nextUrl.searchParams.get('download')
    if (download === 'true') {
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
    } else {
      headers.set('Content-Disposition', `inline; filename="${fileName}"`)
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { path: filePath } = await params
    const user = await requireAuth(request)

    if (!filePath || filePath.length < 2) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    const [userId, fileName] = filePath
    const storageKey = `${userId}/${fileName}`

    // Verify user owns the file
    const document = await prisma.document.findFirst({
      where: {
        storageKey,
        userId: user.userId
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      )
    }

    // Delete file from storage
    const { deleteFile } = await import('@/lib/storage')
    const deleteResult = await deleteFile(storageKey)

    if (!deleteResult) {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    // Delete document record from database
    await prisma.document.delete({
      where: { id: document.id }
    })

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
