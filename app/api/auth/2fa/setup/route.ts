import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { generateTwoFactorSecret, generateQRCode } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Check if 2FA is already enabled
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userRecord.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled for this account' },
        { status: 400 }
      )
    }

    // Generate new 2FA secret
    const secret = generateTwoFactorSecret()
    const qrCodeUrl = await generateQRCode(userRecord.email, secret)

    // Store the secret temporarily (not enabled until verified)
    await prisma.user.update({
      where: { id: user.userId },
      data: { twoFactorSecret: secret }
    })

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
      backupCodes: [] // TODO: Generate backup codes
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled'
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
