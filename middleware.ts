import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    return NextResponse.next()
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
    return NextResponse.next()
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

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    }

    // For dashboard routes, check if user has appropriate access
    if (isProtectedDashboardRoute) {
      // Add any role-based access control here if needed
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware auth error:', error)
    
    const response = requiresAuth
      ? isProtectedApiRoute
        ? NextResponse.json({ error: 'Authentication error' }, { status: 500 })
        : NextResponse.redirect(new URL('/auth/login', request.url))
      : NextResponse.next()

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
