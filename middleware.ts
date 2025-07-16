import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './lib/auth'
import { createRateLimitMiddleware } from './lib/rate-limit'

// Security headers configuration
const securityHeaders = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  })
}

// Initialize rate limiting
const rateLimitMiddleware = createRateLimitMiddleware()

// CSP and security functions for Edge Runtime
function generateCSPNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

function createCSPHeader(nonce?: string): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'" + (nonce ? ` 'nonce-${nonce}'` : ''),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ]

  return directives.join('; ')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply security headers to all responses
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Generate and set CSP header
  const nonce = generateCSPNonce()
  response.headers.set('Content-Security-Policy', createCSPHeader(nonce))

  // Add request ID for tracing
  const requestId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  response.headers.set('X-Request-ID', requestId)

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    try {
      const rateLimitResponse = await rateLimitMiddleware(request)
      if (rateLimitResponse.status === 429) {
        return rateLimitResponse
      }

      // Copy rate limit headers
      const rateLimitHeaders = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
      rateLimitHeaders.forEach(header => {
        const value = rateLimitResponse.headers.get(header)
        if (value) response.headers.set(header, value)
      })
    } catch (error) {
      console.error('Rate limiting error:', error)
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email'
  ]

  // API routes that require authentication
  const protectedApiRoutes = [
    '/api/user',
    '/api/claims',
    '/api/dashboard',
    '/api/messages',
    '/api/documents',
    '/api/earnings',
    '/api/calendar',
    '/api/notifications'
  ]

  // Dashboard routes that require authentication
  const protectedDashboardRoutes = [
    '/dashboard'
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // Check if the current path requires authentication
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))
  const isProtectedDashboardRoute = protectedDashboardRoutes.some(route => pathname.startsWith(route))
  const requiresAuth = isProtectedApiRoute || isProtectedDashboardRoute

  // If it's a public route, allow access
  if (isPublicRoute) {
    return response
  }

  // Get session token from cookie
  const sessionToken = request.cookies.get('session')?.value

  if (!sessionToken) {
    if (requiresAuth) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      } else {
        // Redirect to login for dashboard routes
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    return response
  }

  // Verify the session token
  try {
    const sessionData = await verifySession(sessionToken)
    
    if (!sessionData) {
      // Invalid session
      const response = requiresAuth
        ? isProtectedApiRoute
          ? NextResponse.json({ error: 'Invalid session' }, { status: 401 })
          : NextResponse.redirect(new URL('/auth/login', request.url))
        : NextResponse.next()

      // Clear invalid session cookie
      response.cookies.set('session', '', { maxAge: 0 })
      return response
    }

    // Add user data to request headers for API routes
    if (isProtectedApiRoute) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', sessionData.userId)
      requestHeaders.set('x-user-role', sessionData.role)
      requestHeaders.set('x-user-email', sessionData.email)

      const enhancedResponse = NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })

      // Copy security headers to the enhanced response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        enhancedResponse.headers.set(key, value)
      })
      enhancedResponse.headers.set('Content-Security-Policy', createCSPHeader(nonce))
      enhancedResponse.headers.set('X-Request-ID', requestId)

      return enhancedResponse
    }

    // For dashboard routes, check if user has appropriate access
    if (isProtectedDashboardRoute) {
      // Add any role-based access control here if needed
      return response
    }

    return response
  } catch (error) {
    console.error('Middleware auth error:', error)
    
    const response = requiresAuth
      ? isProtectedApiRoute
        ? NextResponse.json({ error: 'Authentication error' }, { status: 500 })
        : NextResponse.redirect(new URL('/auth/login', request.url))
      : response

    // Clear session cookie on error
    response.cookies.set('session', '', { maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
