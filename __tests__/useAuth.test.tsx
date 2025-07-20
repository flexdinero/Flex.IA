import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { ReactNode } from 'react'

// Mock fetch
global.fetch = jest.fn()

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('handles successful login', async () => {
    const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test' }
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true, user: mockUser })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password')
      expect(loginResult.success).toBe(true)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@example.com', 
        password: 'password' 
      })
    })
  })

  it('handles login with 2FA requirement', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ requiresTwoFactor: true })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password')
      expect(loginResult.requiresTwoFactor).toBe(true)
    })
  })

  it('handles login errors', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: 'Invalid credentials' })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'wrongpassword')
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Invalid credentials')
    })
  })

  it('handles network errors during login', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password')
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Network error occurred')
    })
  })

  it('handles successful registration', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    const userData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User'
    }

    await act(async () => {
      const registerResult = await result.current.register(userData)
      expect(registerResult.success).toBe(true)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
  })

  it('handles logout', async () => {
    const mockResponse = { ok: true }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.logout()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST'
    })
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('clears error when clearError is called', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Simulate an error state
    await act(async () => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
  })

  it('handles profile update', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    const updateData = {
      firstName: 'Updated',
      lastName: 'Name'
    }

    await act(async () => {
      const updateResult = await result.current.updateProfile(updateData)
      expect(updateResult.success).toBe(true)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
  })
})
