import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

const querySchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  type: z.string().optional()
})

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().default('MEETING'),
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  isAllDay: z.boolean().default(false),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  claimId: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const { start, end, type } = querySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: any = { userId: user.userId }

    if (start && end) {
      where.startTime = {
        gte: new Date(start),
        lte: new Date(end)
      }
    }

    if (type) {
      where.type = type
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        claim: {
          select: {
            id: true,
            claimNumber: true,
            title: true,
            address: true,
            city: true,
            state: true,
            firm: {
              select: { name: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ events })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Calendar fetch error:', error)
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
    const eventData = createEventSchema.parse(body)

    // Validate end time is after start time
    if (eventData.endTime <= eventData.startTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Check for conflicts (optional - can be disabled for flexibility)
    const conflictingEvents = await prisma.calendarEvent.findMany({
      where: {
        userId: user.userId,
        OR: [
          {
            startTime: {
              lt: eventData.endTime,
              gte: eventData.startTime
            }
          },
          {
            endTime: {
              gt: eventData.startTime,
              lte: eventData.endTime
            }
          },
          {
            AND: [
              { startTime: { lte: eventData.startTime } },
              { endTime: { gte: eventData.endTime } }
            ]
          }
        ]
      }
    })

    if (conflictingEvents.length > 0) {
      return NextResponse.json(
        { 
          error: 'Time conflict detected',
          conflicts: conflictingEvents.map(e => ({
            id: e.id,
            title: e.title,
            startTime: e.startTime,
            endTime: e.endTime
          }))
        },
        { status: 409 }
      )
    }

    const event = await prisma.calendarEvent.create({
      data: {
        ...eventData,
        userId: user.userId
      },
      include: {
        claim: {
          select: {
            id: true,
            claimNumber: true,
            title: true,
            firm: {
              select: { name: true }
            }
          }
        }
      }
    })

    // Create notification for the event
    await prisma.notification.create({
      data: {
        title: 'New Event Scheduled',
        content: `Event "${event.title}" scheduled for ${event.startTime.toLocaleDateString()}`,
        type: 'CALENDAR_EVENT',
        userId: user.userId
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Calendar create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
