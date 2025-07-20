import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

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

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get comprehensive system statistics
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalClaims,
      activeClaims,
      completedClaims,
      totalFirms,
      activeFirms,
      totalEarnings,
      monthlyEarnings,
      pendingEarnings,
      totalDocuments,
      systemHealth
    ] = await Promise.all([
      // User statistics
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      }),

      // Claim statistics
      prisma.claim.count(),
      prisma.claim.count({
        where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } }
      }),
      prisma.claim.count({
        where: { status: 'COMPLETED' }
      }),

      // Firm statistics
      prisma.firm.count(),
      prisma.firm.count({ where: { isActive: true } }),

      // Financial statistics
      prisma.earning.aggregate({
        _sum: { amount: true }
      }),
      prisma.earning.aggregate({
        where: { earnedDate: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      prisma.earning.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true }
      }),

      // Document statistics
      prisma.document.count(),

      // System health (mock data - would be real monitoring in production)
      Promise.resolve({
        uptime: '99.9%',
        responseTime: '120ms',
        errorRate: '0.1%',
        dbConnections: 15,
        memoryUsage: '68%',
        cpuUsage: '45%'
      })
    ])

    // Get user growth over last 12 months
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(now.getFullYear() - 1, now.getMonth(), 1)
        }
      },
      _count: { createdAt: true }
    })

    // Process user growth by month
    const monthlyUserGrowth = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().substring(0, 7)
      const count = userGrowth.filter(u => 
        u.createdAt.toISOString().substring(0, 7) === monthKey
      ).length
      return {
        month: monthKey,
        users: count
      }
    }).reverse()

    // Get claim statistics by type
    const claimsByType = await prisma.claim.groupBy({
      by: ['type'],
      _count: { type: true },
      _avg: { estimatedValue: true }
    })

    // Get earnings by month for the last 6 months
    const earningsByMonth = await prisma.earning.groupBy({
      by: ['earnedDate'],
      where: {
        earnedDate: {
          gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
        }
      },
      _sum: { amount: true },
      _count: { amount: true }
    })

    // Get top performing adjusters
    const topAdjusters = await prisma.user.findMany({
      where: {
        role: 'ADJUSTER',
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            claims: { where: { status: 'COMPLETED' } }
          }
        },
        earnings: {
          select: {
            amount: true
          }
        }
      },
      take: 10
    })

    // Process top adjusters
    const processedTopAdjusters = topAdjusters
      .map(adjuster => ({
        id: adjuster.id,
        name: `${adjuster.firstName} ${adjuster.lastName}`,
        completedClaims: adjuster._count.claims,
        totalEarnings: adjuster.earnings.reduce((sum, e) => sum + e.amount, 0)
      }))
      .sort((a, b) => b.totalEarnings - a.totalEarnings)

    // Get recent activity
    const recentActivity = await prisma.user.findMany({
      where: {
        lastLoginAt: { gte: thirtyDaysAgo }
      },
      orderBy: { lastLoginAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        lastLoginAt: true,
        role: true
      }
    })

    // Calculate growth rates
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    const lastMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    })

    const userGrowthRate = lastMonthUsers > 0 
      ? ((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100 
      : 0

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        totalClaims,
        activeClaims,
        completedClaims,
        claimCompletionRate: totalClaims > 0 ? (completedClaims / totalClaims) * 100 : 0,
        totalFirms,
        activeFirms,
        totalEarnings: totalEarnings._sum.amount || 0,
        monthlyEarnings: monthlyEarnings._sum.amount || 0,
        pendingEarnings: pendingEarnings._sum.amount || 0,
        totalDocuments
      },
      growth: {
        userGrowth: monthlyUserGrowth,
        earningsByMonth
      },
      performance: {
        claimsByType,
        topAdjusters: processedTopAdjusters
      },
      activity: {
        recentLogins: recentActivity
      },
      system: systemHealth,
      lastUpdated: now.toISOString()
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
