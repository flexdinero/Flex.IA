import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/auth'
import { z } from 'zod'

const sendMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(2000),
  includeContext: z.boolean().default(true)
})

// GET /api/chat - Get chat sessions or session details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    // Handle quick responses request
    if (action === 'quick-responses') {
      const quickResponses = [
        "How do I submit a new claim?",
        "Show me my earnings",
        "Help with firm communications",
        "How to connect with insurance firms?",
        "What documents do I need for claims?"
      ]

      return NextResponse.json({ quickResponses })
    }

    const session = await verifySessionFromRequest(request)
    if (!session) {
      // In development, provide mock data
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          sessions: [
            {
              id: 'demo-session-1',
              title: 'Claims Help',
              lastMessage: 'How can I help you with your claims?',
              timestamp: new Date().toISOString()
            },
            {
              id: 'demo-session-2',
              title: 'Earnings Question',
              lastMessage: 'Let me help you track your earnings.',
              timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            }
          ]
        })
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, implement actual session retrieval
    return NextResponse.json({
      sessions: [],
      message: 'Chat sessions will be implemented with full AI integration'
    })

  } catch (error) {
    console.error('Chat GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat data' },
      { status: 500 }
    )
  }
}

// POST /api/chat - Send message and get AI response
export async function POST(request: NextRequest) {
  try {
    // Parse request body first
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate request data
    const validation = sendMessageSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { sessionId, message, includeContext } = validation.data

    // Verify session
    const session = await verifySessionFromRequest(request)
    if (!session) {
      // In development, provide mock response
      if (process.env.NODE_ENV === 'development') {
        const mockResponses = [
          "Hello! I'm your AI assistant for Flex.IA. I can help you with claims management, earnings tracking, and firm communications. What would you like to know?",
          "I can help you submit new claims, check your earnings status, or connect with insurance firms. What specific task are you working on?",
          "Great question! For claims management, you can use the dashboard to track all your active claims, deadlines, and documentation. Would you like me to guide you through a specific process?",
          "I'm here to help with your independent adjusting business. I can assist with workflow optimization, firm communications, and performance analytics. How can I support you today?"
        ]

        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        const timestamp = new Date().toISOString()
        const messageId = 'msg-' + Date.now()
        const newSessionId = sessionId || 'demo-session-' + Date.now()

        return NextResponse.json({
          sessionId: newSessionId,
          message: {
            id: messageId,
            role: 'assistant',
            content: randomResponse,
            timestamp
          },
          suggestions: [
            "How do I submit a new claim?",
            "Show me my earnings",
            "Help with firm communications"
          ],
          isNewSession: !sessionId
        })
      }

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, implement actual AI chat logic here
    // For now, return a placeholder response
    const timestamp = new Date().toISOString()
    const messageId = 'msg-' + Date.now()
    const newSessionId = sessionId || 'session-' + Date.now()

    return NextResponse.json({
      sessionId: newSessionId,
      message: {
        id: messageId,
        role: 'assistant',
        content: "I'm your AI assistant. This feature is being enhanced for production. How can I help you today?",
        timestamp
      },
      suggestions: [
        "Help with claims",
        "Check earnings",
        "Firm communications"
      ],
      isNewSession: !sessionId
    })

  } catch (error) {
    console.error('Chat POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
