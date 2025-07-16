import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  company: z.string().optional(),
  source: z.string().default('ai-automation')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, company, source } = waitlistSchema.parse(body)

    // Check if email already exists in waitlist
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { message: 'Email already registered for waitlist' },
        { status: 200 }
      )
    }

    // Add to waitlist
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email,
        name,
        company,
        source,
        status: 'pending'
      }
    })

    // Send confirmation email
    await emailService.sendEmail({
      to: email,
      subject: '🤖 Welcome to the Flex.IA AI Automation Waitlist!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>AI Automation Waitlist Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤖 You're on the AI Automation Waitlist!</h1>
                <p>Get ready for the future of independent adjusting</p>
              </div>
              <div class="content">
                <h2>Hi ${name || 'there'}!</h2>
                <p>Thank you for joining the Flex.IA AI Automation waitlist! You're now among the first to know about our revolutionary AI-powered automation platform.</p>
                
                <h3>What to expect:</h3>
                <div class="feature">
                  <h4>🚀 Early Access</h4>
                  <p>Be the first to try AI automation when it launches in Q2 2024</p>
                </div>
                <div class="feature">
                  <h4>💰 Special Pricing</h4>
                  <p>Exclusive discounts for waitlist members</p>
                </div>
                <div class="feature">
                  <h4>🎯 Custom Training</h4>
                  <p>Personalized onboarding to maximize your automation benefits</p>
                </div>

                <h3>AI Automation Features:</h3>
                <ul>
                  <li>✅ Automated report generation from photos and data</li>
                  <li>✅ Smart communication with firms and claimants</li>
                  <li>✅ Intelligent scheduling and route optimization</li>
                  <li>✅ Integration with leading IA software platforms</li>
                  <li>✅ 80% reduction in routine administrative tasks</li>
                </ul>

                <p>We'll keep you updated on our progress and notify you as soon as early access becomes available.</p>

                <p>Questions? Reply to this email - we'd love to hear from you!</p>

                <p>To your automated success,<br>The Flex.IA Team</p>
              </div>
              <div class="footer">
                <p>Flex.IA - The Future of Independent Adjusting</p>
                <p>You can unsubscribe from waitlist updates at any time.</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    // Send notification to admin
    await emailService.sendEmail({
      to: 'admin@flex.ia',
      subject: `New AI Automation Waitlist Signup: ${email}`,
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      id: waitlistEntry.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get waitlist statistics (admin only)
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('admin_key')

    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await prisma.waitlist.groupBy({
      by: ['source', 'status'],
      _count: true
    })

    const totalCount = await prisma.waitlist.count()

    return NextResponse.json({
      totalCount,
      stats
    })

  } catch (error) {
    console.error('Waitlist stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
