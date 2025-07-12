import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'

interface Params {
  id: string
}

const assignSchema = z.object({
  adjusterId: z.string().optional() // If not provided, assign to current user
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const user = await requireAuth(request)
    const body = await request.json()
    const { adjusterId } = assignSchema.parse(body)

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        firm: true,
        adjuster: true
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Check if claim is available for assignment
    if (claim.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Claim is not available for assignment' },
        { status: 400 }
      )
    }

    // Determine who to assign to
    const targetAdjusterId = adjusterId || user.userId

    // For self-assignment, adjuster must be authenticated
    if (targetAdjusterId === user.userId && user.role !== 'ADJUSTER') {
      return NextResponse.json(
        { error: 'Only adjusters can self-assign claims' },
        { status: 403 }
      )
    }

    // For assigning to others, user must be firm admin or admin
    if (targetAdjusterId !== user.userId && user.role !== 'FIRM_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions to assign claims to others' },
        { status: 403 }
      )
    }

    // Verify the target adjuster exists and is active
    const adjuster = await prisma.user.findUnique({
      where: { 
        id: targetAdjusterId,
        role: 'ADJUSTER',
        isActive: true
      }
    })

    if (!adjuster) {
      return NextResponse.json(
        { error: 'Invalid adjuster or adjuster not found' },
        { status: 400 }
      )
    }

    // Check if adjuster has connection with the firm (optional check)
    if (user.role === 'FIRM_ADMIN') {
      const connection = await prisma.firmConnection.findFirst({
        where: {
          userId: targetAdjusterId,
          firmId: claim.firmId,
          status: 'APPROVED'
        }
      })

      if (!connection) {
        return NextResponse.json(
          { error: 'Adjuster is not connected to this firm' },
          { status: 400 }
        )
      }
    }

    // Update claim with assignment
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        adjusterId: targetAdjusterId,
        status: 'ASSIGNED'
      },
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
            profileImage: true,
            email: true
          }
        }
      }
    })

    // Create notification for the assigned adjuster
    await prisma.notification.create({
      data: {
        userId: targetAdjusterId,
        title: 'New Claim Assigned',
        content: `You have been assigned to claim ${claim.claimNumber} - ${claim.title}`,
        type: 'CLAIM_ASSIGNED'
      }
    })

    // Create earning record
    if (claim.adjusterFee) {
      await prisma.earning.create({
        data: {
          userId: targetAdjusterId,
          claimId: claim.id,
          amount: claim.adjusterFee,
          type: 'CLAIM_FEE',
          status: 'PENDING',
          earnedDate: new Date(),
          description: `Fee for claim ${claim.claimNumber}`
        }
      })
    }

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error('Error assigning claim:', error)
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
        adjusterId: true,
        firmId: true,
        status: true,
        claimNumber: true
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    if (!claim.adjusterId) {
      return NextResponse.json(
        { error: 'Claim is not assigned' },
        { status: 400 }
      )
    }

    // Check permissions - adjuster can unassign themselves, firm admin can unassign anyone
    const canUnassign = 
      user.role === 'ADMIN' ||
      claim.adjusterId === user.userId ||
      (user.role === 'FIRM_ADMIN' && claim.firmId === user.userId)

    if (!canUnassign) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Cannot unassign if claim is in progress or completed
    if (claim.status === 'IN_PROGRESS' || claim.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot unassign active or completed claims' },
        { status: 400 }
      )
    }

    // Update claim to remove assignment
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        adjusterId: null,
        status: 'AVAILABLE'
      },
      include: {
        firm: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    // Delete pending earnings for this claim
    await prisma.earning.deleteMany({
      where: {
        claimId: claim.id,
        status: 'PENDING'
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: claim.adjusterId,
        title: 'Claim Unassigned',
        content: `You have been unassigned from claim ${claim.claimNumber}`,
        type: 'CLAIM_UPDATE'
      }
    })

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error('Error unassigning claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
