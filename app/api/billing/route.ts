import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { paymentService } from '@/lib/payments'
import { prisma } from '@/lib/db'

// Get billing information
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Get user with billing info
    const userWithBilling = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionCurrentPeriodEnd: true
      }
    })

    if (!userWithBilling) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let billingInfo = null
    if (userWithBilling.stripeCustomerId) {
      billingInfo = await paymentService.getBillingInfo(userWithBilling.stripeCustomerId)
    }

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        paidAt: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      user: userWithBilling,
      billing: billingInfo,
      recentPayments,
      plans: paymentService.getPlans()
    })
  } catch (error) {
    console.error('Error fetching billing info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { planId, paymentMethodId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        subscriptionStatus: true
      }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let customerId = userRecord.stripeCustomerId

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      customerId = await paymentService.createCustomer(
        userRecord.email,
        `${userRecord.firstName} ${userRecord.lastName}`,
        userRecord.id
      )

      // Update user with customer ID
      await prisma.user.update({
        where: { id: user.userId },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create subscription
    const result = await paymentService.createSubscription(
      customerId,
      planId,
      paymentMethodId
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      clientSecret: result.clientSecret,
      subscriptionId: result.subscriptionId
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update subscription
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { planId, subscriptionId } = await request.json()

    if (!planId || !subscriptionId) {
      return NextResponse.json(
        { error: 'Plan ID and subscription ID are required' },
        { status: 400 }
      )
    }

    // Verify user owns this subscription
    const userRecord = await prisma.user.findFirst({
      where: {
        id: user.userId,
        stripeSubscriptionId: subscriptionId
      }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Update subscription
    const result = await paymentService.updateSubscription(subscriptionId, planId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: result.subscriptionId
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('subscriptionId')
    const immediately = searchParams.get('immediately') === 'true'

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this subscription
    const userRecord = await prisma.user.findFirst({
      where: {
        id: user.userId,
        stripeSubscriptionId: subscriptionId
      }
    })

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Cancel subscription
    const success = await paymentService.cancelSubscription(subscriptionId, immediately)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: immediately 
        ? 'Subscription canceled immediately' 
        : 'Subscription will cancel at the end of the current period'
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
