import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'
import { startOfMonth, endOfMonth, startOfYear, subMonths, format } from 'date-fns'

const querySchema = z.object({
  period: z.enum(['month', 'quarter', 'year']).default('month'),
  months: z.string().optional().transform(val => val ? parseInt(val) : 12)
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { period, months } = querySchema.parse(Object.fromEntries(searchParams))

    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)
    const currentYearStart = startOfYear(now)

    // Basic statistics
    const stats = await Promise.all([
      // Total earnings
      prisma.earning.aggregate({
        where: { 
          userId: user.userId,
          status: { in: ['APPROVED', 'PAID'] }
        },
        _sum: { amount: true },
        _count: true
      }),

      // This month's earnings
      prisma.earning.aggregate({
        where: { 
          userId: user.userId,
          status: { in: ['APPROVED', 'PAID'] },
          earnedDate: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        },
        _sum: { amount: true }
      }),

      // Active claims count
      prisma.claim.count({
        where: {
          adjusterId: user.userId,
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] }
        }
      }),

      // Total claims handled
      prisma.claim.count({
        where: { adjusterId: user.userId }
      }),

      // Completed claims this month
      prisma.claim.count({
        where: {
          adjusterId: user.userId,
          status: 'COMPLETED',
          completedAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        }
      })
    ])

    const [totalEarnings, monthlyEarnings, activeClaims, totalClaims, completedThisMonth] = stats

    // Monthly earnings chart data
    const monthlyData = []
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))
      
      const [earnings, claimsCount] = await Promise.all([
        prisma.earning.aggregate({
          where: {
            userId: user.userId,
            status: { in: ['APPROVED', 'PAID'] },
            earnedDate: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true }
        }),
        prisma.claim.count({
          where: {
            adjusterId: user.userId,
            completedAt: { gte: monthStart, lte: monthEnd }
          }
        })
      ])

      monthlyData.push({
        month: format(monthStart, 'MMM yyyy'),
        earnings: earnings._sum.amount || 0,
        claims: claimsCount
      })
    }

    // Claims by type
    const claimsByType = await prisma.claim.groupBy({
      by: ['type'],
      where: { adjusterId: user.userId },
      _count: { _all: true }
    })

    // Claims by status
    const claimsByStatus = await prisma.claim.groupBy({
      by: ['status'],
      where: { adjusterId: user.userId },
      _count: { _all: true }
    })

    // Recent activity
    const recentActivity = await Promise.all([
      // Recent completed claims
      prisma.claim.findMany({
        where: {
          adjusterId: user.userId,
          status: 'COMPLETED'
        },
        orderBy: { completedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          claimNumber: true,
          title: true,
          completedAt: true,
          finalValue: true
        }
      }),

      // Recent earnings
      prisma.earning.findMany({
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
    ])

    const [recentClaims, recentEarnings] = recentActivity

    // Performance metrics
    const performanceMetrics = {
      averageCompletionTime: null, // Could be calculated based on claim assignment to completion dates
      clientSatisfactionScore: 0, // Rating system not implemented yet
      totalReviews: 0,
      completionRate: totalClaims > 0 ? ((totalClaims - activeClaims) / totalClaims) * 100 : 0
    }

    // Calculate goal progress (assuming a monthly goal)
    const monthlyGoal = 25000 // This could be stored in user preferences
    const goalProgress = monthlyEarnings._sum.amount ? 
      (monthlyEarnings._sum.amount / monthlyGoal) * 100 : 0

    return NextResponse.json({
      overview: {
        totalEarnings: totalEarnings._sum.amount || 0,
        monthlyEarnings: monthlyEarnings._sum.amount || 0,
        activeClaims,
        totalClaims,
        completedThisMonth,
        averageRating: 0, // Rating system not implemented yet
        totalReviews: 0,
        goalProgress: Math.min(goalProgress, 100)
      },
      charts: {
        monthlyEarnings: monthlyData,
        claimsByType: claimsByType.map(item => ({
          type: item.type,
          count: item._count._all
        })),
        claimsByStatus: claimsByStatus.map(item => ({
          status: item.status,
          count: item._count._all
        }))
      },
      recentActivity: {
        claims: recentClaims,
        earnings: recentEarnings
      },
      performance: performanceMetrics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
