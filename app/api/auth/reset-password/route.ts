import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyPasswordResetToken, hashPassword } from '@/lib/auth'
import { createRateLimiter, RATE_LIMITS, extractClientIP, logSecurityEvent } from '@/lib/security'

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Rate limiting for password reset
const resetLimiter = createRateLimiter(RATE_LIMITS.auth)

export async function POST(request: NextRequest) {
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    // Rate limiting - 5 attempts per 15 minutes per IP
    const rateLimitResult = await resetLimiter()
    if (rateLimitResult) {
      logSecurityEvent({
        type: 'auth_attempt',
        ip,
        userAgent,
        timestamp: new Date(),
        details: { action: 'password_reset_limited' }
      })
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Verify the reset token
    const userId = await verifyPasswordResetToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { 
        hashedPassword,
        updatedAt: new Date()
      }
    })

    // Invalidate all existing sessions for this user
    await prisma.session.deleteMany({
      where: { userId }
    })

    // Log the password reset
    console.log(`Password reset completed for user: ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
