import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyEmailToken } from '@/lib/auth'
import { createRateLimiter, RATE_LIMITS, extractClientIP, logSecurityEvent } from '@/lib/security'

const verifyEmailSchema = z.object({
  token: z.string().min(1)
})

// Rate limiting for email verification
const verifyLimiter = createRateLimiter(RATE_LIMITS.auth)

export async function POST(request: NextRequest) {
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting - 10 attempts per 15 minutes per IP
    const rateLimitResult = await verifyLimiter()
    if (rateLimitResult) {
      logSecurityEvent({
        type: 'auth_attempt',
        ip,
        userAgent,
        timestamp: new Date(),
        details: { action: 'email_verification_limited' }
      })
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { token } = verifyEmailSchema.parse(body)

    // Verify the email token
    const isValid = await verifyEmailToken(token)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Log the email verification
    console.log(`Email verification completed for token: ${token.substring(0, 8)}...`)

    return NextResponse.json({
      success: true,
      message: 'Email has been verified successfully. You can now access all features.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect('/auth/login?error=missing-token')
    }

    // Verify the email token
    const isValid = await verifyEmailToken(token)
    if (!isValid) {
      return NextResponse.redirect('/auth/login?error=invalid-token')
    }

    // Redirect to dashboard with success message
    return NextResponse.redirect('/dashboard?verified=true')
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect('/auth/login?error=verification-failed')
  }
}
