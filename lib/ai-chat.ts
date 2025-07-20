import { OpenAI } from 'openai'
import { prisma } from './db'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  userId?: string
  sessionId: string
}

interface ChatSession {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

interface AIResponse {
  message: string
  suggestions?: string[]
  actions?: {
    type: string
    data: any
  }[]
}

class AIChatAssistant {
  private systemPrompt = `You are Flex.IA's AI assistant, a helpful and knowledgeable assistant for independent insurance adjusters. You help with:

1. **Claim Management**: Guidance on claim processing, documentation, and best practices
2. **Industry Knowledge**: Insurance regulations, procedures, and compliance requirements  
3. **Platform Help**: How to use Flex.IA features and tools
4. **Business Support**: Tips for growing an independent adjusting business
5. **Technical Assistance**: Help with integrations, automation, and workflows

Key Guidelines:
- Be professional, helpful, and accurate
- Provide specific, actionable advice
- Reference relevant Flex.IA features when appropriate
- Ask clarifying questions when needed
- Suggest relevant actions or next steps
- Stay focused on insurance adjusting and the Flex.IA platform

If asked about topics outside your expertise, politely redirect to relevant resources or suggest contacting human support.`

  async generateResponse(
    messages: ChatMessage[],
    userId: string,
    context?: {
      userProfile?: any
      recentClaims?: any[]
      platformUsage?: any
    }
  ): Promise<AIResponse> {
    try {
      // Build conversation history
      const conversationMessages = [
        {
          role: 'system' as const,
          content: this.buildContextualPrompt(context)
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ]

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      const responseContent = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.'

      // Parse response for actions and suggestions
      const response = this.parseAIResponse(responseContent)

      return response
    } catch (error) {
      console.error('AI chat error:', error)
      return {
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.',
        suggestions: ['Contact Support', 'Try Again Later']
      }
    }
  }

  private buildContextualPrompt(context?: any): string {
    let prompt = this.systemPrompt

    if (context?.userProfile) {
      prompt += `\n\nUser Context:
- Name: ${context.userProfile.firstName} ${context.userProfile.lastName}
- Role: ${context.userProfile.role}
- Experience Level: ${context.userProfile.experienceLevel || 'Not specified'}
- Specialties: ${context.userProfile.specialties || 'General adjusting'}`
    }

    if (context?.recentClaims?.length > 0) {
      prompt += `\n\nRecent Claims Context:
- Active Claims: ${context.recentClaims.filter((c: any) => c.status === 'ACTIVE').length}
- Recent Activity: ${context.recentClaims.slice(0, 3).map((c: any) => `${c.claimNumber} (${c.status})`).join(', ')}`
    }

    if (context?.platformUsage) {
      prompt += `\n\nPlatform Usage:
- Last Login: ${context.platformUsage.lastLogin}
- Features Used: ${context.platformUsage.featuresUsed?.join(', ') || 'Basic features'}`
    }

    return prompt
  }

  private parseAIResponse(content: string): AIResponse {
    // Look for action markers in the response
    const actionRegex = /\[ACTION:([^\]]+)\]/g
    const suggestionRegex = /\[SUGGEST:([^\]]+)\]/g

    const actions: any[] = []
    const suggestions: string[] = []

    let match
    while ((match = actionRegex.exec(content)) !== null) {
      try {
        const actionData = JSON.parse(match[1])
        actions.push(actionData)
      } catch (e) {
        // Ignore malformed actions
      }
    }

    while ((match = suggestionRegex.exec(content)) !== null) {
      suggestions.push(match[1].trim())
    }

