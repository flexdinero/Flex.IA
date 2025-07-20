'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  emailVerified: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, twoFactorToken?: string) => Promise<{ success: boolean; requiresTwoFactor?: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setError(null)
      setLoading(true)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch('/api/user/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else if (response.status === 401) {
        // User not authenticated, clear any existing user data
        setUser(null)
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Authentication check failed: ${response.status}`)
      }
    } catch (error) {
      let errorMessage = 'Authentication check failed'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.'
        } else {
          errorMessage = error.message
        }
      }

      console.error('Auth check failed:', error)
      setError(errorMessage)
      setUser(null)

      // Log error for monitoring
      if (typeof window !== 'undefined') {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'api_error',
            severity: 'medium',
            message: `Auth check failed: ${errorMessage}`,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {}) // Silent fail for error logging
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const login = async (email: string, password: string, twoFactorToken?: string) => {
    try {
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twoFactorToken }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (response.ok) {
        if (data.requiresTwoFactor) {
          return { success: false, requiresTwoFactor: true }
        } else {
          setUser(data.user)
          router.push('/dashboard')
          return { success: true }
        }
      } else {
        const errorMessage = data.error || `Login failed: ${response.status}`
        setError(errorMessage)

        // Log failed login attempt
        if (typeof window !== 'undefined') {
          fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'api_error',
              severity: response.status === 429 ? 'high' : 'medium',
              message: `Login failed: ${errorMessage}`,
              url: window.location.href,
              userAgent: navigator.userAgent,
              context: { email, hasToken: !!twoFactorToken },
              timestamp: new Date().toISOString()
            })
          }).catch(() => {})
        }

        return { success: false, error: errorMessage }
      }
    } catch (error) {
      let errorMessage = 'Login failed'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Login request timed out. Please try again.'
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = 'An unexpected error occurred. Please try again.'
        }
      }

      setError(errorMessage)

      // Log network/unexpected errors
      if (typeof window !== 'undefined') {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'network_error',
            severity: 'high',
            message: `Login network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {})
      }

      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (data: any) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setUser(prev => prev ? { ...prev, ...result } : null)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
