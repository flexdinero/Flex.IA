import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

const updateEarningSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'PAID', 'DISPUTED']).optional(),
  earnedDate: z.string().transform(val => new Date(val)).optional(),
  paidDate: z.string().transform(val => new Date(val)).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const earning = await prisma.earning.findFirst({
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
            firm: {
              select: { name: true, phone: true, email: true }
            }
          }
        }
      }
    })

    if (!earning) {
      return NextResponse.json(
        { error: 'Earning not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(earning)
  } catch (error) {
    console.error('Earning fetch error:', error)
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
    const updates = updateEarningSchema.parse(body)

    // Verify earning exists and belongs to user
    const existingEarning = await prisma.earning.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!existingEarning) {
      return NextResponse.json(
        { error: 'Earning not found' },
        { status: 404 }
      )
    }

    // If status is being changed to PAID, set paidDate
    if (updates.status === 'PAID' && existingEarning.status !== 'PAID') {
      updates.paidDate = new Date()
    }

    const updatedEarning = await prisma.earning.update({
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

    // Create notification for status changes
    if (updates.status && updates.status !== existingEarning.status) {
      await prisma.notification.create({
        data: {
          title: 'Earning Status Updated',
          content: `Earning status changed from ${existingEarning.status} to ${updates.status}`,
          type: 'EARNING_STATUS_CHANGED',
          userId: user.userId
        }
      })
    }

    return NextResponse.json(updatedEarning)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid earning data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Earning update error:', error)
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

    // Verify earning exists and belongs to user
    const earning = await prisma.earning.findFirst({
      where: {
        id,
        userId: user.userId
      }
    })

    if (!earning) {
      return NextResponse.json(
        { error: 'Earning not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of PENDING earnings
    if (earning.status === 'PAID') {
      return NextResponse.json(
        { error: 'Cannot delete paid earnings' },
        { status: 400 }
      )
    }

    await prisma.earning.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Earning deleted successfully'
    })
  } catch (error) {
    console.error('Earning delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
