import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'

// TypeScript union type based on Prisma schema comments
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  unreadOnly: z.string().optional().transform(val => val === 'true'),
  claimId: z.string().optional(),
  firmId: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { page, limit, unreadOnly, claimId, firmId } = querySchema.parse(Object.fromEntries(searchParams))

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { senderId: user.userId },
        { recipientId: user.userId }
      ]
    }

    if (unreadOnly) {
      where.isRead = false
      where.recipientId = user.userId // Only unread messages to the user
    }

    if (claimId) where.claimId = claimId
    if (firmId) where.firmId = firmId

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              role: true
            }
          },
          recipient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              role: true
            }
          },
          firm: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          },
          claim: {
            select: {
              id: true,
              claimNumber: true,
              title: true
            }
          },
          documents: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              url: true,
              mimeType: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.message.count({ where })
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const createMessageSchema = z.object({
  subject: z.string().optional(),
  content: z.string().min(1),
  recipientId: z.string(),
  priority: z.nativeEnum(Priority).default('MEDIUM'),
  claimId: z.string().optional(),
  firmId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const data = createMessageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        ...data,
        senderId: user.userId
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true
          }
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true
          }
        },
        firm: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
        claim: {
          select: {
            id: true,
            claimNumber: true,
            title: true
          }
        }
      }
    })

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: data.recipientId,
        title: 'New Message',
        content: `You have a new message from ${user.firstName} ${user.lastName}`,
        type: 'MESSAGE_RECEIVED'
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
