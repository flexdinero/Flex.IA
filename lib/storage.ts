import { put, del, list, head } from '@vercel/blob'
import { nanoid } from 'nanoid'

export interface UploadResult {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

export interface FileMetadata {
  originalName: string
  mimeType: string
  size: number
  uploadedBy: string
  claimId?: string
  category?: 'document' | 'image' | 'report' | 'other'
}

export class StorageService {
  private readonly maxFileSize = 50 * 1024 * 1024 // 50MB
  private readonly allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    // Archives
    'application/zip',
    'application/x-rar-compressed'
  ]

  async uploadFile(
    file: File | Buffer,
    metadata: FileMetadata
  ): Promise<UploadResult> {
    try {
      // Validate file size
      const fileSize = file instanceof File ? file.size : file.length
      if (fileSize > this.maxFileSize) {
        throw new Error(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`)
      }

      // Validate MIME type
      if (file instanceof File && !this.allowedMimeTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`)
      }

      // Generate unique filename
      const fileExtension = this.getFileExtension(metadata.originalName)
      const uniqueFilename = `${nanoid()}-${Date.now()}${fileExtension}`
      
      // Create folder structure based on category and date
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const category = metadata.category || 'other'
      const pathname = `${category}/${year}/${month}/${uniqueFilename}`

      // Upload to Vercel Blob
      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: false,
        contentType: metadata.mimeType
      })

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: fileSize,
        uploadedAt: new Date()
      }
    } catch (error) {
      console.error('File upload failed:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
  }

  async deleteFile(pathname: string): Promise<boolean> {
    try {
      await del(pathname)
      return true
    } catch (error) {
      console.error('File deletion failed:', error)
      return false
    }
  }

  async getFileInfo(pathname: string) {
    try {
      const info = await head(pathname)
      return {
        url: info.url,
        size: info.size,
        uploadedAt: info.uploadedAt,
        contentType: info.contentType
      }
    } catch (error) {
      console.error('Failed to get file info:', error)
      return null
    }
  }

  async listFiles(prefix?: string) {
    try {
      const { blobs } = await list({ prefix })
      return blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
    } catch (error) {
      console.error('Failed to list files:', error)
      return []
    }
  }

  async uploadClaimDocument(
    file: File,
    claimId: string,
    uploadedBy: string,
    category: 'estimate' | 'photos' | 'report' | 'correspondence' | 'other' = 'other'
  ): Promise<UploadResult> {
    const metadata: FileMetadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedBy,
      claimId,
      category: 'document'
    }

    return this.uploadFile(file, metadata)
  }

  async uploadProfileImage(
    file: File,
    userId: string
  ): Promise<UploadResult> {
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate image size (max 5MB for profile images)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Profile image must be less than 5MB')
    }

    const metadata: FileMetadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedBy: userId,
      category: 'image'
    }

    return this.uploadFile(file, metadata)
  }

  async uploadReportDocument(
    file: File,
    claimId: string,
    uploadedBy: string
  ): Promise<UploadResult> {
    // Validate it's a document
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!documentTypes.includes(file.type)) {
      throw new Error('Report must be a PDF or Word document')
    }

    const metadata: FileMetadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedBy,
      claimId,
      category: 'document'
    }

    return this.uploadFile(file, metadata)
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.')
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
  }

  generateSignedUrl(pathname: string, expiresIn: number = 3600): string {
    // For Vercel Blob, URLs are already signed and public
    // In production, you might want to implement additional security
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/files/${pathname}?expires=${Date.now() + expiresIn * 1000}`
  }

  async cleanupOldFiles(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const allFiles = await this.listFiles()
      let deletedCount = 0

      for (const file of allFiles) {
        if (file.uploadedAt < cutoffDate) {
          const deleted = await this.deleteFile(file.pathname)
          if (deleted) deletedCount++
        }
      }

      return deletedCount
    } catch (error) {
      console.error('Cleanup failed:', error)
      return 0
    }
  }

  validateFileUpload(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`
      }
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      }
    }

    // Check filename
    if (!file.name || file.name.length > 255) {
      return {
        valid: false,
        error: 'Invalid filename'
      }
    }

    return { valid: true }
  }

  getFileCategory(mimeType: string): 'document' | 'image' | 'other' {
    if (mimeType.startsWith('image/')) {
      return 'image'
    }
    
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ]

    if (documentTypes.includes(mimeType)) {
      return 'document'
    }

    return 'other'
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export const storageService = new StorageService()
