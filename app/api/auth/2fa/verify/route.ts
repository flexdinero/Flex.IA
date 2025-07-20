import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { verifyTwoFactorToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

const verifyTwoFactorSchema = z.object({
  token: z.string().length(6).regex(/^\d+$/)
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Rate limiting - 5 attempts per 15 minutes per user
    const rateLimitResult = await checkRateLimit(request, `2fa-verify-${user.userId}`, 5, 15 * 60 * 1000)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { token } = verifyTwoFactorSchema.parse(body)

    // Get user's 2FA secret
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!userRecord || !userRecord.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA is not set up for this account' },
        { status: 400 }
      )
    }

    // Verify the token
    const isValid = await verifyTwoFactorToken(userRecord.twoFactorSecret, token)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid 2FA token' },
        { status: 400 }
      )
    }

    // Enable 2FA if this is the first verification
    if (!userRecord.twoFactorEnabled) {
      await prisma.user.update({
        where: { id: user.userId },
        data: { twoFactorEnabled: true }
      })

      return NextResponse.json({
        success: true,
        message: '2FA has been successfully enabled for your account'
      })
    }

    return NextResponse.json({
      success: true,
      message: '2FA token verified successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid token format. Please enter a 6-digit code.' },
        { status: 400 }
      )
    }

    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
