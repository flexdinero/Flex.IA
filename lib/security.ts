/**
 * Security Utilities for Flex.IA
 * 
 * Comprehensive security functions for input validation,
 * XSS prevention, SQL injection protection, and more.
 */

import DOMPurify from 'isomorphic-dompurify'
import { NextRequest } from 'next/server'

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  claimNumber: /^[A-Z]{2,4}-\d{4}-\d{3,6}$/,
  licenseNumber: /^[A-Z]{2,4}-\d{4,8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  filename: /^[a-zA-Z0-9._-]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
} as const

// File upload security
export const FILE_SECURITY = {
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  dangerousExtensions: [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
    '.php', '.asp', '.aspx', '.jsp', '.sh', '.ps1', '.py', '.rb', '.pl'
  ]
} as const

// XSS Prevention
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  // Remove any script tags and dangerous content
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  })
  
  return cleaned.trim()
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    KEEP_CONTENT: true
  })
}

// SQL Injection Prevention
export function escapeSQL(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '\\;')
    .replace(/--/g, '\\--')
    .replace(/\/\*/g, '\\/\\*')
    .replace(/\*\//g, '\\*\\/')
}

// Input validation functions
export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email)
}

export function validatePassword(password: string): boolean {
  return VALIDATION_PATTERNS.password.test(password)
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.phone.test(phone)
}

export function validateClaimNumber(claimNumber: string): boolean {
  return VALIDATION_PATTERNS.claimNumber.test(claimNumber)
}

export function validateUrl(url: string): boolean {
  return VALIDATION_PATTERNS.url.test(url)
}

// File upload validation
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_SECURITY.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_SECURITY.maxFileSize / 1024 / 1024}MB limit`
    }
  }
  
  // Check MIME type
  if (!FILE_SECURITY.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed'
    }
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (FILE_SECURITY.dangerousExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'File extension not allowed'
    }
  }
  
  // Check filename for dangerous characters
  if (!VALIDATION_PATTERNS.filename.test(file.name)) {
    return {
      valid: false,
      error: 'Invalid filename characters'
    }
  }
  
  return { valid: true }
}

// Rate limiting configurations
export const RATE_LIMITS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later'
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many API requests, please try again later'
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many file uploads, please try again later'
  },
  password: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 password reset attempts per hour
    message: 'Too many password reset attempts, please try again later'
  }
} as const

// Rate limiting functions moved to security-server.ts for server-only use
// Type for rate limit configuration
type RateLimitConfig = {
  windowMs: number
  max: number
  message: string
}

export function createRateLimiter(config: RateLimitConfig) {
  // Client-side no-op function
  return async () => null
}

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length > 0
}

// Content Security Policy
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development
    'https://js.stripe.com',
    'https://checkout.stripe.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.stripe.com',
    'https://images.unsplash.com'
  ],
  'connect-src': [
    "'self'",
    'https://api.stripe.com',
    'https://api.resend.com',
    'https://api.openai.com'
  ],
  'frame-src': [
    'https://js.stripe.com',
    'https://hooks.stripe.com'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
}

export function generateCSP(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}

// Security headers
export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
} as const

// Password strength validation
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) score += 1
  else feedback.push('Password must be at least 8 characters long')
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Password must contain lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Password must contain uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Password must contain numbers')
  
  if (/[@$!%*?&]/.test(password)) score += 1
  else feedback.push('Password must contain special characters')
  
  if (password.length >= 12) score += 1
  
  return {
    valid: score >= 4,
    score,
    feedback
  }
}

// Session security
export function generateSecureSessionId(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// IP address validation and extraction
export function extractClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.ip
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || 'unknown'
}

// Audit logging
export interface SecurityEvent {
  type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'file_upload' | 'api_access' | 'suspicious_activity'
  userId?: string
  ip: string
  userAgent: string
  timestamp: Date
  details: Record<string, any>
}

export function logSecurityEvent(event: SecurityEvent): void {
  // In production, this would send to a security monitoring service
  console.log('[SECURITY]', JSON.stringify(event))
  
  // TODO: Implement proper security logging service
  // - Send to SIEM system
  // - Alert on suspicious patterns
  // - Store in secure audit log
}

// Environment validation
export function validateSecurityEnvironment(): void {
  const requiredSecrets = [
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'DATABASE_URL'
  ]
  
  const missing = requiredSecrets.filter(secret => !process.env[secret])
  
  if (missing.length > 0) {
    throw new Error(`Missing required security environment variables: ${missing.join(', ')}`)
  }
  
  // Validate JWT secret strength
  const jwtSecret = process.env.JWT_SECRET
  if (jwtSecret && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
}
