import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

const addMessageSchema = z.object({
  content: z.string().min(1).max(5000)
})

const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: user.userId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                role: true
              }
            }
          }
        },
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Mark ticket as viewed by user
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Support ticket fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    const body = await request.json()
    const { content } = addMessageSchema.parse(body)

    // Verify ticket exists and belongs to user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Don't allow messages on closed tickets
    if (ticket.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Cannot add messages to closed tickets' },
        { status: 400 }
      )
    }

    // Create message
    const message = await prisma.supportMessage.create({
      data: {
        content,
        ticketId: id,
        senderId: user.userId,
        isFromSupport: false
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    })

    // Update ticket status if it was resolved
    if (ticket.status === 'RESOLVED') {
      await prisma.supportTicket.update({
        where: { id },
        data: { 
          status: 'OPEN',
          resolvedAt: null
        }
      })
    }

    // Create notification for support team (placeholder)
    console.log(`New message added to ticket ${ticket.ticketNumber} by ${user.firstName} ${user.lastName}`)

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid message data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Support message creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    const body = await request.json()
    const updates = updateTicketSchema.parse(body)

    // Verify ticket exists and belongs to user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Users can only close their own tickets
    if (updates.status && updates.status !== 'CLOSED') {
      return NextResponse.json(
        { error: 'Users can only close tickets' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    
    if (updates.status === 'CLOSED') {
      updateData.status = 'CLOSED'
      updateData.closedAt = new Date()
    }

    if (updates.priority) {
      updateData.priority = updates.priority
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Support ticket update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
