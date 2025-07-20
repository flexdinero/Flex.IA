import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  startTime: z.string().transform(val => new Date(val)).optional(),
  endTime: z.string().transform(val => new Date(val)).optional(),
  isAllDay: z.boolean().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  status: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const event = await prisma.calendarEvent.findFirst({
      where: {
        id,
        userId: user.userId
      },
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
              select: { name: true, phone: true }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Calendar event fetch error:', error)
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
    const updates = updateEventSchema.parse(body)

    // Verify event exists and belongs to user
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Validate time changes if provided
    if (updates.startTime || updates.endTime) {
      const startTime = updates.startTime || existingEvent.startTime
      const endTime = updates.endTime || existingEvent.endTime

      if (endTime <= startTime) {
        return NextResponse.json(
          { error: 'End time must be after start time' },
          { status: 400 }
        )
      }

      // Check for conflicts with other events
      const conflictingEvents = await prisma.calendarEvent.findMany({
        where: {
          userId: user.userId,
          id: { not: id }, // Exclude current event
          OR: [
            {
              startTime: {
                lt: endTime,
                gte: startTime
              }
            },
            {
              endTime: {
                gt: startTime,
                lte: endTime
              }
            },
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gte: endTime } }
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
    }

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id },
      data: updates,
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

    return NextResponse.json(updatedEvent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Calendar event update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    // Verify event exists and belongs to user
    const event = await prisma.calendarEvent.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    await prisma.calendarEvent.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Calendar event delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
