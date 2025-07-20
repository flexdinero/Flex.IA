import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'

// TypeScript union types based on Prisma schema comments
type ClaimStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
type ClaimType = 'AUTO_COLLISION' | 'PROPERTY_DAMAGE' | 'FIRE_DAMAGE' | 'WATER_DAMAGE' | 'THEFT' | 'VANDALISM' | 'NATURAL_DISASTER' | 'LIABILITY' | 'WORKERS_COMP' | 'OTHER'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  status: z.enum(['AVAILABLE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  type: z.enum(['AUTO_COLLISION', 'PROPERTY_DAMAGE', 'FIRE_DAMAGE', 'WATER_DAMAGE', 'THEFT', 'VANDALISM', 'NATURAL_DISASTER', 'LIABILITY', 'WORKERS_COMP', 'OTHER']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  search: z.string().optional(),
  firmId: z.string().optional(),
  assigned: z.string().optional().transform(val => val === 'true')
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    
    const query = querySchema.parse(Object.fromEntries(searchParams))
    const { page, limit, status, type, priority, search, firmId, assigned } = query

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) where.status = status
    if (type) where.type = type
    if (priority) where.priority = priority
    if (firmId) where.firmId = firmId

    // For adjusters, show only available claims or their assigned claims
    if (user.role === 'ADJUSTER') {
      if (assigned) {
        where.adjusterId = user.userId
      } else {
        where.OR = [
          { status: 'AVAILABLE' },
          { adjusterId: user.userId }
        ]
      }
    }

    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          firm: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          },
          adjuster: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          _count: {
            select: {
              documents: true,
              messages: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { deadline: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.claim.count({ where })
    ])

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const createClaimSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['AUTO_COLLISION', 'PROPERTY_DAMAGE', 'FIRE_DAMAGE', 'WATER_DAMAGE', 'THEFT', 'VANDALISM', 'NATURAL_DISASTER', 'LIABILITY', 'WORKERS_COMP', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimatedValue: z.number().positive().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  incidentDate: z.string().transform(val => new Date(val)),
  deadline: z.string().transform(val => new Date(val)),
  firmId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Only firm admins can create claims
    if (user.role !== 'FIRM_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createClaimSchema.parse(body)

    // Generate unique claim number
    const claimCount = await prisma.claim.count()
    const claimNumber = `CLM-${new Date().getFullYear()}-${String(claimCount + 1).padStart(4, '0')}`

    const claim = await prisma.claim.create({
      data: {
        ...data,
        claimNumber,
        reportedDate: new Date(),
        firmId: data.firmId || user.userId // Default to user's firm if not specified
      },
      include: {
        firm: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    return NextResponse.json(claim, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
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
