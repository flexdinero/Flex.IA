import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { paymentService } from '@/lib/payments'
import { prisma } from '@/lib/db'

const createSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string()
})

const updateSubscriptionSchema = z.object({
  planId: z.string()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Get user's billing information
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionCurrentPeriodEnd: true,
        subscriptionCancelAtPeriodEnd: true
      }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get billing info from Stripe if customer exists
    let billingInfo = null
    if (userRecord.stripeCustomerId) {
      billingInfo = await paymentService.getBillingInfo(userRecord.stripeCustomerId)
    }

    return NextResponse.json({
      subscription: {
        status: userRecord.subscriptionStatus,
        plan: userRecord.subscriptionPlan,
        currentPeriodEnd: userRecord.subscriptionCurrentPeriodEnd,
        cancelAtPeriodEnd: userRecord.subscriptionCancelAtPeriodEnd
      },
      billing: billingInfo,
      plans: paymentService.getPlans()
    })
  } catch (error) {
    console.error('Get subscription error:', error)
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
    const { planId, paymentMethodId } = createSubscriptionSchema.parse(body)

    // Get user record
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has an active subscription
    if (userRecord.stripeSubscriptionId && userRecord.subscriptionStatus === 'active') {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      )
    }

    // Create subscription
    const result = await paymentService.createSubscription(
      userRecord.email,
      planId,
      paymentMethodId
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create subscription' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: result.subscriptionId,
      clientSecret: result.clientSecret
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { planId } = updateSubscriptionSchema.parse(body)

    // Get user record
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!userRecord || !userRecord.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Update subscription
    const result = await paymentService.updateSubscription(
      userRecord.stripeSubscriptionId,
      planId
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update subscription' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Get user record
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!userRecord || !userRecord.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription
    const success = await paymentService.cancelSubscription(userRecord.stripeSubscriptionId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
