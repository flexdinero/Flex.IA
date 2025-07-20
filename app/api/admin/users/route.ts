import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'ADJUSTER', 'FIRM']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  verified: z.string().optional().transform(val => val === 'true')
})

const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'ADJUSTER', 'FIRM']).default('ADJUSTER'),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false)
})

const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'ADJUSTER', 'FIRM']).optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Check admin permissions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const { page, limit, search, role, status, verified } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (role) where.role = role
    if (status) where.isActive = status === 'active'
    if (verified !== undefined) where.emailVerified = verified

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          licenseNumber: true,
          yearsExperience: true,
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
      }),
      prisma.user.count({ where })
    ])

    // Get user statistics
    const stats = await prisma.user.groupBy({
      by: ['role', 'isActive'],
      _count: { role: true }
    })

    const recentSignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        breakdown: stats,
        recentSignups,
        totalUsers: total
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Check admin permissions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const userData = createUserSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        email: userData.email.toLowerCase(),
        hashedPassword
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin user creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
