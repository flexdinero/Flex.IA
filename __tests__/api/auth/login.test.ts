/**
 * Login API Route Tests
 * 
 * Comprehensive tests for the authentication login endpoint
 * including security, validation, and error handling
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}))

jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  createSession: jest.fn(),
  verifyTwoFactorToken: jest.fn()
}))

jest.mock('@/lib/security', () => ({
  sanitizeInput: jest.fn((input) => input),
  validateEmail: jest.fn(() => true),
  createRateLimiter: jest.fn(() => jest.fn()),
  RATE_LIMITS: { auth: { windowMs: 900000, max: 5 } },
  logSecurityEvent: jest.fn(),
  extractClientIP: jest.fn(() => '127.0.0.1')
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockAuth = require('@/lib/auth')
const mockSecurity = require('@/lib/security')

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset rate limiter mock
    mockSecurity.createRateLimiter.mockReturnValue(jest.fn().mockResolvedValue(null))
  })

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'ValidPassword123!'
    }

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      hashedPassword: 'hashed-password',
      role: 'ADJUSTER',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
      lastLoginAt: null
    }

    it('successfully logs in with valid credentials', async () => {
      // Setup mocks
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockAuth.verifyPassword.mockResolvedValue(true)
      mockAuth.createSession.mockResolvedValue({
        token: 'session-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'test-agent'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName
      }))
      expect(data.user.hashedPassword).toBeUndefined()
      expect(mockSecurity.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth_success',
          userId: mockUser.id
        })
      )
    })

    it('requires two-factor authentication when enabled', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true }
      mockPrisma.user.findUnique.mockResolvedValue(userWith2FA)
      mockAuth.verifyPassword.mockResolvedValue(true)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.requiresTwoFactor).toBe(true)
      expect(data.user).toBeUndefined()
    })

    it('validates two-factor token when provided', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true }
      mockPrisma.user.findUnique.mockResolvedValue(userWith2FA)
      mockAuth.verifyPassword.mockResolvedValue(true)
      mockAuth.verifyTwoFactorToken.mockResolvedValue(true)
      mockAuth.createSession.mockResolvedValue({
        token: 'session-token',
        expiresAt: new Date()
      })

      const loginWith2FA = {
        ...validLoginData,
        twoFactorToken: '123456'
      }

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginWith2FA),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toBeDefined()
      expect(mockAuth.verifyTwoFactorToken).toHaveBeenCalledWith(
        userWith2FA.id,
        '123456'
      )
    })

    it('rejects invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'ValidPassword123!'
      }

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
      expect(mockSecurity.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth_attempt',
          details: expect.objectContaining({
            action: 'validation_failed'
          })
        })
      )
    })

    it('rejects weak passwords', async () => {
      const weakPasswordData = {
        email: 'test@example.com',
        password: '123'
      }

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(weakPasswordData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
    })

    it('rejects non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
      expect(mockSecurity.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth_failure',
          details: expect.objectContaining({
            reason: 'user_not_found'
          })
        })
      )
    })

    it('rejects inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false }
      mockPrisma.user.findUnique.mockResolvedValue(inactiveUser)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Account is deactivated')
    })

    it('rejects incorrect password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockAuth.verifyPassword.mockResolvedValue(false)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
      expect(mockSecurity.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth_failure',
          details: expect.objectContaining({
            reason: 'invalid_password'
          })
        })
      )
    })

    it('rejects invalid two-factor token', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true }
      mockPrisma.user.findUnique.mockResolvedValue(userWith2FA)
      mockAuth.verifyPassword.mockResolvedValue(true)
      mockAuth.verifyTwoFactorToken.mockResolvedValue(false)

      const loginWith2FA = {
        ...validLoginData,
        twoFactorToken: '000000'
      }

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginWith2FA),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid two-factor authentication code')
    })

    it('applies rate limiting', async () => {
      // Mock rate limiter to return a response (indicating rate limit hit)
      const rateLimitResponse = new Response('Rate limited', { status: 429 })
      mockSecurity.createRateLimiter.mockReturnValue(
        jest.fn().mockResolvedValue(rateLimitResponse)
      )

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toContain('too many')
    })

    it('updates last login timestamp on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockAuth.verifyPassword.mockResolvedValue(true)
      mockAuth.createSession.mockResolvedValue({
        token: 'session-token',
        expiresAt: new Date()
      })

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      await POST(request)

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) }
      })
    })

    it('handles database errors gracefully', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Login failed')
    })

    it('sanitizes input data', async () => {
      const maliciousData = {
        email: '<script>alert("xss")</script>@example.com',
        password: 'ValidPassword123!'
      }

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(maliciousData),
        headers: { 'Content-Type': 'application/json' }
      })

      await POST(request)

      expect(mockSecurity.sanitizeInput).toHaveBeenCalled()
    })
  })
})
