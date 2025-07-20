import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { automationService } from '@/lib/automation'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const connectFirmSchema = z.object({
  firmId: z.string(),
  credentials: z.object({
    username: z.string(),
    password: z.string()
  })
})

const submitClaimSchema = z.object({
  firmId: z.string(),
  claimNumber: z.string(),
  claimType: z.string(),
  description: z.string(),
  amount: z.number(),
  documents: z.array(z.string()).optional()
})

// GET /api/automation - Get automation logs
export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const firmId = searchParams.get('firmId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (type) where.type = type
    if (firmId) where.firmId = firmId

    const logs = await prisma.automationLog.findMany({
      where,
      include: {
        firm: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Automation logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation logs' },
      { status: 500 }
    )
  }
}

// POST /api/automation - Execute automation tasks
export async function POST(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'connect_firm':
        return await handleConnectFirm(body)
      case 'submit_claim':
        return await handleSubmitClaim(body)
      case 'check_status':
        return await handleCheckStatus(body)
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Automation error:', error)
    return NextResponse.json(
      { error: 'Automation failed' },
      { status: 500 }
    )
  }
}

async function handleConnectFirm(body: any) {
  const validation = connectFirmSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request data', details: validation.error.errors },
      { status: 400 }
    )
  }

  const { firmId, credentials } = validation.data

  // Get firm details
  const firm = await prisma.firm.findUnique({
    where: { id: firmId }
  })

  if (!firm) {
    return NextResponse.json(
      { error: 'Firm not found' },
      { status: 404 }
    )
  }

  // Prepare connection data
  const connectionData = {
    firmId: firm.id,
    firmName: firm.name,
    loginUrl: firm.website + '/login', // This would be configured per firm
    credentials,
    selectors: {
      usernameField: '#username', // These would be configured per firm
      passwordField: '#password',
      loginButton: '#login-btn',
      dashboardIndicator: '.dashboard'
    }
  }

  // Execute connection
  const result = await automationService.connectToFirm(connectionData)

  if (result.success) {
    // Update firm connection status
    await prisma.firm.update({
      where: { id: firmId },
      data: {
        // Add connection status field if needed
        updatedAt: new Date()
      }
    })
  }

  return NextResponse.json(result)
}

async function handleSubmitClaim(body: any) {
  const validation = submitClaimSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request data', details: validation.error.errors },
      { status: 400 }
    )
  }

  const { firmId, claimNumber, claimType, description, amount, documents = [] } = validation.data

  const claimData = {
    claimNumber,
    claimType,
    description,
    documents,
    amount
  }

  const result = await automationService.submitClaim(firmId, claimData)

  if (result.success) {
    // Update claim status in database
    await prisma.claim.updateMany({
      where: { 
        claimNumber,
        firmId 
      },
      data: {
        status: 'SUBMITTED',
        updatedAt: new Date()
      }
    })
  }

  return NextResponse.json(result)
}

async function handleCheckStatus(body: any) {
  const { firmId, claimNumber } = body

  if (!firmId || !claimNumber) {
    return NextResponse.json(
      { error: 'firmId and claimNumber are required' },
      { status: 400 }
    )
  }

  const result = await automationService.monitorClaimStatus(firmId, claimNumber)

  // Update claim status in database
  if (result.status !== 'UNKNOWN') {
    await prisma.claim.updateMany({
      where: { 
        claimNumber,
        firmId 
      },
      data: {
        status: result.status,
        updatedAt: new Date()
      }
    })
  }

  return NextResponse.json(result)
}

// DELETE /api/automation - Clear automation logs
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan') // ISO date string

    const where: any = {}
    if (olderThan) {
      where.timestamp = {
        lt: new Date(olderThan)
      }
    }

    const deleted = await prisma.automationLog.deleteMany({ where })

    return NextResponse.json({ 
      message: `Deleted ${deleted.count} automation logs` 
    })
  } catch (error) {
    console.error('Delete automation logs error:', error)
    return NextResponse.json(
      { error: 'Failed to delete automation logs' },
      { status: 500 }
    )
  }
}
