import puppeteer, { Browser, Page } from 'puppeteer'
import { prisma } from './db'

interface AutomationConfig {
  headless: boolean
  timeout: number
  retries: number
  userAgent: string
}

interface FirmConnectionData {
  firmId: string
  firmName: string
  loginUrl: string
  credentials: {
    username: string
    password: string
  }
  selectors: {
    usernameField: string
    passwordField: string
    loginButton: string
    dashboardIndicator: string
  }
}

interface ClaimSubmissionData {
  claimNumber: string
  claimType: string
  description: string
  documents: string[]
  amount: number
}

class HeadlessBrowserAutomation {
  private browser: Browser | null = null
  private config: AutomationConfig

  constructor(config: Partial<AutomationConfig> = {}) {
    this.config = {
      headless: process.env.NODE_ENV === 'production',
      timeout: 30000,
      retries: 3,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...config
    }
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        defaultViewport: {
          width: 1920,
          height: 1080
        }
      })
      console.log('Browser initialized successfully')
    } catch (error) {
      console.error('Failed to initialize browser:', error)
      throw error
    }
  }

  async createPage(): Promise<Page> {
    if (!this.browser) {
      await this.initialize()
    }
    
    const page = await this.browser!.newPage()
    await page.setUserAgent(this.config.userAgent)
    
    // Set up request interception for better performance
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      if (req.resourceType() === 'stylesheet' || req.resourceType() === 'image') {
        req.abort()
      } else {
        req.continue()
      }
    })

    return page
  }

  async connectToFirm(connectionData: FirmConnectionData): Promise<{ success: boolean; error?: string }> {
    let page: Page | null = null
    
    try {
      page = await this.createPage()
      
      // Navigate to firm login page
      await page.goto(connectionData.loginUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.config.timeout 
      })

      // Wait for login form to load
      await page.waitForSelector(connectionData.selectors.usernameField, { 
        timeout: this.config.timeout 
      })

      // Fill in credentials
      await page.type(connectionData.selectors.usernameField, connectionData.credentials.username)
      await page.type(connectionData.selectors.passwordField, connectionData.credentials.password)

      // Click login button
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click(connectionData.selectors.loginButton)
      ])

      // Verify successful login
      await page.waitForSelector(connectionData.selectors.dashboardIndicator, { 
        timeout: this.config.timeout 
      })

      // Log successful connection
      await this.logAutomationEvent({
        type: 'FIRM_CONNECTION',
        firmId: connectionData.firmId,
        status: 'SUCCESS',
        details: `Successfully connected to ${connectionData.firmName}`
      })

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Log failed connection
      await this.logAutomationEvent({
        type: 'FIRM_CONNECTION',
        firmId: connectionData.firmId,
        status: 'FAILED',
        details: `Failed to connect to ${connectionData.firmName}: ${errorMessage}`
      })

      return { success: false, error: errorMessage }
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  async submitClaim(firmId: string, claimData: ClaimSubmissionData): Promise<{ success: boolean; error?: string }> {
    let page: Page | null = null
    
    try {
      page = await this.createPage()
      
      // Get firm-specific configuration
      const firm = await prisma.firm.findUnique({
        where: { id: firmId }
      })

      if (!firm) {
        throw new Error('Firm not found')
      }

      // Navigate to claim submission page
      const claimSubmissionUrl = `${firm.portalUrl}/claims/new`
      await page.goto(claimSubmissionUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.config.timeout 
      })

      // Fill claim form (this would be customized per firm)
      await this.fillClaimForm(page, claimData)

      // Upload documents
      if (claimData.documents.length > 0) {
        await this.uploadDocuments(page, claimData.documents)
      }

      // Submit claim
      await this.submitClaimForm(page)

      // Log successful submission
      await this.logAutomationEvent({
        type: 'CLAIM_SUBMISSION',
        firmId: firmId,
        status: 'SUCCESS',
        details: `Successfully submitted claim ${claimData.claimNumber}`
      })

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Log failed submission
      await this.logAutomationEvent({
        type: 'CLAIM_SUBMISSION',
        firmId: firmId,
        status: 'FAILED',
        details: `Failed to submit claim ${claimData.claimNumber}: ${errorMessage}`
      })

      return { success: false, error: errorMessage }
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  private async fillClaimForm(page: Page, claimData: ClaimSubmissionData): Promise<void> {
    // This would be customized based on each firm's form structure
    await page.waitForSelector('#claim-number', { timeout: this.config.timeout })
    await page.type('#claim-number', claimData.claimNumber)
    
    await page.select('#claim-type', claimData.claimType)
    await page.type('#description', claimData.description)
    await page.type('#amount', claimData.amount.toString())
  }

  private async uploadDocuments(page: Page, documents: string[]): Promise<void> {
    const fileInput = await page.$('input[type="file"]')
    if (fileInput) {
      await fileInput.uploadFile(...documents)
    }
  }

  private async submitClaimForm(page: Page): Promise<void> {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#submit-claim')
    ])
  }

  private async logAutomationEvent(event: {
    type: string
    firmId: string
    status: string
    details: string
  }): Promise<void> {
    try {
      await prisma.automationLog.create({
        data: {
          type: event.type,
          firmId: event.firmId,
          status: event.status,
          details: event.details,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log automation event:', error)
    }
  }

  async monitorClaimStatus(firmId: string, claimNumber: string): Promise<{ status: string; updates: string[] }> {
    let page: Page | null = null
    
    try {
      page = await this.createPage()
      
      const firm = await prisma.firm.findUnique({
        where: { id: firmId }
      })

      if (!firm) {
        throw new Error('Firm not found')
      }

      // Navigate to claim status page
      const statusUrl = `${firm.portalUrl}/claims/${claimNumber}/status`
      await page.goto(statusUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.config.timeout 
      })

      // Extract claim status
      const status = await page.$eval('.claim-status', el => el.textContent?.trim() || '')
      
      // Extract status updates
      const updates = await page.$$eval('.status-update', elements => 
        elements.map(el => el.textContent?.trim() || '')
      )

      return { status, updates }

    } catch (error) {
      console.error('Failed to monitor claim status:', error)
      return { status: 'UNKNOWN', updates: [] }
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

// Export singleton instance
export const automationService = new HeadlessBrowserAutomation()

// Export types
export type { FirmConnectionData, ClaimSubmissionData, AutomationConfig }
