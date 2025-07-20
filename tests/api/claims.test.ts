import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { GET as getClaimsHandler, POST as createClaimHandler } from '@/app/api/claims/route'
import { prisma } from '@/lib/db'
import { verifySession } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    claim: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    firm: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  verifySession: jest.fn(),
}))

const mockSession = {
  userId: 'user-1',
  email: 'john@example.com',
  role: 'USER',
}

describe('/api/claims GET', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(verifySession as jest.Mock).mockResolvedValue(mockSession)
  })

  it('should return user claims', async () => {
    const mockClaims = [
      {
        id: 'claim-1',
        claimNumber: 'CLM-001',
        type: 'AUTO',
        status: 'ACTIVE',
        description: 'Test claim',
        adjusterId: 'user-1',
        firmId: 'firm-1',
        createdAt: new Date(),
        firm: {
          name: 'Test Firm',
        },
      },
    ]

    ;(prisma.claim.findMany as jest.Mock).mockResolvedValue(mockClaims)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await getClaimsHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.claims).toEqual(mockClaims)
    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: { adjusterId: 'user-1' },
      include: {
        firm: {
          select: {
            name: true,
            website: true,
          },
        },
        documents: {
          select: {
            id: true,
            filename: true,
            fileSize: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('should filter claims by status', async () => {
    const mockClaims = [
      {
        id: 'claim-1',
        status: 'ACTIVE',
        adjusterId: 'user-1',
      },
    ]

    ;(prisma.claim.findMany as jest.Mock).mockResolvedValue(mockClaims)

    const { req } = createMocks({
      method: 'GET',
      query: { status: 'ACTIVE' },
    })

    const response = await getClaimsHandler(req as any)

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: { 
        adjusterId: 'user-1',
        status: 'ACTIVE'
      },
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    })
  })

  it('should return 401 for unauthenticated request', async () => {
    ;(verifySession as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await getClaimsHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})

describe('/api/claims POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(verifySession as jest.Mock).mockResolvedValue(mockSession)
  })

  it('should create a new claim', async () => {
    const claimData = {
      claimNumber: 'CLM-002',
      type: 'PROPERTY',
      description: 'Water damage claim',
      firmId: 'firm-1',
      dateOfLoss: '2024-01-15',
      estimatedValue: 5000,
      location: '123 Main St, City, State',
    }

    const mockFirm = {
      id: 'firm-1',
      name: 'Test Firm',
    }

    const mockCreatedClaim = {
      id: 'claim-2',
      ...claimData,
      adjusterId: 'user-1',
      status: 'PENDING',
      createdAt: new Date(),
    }

    ;(prisma.firm.findUnique as jest.Mock).mockResolvedValue(mockFirm)
    ;(prisma.claim.create as jest.Mock).mockResolvedValue(mockCreatedClaim)

    const { req } = createMocks({
      method: 'POST',
      body: claimData,
    })

    const response = await createClaimHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.claim.claimNumber).toBe(claimData.claimNumber)
    expect(data.claim.adjusterId).toBe('user-1')
    expect(prisma.claim.create).toHaveBeenCalledWith({
      data: {
        ...claimData,
        adjusterId: 'user-1',
        status: 'PENDING',
        dateOfLoss: new Date('2024-01-15'),
      },
      include: {
        firm: {
          select: {
            name: true,
            website: true,
          },
        },
      },
    })
  })

  it('should validate required fields', async () => {
    const invalidData = {
      claimNumber: 'CLM-003',
      // Missing required fields
    }

    const { req } = createMocks({
      method: 'POST',
      body: invalidData,
    })

    const response = await createClaimHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid request data')
    expect(data.details).toBeDefined()
  })

  it('should return error for invalid firm', async () => {
    const claimData = {
      claimNumber: 'CLM-004',
      type: 'AUTO',
      description: 'Test claim',
      firmId: 'invalid-firm',
      dateOfLoss: '2024-01-15',
      estimatedValue: 1000,
    }

    ;(prisma.firm.findUnique as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'POST',
      body: claimData,
    })

    const response = await createClaimHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Firm not found')
  })

  it('should return 401 for unauthenticated request', async () => {
    ;(verifySession as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'POST',
      body: {},
    })

    const response = await createClaimHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should generate unique claim number if not provided', async () => {
    const claimData = {
      type: 'PROPERTY',
      description: 'Test claim without number',
      firmId: 'firm-1',
      dateOfLoss: '2024-01-15',
      estimatedValue: 2000,
    }

    const mockFirm = {
      id: 'firm-1',
      name: 'Test Firm',
    }

    ;(prisma.firm.findUnique as jest.Mock).mockResolvedValue(mockFirm)
    ;(prisma.claim.create as jest.Mock).mockResolvedValue({
      id: 'claim-3',
      ...claimData,
      claimNumber: expect.stringMatching(/^CLM-\d{8}-\w{4}$/),
      adjusterId: 'user-1',
      status: 'PENDING',
    })

    const { req } = createMocks({
      method: 'POST',
      body: claimData,
    })

    const response = await createClaimHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.claim.claimNumber).toMatch(/^CLM-\d{8}-\w{4}$/)
  })
})
