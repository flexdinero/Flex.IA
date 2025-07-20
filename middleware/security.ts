import { NextRequest, NextResponse } from 'next/server'
import { 
  SECURITY_HEADERS, 
  generateCSP, 
  logSecurityEvent, 
  extractClientIP,
  validateSecurityEnvironment 
} from '@/lib/security'

// Security middleware for comprehensive protection
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  const url = request.nextUrl.pathname

  try {
    // Validate security environment on startup
    if (process.env.NODE_ENV === 'production') {
      validateSecurityEnvironment()
    }

    // Apply security headers
    Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
      response.headers.set(header, value)
    })

    // Apply Content Security Policy
    response.headers.set('Content-Security-Policy', generateCSP())

    // Additional security checks for sensitive endpoints
    if (isSensitiveEndpoint(url)) {
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /\.\./,           // Path traversal
        /<script/i,       // XSS attempts
        /union.*select/i, // SQL injection
        /javascript:/i,   // JavaScript protocol
        /data:.*base64/i, // Data URLs
        /eval\(/i,        // Code execution
        /exec\(/i,        // Command execution
      ]

      const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(url) || 
        pattern.test(request.headers.get('referer') || '') ||
        pattern.test(userAgent)
      )

      if (isSuspicious) {
        logSecurityEvent({
          type: 'suspicious_activity',
          ip,
          userAgent,
          timestamp: new Date(),
          details: {
            action: 'suspicious_request_pattern',
            url,
            referer: request.headers.get('referer'),
            method: request.method
          }
        })

        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Check for common attack patterns in headers
    const dangerousHeaders = [
      'x-forwarded-host',
      'x-original-url',
      'x-rewrite-url'
    ]

    for (const header of dangerousHeaders) {
      const value = request.headers.get(header)
      if (value && value !== request.nextUrl.host) {
        logSecurityEvent({
          type: 'suspicious_activity',
          ip,
          userAgent,
          timestamp: new Date(),
          details: {
            action: 'header_injection_attempt',
            header,
            value,
            url
          }
        })

        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Rate limiting for API endpoints
    if (url.startsWith('/api/')) {
      const rateLimitKey = `${ip}:${url}`
      // TODO: Implement Redis-based rate limiting for production
      // For now, we rely on individual route rate limiting
    }

    // Block known malicious user agents
    const maliciousUserAgents = [
      /sqlmap/i,
      /nikto/i,
      /nessus/i,
      /burpsuite/i,
      /nmap/i,
      /masscan/i,
      /zap/i,
      /w3af/i
    ]

    const isMaliciousUA = maliciousUserAgents.some(pattern => pattern.test(userAgent))
    if (isMaliciousUA) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'malicious_user_agent',
          url
        }
      })

      return new NextResponse('Forbidden', { status: 403 })
    }

    // Check for oversized requests
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB limit
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'oversized_request',
          contentLength,
          url
        }
      })

      return new NextResponse('Request too large', { status: 413 })
    }

    // Validate request method for specific endpoints
    if (url.startsWith('/api/auth/') && !['POST', 'GET'].includes(request.method)) {
      return new NextResponse('Method not allowed', { status: 405 })
    }

    // Add security headers for file uploads
    if (url.includes('/upload')) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
    }

    return response

  } catch (error) {
    console.error('Security middleware error:', error)
    
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        action: 'security_middleware_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        url
      }
    })

    // Fail securely - allow request but log the error
    return response
  }
}

// Helper function to identify sensitive endpoints
function isSensitiveEndpoint(url: string): boolean {
  const sensitivePatterns = [
    /^\/api\/auth\//,
    /^\/api\/admin\//,
    /^\/api\/user\/profile/,
    /^\/api\/upload/,
    /^\/api\/stripe/,
    /^\/api\/billing/,
    /^\/dashboard\/admin/,
    /^\/dashboard\/settings/
  ]

  return sensitivePatterns.some(pattern => pattern.test(url))
}

// CSRF protection for state-changing operations
export function csrfProtection(request: NextRequest) {
  const method = request.method
  const url = request.nextUrl.pathname

  // Only check CSRF for state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return null
  }

  // Skip CSRF for API routes that use other authentication
  if (url.startsWith('/api/stripe/webhook') || url.startsWith('/api/auth/')) {
    return null
  }

  const csrfToken = request.headers.get('x-csrf-token')
  const sessionCsrf = request.cookies.get('csrf-token')?.value

  if (!csrfToken || !sessionCsrf || csrfToken !== sessionCsrf) {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip: extractClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date(),
      details: {
        action: 'csrf_token_mismatch',
        url,
        method,
        hasToken: !!csrfToken,
        hasSessionToken: !!sessionCsrf
      }
    })

    return new NextResponse('CSRF token mismatch', { status: 403 })
  }

  return null
}

// Input sanitization middleware
export function sanitizeRequest(request: NextRequest) {
  // This would be implemented to sanitize request bodies
  // For now, we handle sanitization in individual routes
  return null
}

// Honeypot endpoints to catch automated attacks
export function honeypotMiddleware(request: NextRequest) {
  const url = request.nextUrl.pathname
  
  // Common honeypot paths that attackers often target
  const honeypotPaths = [
    '/wp-admin',
    '/wp-login.php',
    '/admin',
    '/administrator',
    '/phpmyadmin',
    '/.env',
    '/config.php',
    '/wp-config.php',
    '/robots.txt',
    '/.git',
    '/backup',
    '/test',
    '/debug'
  ]

  if (honeypotPaths.some(path => url.startsWith(path))) {
    const ip = extractClientIP(request)
    
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date(),
      details: {
        action: 'honeypot_triggered',
        url,
        method: request.method
      }
    })

    // Return a fake response to waste attacker's time
    return new NextResponse('Not Found', { status: 404 })
  }

  return null
}
