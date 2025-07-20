import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payments'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email'
import { realtimeService } from '@/lib/realtime'
import { logSecurityEvent, extractClientIP } from '@/lib/security'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  const ip = extractClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'stripe_webhook_missing_signature',
          bodyLength: body.length
        }
      })
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature with enhanced security
    let event: Stripe.Event
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured')
      }

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

      // Log successful webhook verification
      logSecurityEvent({
        type: 'api_access',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'stripe_webhook_verified',
          eventType: event.type,
          eventId: event.id
        }
      })

    } catch (err) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'stripe_webhook_verification_failed',
          error: err instanceof Error ? err.message : 'Unknown error',
          signature: signature.substring(0, 20) + '...' // Log partial signature for debugging
        }
      })

      console.error('Stripe webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Additional security: verify event is recent (within 5 minutes)
    const eventTime = new Date(event.created * 1000)
    const now = new Date()
    const timeDiff = now.getTime() - eventTime.getTime()
    const fiveMinutes = 5 * 60 * 1000

    if (timeDiff > fiveMinutes) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: new Date(),
        details: {
          action: 'stripe_webhook_replay_attempt',
          eventId: event.id,
          eventTime: eventTime.toISOString(),
          timeDiff
        }
      })
      return NextResponse.json(
        { error: 'Event too old' },
        { status: 400 }
      )
    }

    // Event is already parsed above, no need to parse again
    
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    })

    if (!user) {
      console.error('User not found for customer:', subscription.customer)
      return
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: getPlanFromPriceId(subscription.items.data[0].price.id),
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        plan: getPlanFromPriceId(subscription.items.data[0].price.id),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    // Send welcome email
    await emailService.sendWelcomeEmail({
      firstName: user.firstName,
      email: user.email,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    })

    // Send real-time notification
    await realtimeService.sendNotification({
      id: `sub-created-${subscription.id}`,
      userId: user.id,
      title: '🎉 Welcome to Flex.IA!',
      message: 'Your subscription is now active. Start exploring premium features!',
      type: 'system',
      timestamp: new Date()
    })

    console.log(`Subscription created for user ${user.id}`)
  } catch (error) {
    console.error('Failed to handle subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    })

    if (!user) {
      console.error('User not found for customer:', subscription.customer)
      return
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionPlan: getPlanFromPriceId(subscription.items.data[0].price.id),
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update subscription record
    await prisma.subscription.updateMany({
      where: { 
        userId: user.id,
        stripeSubscriptionId: subscription.id
      },
      data: {
        status: subscription.status,
        plan: getPlanFromPriceId(subscription.items.data[0].price.id),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    // Send notification for plan changes
    if (subscription.status === 'active') {
      await realtimeService.sendNotification({
        id: `sub-updated-${subscription.id}`,
        userId: user.id,
        title: '📈 Subscription Updated',
        message: 'Your subscription plan has been updated successfully!',
        type: 'system',
        timestamp: new Date()
      })
    }

    console.log(`Subscription updated for user ${user.id}`)
  } catch (error) {
    console.error('Failed to handle subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    })

    if (!user) {
      console.error('User not found for customer:', subscription.customer)
      return
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionPlan: null,
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update subscription record
    await prisma.subscription.updateMany({
      where: { 
        userId: user.id,
        stripeSubscriptionId: subscription.id
      },
      data: {
        status: 'canceled',
        canceledAt: new Date()
      }
    })

    // Send cancellation notification
    await realtimeService.sendNotification({
      id: `sub-canceled-${subscription.id}`,
      userId: user.id,
      title: '😢 Subscription Canceled',
      message: 'Your subscription has been canceled. We\'d love to have you back!',
      type: 'system',
      timestamp: new Date()
    })

    console.log(`Subscription canceled for user ${user.id}`)
  } catch (error) {
    console.error('Failed to handle subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer }
    })

    if (!user) {
      console.error('User not found for customer:', invoice.customer)
      return
    }

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        paidAt: new Date(invoice.status_transitions.paid_at * 1000)
      }
    })

    // Send payment confirmation
    await emailService.sendPaymentConfirmationEmail({
      adjusterName: `${user.firstName} ${user.lastName}`,
      amount: paymentService.formatPrice(invoice.amount_paid, invoice.currency),
      claimNumber: 'Subscription Payment',
      paymentDate: new Date(invoice.status_transitions.paid_at * 1000).toLocaleDateString()
    })

    // Send real-time notification
    await realtimeService.sendNotification({
      id: `payment-success-${invoice.id}`,
      userId: user.id,
      title: '💰 Payment Successful',
      message: `Payment of ${paymentService.formatPrice(invoice.amount_paid, invoice.currency)} processed successfully!`,
      type: 'system',
      timestamp: new Date()
    })

    console.log(`Payment succeeded for user ${user.id}`)
  } catch (error) {
    console.error('Failed to handle payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer }
    })

    if (!user) {
      console.error('User not found for customer:', invoice.customer)
      return
    }

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed'
      }
    })

    // Send payment failure notification
    await realtimeService.sendUrgentAlert(
      user.id,
      '⚠️ Payment Failed',
      'Your payment could not be processed. Please update your payment method to continue using Flex.IA.',
      {
        invoiceId: invoice.id,
        amount: paymentService.formatPrice(invoice.amount_due, invoice.currency),
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`
      }
    )

    console.log(`Payment failed for user ${user.id}`)
  } catch (error) {
    console.error('Failed to handle payment failed:', error)
  }
}

function getPlanFromPriceId(priceId: string): string {
  const planMap: Record<string, string> = {
    [process.env.STRIPE_STARTER_PRICE_ID || 'price_starter']: 'starter',
    [process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional']: 'professional',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise']: 'enterprise'
  }

  return planMap[priceId] || 'starter'
}
