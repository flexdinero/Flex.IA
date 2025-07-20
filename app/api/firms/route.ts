import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  state: z.string().optional(),
  specialty: z.string().optional(),
  rating: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  active: z.string().optional().transform(val => val === 'true')
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { page, limit, search, state, specialty, rating, active } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (active !== undefined) where.isActive = active
    if (state) where.state = state
    if (rating) where.rating = { gte: rating }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (specialty) {
      where.specialties = {
        contains: specialty
      }
    }

    const [firms, total] = await Promise.all([
      prisma.firm.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { name: 'asc' }
        ],
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          website: true,
          description: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          logo: true,
          specialties: true,
          rating: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              claims: {
                where: { status: 'AVAILABLE' }
              }
            }
          }
        }
      }),
      prisma.firm.count({ where })
    ])

    // Get user's connections with firms
    const userConnections = await prisma.firmConnection.findMany({
      where: { adjusterId: user.userId },
      select: {
        firmId: true,
        status: true,
        connectedAt: true
      }
    })

    const connectionMap = new Map(
      userConnections.map(conn => [conn.firmId, conn])
    )

    // Enhance firms with connection status
    const enhancedFirms = firms.map(firm => ({
      ...firm,
      specialties: firm.specialties ? JSON.parse(firm.specialties) : [],
      availableClaims: firm._count.claims,
      connection: connectionMap.get(firm.id) || null
    }))

    // Get statistics
    const stats = await prisma.firm.aggregate({
      where: { isActive: true },
      _count: { id: true },
      _avg: { rating: true }
    })

    const stateBreakdown = await prisma.firm.groupBy({
      by: ['state'],
      where: { isActive: true },
      _count: { state: true },
      orderBy: { _count: { state: 'desc' } },
      take: 10
    })

    return NextResponse.json({
      firms: enhancedFirms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalFirms: stats._count.id,
        averageRating: stats._avg.rating || 0,
        stateBreakdown
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Firms fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const createConnectionSchema = z.object({
  firmId: z.string(),
  message: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { firmId, message } = createConnectionSchema.parse(body)

    // Verify firm exists and is active
    const firm = await prisma.firm.findFirst({
      where: {
        id: firmId,
        isActive: true
      }
    })

    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found or inactive' },
        { status: 404 }
      )
    }

    // Check if connection already exists
    const existingConnection = await prisma.firmConnection.findFirst({
      where: {
        adjusterId: user.userId,
        firmId
      }
    })

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 400 }
      )
    }

    // Create connection request
    const connection = await prisma.firmConnection.create({
      data: {
        adjusterId: user.userId,
        firmId,
        status: 'PENDING',
        message: message || `Connection request from ${user.firstName} ${user.lastName}`
      },
      include: {
        firm: {
          select: {
            name: true,
            email: true
          }
        },
        adjuster: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            licenseNumber: true,
            yearsExperience: true
          }
        }
      }
    })

    // Send notification to firm (placeholder)
    console.log(`Connection request sent to ${firm.name} from ${user.firstName} ${user.lastName}`)

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: 'Connection Request Sent',
        content: `Your connection request to ${firm.name} has been sent`,
        type: 'CONNECTION_REQUEST_SENT',
        userId: user.userId
      }
    })

    return NextResponse.json(connection, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Firm connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
