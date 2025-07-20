import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { createEmailVerificationToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { createRateLimiter, RATE_LIMITS, extractClientIP, logSecurityEvent } from '@/lib/security'

const resendVerificationSchema = z.object({
  email: z.string().email()
})

// Rate limiting for verification emails
const verificationLimiter = createRateLimiter(RATE_LIMITS.auth)

export async function POST(request: NextRequest) {
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting - 3 attempts per hour per IP
    const rateLimitResult = await verificationLimiter()
    if (rateLimitResult) {
      logSecurityEvent({
        type: 'auth_attempt',
        ip,
        userAgent,
        timestamp: new Date(),
        details: { action: 'resend_verification_limited' }
      })
      return NextResponse.json(
        { error: 'Too many verification emails sent. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = resendVerificationSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists and is unverified, a verification email has been sent.'
      })
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified.'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists and is unverified, a verification email has been sent.'
      })
    }

    // Delete any existing verification tokens for this user
    await prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: 'VERIFY_EMAIL'
      }
    })

    // Create new verification token
    const verificationToken = await createEmailVerificationToken(email)

    // Send verification email
    await sendVerificationEmail(email, verificationToken, user.firstName)

    // Log the verification resend
    console.log(`Verification email resent for user: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists and is unverified, a verification email has been sent.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
