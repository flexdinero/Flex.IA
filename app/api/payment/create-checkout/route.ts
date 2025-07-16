import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const checkoutSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
  priceId: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, priceId } = checkoutSchema.parse(body)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Flex.IA Professional',
              description: plan === 'monthly' 
                ? 'Monthly subscription to Flex.IA Professional platform'
                : 'Annual subscription to Flex.IA Professional platform (15% savings)',
              images: ['https://your-domain.com/logo.png']
            },
            unit_amount: plan === 'monthly' ? 9700 : 98400, // $97 or $984 in cents
            recurring: {
              interval: plan === 'monthly' ? 'month' : 'year'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?cancelled=true`,
      customer_creation: 'always',
      billing_address_collection: 'required',
      metadata: {
        plan,
        source: 'flex_ia_landing'
      },
      subscription_data: {
        metadata: {
          plan,
          source: 'flex_ia_landing'
        }
      },
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Handle Stripe webhooks for subscription events
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    })

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        customer_email: session.customer_details?.email,
        subscription_id: session.subscription,
        amount_total: session.amount_total
      }
    })

  } catch (error) {
    console.error('Session retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}
