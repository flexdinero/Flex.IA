"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/loading'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickResponses, setQuickResponses] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      loadQuickResponses()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadQuickResponses = async () => {
    try {
      const response = await fetch('/api/chat?action=quick-responses')
      if (response.ok) {
        const data = await response.json()
        setQuickResponses(data.quickResponses || [])
      }
    } catch (error) {
      console.error('Failed to load quick responses:', error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setSuggestions([])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession?.id,
          message,
          includeContext: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: ChatMessage = {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(data.message.timestamp)
        }

        setMessages(prev => [...prev, assistantMessage])
        
        if (data.suggestions) {
          setSuggestions(data.suggestions)
        }

        if (data.isNewSession) {
          setCurrentSession({
            id: data.sessionId,
            title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            messages: [userMessage, assistantMessage]
          })
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickResponse = (response: string) => {
    sendMessage(response)
  }

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const startNewChat = () => {
    setCurrentSession(null)
    setMessages([])
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white"
          size="icon"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Modal Overlay - Only show when not minimized */}
      {!isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-35 md:block hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close AI Assistant"
        />
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-40">
        <Card className={cn(
          "w-80 md:w-80 h-96 md:h-96 flex flex-col shadow-xl border-0",
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
          isMinimized && "h-14"
        )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
            <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
              24/7
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-700"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <p className="text-sm mb-4">Hi! I'm your AI assistant. How can I help you today?</p>
                  
                  {quickResponses.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Quick questions:</p>
                      {quickResponses.slice(0, 3).map((response, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-2 px-3 w-full"
                          onClick={() => handleQuickResponse(response)}
                        >
                          {response}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1 opacity-70",
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Suggested:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => handleSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="pr-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(inputMessage)
                      }
                    }}
                    disabled={isLoading}
                  />
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={startNewChat}
                      title="Start new chat"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
        </Card>
      </div>
    </>
  )
}
