import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'

// TypeScript union types based on Prisma schema comments
type ClaimStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
type ClaimType = 'AUTO_COLLISION' | 'PROPERTY_DAMAGE' | 'FIRE_DAMAGE' | 'WATER_DAMAGE' | 'THEFT' | 'VANDALISM' | 'NATURAL_DISASTER' | 'LIABILITY' | 'WORKERS_COMP' | 'OTHER'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        firm: {
          select: {
            id: true,
            name: true,
            logo: true,
            email: true,
            phone: true
          }
        },
        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            phone: true
          }
        },
        documents: {
          select: {
            id: true,
            fileName: true,
            name: true,
            url: true,
            type: true,
            createdAt: true
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        calendar: {
          where: {
            startTime: { gte: new Date() }
          },
          orderBy: { startTime: 'asc' },
          take: 5
        }
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canView = 
      user.role === 'ADMIN' ||
      claim.adjusterId === user.userId ||
      (user.role === 'FIRM_ADMIN' && claim.firmId === user.userId) ||
      claim.status === 'AVAILABLE'

    if (!canView) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

const updateClaimSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(['AUTO_COLLISION', 'PROPERTY_DAMAGE', 'FIRE_DAMAGE', 'WATER_DAMAGE', 'THEFT', 'VANDALISM', 'NATURAL_DISASTER', 'LIABILITY', 'WORKERS_COMP', 'OTHER']).optional(),
  status: z.enum(['AVAILABLE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  estimatedValue: z.number().positive().optional(),
  finalValue: z.number().positive().optional(),
  adjusterFee: z.number().positive().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1).optional(),
  incidentDate: z.string().transform(val => new Date(val)).optional(),
  deadline: z.string().transform(val => new Date(val)).optional(),
  completedAt: z.date().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    const body = await request.json()
    const updates = updateClaimSchema.parse(body)

    // Get current claim
    const currentClaim = await prisma.claim.findUnique({
      where: { id },
      select: {
        id: true,
        adjusterId: true,
        firmId: true,
        status: true
      }
    })

    if (!currentClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canUpdate = 
      user.role === 'ADMIN' ||
      currentClaim.adjusterId === user.userId ||
      (user.role === 'FIRM_ADMIN' && currentClaim.firmId === user.userId)

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Handle status changes
    if (updates.status && updates.status !== currentClaim.status) {
      if (updates.status === 'COMPLETED') {
        updates.completedAt = new Date()
      }
    }

    const claim = await prisma.claim.update({
      where: { id },
      data: updates,
      include: {
        firm: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        },
        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    })

    // Create notification for status changes
    if (updates.status && updates.status !== currentClaim.status && claim.adjusterId) {
      await prisma.notification.create({
        data: {
          userId: claim.adjusterId,
          title: 'Claim Status Updated',
          content: `Claim ${claim.claimNumber} status changed to ${updates.status}`,
          type: 'CLAIM_UPDATE'
        }
      })
    }

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error updating claim:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)

    const claim = await prisma.claim.findUnique({
      where: { id },
      select: {
        id: true,
        firmId: true,
        status: true
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Only firm admins and admins can delete claims
    const canDelete = 
      user.role === 'ADMIN' ||
      (user.role === 'FIRM_ADMIN' && claim.firmId === user.userId)

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Can only delete claims that haven't been assigned or completed
    if (claim.status === 'COMPLETED' || claim.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Cannot delete active or completed claims' },
        { status: 400 }
      )
    }

    await prisma.claim.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
