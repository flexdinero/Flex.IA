import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { paymentService } from '@/lib/payments'
import { z } from 'zod'

const createPaymentIntentSchema = z.object({
  amount: z.number().min(50), // Minimum $0.50
  currency: z.string().default('usd'),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const { amount, currency, description, metadata } = createPaymentIntentSchema.parse(body)

    // Create payment intent
    const result = await paymentService.createPaymentIntent(amount, currency)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Log the payment intent creation
    console.log(`Payment intent created for user ${user.userId}: ${amount} ${currency}`)

    return NextResponse.json({
      clientSecret: result.clientSecret,
      amount,
      currency
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
