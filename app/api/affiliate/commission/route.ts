import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const payCommissionSchema = z.object({
  commissionIds: z.array(z.string()),
  paymentMethod: z.string(),
  paymentReference: z.string().optional()
})

// GET /api/affiliate/commission - Get commissions
export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const affiliateId = searchParams.get('affiliateId')

    // If not admin, can only view own commissions
    let whereClause: any = {}
    
    if (session.role !== 'ADMIN') {
      const affiliate = await prisma.affiliatePartner.findUnique({
        where: { userId: session.userId }
      })
      
      if (!affiliate) {
        return NextResponse.json({ commissions: [] })
      }
      
      whereClause.affiliateId = affiliate.id
    } else if (affiliateId) {
      whereClause.affiliateId = affiliateId
    }

    if (status) {
      whereClause.status = status
    }

    const commissions = await prisma.affiliateCommission.findMany({
      where: whereClause,
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        referral: {
          include: {
            referredUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ commissions })
  } catch (error) {
    console.error('Get commissions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}

// PUT /api/affiliate/commission - Pay commissions (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = payCommissionSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { commissionIds, paymentMethod, paymentReference } = validation.data

    // Verify all commissions exist and are pending
    const commissions = await prisma.affiliateCommission.findMany({
      where: {
        id: { in: commissionIds },
        status: 'PENDING'
      }
    })

    if (commissions.length !== commissionIds.length) {
      return NextResponse.json(
        { error: 'Some commissions not found or already processed' },
        { status: 400 }
      )
    }

    // Update commissions to paid
    const updatedCommissions = await prisma.affiliateCommission.updateMany({
      where: {
        id: { in: commissionIds }
      },
      data: {
        status: 'PAID',
        paymentDate: new Date(),
        paymentMethod,
        paymentReference
      }
    })

    return NextResponse.json({ 
      message: `${updatedCommissions.count} commissions marked as paid`,
      paidCommissions: updatedCommissions.count
    })
  } catch (error) {
    console.error('Pay commissions error:', error)
    return NextResponse.json(
      { error: 'Failed to pay commissions' },
      { status: 500 }
    )
  }
}

// POST /api/affiliate/commission - Approve commission (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { commissionId, action } = body

    if (!commissionId || !action) {
      return NextResponse.json(
        { error: 'commissionId and action are required' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be APPROVE or REJECT' },
        { status: 400 }
      )
    }

    const commission = await prisma.affiliateCommission.findUnique({
      where: { id: commissionId }
    })

    if (!commission) {
      return NextResponse.json(
        { error: 'Commission not found' },
        { status: 404 }
      )
    }

    if (commission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Commission already processed' },
        { status: 400 }
      )
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'CANCELLED'

    const updatedCommission = await prisma.affiliateCommission.update({
      where: { id: commissionId },
      data: { status: newStatus }
    })

    return NextResponse.json({ commission: updatedCommission })
  } catch (error) {
    console.error('Process commission error:', error)
    return NextResponse.json(
      { error: 'Failed to process commission' },
      { status: 500 }
    )
  }
}

// DELETE /api/affiliate/commission - Cancel commission (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commissionId = searchParams.get('id')

    if (!commissionId) {
      return NextResponse.json(
        { error: 'Commission ID is required' },
        { status: 400 }
      )
    }

    const commission = await prisma.affiliateCommission.findUnique({
      where: { id: commissionId },
      include: { affiliate: true }
    })

    if (!commission) {
      return NextResponse.json(
        { error: 'Commission not found' },
        { status: 404 }
      )
    }

    if (commission.status === 'PAID') {
      return NextResponse.json(
        { error: 'Cannot cancel paid commission' },
        { status: 400 }
      )
    }

    // Start transaction to cancel commission and update affiliate earnings
    await prisma.$transaction(async (tx) => {
      // Cancel commission
      await tx.affiliateCommission.update({
        where: { id: commissionId },
        data: { status: 'CANCELLED' }
      })

      // Reduce affiliate total earnings if it was approved
      if (commission.status === 'APPROVED') {
        await tx.affiliatePartner.update({
          where: { id: commission.affiliateId },
          data: {
            totalEarnings: {
              decrement: commission.amount
            }
          }
        })
      }
    })

    return NextResponse.json({ message: 'Commission cancelled successfully' })
  } catch (error) {
    console.error('Cancel commission error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel commission' },
      { status: 500 }
    )
  }
}
