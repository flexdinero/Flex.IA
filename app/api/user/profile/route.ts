import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'
import { hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        licenseNumber: true,
        certifications: true,
        specialties: true,
        yearsExperience: true,
        hourlyRate: true,
        travelRadius: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            claims: true,
            earnings: true,
            notifications: { where: { isRead: false } }
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get recent earnings
    const recentEarnings = await prisma.earning.findMany({
      where: { userId: user.userId },
      orderBy: { earnedDate: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        earnedDate: true,
        description: true
      }
    })

    // Get total earnings
    const earningsStats = await prisma.earning.aggregate({
      where: { userId: user.userId },
      _sum: { amount: true },
      _count: true
    })

    return NextResponse.json({
      ...profile,
      recentEarnings,
      totalEarnings: earningsStats._sum.amount || 0,
      totalEarningsCount: earningsStats._count
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
  licenseNumber: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  yearsExperience: z.number().int().min(0).optional(),
  hourlyRate: z.number().positive().optional(),
  travelRadius: z.number().int().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
})

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const updates = updateProfileSchema.parse(body)

    const updatedProfile = await prisma.user.update({
      where: { id: user.userId },
      data: updates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        licenseNumber: true,
        certifications: true,
        specialties: true,
        yearsExperience: true,
        hourlyRate: true,
        travelRadius: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8)
})

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { currentPassword, newPassword } = changePasswordSchema.parse(body)

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { hashedPassword: true }
    })

    if (!currentUser?.hashedPassword) {
      return NextResponse.json(
        { error: 'No password set' },
        { status: 400 }
      )
    }

    // Verify current password
    const bcrypt = require('bcryptjs')
    const isValidPassword = await bcrypt.compare(currentPassword, currentUser.hashedPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: user.userId },
      data: { hashedPassword: hashedNewPassword }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        title: 'Password Changed',
        content: 'Your password has been successfully updated.',
        type: 'SYSTEM_UPDATE'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
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
