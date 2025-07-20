import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      companyName: 'Test Company'
    }

    // Mock Prisma responses
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      ...userData,
      password: 'hashed-password',
      emailVerified: false,
      createdAt: new Date(),
    })
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')

    const { req } = createMocks({
      method: 'POST',
      body: userData,
    })

    const response = await registerHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('User registered successfully')
    expect(data.user.email).toBe(userData.email)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: 'hashed-password',
        companyName: userData.companyName,
      }),
    })
  })

  it('should return error for existing email', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      password: 'password123',
    }

    // Mock existing user
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing-user',
      email: userData.email,
    })

    const { req } = createMocks({
      method: 'POST',
      body: userData,
    })

    const response = await registerHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe('User already exists')
  })

  it('should validate required fields', async () => {
    const invalidData = {
      firstName: 'John',
      // Missing required fields
    }

    const { req } = createMocks({
      method: 'POST',
      body: invalidData,
    })

    const response = await registerHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid request data')
    expect(data.details).toBeDefined()
  })
})

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should login user with valid credentials', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const mockUser = {
      id: 'user-1',
      email: loginData.email,
      password: 'hashed-password',
      emailVerified: true,
      twoFactorEnabled: false,
    }

    // Mock Prisma and bcrypt responses
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(prisma.session.create as jest.Mock).mockResolvedValue({
      id: 'session-1',
      userId: mockUser.id,
      token: 'session-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    const { req } = createMocks({
      method: 'POST',
      body: loginData,
    })

    const response = await loginHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Login successful')
    expect(data.user.email).toBe(loginData.email)
    expect(data.sessionToken).toBeDefined()
  })

  it('should return error for invalid email', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    }

    // Mock no user found
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'POST',
      body: loginData,
    })

    const response = await loginHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('should return error for invalid password', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'wrongpassword',
    }

    const mockUser = {
      id: 'user-1',
      email: loginData.email,
      password: 'hashed-password',
      emailVerified: true,
    }

    // Mock user found but wrong password
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const { req } = createMocks({
      method: 'POST',
      body: loginData,
    })

    const response = await loginHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('should require 2FA when enabled', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const mockUser = {
      id: 'user-1',
      email: loginData.email,
      password: 'hashed-password',
      emailVerified: true,
      twoFactorEnabled: true,
    }

    // Mock user with 2FA enabled
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const { req } = createMocks({
      method: 'POST',
      body: loginData,
    })

    const response = await loginHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.requiresTwoFactor).toBe(true)
    expect(data.tempToken).toBeDefined()
  })

  it('should return error for unverified email', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const mockUser = {
      id: 'user-1',
      email: loginData.email,
      password: 'hashed-password',
      emailVerified: false,
    }

    // Mock unverified user
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const { req } = createMocks({
      method: 'POST',
      body: loginData,
    })

    const response = await loginHandler(req as any)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Email not verified')
  })
})
