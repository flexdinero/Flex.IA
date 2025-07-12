import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (user) {
      await deleteSession(user.userId)
    }

    const response = NextResponse.json({ success: true })
    
    // Clear session cookie
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
