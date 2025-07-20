import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplate {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

interface WelcomeEmailData {
  firstName: string
  email: string
  loginUrl: string
}

interface ClaimAssignmentEmailData {
  adjusterName: string
  claimNumber: string
  claimTitle: string
  firmName: string
  deadline: string
  claimUrl: string
}

interface PaymentConfirmationEmailData {
  adjusterName: string
  amount: string
  claimNumber: string
  paymentDate: string
}

interface FirmConnectionEmailData {
  adjusterName: string
  firmName: string
  connectionUrl: string
}

export class EmailService {
  private fromEmail = process.env.FROM_EMAIL || 'noreply@flex.ia'

  async sendEmail({ to, subject, html, text, from }: EmailTemplate) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('Email would be sent:', { to, subject })
        return { success: true, id: 'demo-email-id' }
      }

      const result = await resend.emails.send({
        from: from || this.fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        react: null // Required by Resend API
      })

      return { success: true, id: result.data?.id }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Flex.IA</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Flex.IA! 🚀</h1>
              <p>Your journey to adjusting success starts now</p>
            </div>
            <div class="content">
              <h2>Hi ${data.firstName}!</h2>
              <p>Welcome to Flex.IA - the platform that's about to transform your independent adjusting career!</p>
              
              <p><strong>Here's what you can do right now:</strong></p>
              <ul>
                <li>✅ Browse available claims from top-tier firms</li>
                <li>📊 Set up your earnings tracking</li>
                <li>🏢 Connect with premium insurance firms</li>
                <li>📅 Schedule your first inspection</li>
                <li>💰 Start maximizing your income potential</li>
              </ul>

              <div style="text-align: center;">
                <a href="${data.loginUrl}" class="button">Access Your Dashboard</a>
              </div>

              <p><strong>Need help getting started?</strong></p>
              <p>Our success team is here to help you maximize your earning potential. Reply to this email or schedule a free consultation.</p>

              <p>To your success,<br>The Flex.IA Team</p>
            </div>
            <div class="footer">
              <p>Flex.IA - Guarantee Your Success as an Independent Adjuster</p>
              <p>If you have any questions, contact us at support@flex.ia</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.email,
      subject: '🚀 Welcome to Flex.IA - Your Success Journey Starts Now!',
      html
    })
  }

  async sendClaimAssignmentEmail(data: ClaimAssignmentEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Claim Assignment</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .claim-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .urgent { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Claim Assignment!</h1>
              <p>You've been assigned a new claim</p>
            </div>
            <div class="content">
              <h2>Hi ${data.adjusterName}!</h2>
              <p>Great news! You've been assigned a new claim. Here are the details:</p>
              
              <div class="claim-details">
                <h3>Claim Details</h3>
                <p><strong>Claim Number:</strong> ${data.claimNumber}</p>
                <p><strong>Title:</strong> ${data.claimTitle}</p>
                <p><strong>Firm:</strong> ${data.firmName}</p>
                <p><strong>Deadline:</strong> <span class="urgent">${data.deadline}</span></p>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Review the claim details in your dashboard</li>
                <li>Contact the claimant to schedule inspection</li>
                <li>Upload required documentation</li>
                <li>Submit your report before the deadline</li>
              </ol>

              <div style="text-align: center;">
                <a href="${data.claimUrl}" class="button">View Claim Details</a>
              </div>

              <p>Questions? Contact the firm directly or reach out to our support team.</p>

              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.adjusterName,
      subject: `🎯 New Claim Assignment: ${data.claimNumber}`,
      html
    })
  }

  async sendPaymentConfirmationEmail(data: PaymentConfirmationEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payment Confirmed!</h1>
              <p>Your payment has been processed</p>
            </div>
            <div class="content">
              <h2>Hi ${data.adjusterName}!</h2>
              <p>Great news! Your payment has been successfully processed.</p>
              
              <div class="payment-details">
                <h3>Payment Details</h3>
                <p><strong>Amount:</strong> <span class="amount">${data.amount}</span></p>
                <p><strong>Claim Number:</strong> ${data.claimNumber}</p>
                <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
              </div>

              <p>The payment should appear in your account within 1-2 business days.</p>

              <p>Keep up the excellent work! Your success is our success.</p>

              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.adjusterName,
      subject: `💰 Payment Confirmed: ${data.amount} for Claim ${data.claimNumber}`,
      html
    })
  }

  async sendFirmConnectionEmail(data: FirmConnectionEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Firm Connection</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 New Firm Connection!</h1>
              <p>You've connected with a new firm</p>
            </div>
            <div class="content">
              <h2>Hi ${data.adjusterName}!</h2>
              <p>Congratulations! You've successfully connected with <strong>${data.firmName}</strong>.</p>
              
              <p>This connection opens up new opportunities for:</p>
              <ul>
                <li>🎯 Priority access to their claims</li>
                <li>💰 Higher-paying assignments</li>
                <li>📈 Increased earning potential</li>
                <li>🏆 Building your professional reputation</li>
              </ul>

              <div style="text-align: center;">
                <a href="${data.connectionUrl}" class="button">View Connection Details</a>
              </div>

              <p>Start browsing their available claims and take your adjusting career to the next level!</p>

              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.adjusterName,
      subject: `🤝 Connected with ${data.firmName} - New Opportunities Await!`,
      html
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password for your Flex.IA account.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <ul>
                  <li>This link expires in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>

              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>

              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: '🔐 Reset Your Flex.IA Password',
      html
    })
  }

  async sendWelcomeEmailLegacy(email: string, firstName: string, planName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Flex.IA</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Flex.IA!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName}!</h2>
              <p>Welcome to Flex.IA! Your ${planName} subscription is now active and you're ready to start maximizing your independent adjusting career.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Access Your Dashboard</a>
              </div>

              <h3>What's Next?</h3>
              <div class="feature">
                <h4>🔍 Browse Available Claims</h4>
                <p>Start exploring claims from our network of 50+ insurance firms</p>
              </div>
              <div class="feature">
                <h4>📊 Track Your Earnings</h4>
                <p>Monitor your income and performance with detailed analytics</p>
              </div>
              <div class="feature">
                <h4>🤝 Connect with Firms</h4>
                <p>Build relationships with top insurance companies</p>
              </div>

              <p>If you have any questions, our support team is here to help!</p>
              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: '🎉 Welcome to Flex.IA - Your Account is Ready!',
      html
    })
  }

  async sendPlanChangeEmail(email: string, firstName: string, oldPlan: string, newPlan: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Subscription Updated</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📈 Subscription Updated</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName}!</h2>
              <p>Your Flex.IA subscription has been successfully updated from ${oldPlan} to ${newPlan}.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="button">View Billing Details</a>
              </div>

              <p>Your new plan features are now available in your dashboard.</p>
              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: '📈 Your Flex.IA Subscription Has Been Updated',
      html
    })
  }

  async sendCancellationEmail(email: string, firstName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Subscription Canceled</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>😔 We're Sorry to See You Go</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Your Flex.IA subscription has been canceled. You'll continue to have access to your account until the end of your current billing period.</p>

              <p>We'd love to hear your feedback about your experience with Flex.IA. Your input helps us improve our platform for all independent adjusters.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback" class="button">Share Feedback</a>
              </div>

              <p>If you change your mind, you can reactivate your subscription anytime from your dashboard.</p>
              <p>Best regards,<br>The Flex.IA Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: '😔 Your Flex.IA Subscription Has Been Canceled',
      html
    })
  }
}

