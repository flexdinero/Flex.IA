import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyPassword, createSession, verifyTwoFactorToken } from '@/lib/auth'
import {
  sanitizeInput,
  validateEmail,
  createRateLimiter,
  RATE_LIMITS,
  logSecurityEvent,
  extractClientIP
} from '@/lib/security'

// Enhanced login schema with security validation
const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .transform(val => sanitizeInput(val.toLowerCase())),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
  twoFactorToken: z.string()
    .regex(/^\d{6}$/, 'Two-factor token must be 6 digits')
    .optional()
})

// Rate limiting for authentication attempts
const authLimiter = createRateLimiter(RATE_LIMITS.auth)

export async function POST(request: NextRequest) {
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Apply rate limiting (no-op in current implementation)
    const rateLimitResult = await authLimiter()
    if (rateLimitResult) {
      logSecurityEvent({
        type: 'auth_attempt',
        ip,
        userAgent,
        timestamp: new Date(),
        details: { action: 'rate_limited', reason: 'too_many_attempts' }
      })
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input with enhanced security
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      logSecurityEvent({
        type: 'auth_attempt',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'validation_failed',
          errors: validationResult.error.errors.map(e => e.message)
        }
      })
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    const { email, password, twoFactorToken } = validationResult.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Log authentication attempt
    logSecurityEvent({
      type: 'auth_attempt',
      userId: user?.id,
      ip,
      userAgent,
      timestamp: new Date(),
      details: {
        action: 'login_attempt',
        email,
        userExists: !!user,
        userActive: user?.isActive
      }
    })

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.hashedPassword)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Check two-factor authentication
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return NextResponse.json(
          { requiresTwoFactor: true },
          { status: 200 }
        )
      }

      const isValidTwoFactor = await verifyTwoFactorToken(
        user.twoFactorSecret || '',
        twoFactorToken
      )

      if (!isValidTwoFactor) {
        return NextResponse.json(
          { error: 'Invalid two-factor authentication code' },
          { status: 401 }
        )
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Create session
    const sessionToken = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    })

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