    // Clean the message content
    const cleanMessage = content
      .replace(/\[ACTION:[^\]]+\]/g, '')
      .replace(/\[SUGGEST:[^\]]+\]/g, '')
      .trim()

    return {
      message: cleanMessage,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      actions: actions.length > 0 ? actions : undefined
    }
  }

  async createChatSession(userId: string, initialMessage?: string): Promise<ChatSession> {
    const session = await prisma.chatSession.create({
      data: {
        userId,
        title: initialMessage ? this.generateSessionTitle(initialMessage) : 'New Chat',
        messages: initialMessage ? {
          create: [{
            role: 'user',
            content: initialMessage,
            timestamp: new Date()
          }]
        } : undefined
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      messages: session.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
        sessionId: session.id
      })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }
  }

  async getChatSession(sessionId: string, userId: string): Promise<ChatSession | null> {
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!session) return null

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      messages: session.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
        sessionId: session.id
      })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }
  }

  async addMessageToSession(
    sessionId: string,
    userId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<ChatMessage> {
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
        timestamp: new Date()
      }
    })

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    })

    return {
      id: message.id,
      role: message.role as 'user' | 'assistant',
      content: message.content,
      timestamp: message.timestamp,
      sessionId: message.sessionId
    }
  }

  async getUserChatSessions(userId: string, limit = 20): Promise<ChatSession[]> {
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 1 // Just get the first message for preview
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      title: session.title,
      messages: session.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
        sessionId: session.id
      })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }))
  }

  async deleteChatSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      await prisma.chatSession.deleteMany({
        where: {
          id: sessionId,
          userId
        }
      })
      return true
    } catch (error) {
      console.error('Error deleting chat session:', error)
      return false
    }
  }

  private generateSessionTitle(message: string): string {
    // Generate a short title from the first message
    const words = message.split(' ').slice(0, 6)
    let title = words.join(' ')
    if (message.split(' ').length > 6) {
      title += '...'
    }
    return title.length > 50 ? title.substring(0, 47) + '...' : title
  }

  async getQuickResponses(): Promise<string[]> {
    return [
      "How do I submit a new claim?",
      "What documents do I need for property damage claims?",
      "How can I track my claim status?",
      "What are the best practices for claim photography?",
      "How do I connect with new insurance firms?",
      "What automation features are available?",
      "How do I generate reports?",
      "What integrations does Flex.IA support?"
    ]
  }

  async getSuggestedActions(userId: string): Promise<any[]> {
    // Get user context to suggest relevant actions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        claims: {
          where: { status: 'ACTIVE' },
          take: 5
        }
      }
    })

    const suggestions = []

    if (user?.claims.length === 0) {
      suggestions.push({
        type: 'create_claim',
        title: 'Create Your First Claim',
        description: 'Get started by creating your first claim in the system'
      })
    }

    if (user?.claims.some(c => c.status === 'PENDING_REVIEW')) {
      suggestions.push({
        type: 'review_claims',
        title: 'Review Pending Claims',
        description: 'You have claims waiting for review'
      })
    }

    suggestions.push({
      type: 'view_dashboard',
      title: 'View Dashboard',
      description: 'Check your latest activity and metrics'
    })

    return suggestions
  }
}

// Export singleton instance
export const aiChatAssistant = new AIChatAssistant()

// Export types
export type { ChatMessage, ChatSession, AIResponse }

// Mock OpenAI for development if no API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Using mock responses for development.')

  // Override the generateResponse method for development
  AIChatAssistant.prototype.generateResponse = async function(
    messages: ChatMessage[],
    userId: string,
    context?: any
  ): Promise<AIResponse> {
    const lastMessage = messages[messages.length - 1]?.content || ''

    // Simple mock responses based on keywords
    let response = "I'm here to help you with your insurance adjusting needs! "

    if (lastMessage.toLowerCase().includes('claim')) {
      response += "For claim-related questions, I can help you with documentation, processing steps, and best practices. What specific aspect of claim handling would you like assistance with?"
    } else if (lastMessage.toLowerCase().includes('automation')) {
      response += "Flex.IA offers powerful automation features to streamline your workflow. You can automate firm connections, claim submissions, and status monitoring. Would you like to learn more about setting up automation?"
    } else if (lastMessage.toLowerCase().includes('integration')) {
      response += "Our platform supports various integrations with insurance firm portals and document management systems. Check the Integrations section in your settings to connect with your preferred tools."
    } else if (lastMessage.toLowerCase().includes('help') || lastMessage.toLowerCase().includes('how')) {
      response += "I can assist you with platform navigation, claim management, automation setup, and general insurance adjusting guidance. What would you like help with specifically?"
    } else {
      response += "I can help you with claim management, platform features, automation, integrations, and general insurance adjusting guidance. How can I assist you today?"
    }

    return {
      message: response,
      suggestions: [
        "How do I submit a new claim?",
        "Set up automation",
        "View integrations",
        "Contact support"
      ]
    }
  }
}
