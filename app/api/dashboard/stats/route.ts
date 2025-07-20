import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Get user's claims statistics
    const [
      totalClaims,
      activeClaims,
      completedClaims,
      totalEarnings,
      monthlyEarnings,
      pendingEarnings,
      unreadNotifications
    ] = await Promise.all([
      // Total claims assigned to user
      prisma.claim.count({
        where: { adjusterId: user.userId }
      }),

      // Active claims (assigned but not completed)
      prisma.claim.count({
        where: {
          adjusterId: user.userId,
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] }
        }
      }),

      // Completed claims
      prisma.claim.count({
        where: {
          adjusterId: user.userId,
          status: 'COMPLETED'
        }
      }),

      // Total earnings (all time)
      prisma.earning.aggregate({
        where: { userId: user.userId },
        _sum: { amount: true }
      }),

      // Monthly earnings
      prisma.earning.aggregate({
        where: {
          userId: user.userId,
          earnedDate: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),

      // Pending earnings
      prisma.earning.aggregate({
        where: {
          userId: user.userId,
          status: 'PENDING'
        },
        _sum: { amount: true }
      }),

      // Unread notifications
      prisma.notification.count({
        where: {
          userId: user.userId,
          isRead: false
        }
      })
    ])

    // Calculate completion rate
    const completionRate = totalClaims > 0 ? (completedClaims / totalClaims) * 100 : 0

    // Calculate average response time (mock data for now)
    const averageResponseTime = 2.5 // hours

    // Calculate efficiency score based on completion rate and response time
    const efficiencyScore = Math.min(100, (completionRate * 0.7) + ((5 - averageResponseTime) * 10))

    // Get recent activity
    const recentClaims = await prisma.claim.findMany({
      where: { adjusterId: user.userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        firm: {
          select: { name: true, logo: true }
        }
      }
    })

    const recentEarnings = await prisma.earning.findMany({
      where: { userId: user.userId },
      orderBy: { earnedDate: 'desc' },
      take: 5,
      include: {
        claim: {
          select: { claimNumber: true, title: true }
        }
      }
    })

    // Calculate monthly goal progress (assuming $10,000 monthly goal)
    const monthlyGoal = 10000
    const monthlyGoalProgress = monthlyEarnings._sum.amount 
      ? (monthlyEarnings._sum.amount / monthlyGoal) * 100 
      : 0

    return NextResponse.json({
      // Core metrics
      totalEarnings: totalEarnings._sum.amount || 0,
      monthlyEarnings: monthlyEarnings._sum.amount || 0,
      pendingEarnings: pendingEarnings._sum.amount || 0,
      totalClaims,
      activeClaims,
      completedClaims,
      
      // Performance metrics
      completionRate: Math.round(completionRate * 100) / 100,
      averageResponseTime,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      monthlyGoalProgress: Math.round(monthlyGoalProgress * 100) / 100,
      
      // Notifications
      unreadNotifications,
      
      // Recent activity
      recentActivity: {
        claims: recentClaims,
        earnings: recentEarnings
      },
      
      // Metadata
      lastUpdated: now.toISOString(),
      period: {
        month: startOfMonth.toISOString(),
        year: startOfYear.toISOString()
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
