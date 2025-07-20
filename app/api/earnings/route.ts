import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  status: z.enum(['PENDING', 'PAID', 'DISPUTED']).optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  claimId: z.string().optional()
})

const createEarningSchema = z.object({
  amount: z.number().positive(),
  type: z.string().min(1),
  description: z.string().optional(),
  earnedDate: z.string().transform(val => new Date(val)),
  claimId: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { page, limit, status, type, startDate, endDate, claimId } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId: user.userId }

    if (status) where.status = status
    if (type) where.type = type
    if (claimId) where.claimId = claimId

    if (startDate || endDate) {
      where.earnedDate = {}
      if (startDate) where.earnedDate.gte = new Date(startDate)
      if (endDate) where.earnedDate.lte = new Date(endDate)
    }

    const [earnings, total] = await Promise.all([
      prisma.earning.findMany({
        where,
        skip,
        take: limit,
        orderBy: { earnedDate: 'desc' },
        include: {
          claim: {
            select: {
              id: true,
              claimNumber: true,
              title: true,
              firm: {
                select: { name: true }
              }
            }
          }
        }
      }),
      prisma.earning.count({ where })
    ])

    // Calculate summary statistics
    const summary = await prisma.earning.aggregate({
      where: { userId: user.userId },
      _sum: { amount: true },
      _count: { amount: true }
    })

    const statusBreakdown = await prisma.earning.groupBy({
      by: ['status'],
      where: { userId: user.userId },
      _sum: { amount: true },
      _count: { amount: true }
    })

    const typeBreakdown = await prisma.earning.groupBy({
      by: ['type'],
      where: { userId: user.userId },
      _sum: { amount: true },
      _count: { amount: true }
    })

    // Calculate monthly earnings for the last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const monthlyEarnings = await prisma.earning.findMany({
      where: {
        userId: user.userId,
        earnedDate: { gte: twelveMonthsAgo }
      },
      select: {
        amount: true,
        earnedDate: true,
        status: true
      }
    })

    // Group by month
    const monthlyBreakdown = monthlyEarnings.reduce((acc, earning) => {
      const monthKey = earning.earnedDate.toISOString().substring(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, paid: 0, pending: 0, count: 0 }
      }
      acc[monthKey].total += earning.amount
      acc[monthKey].count += 1
      if (earning.status === 'PAID') {
        acc[monthKey].paid += earning.amount
      } else if (earning.status === 'PENDING') {
        acc[monthKey].pending += earning.amount
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      earnings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalEarnings: summary._sum.amount || 0,
        totalCount: summary._count.amount || 0,
        averageEarning: summary._count.amount > 0 
          ? (summary._sum.amount || 0) / summary._count.amount 
          : 0,
        statusBreakdown,
        typeBreakdown,
        monthlyBreakdown
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Earnings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const earningData = createEarningSchema.parse(body)

    // Verify claim belongs to user if claimId is provided
    if (earningData.claimId) {
      const claim = await prisma.claim.findFirst({
        where: {
          id: earningData.claimId,
          adjusterId: user.userId
        }
      })

      if (!claim) {
        return NextResponse.json(
          { error: 'Claim not found or not assigned to you' },
          { status: 404 }
        )
      }
    }

    const earning = await prisma.earning.create({
      data: {
        ...earningData,
        userId: user.userId,
        status: 'PENDING' // Default status
      },
      include: {
        claim: {
          select: {
            id: true,
            claimNumber: true,
            title: true,
            firm: {
              select: { name: true }
            }
          }
        }
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        title: 'New Earning Added',
        content: `Earning of $${earning.amount.toFixed(2)} has been recorded`,
        type: 'EARNING_ADDED',
        userId: user.userId
      }
    })

    return NextResponse.json(earning, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid earning data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Earning creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
