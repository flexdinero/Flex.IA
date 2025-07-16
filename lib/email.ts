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
        text
      })

      return { success: true, id: result.data?.id }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
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
}

export const emailService = new EmailService()
