import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'ADJUSTER', 'FIRM']).optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  yearsExperience: z.number().optional(),
  hourlyRate: z.number().optional(),
  travelRadius: z.number().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    
    // Check admin permissions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        claims: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            firm: {
              select: { name: true }
            }
          }
        },
        earnings: {
          take: 10,
          orderBy: { earnedDate: 'desc' }
        },
        notifications: {
          where: { isRead: false },
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        sessions: {
          take: 5,
          orderBy: { expiresAt: 'desc' }
        },
        _count: {
          select: {
            claims: true,
            earnings: true,
            notifications: { where: { isRead: false } },
            sessions: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { hashedPassword, twoFactorSecret, ...safeUser } = targetUser

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Admin user fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    
    // Check admin permissions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updates = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it already exists
    if (updates.email && updates.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updates.email.toLowerCase() }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }

      updates.email = updates.email.toLowerCase()
    }

    // Prevent admin from deactivating themselves
    if (updates.isActive === false && user.userId === id) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        phone: true,
        licenseNumber: true,
        yearsExperience: true,
        hourlyRate: true,
        travelRadius: true,
        updatedAt: true
      }
    })

    // Log admin action
    console.log(`Admin ${user.userId} updated user ${id}:`, updates)

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin user update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    
    // Check admin permissions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Prevent admin from deleting themselves
    if (user.userId === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Soft delete by deactivating instead of hard delete to preserve data integrity
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        email: `deleted_${Date.now()}_${existingUser.email}` // Prevent email conflicts
      }
    })

    // Log admin action
    console.log(`Admin ${user.userId} deleted user ${id}`)

    return NextResponse.json({
      success: true,
      message: 'User has been deactivated'
    })
  } catch (error) {
    console.error('Admin user deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
