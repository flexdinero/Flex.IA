import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SessionData } from './auth'

export async function getCurrentUser(request?: NextRequest): Promise<SessionData | null> {
  try {
    let sessionToken: string | undefined

    if (request) {
      // Server-side with request object
      sessionToken = request.cookies.get('session')?.value
    } else {
      // Server-side without request object (using cookies())
      const cookieStore = await cookies()
      sessionToken = cookieStore.get('session')?.value
    }

    if (!sessionToken) {
      return null
    }

    return await verifySession(sessionToken)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(request?: NextRequest): Promise<SessionData> {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(role: string, request?: NextRequest): Promise<SessionData> {
  const user = await requireAuth(request)
  if (user.role !== role) {
    throw new Error('Insufficient permissions')
  }
  return user
}
