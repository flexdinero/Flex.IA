"use client"

import { useState, useEffect, useRef } from 'react'
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
  RotateCcw,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

interface SidebarAIChatProps {
  sidebarExpanded: boolean
}

export default function SidebarAIChat({ sidebarExpanded }: SidebarAIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickResponses, setQuickResponses] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadQuickResponses()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen])

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

  // Collapsed state - just the chat icon
  if (!isOpen) {
    return (
      <div className="px-2 pb-4">
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white",
            !sidebarExpanded && "justify-center px-2"
          )}
          title={!sidebarExpanded ? "AI Assistant" : undefined}
        >
          <MessageCircle className="h-5 w-5" />
          {sidebarExpanded && (
            <>
              <span className="font-medium">AI Assistant</span>
              <Badge variant="secondary" className="ml-auto bg-blue-500 text-white text-xs">
                24/7
              </Badge>
            </>
          )}
        </Button>
      </div>
    )
  }

  // Expanded chat interface - Modal overlay for desktop, bottom panel for mobile
  return (
    <>
      {/* Desktop Modal Overlay */}
      <div className="hidden md:block fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
      <div className="hidden md:block fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50">
        {/* Desktop Chat Header */}
        <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="font-medium text-sm">AI Assistant</span>
            <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
              24/7
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Desktop Chat Content */}
        <div className="h-[calc(100%-60px)] flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-xs mb-3">Hi! I'm your AI assistant. How can I help you today?</p>

                {quickResponses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Quick questions:</p>
                    {quickResponses.slice(0, 2).map((response, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1.5 px-2 w-full"
                        onClick={() => handleQuickResponse(response)}
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs",
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
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
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Desktop Input Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="text-xs h-8 pr-6"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
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
                    <RotateCcw className="h-2.5 w-2.5" />
                  </Button>
                )}
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="h-8 w-8 p-0"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Panel */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="font-medium text-sm">AI Assistant</span>
          <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
            24/7
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-700"
            onClick={() => setIsOpen(false)}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="h-80 flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-xs mb-3">Hi! I'm your AI assistant. How can I help you today?</p>
              
              {quickResponses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium">Quick questions:</p>
                  {quickResponses.slice(0, 2).map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1.5 px-2 w-full"
                      onClick={() => handleQuickResponse(response)}
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs",
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
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
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="text-xs h-8 pr-6"
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
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