export const emailService = new EmailService()

// Export individual functions for easier importing
export const sendWelcomeEmail = (email: string, firstName: string, planName: string) =>
  emailService.sendWelcomeEmail({ email, firstName, planName })

export const sendPlanChangeEmail = (email: string, firstName: string, oldPlan: string, newPlan: string) =>
  emailService.sendPlanChangeEmail(email, firstName, oldPlan, newPlan)

export const sendCancellationEmail = (email: string, firstName: string) =>
  emailService.sendCancellationEmail(email, firstName)

export const sendPasswordResetEmail = (email: string, token: string, firstName: string) =>
  emailService.sendPasswordResetEmail(email, token, firstName)

export const sendVerificationEmail = (email: string, token: string, firstName: string) =>
  emailService.sendVerificationEmail(email, token, firstName)

// Placeholder functions for missing email types
export const scheduleRetentionEmail = async (email: string, firstName: string) => {
  console.log(`Retention email scheduled for ${email}`)
  // TODO: Implement with job queue
}

export const sendPaymentConfirmationEmail = async (email: string, firstName: string, amount: string, claimNumber: string) => {
  console.log(`Payment confirmation email sent to ${email}`)
  // TODO: Implement payment confirmation template
}

export const sendPaymentFailureEmail = async (email: string, firstName: string, amount: string) => {
  console.log(`Payment failure email sent to ${email}`)
  // TODO: Implement payment failure template
}

export const sendSupportTicketEmail = async (email: string, firstName: string, ticketNumber: string, subject: string, description: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Support Ticket Created</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Support Ticket Created</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>Your support ticket has been created successfully. Our team will review it and respond as soon as possible.</p>

            <div class="ticket-info">
              <h3>Ticket Details</h3>
              <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Description:</strong> ${description}</p>
            </div>

            <p>You can track the status of your ticket in your dashboard or reply to this email to add more information.</p>
            <p>Best regards,<br>The Flex.IA Support Team</p>
          </div>
        </div>
      </body>
    </html>
  `

  return emailService.sendEmail({
    to: email,
    subject: `🎫 Support Ticket Created - ${ticketNumber}`,
    html
  })
}
