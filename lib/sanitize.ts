import { z } from 'zod'

// HTML sanitization - Edge Runtime compatible
export function sanitizeHtml(html: string, options?: {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  stripTags?: boolean
}): string {
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
    allowedAttributes = { a: ['href', 'title'] },
    stripTags = false
  } = options || {}

  // Simple HTML sanitization for Edge Runtime
  if (stripTags) {
    return html.replace(/<[^>]*>/g, '')
  }

  // Basic HTML tag filtering
  let sanitized = html

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove dangerous event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove style attributes that could contain malicious CSS
  sanitized = sanitized.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '')

  return sanitized
}

// Text sanitization
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., and -
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  return phone
    .replace(/[^\d+()-.\s]/g, '') // Only allow digits, +, (), -, ., and spaces
    .trim()
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol')
    }
    
    return parsed.toString()
  } catch {
    return ''
  }
}

// File name sanitization
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 255) // Limit length
}

// SQL injection prevention (for dynamic queries)
export function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''")
}

// XSS prevention for attributes
export function sanitizeAttribute(value: string): string {
  return value
    .replace(/[<>"']/g, '') // Remove dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Comprehensive input sanitizer
export function sanitizeInput(input: any, type: 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename' = 'text'): string {
  if (typeof input !== 'string') {
    return ''
  }

  switch (type) {
    case 'html':
      return sanitizeHtml(input)
    case 'email':
      return sanitizeEmail(input)
    case 'phone':
      return sanitizePhone(input)
    case 'url':
      return sanitizeUrl(input)
    case 'filename':
      return sanitizeFileName(input)
    case 'text':
    default:
      return sanitizeText(input)
  }
}

// Zod schema helpers with sanitization
export const sanitizedString = (type: 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename' = 'text') =>
  z.string().transform(val => sanitizeInput(val, type))

export const sanitizedEmail = z.string().email().transform(sanitizeEmail)

export const sanitizedUrl = z.string().url().transform(sanitizeUrl)

export const sanitizedHtml = z.string().transform(val => sanitizeHtml(val))

export const sanitizedText = z.string().transform(sanitizeText)

// Object sanitization
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename'>
): T {
  const sanitized = { ...obj }
  
  for (const [key, type] of Object.entries(schema)) {
    if (key in sanitized && typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key], type)
    }
  }
  
  return sanitized
}

// Array sanitization
export function sanitizeArray(
  arr: string[],
  type: 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename' = 'text'
): string[] {
  return arr.map(item => sanitizeInput(item, type))
}

// Deep object sanitization
export function deepSanitize(obj: any, defaultType: 'text' | 'html' = 'text'): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj, defaultType)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item, defaultType))
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deepSanitize(value, defaultType)
    }
    return sanitized
  }
  
  return obj
}

// Content Security Policy helpers (moved to middleware for Edge Runtime compatibility)
// These functions are now defined directly in middleware.ts

// Request body sanitization middleware
export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body
  }

  // Common fields that need specific sanitization
  const fieldSanitizers: Record<string, 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename'> = {
    email: 'email',
    phone: 'phone',
    website: 'url',
    url: 'url',
    filename: 'filename',
    description: 'html',
    content: 'html',
    message: 'html',
    title: 'text',
    name: 'text',
    firstName: 'text',
    lastName: 'text',
    address: 'text',
    city: 'text',
    state: 'text',
    zipCode: 'text'
  }

  const sanitized = { ...body }
  
  for (const [field, type] of Object.entries(fieldSanitizers)) {
    if (field in sanitized && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field], type)
    }
  }

  // Sanitize any remaining string fields as text
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string' && !(key in fieldSanitizers)) {
      sanitized[key] = sanitizeText(value)
    }
  }

  return sanitized
}

// Validation helpers
export function isValidInput(input: string, type: 'email' | 'phone' | 'url'): boolean {
  try {
    switch (type) {
      case 'email':
        return z.string().email().safeParse(input).success
      case 'phone':
        return /^[\+]?[\d\s\-\(\)\.]{10,}$/.test(input)
      case 'url':
        return z.string().url().safeParse(input).success
      default:
        return false
    }
  } catch {
    return false
  }
}
