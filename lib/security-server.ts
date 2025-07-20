/**
 * Server-Only Security Utilities for Flex.IA
 * 
 * Rate limiting and other server-specific security functions
 * This file should only be imported in server-side code
 */

import rateLimit from 'express-rate-limit'
import { NextRequest } from 'next/server'

// Rate limiting configurations
export const RATE_LIMITS = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later'
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: 'Too many file uploads, please try again later'
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 password reset attempts per hour
    message: 'Too many password reset attempts, please try again later'
  }
} as const

// Extract client IP address
export function extractClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return request.ip || 'unknown'
}

// Security event logging
interface SecurityEvent {
  type: string
  ip: string
  userAgent: string
  timestamp: Date
  details: Record<string, any>
}

export function logSecurityEvent(event: SecurityEvent): void {
  // In production, this would send to a logging service like Sentry or CloudWatch
  console.warn('Security Event:', {
    type: event.type,
    ip: event.ip,
    userAgent: event.userAgent,
    timestamp: event.timestamp.toISOString(),
    details: event.details
  })
  
  // TODO: Implement actual logging service integration
  // - Send to Sentry for error tracking
  // - Send to CloudWatch for monitoring
  // - Store in database for audit trail
}

// Create rate limiter
export function createRateLimiter(config: typeof RATE_LIMITS.api) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { error: config.message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: NextRequest) => {
      // Use IP address and user ID if available
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      const userId = req.headers.get('x-user-id') || ''
      return `${ip}:${userId}`
    },
    handler: (req: NextRequest, res: any) => {
      logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip: extractClientIP(req),
        userAgent: req.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        details: {
          action: 'rate_limit_hit',
          limit: config.max,
          window: config.windowMs
        }
      })
      
      return new Response(
        JSON.stringify({ error: config.message }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.windowMs / 1000).toString()
          }
        }
      )
    }
  })
}

// Server-side validation functions
export function validateServerRequest(request: NextRequest): boolean {
  // Check for required headers
  const contentType = request.headers.get('content-type')
  const userAgent = request.headers.get('user-agent')
  
  // Basic validation
  if (!userAgent || userAgent.length < 10) {
    return false
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      logSecurityEvent({
        type: 'suspicious_request',
        ip: extractClientIP(request),
        userAgent,
        timestamp: new Date(),
        details: {
          reason: 'suspicious_user_agent',
          pattern: pattern.toString()
        }
      })
      return false
    }
  }
  
  return true
}

// Request size validation
export function validateRequestSize(request: NextRequest, maxSize: number = 10 * 1024 * 1024): boolean {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    if (size > maxSize) {
      logSecurityEvent({
        type: 'request_too_large',
        ip: extractClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
        details: {
          size,
          maxSize,
          url: request.url
        }
      })
      return false
    }
  }
  
  return true
}

// Honeypot validation
export function validateHoneypot(formData: FormData): boolean {
  // Check for honeypot fields that should be empty
  const honeypotFields = ['website', 'url', 'homepage', 'email_confirm']
  
  for (const field of honeypotFields) {
    const value = formData.get(field)
    if (value && value.toString().trim() !== '') {
      return false
    }
  }
  
  return true
}

// Export types
export type { SecurityEvent }
