import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import { authenticator } from '@otplib/preset-default'
import QRCode from 'qrcode'
import { prisma } from './db'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production')
    }
    console.warn('⚠️  Using fallback JWT secret in development. Set JWT_SECRET environment variable.')
    return 'dev-fallback-secret-change-in-production'
  })()
)

export interface SessionData extends Record<string, any> {
  userId: string
  email: string
  role: string
  firstName: string
  lastName: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userData: SessionData): Promise<string> {
  const token = await new SignJWT(userData)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .setJti(nanoid())
    .sign(JWT_SECRET)

  // Store session in database
  const sessionId = nanoid()
  await prisma.session.create({
    data: {
      id: sessionId,
      userId: userData.userId,
      handle: sessionId,
      hashedSessionToken: await hashPassword(token),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      publicData: JSON.stringify({
        userId: userData.userId,
        role: userData.role,
        email: userData.email
      })
    }
  })

  return token
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionData
  } catch (error) {
    return null
  }
}

// Helper function to verify session from NextRequest
export async function verifySessionFromRequest(request: NextRequest): Promise<SessionData | null> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      return await verifySession(token)
    }

    // Try to get token from cookies
    const tokenCookie = request.cookies.get('session-token')
    if (tokenCookie) {
      return await verifySession(tokenCookie.value)
    }

    return null
  } catch (error) {
    return null
  }
}

export async function deleteSession(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId }
  })
}

// Removed duplicate function - using speakeasy implementation below

// Removed duplicate function - using speakeasy implementation below

export async function createPasswordResetToken(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const token = nanoid(32)
  const hashedToken = await hashPassword(token)

  await prisma.token.create({
    data: {
      userId: user.id,
      type: 'RESET_PASSWORD',
      hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      sentTo: email
    }
  })

  return token
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const tokenRecord = await prisma.token.findFirst({
    where: {
      type: 'RESET_PASSWORD',
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  })

  if (!tokenRecord) return null

  const isValid = await verifyPassword(token, tokenRecord.hashedToken)
  if (!isValid) return null

  // Delete the used token
  await prisma.token.delete({ where: { id: tokenRecord.id } })

  return tokenRecord.userId
}

export async function createEmailVerificationToken(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const token = nanoid(32)
  const hashedToken = await hashPassword(token)

  await prisma.token.create({
    data: {
      userId: user.id,
      type: 'VERIFY_EMAIL',
      hashedToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      sentTo: email
    }
  })

  return token
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const tokenRecord = await prisma.token.findFirst({
    where: {
      type: 'VERIFY_EMAIL',
      expiresAt: { gt: new Date() }
    }
  })

  if (!tokenRecord) return false

  const isValid = await verifyPassword(token, tokenRecord.hashedToken)
  if (!isValid) return false

  // Mark email as verified and delete token
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { emailVerified: true }
  })

  await prisma.token.delete({ where: { id: tokenRecord.id } })

  return true
}

export function generateTwoFactorSecret(): string {
  return authenticator.generateSecret()
}

export async function generateQRCode(email: string, secret: string): Promise<string> {
  const otpAuthUrl = authenticator.keyuri(email, 'Flex.IA', secret)
  return QRCode.toDataURL(otpAuthUrl)
}

export async function verifyTwoFactorToken(secret: string, token: string): Promise<boolean> {
  try {
    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error('2FA verification error:', error)
    return false
  }
}

export async function generateBackupCodes(): Promise<string[]> {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(nanoid(8).toUpperCase())
  }
  return codes
}
