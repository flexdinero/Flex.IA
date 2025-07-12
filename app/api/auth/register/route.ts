import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashPassword, createSession, createEmailVerificationToken } from '@/lib/auth'

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  yearsExperience: z.number().int().min(0).optional(),
  hourlyRate: z.number().positive().optional(),
  travelRadius: z.number().int().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        hashedPassword,
        phone: userData.phone,
        licenseNumber: userData.licenseNumber,
        specialties: userData.specialties || [],
        yearsExperience: userData.yearsExperience,
        hourlyRate: userData.hourlyRate,
        travelRadius: userData.travelRadius,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        role: 'ADJUSTER'
      }
    })

    // Create email verification token
    try {
      const verificationToken = await createEmailVerificationToken(user.email)
      // TODO: Send verification email with token
      console.log('Verification token:', verificationToken)
    } catch (error) {
      console.error('Failed to create verification token:', error)
    }

    // Create session
    const sessionToken = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Flex.IA!',
        content: 'Your account has been created successfully. Complete your profile to start receiving claim assignments.',
        type: 'SYSTEM_UPDATE'
      }
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
    }, { status: 201 })

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
