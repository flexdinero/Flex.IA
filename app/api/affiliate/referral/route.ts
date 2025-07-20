import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const trackReferralSchema = z.object({
  affiliateCode: z.string(),
  referredUserId: z.string()
})

// POST /api/affiliate/referral - Track a new referral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = trackReferralSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { affiliateCode, referredUserId } = validation.data

    // Find affiliate partner
    const affiliate = await prisma.affiliatePartner.findUnique({
      where: { affiliateCode }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Invalid affiliate code' },
        { status: 404 }
      )
    }

    if (affiliate.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Affiliate partner is not active' },
        { status: 400 }
      )
    }

    // Check if referral already exists
    const existingReferral = await prisma.affiliateReferral.findUnique({
      where: {
        affiliateId_referredUserId: {
          affiliateId: affiliate.id,
          referredUserId
        }
      }
    })

    if (existingReferral) {
      return NextResponse.json(
        { error: 'User already referred by this affiliate' },
        { status: 409 }
      )
    }

    // Create referral
    const referral = await prisma.affiliateReferral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId,
        referralCode: affiliateCode,
        status: 'PENDING'
      }
    })

    // Update affiliate total referrals
    await prisma.affiliatePartner.update({
      where: { id: affiliate.id },
      data: {
        totalReferrals: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ referral })
  } catch (error) {
    console.error('Track referral error:', error)
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    )
  }
}

// PUT /api/affiliate/referral - Convert referral (when user subscribes)
export async function PUT(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { referralId, subscriptionAmount } = body

    if (!referralId || !subscriptionAmount) {
      return NextResponse.json(
        { error: 'referralId and subscriptionAmount are required' },
        { status: 400 }
      )
    }

    // Find referral
    const referral = await prisma.affiliateReferral.findUnique({
      where: { id: referralId },
      include: {
        affiliate: true
      }
    })

    if (!referral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      )
    }

    if (referral.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Referral already processed' },
        { status: 400 }
      )
    }

    // Calculate commission
    const commissionAmount = subscriptionAmount * referral.affiliate.commissionRate

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update referral status
      const updatedReferral = await tx.affiliateReferral.update({
        where: { id: referralId },
        data: {
          status: 'CONVERTED',
          conversionDate: new Date()
        }
      })

      // Create commission
      const commission = await tx.affiliateCommission.create({
        data: {
          affiliateId: referral.affiliate.id,
          referralId: referralId,
          amount: commissionAmount,
          commissionRate: referral.affiliate.commissionRate,
          status: 'PENDING'
        }
      })

      // Update affiliate total earnings
      await tx.affiliatePartner.update({
        where: { id: referral.affiliate.id },
        data: {
          totalEarnings: {
            increment: commissionAmount
          }
        }
      })

      return { referral: updatedReferral, commission }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Convert referral error:', error)
    return NextResponse.json(
      { error: 'Failed to convert referral' },
      { status: 500 }
    )
  }
}

// GET /api/affiliate/referral - Get referral by affiliate code (for tracking)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get('code')
    const userId = searchParams.get('userId')

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Affiliate code is required' },
        { status: 400 }
      )
    }

    // Find affiliate partner
    const affiliate = await prisma.affiliatePartner.findUnique({
      where: { affiliateCode },
      select: {
        id: true,
        affiliateCode: true,
        status: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Invalid affiliate code' },
        { status: 404 }
      )
    }

    if (affiliate.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Affiliate partner is not active' },
        { status: 400 }
      )
    }

    // If userId provided, check if already referred
    let existingReferral = null
    if (userId) {
      existingReferral = await prisma.affiliateReferral.findUnique({
        where: {
          affiliateId_referredUserId: {
            affiliateId: affiliate.id,
            referredUserId: userId
          }
        }
      })
    }

    return NextResponse.json({ 
      affiliate: {
        code: affiliate.affiliateCode,
        name: affiliate.user.firstName + ' ' + affiliate.user.lastName,
        company: null // Company name not available in user model
      },
      alreadyReferred: !!existingReferral
    })
  } catch (error) {
    console.error('Get referral error:', error)
    return NextResponse.json(
      { error: 'Failed to get referral data' },
      { status: 500 }
    )
  }
}
