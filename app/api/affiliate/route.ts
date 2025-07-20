import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const createAffiliateSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().url().optional(),
  paymentMethod: z.enum(['PAYPAL', 'BANK_TRANSFER', 'CHECK']).default('PAYPAL'),
  paymentDetails: z.string().optional()
})

const updateAffiliateSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().url().optional(),
  paymentMethod: z.enum(['PAYPAL', 'BANK_TRANSFER', 'CHECK']).optional(),
  paymentDetails: z.string().optional()
})

// GET /api/affiliate - Get affiliate partner info
export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const affiliate = await prisma.affiliatePartner.findUnique({
      where: { userId: session.userId },
      include: {
        referrals: {
          include: {
            referredUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        commissions: {
          include: {
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
        }
      }
    })

    if (!affiliate) {
      return NextResponse.json({ affiliate: null })
    }

    // Calculate statistics
    const stats = {
      totalReferrals: affiliate.referrals.length,
      convertedReferrals: affiliate.referrals.filter(r => r.status === 'CONVERTED').length,
      pendingReferrals: affiliate.referrals.filter(r => r.status === 'PENDING').length,
      totalEarnings: affiliate.totalEarnings,
      pendingCommissions: affiliate.commissions
        .filter(c => c.status === 'PENDING')
        .reduce((sum, c) => sum + c.amount, 0),
      paidCommissions: affiliate.commissions
        .filter(c => c.status === 'PAID')
        .reduce((sum, c) => sum + c.amount, 0),
      conversionRate: affiliate.referrals.length > 0 
        ? (affiliate.referrals.filter(r => r.status === 'CONVERTED').length / affiliate.referrals.length * 100).toFixed(1)
        : '0.0'
    }

    return NextResponse.json({ affiliate, stats })
  } catch (error) {
    console.error('Get affiliate error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate data' },
      { status: 500 }
    )
  }
}

// POST /api/affiliate - Create or update affiliate partner
export async function POST(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createAffiliateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { companyName, website, paymentMethod, paymentDetails } = validation.data

    // Check if affiliate already exists
    const existingAffiliate = await prisma.affiliatePartner.findUnique({
      where: { userId: session.userId }
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'Affiliate partner already exists' },
        { status: 409 }
      )
    }

    // Generate unique affiliate code
    let affiliateCode: string
    let isUnique = false
    
    while (!isUnique) {
      affiliateCode = `FLEX-${nanoid(8).toUpperCase()}`
      const existing = await prisma.affiliatePartner.findUnique({
        where: { affiliateCode }
      })
      if (!existing) {
        isUnique = true
      }
    }

    const affiliate = await prisma.affiliatePartner.create({
      data: {
        userId: session.userId,
        affiliateCode: affiliateCode!,
        companyName,
        website,
        paymentMethod,
        paymentDetails,
        status: 'PENDING' // Requires admin approval
      }
    })

    return NextResponse.json({ affiliate })
  } catch (error) {
    console.error('Create affiliate error:', error)
    return NextResponse.json(
      { error: 'Failed to create affiliate partner' },
      { status: 500 }
    )
  }
}

// PUT /api/affiliate - Update affiliate partner
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateAffiliateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliatePartner.findUnique({
      where: { userId: session.userId }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate partner not found' },
        { status: 404 }
      )
    }

    const updatedAffiliate = await prisma.affiliatePartner.update({
      where: { userId: session.userId },
      data: validation.data
    })

    return NextResponse.json({ affiliate: updatedAffiliate })
  } catch (error) {
    console.error('Update affiliate error:', error)
    return NextResponse.json(
      { error: 'Failed to update affiliate partner' },
      { status: 500 }
    )
  }
}

// DELETE /api/affiliate - Delete affiliate partner
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const affiliate = await prisma.affiliatePartner.findUnique({
      where: { userId: session.userId }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate partner not found' },
        { status: 404 }
      )
    }

    // Can only delete if no pending commissions
    const pendingCommissions = await prisma.affiliateCommission.count({
      where: {
        affiliateId: affiliate.id,
        status: 'PENDING'
      }
    })

    if (pendingCommissions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete affiliate with pending commissions' },
        { status: 400 }
      )
    }

    await prisma.affiliatePartner.delete({
      where: { userId: session.userId }
    })

    return NextResponse.json({ message: 'Affiliate partner deleted successfully' })
  } catch (error) {
    console.error('Delete affiliate error:', error)
    return NextResponse.json(
      { error: 'Failed to delete affiliate partner' },
      { status: 500 }
    )
  }
}
