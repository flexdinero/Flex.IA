import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'
import { sendSupportTicketEmail } from '@/lib/email'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().optional()
})

const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  attachments: z.array(z.string()).optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { page, limit, status, priority, category } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId: user.userId }

    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
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
          }
        }
      }),
      prisma.supportTicket.count({ where })
    ])

    // Get ticket statistics
    const stats = await prisma.supportTicket.groupBy({
      by: ['status'],
      where: { userId: user.userId },
      _count: { status: true }
    })

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Support tickets fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const ticketData = createTicketSchema.parse(body)

    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        status: 'OPEN',
        userId: user.userId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Create initial message
    await prisma.supportMessage.create({
      data: {
        content: ticketData.description,
        ticketId: ticket.id,
        senderId: user.userId,
        isFromSupport: false
      }
    })

    // Send notification email to support team
    await sendSupportTicketEmail(
      ticket.user.email,
      ticket.user.firstName,
      ticket.ticketNumber,
      ticket.subject,
      ticket.description
    )

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: 'Support Ticket Created',
        content: `Your support ticket ${ticket.ticketNumber} has been created`,
        type: 'SUPPORT_TICKET_CREATED',
        userId: user.userId
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid ticket data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Support ticket creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
