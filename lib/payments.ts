import Stripe from 'stripe'
import { prisma } from './db'
import { sendWelcomeEmail, sendPlanChangeEmail, sendCancellationEmail, scheduleRetentionEmail, sendPaymentConfirmationEmail, sendPaymentFailureEmail } from './email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}

export interface PaymentResult {
  success: boolean
  clientSecret?: string
  subscriptionId?: string
  error?: string
}

export interface BillingInfo {
  customerId: string
  subscriptionId?: string
  status: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
  plan?: SubscriptionPlan
}

export class PaymentService {
  private plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 4900, // $49.00 in cents
      interval: 'month',
      features: [
        'Up to 50 claims per month',
        'Basic earnings tracking',
        'Firm network access (50+ firms)',
        'Mobile app access',
        'Document storage (10GB)',
        'Email support',
        'Basic training resources'
      ],
      stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 9700, // $97.00 in cents
      interval: 'month',
      features: [
        'Unlimited claims',
        'Premium firm network (150+ top firms)',
        'Advanced analytics & AI insights',
        'Priority CAT deployment alerts',
        'Document storage (100GB)',
        'Calendar integration',
        'Performance benchmarking',
        '24/7 priority support',
        'Personal success coach'
      ],
      stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 19700, // $197.00 in cents
      interval: 'month',
      features: [
        'Everything in Professional',
        'Exclusive firm partnerships',
        'White-label options',
        'API access & custom integrations',
        'Dedicated account manager',
        'Unlimited storage',
        'Advanced security features',
        'Team management tools',
        'Custom training programs'
      ],
      stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise'
    }
  ]

  // Create or retrieve Stripe customer
  async createCustomer(email: string, name: string, userId: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId
        }
      })

      return customer.id
    } catch (error) {
      console.error('Failed to create Stripe customer:', error)
      throw new Error('Failed to create customer')
    }
  }

  // Create subscription
  async createSubscription(
    customerId: string,
    planId: string,
    paymentMethodId?: string
  ): Promise<PaymentResult> {
    try {
      const plan = this.plans.find(p => p.id === planId)
      if (!plan) {
        return { success: false, error: 'Invalid plan selected' }
      }

      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 30 // 30-day free trial
      }

      if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId
      }

      const subscription = await stripe.subscriptions.create(subscriptionData)

      const invoice = subscription.latest_invoice as Stripe.Invoice
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

      return {
        success: true,
        clientSecret: paymentIntent.client_secret!,
        subscriptionId: subscription.id
      }
    } catch (error) {
      console.error('Failed to create subscription:', error)
      return { success: false, error: 'Failed to create subscription' }
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<PaymentResult> {
    try {
      const plan = this.plans.find(p => p.id === newPlanId)
      if (!plan) {
        return { success: false, error: 'Invalid plan selected' }
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: plan.stripePriceId
        }],
        proration_behavior: 'create_prorations'
      })

      return { success: true, subscriptionId }
    } catch (error) {
      console.error('Failed to update subscription:', error)
      return { success: false, error: 'Failed to update subscription' }
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<boolean> {
    try {
      if (immediately) {
        await stripe.subscriptions.cancel(subscriptionId)
      } else {
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
      }

      return true
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      return false
    }
  }

  // Reactivate subscription
  async reactivateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })

      return true
    } catch (error) {
      console.error('Failed to reactivate subscription:', error)
      return false
    }
  }

  // Get billing info
  async getBillingInfo(customerId: string): Promise<BillingInfo | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId)
      
      if (customer.deleted) {
        return null
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 1
      })

      if (subscriptions.data.length === 0) {
        return {
          customerId,
          status: 'no_subscription'
        }
      }

      const subscription = subscriptions.data[0]
      const priceId = subscription.items.data[0].price.id
      const plan = this.plans.find(p => p.stripePriceId === priceId)

      return {
        customerId,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan
      }
    } catch (error) {
      console.error('Failed to get billing info:', error)
      return null
    }
  }

  // Create payment intent for one-time payment
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true }
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret!
      }
    } catch (error) {
      console.error('Failed to create payment intent:', error)
      return { success: false, error: 'Failed to create payment intent' }
    }
  }

  // Handle webhook events
  async handleWebhook(body: string, signature: string): Promise<boolean> {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break
        
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
        
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return true
    } catch (error) {
      console.error('Webhook handling failed:', error)
      return false
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    console.log('Subscription created:', subscription.id)

    try {
      const customerId = subscription.customer as string
      const plan = this.plans.find(p => p.stripePriceId === subscription.items.data[0].price.id)

      // Update user subscription status in database
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          subscriptionPlan: plan?.id || 'unknown',
          subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      })

      // Send welcome email
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      })

      if (user) {
        await sendWelcomeEmail(user.email, user.firstName, plan?.name || 'Premium')
      }

      // Log analytics event
      console.log(`Subscription created for customer ${customerId}: ${plan?.name}`)
    } catch (error) {
      console.error('Error handling subscription created:', error)
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('Subscription updated:', subscription.id)

    try {
      const customerId = subscription.customer as string
      const plan = this.plans.find(p => p.stripePriceId === subscription.items.data[0].price.id)

      // Get current user data to check for plan changes
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      })

      const oldPlan = user?.subscriptionPlan
      const newPlan = plan?.id

      // Update user subscription status in database
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionPlan: newPlan || 'unknown',
          subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          subscriptionCancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      })

      // Send notification if plan changed
      if (user && oldPlan !== newPlan) {
        await sendPlanChangeEmail(user.email, user.firstName, oldPlan || 'Unknown', newPlan || 'Unknown')
      }

      console.log(`Subscription updated for customer ${customerId}: ${oldPlan} -> ${newPlan}`)
    } catch (error) {
      console.error('Error handling subscription updated:', error)
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Subscription deleted:', subscription.id)

    try {
      const customerId = subscription.customer as string

      // Update user subscription status in database
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: null,
          subscriptionStatus: 'canceled',
          subscriptionPlan: null,
          subscriptionCurrentPeriodEnd: null,
          subscriptionCancelAtPeriodEnd: false
        }
      })

      // Send cancellation email
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      })

      if (user) {
        await sendCancellationEmail(user.email, user.firstName)

        // Trigger retention campaign (send after 24 hours)
        await scheduleRetentionEmail(user.email, user.firstName)
      }

      console.log(`Subscription canceled for customer ${customerId}`)
    } catch (error) {
      console.error('Error handling subscription deleted:', error)
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('Payment succeeded:', invoice.id)
    // Update payment status in database
    // Send payment confirmation email
    // Trigger analytics event
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('Payment failed:', invoice.id)
    // Update payment status in database
    // Send payment failure notification
    // Trigger dunning management
  }

  // Get available plans
  getPlans(): SubscriptionPlan[] {
    return this.plans
  }

  // Get plan by ID
  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(p => p.id === planId)
  }

  // Format price for display
  formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount / 100)
  }

  // Calculate proration amount
  async calculateProration(subscriptionId: string, newPlanId: string): Promise<number> {
    try {
      const plan = this.plans.find(p => p.id === newPlanId)
      if (!plan) return 0

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      const proration = await stripe.invoices.retrieveUpcoming({
        customer: subscription.customer as string,
        subscription: subscriptionId,
        subscription_items: [{
          id: subscription.items.data[0].id,
          price: plan.stripePriceId
        }]
      })

      return proration.amount_due
    } catch (error) {
      console.error('Failed to calculate proration:', error)
      return 0
    }
  }
}

export const paymentService = new PaymentService()
