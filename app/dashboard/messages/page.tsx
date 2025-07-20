"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  MessageSquare,
  Building2,
  CheckCheck,
  Check,
  Star,
  Archive,
  Trash2,
  Flag,
  Users,
  Plus,
  ImageIcon,
  File,
  Smile,
  Pin,
  Reply,
  Forward,
  Edit,
  Copy,
  Download,
  AlertTriangle,
  Filter,
  SortAsc,
  Clock,
  Calendar,
  MapPin,
  Mail,
  X,
  Upload,
  FileText,
  Image,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  UserPlus,
  Hash,
  AtSign,
  Zap,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Info,
  Shield,
  Lock,
  Unlock,
  Globe,
  Wifi,
  WifiOff
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FilterBar } from "@/components/ui/filter-bar"
import { messagesFilterConfig } from "@/lib/filter-configs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Enhanced interfaces for the messaging system
interface Contact {
  id: string
  name: string
  role: string
  avatar?: string
  email: string
  phone?: string
  firm: string
  online: boolean
  lastSeen: string
  timezone: string
  status: 'available' | 'busy' | 'away' | 'offline'
}

interface MessageAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
  uploadProgress?: number
}

interface Message {
  id: string
  text: string
  timestamp: string
  sender: 'me' | 'them'
  read: boolean
  delivered: boolean
  type: 'text' | 'file' | 'image' | 'voice' | 'system'
  attachments?: MessageAttachment[]
  replyTo?: string
  edited?: boolean
  editedAt?: string
  reactions?: { emoji: string; users: string[] }[]
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  encrypted?: boolean
}

interface Conversation {
  id: string
  type: 'direct' | 'group' | 'channel'
  name?: string
  participants: Contact[]
  lastMessage?: Message
  unreadCount: number
  starred: boolean
  archived: boolean
  muted: boolean
  pinned: boolean
  claimId?: string
  firmId: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  tags: string[]
  createdAt: string
  updatedAt: string
  messages: Message[]
  typing?: string[]
  draft?: string
}

interface QuickReply {
  id: string
  text: string
  category: string
  usage: number
}

export default function EnhancedMessagesPage() {
  // Core state
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  
  // UI state
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Filter and sort state
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'starred' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'firm' | 'priority'>('recent')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedFirms, setSelectedFirms] = useState<string[]>([])

  // Standardized filter state
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    type: 'all',
    firm: 'all'
  })

  // Filter handling functions
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearAllFilters = () => {
    setActiveFilters({
      status: 'all',
      type: 'all',
      firm: 'all'
    })
    setSearchTerm('')
  }

  // File upload state
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [loadingConversations, setLoadingConversations] = useState(true)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mock data - Enhanced contacts
  const mockContacts: Contact[] = [
    {
      id: 'contact-1',
      name: 'Sarah Johnson',
      role: 'Senior Claims Manager',
      avatar: '/avatars/sarah.jpg',
      email: 'sarah.johnson@crawford.com',
      phone: '+1 (555) 123-4567',
      firm: 'Crawford & Company',
      online: true,
      lastSeen: 'Active now',
      timezone: 'EST',
      status: 'available'
    },
    {
      id: 'contact-2',
      name: 'Mike Rodriguez',
      role: 'Claims Adjuster',
      avatar: '/avatars/mike.jpg',
      email: 'mike.rodriguez@sedgwick.com',
      phone: '+1 (555) 234-5678',
      firm: 'Sedgwick',
      online: false,
      lastSeen: '2 hours ago',
      timezone: 'PST',
      status: 'away'
    },
    {
      id: 'contact-3',
      name: 'Emily Chen',
      role: 'Property Claims Specialist',
      avatar: '/avatars/emily.jpg',
      email: 'emily.chen@gallagher.com',
      phone: '+1 (555) 345-6789',
      firm: 'Gallagher Bassett',
      online: true,
      lastSeen: 'Active now',
      timezone: 'CST',
      status: 'busy'
    }
  ]

  // Mock quick replies
  const mockQuickReplies: QuickReply[] = [
    { id: '1', text: 'Thank you for the update. I\'ll review and get back to you shortly.', category: 'acknowledgment', usage: 45 },
    { id: '2', text: 'Could you please provide additional documentation for this claim?', category: 'request', usage: 32 },
    { id: '3', text: 'The inspection has been completed. Report attached.', category: 'completion', usage: 28 },
    { id: '4', text: 'I\'m currently on-site and will update you within the hour.', category: 'status', usage: 21 },
    { id: '5', text: 'Payment authorization approved. Processing will begin tomorrow.', category: 'approval', usage: 19 }
  ]

  // Mock conversations with full data
  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      type: 'direct',
      participants: [mockContacts[0]],
      lastMessage: {
        id: 'msg-6',
        text: "The property inspection report looks great. We'll process the payment by Friday.",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        sender: 'them',
        read: false,
        delivered: true,
        type: 'text',
        priority: 'high'
      },
      unreadCount: 2,
      starred: true,
      archived: false,
      muted: false,
      pinned: true,
      claimId: 'CLM-2024-001',
      firmId: 'crawford',
      priority: 'high',
      tags: ['urgent', 'payment', 'inspection'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      typing: [],
      messages: [
        {
          id: 'msg-1',
          text: "Hi John, I've reviewed your initial assessment for the water damage claim. Great work on the detailed documentation.",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          sender: 'them',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-2',
          text: "Thank you! I made sure to capture all the affected areas and document the moisture readings thoroughly.",
          timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
          sender: 'me',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-3',
          text: "Perfect. Could you also provide an estimate for the drying equipment rental costs?",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          sender: 'them',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-4',
          text: "Absolutely. Based on the affected area, I estimate $450-500 for industrial dehumidifiers and air movers for 3-4 days.",
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          sender: 'me',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-5',
          text: "The property inspection report looks great. We'll process the payment by Friday.",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          sender: 'them',
          read: false,
          delivered: true,
          type: 'text',
          priority: 'high'
        },
        {
          id: 'msg-6',
          text: "",
          timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          sender: 'them',
          read: false,
          delivered: true,
          type: 'file',
          attachments: [{
            id: 'att-1',
            name: 'Payment_Authorization.pdf',
            size: 2400000,
            type: 'application/pdf',
            url: '/files/payment_auth.pdf'
          }],
          priority: 'high'
        }
      ]
    },
    {
      id: 'conv-2',
      type: 'direct',
      participants: [mockContacts[1]],
      lastMessage: {
        id: 'msg-10',
        text: "Thanks for the quick turnaround on the auto claim assessment.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        sender: 'them',
        read: true,
        delivered: true,
        type: 'text',
        priority: 'normal'
      },
      unreadCount: 0,
      starred: false,
      archived: false,
      muted: false,
      pinned: false,
      claimId: 'CLM-2024-002',
      firmId: 'sedgwick',
      priority: 'normal',
      tags: ['auto', 'assessment'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      typing: [],
      messages: [
        {
          id: 'msg-7',
          text: "John, we have an urgent auto collision case that needs immediate attention. Can you take it?",
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          sender: 'them',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'urgent'
        },
        {
          id: 'msg-8',
          text: "Yes, I can handle it. Please send me the details and I'll head out first thing tomorrow morning.",
          timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000).toISOString(),
          sender: 'me',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-9',
          text: "Perfect! I've sent the case details to your email. The policyholder is expecting your call by 9 AM.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sender: 'them',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        },
        {
          id: 'msg-10',
          text: "Thanks for the quick turnaround on the auto claim assessment.",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          sender: 'them',
          read: true,
          delivered: true,
          type: 'text',
          priority: 'normal'
        }
      ]
    }
  ]

  // Initialize data
  useEffect(() => {
    setContacts(mockContacts)
    setQuickReplies(mockQuickReplies)
    setConversations(mockConversations)
    setLoadingConversations(false)

    // Auto-select first conversation
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0])
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedConversation?.messages])

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    setIsTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }, [])

  // Send message function
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return

    setSendingMessage(true)

    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        sender: 'me',
        read: true,
        delivered: true,
        type: 'text',
        priority: 'normal'
      }

      // Update conversation with new message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
              updatedAt: new Date().toISOString()
            }
          : conv
      ))

      // Update selected conversation
      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: message,
        updatedAt: new Date().toISOString()
      } : null)

      setNewMessage('')
      toast.success('Message sent')
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }, [newMessage, selectedConversation, sendingMessage])

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedConversation) return

    const fileArray = Array.from(files)
    setUploadingFiles(fileArray)

    for (const file of fileArray) {
      try {
        // Simulate file upload with progress
        const fileId = `file-${Date.now()}-${Math.random()}`

        // Update progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // Create file message
        const message: Message = {
          id: `msg-${Date.now()}`,
          text: `Shared ${file.name}`,
          timestamp: new Date().toISOString(),
          sender: 'me',
          read: true,
          delivered: true,
          type: 'file',
          attachments: [{
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
          }],
          priority: 'normal'
        }

        // Update conversation
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessage: message,
                updatedAt: new Date().toISOString()
              }
            : conv
        ))

        setSelectedConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: message,
          updatedAt: new Date().toISOString()
        } : null)

        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploadingFiles([])
    setUploadProgress({})
  }, [selectedConversation])

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' ||
      conv.participants.some(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.firm.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      conv.lastMessage?.text.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === 'all' ||
      (activeTab === 'unread' && conv.unreadCount > 0) ||
      (activeTab === 'starred' && conv.starred) ||
      (activeTab === 'archived' && conv.archived)

    // Apply standardized filters
    const matchesStatus = activeFilters.status === 'all' ||
      (activeFilters.status === 'unread' && conv.unreadCount > 0) ||
      (activeFilters.status === 'starred' && conv.starred) ||
      (activeFilters.status === 'archived' && conv.archived)

    const matchesType = activeFilters.type === 'all' ||
      (activeFilters.type === 'direct' && conv.participants.length === 2) ||
      (activeFilters.type === 'group' && conv.participants.length > 2)

    const matchesFirm = activeFilters.firm === 'all' ||
      conv.participants.some(p => p.firm === activeFilters.firm)

    return matchesSearch && matchesTab && matchesStatus && matchesType && matchesFirm
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'name':
        return a.participants[0]?.name.localeCompare(b.participants[0]?.name || '') || 0
      case 'firm':
        return a.participants[0]?.firm.localeCompare(b.participants[0]?.firm || '') || 0
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
        {/* Sidebar - Conversations List */}
        <div className={cn(
          "border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-80"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className={cn(
                "text-xl font-semibold text-gray-900 dark:text-white",
                sidebarCollapsed && "hidden"
              )}>
                Messages
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
                {!sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewConversation(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {!sidebarCollapsed && (
              <>
                {/* Standardized Filter Bar */}
                <div className="mt-4">
                  <FilterBar
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search conversations, participants, firms..."
                    filters={messagesFilterConfig}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearAllFilters}
                    showSearch={true}
                    showFilterToggle={true}
                    compact={true}
                    className="border rounded-lg"
                  />
                </div>

                {/* Tab Navigation */}
                <div className="mt-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-6">
                      <TabsTrigger value="all" className="text-xs px-0.5 py-0.5 h-5">All</TabsTrigger>
                      <TabsTrigger value="unread" className="text-xs px-0.5 py-0.5 h-5">Unread</TabsTrigger>
                      <TabsTrigger value="starred" className="text-xs px-0.5 py-0.5 h-5">Starred</TabsTrigger>
                      <TabsTrigger value="archived" className="text-xs px-0.5 py-0.5 h-5">Archived</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </>
            )}
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {loadingConversations ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowNewConversation(true)}
                  >
                    Start a conversation
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                        selectedConversation?.id === conversation.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.participants[0]?.avatar} />
                            <AvatarFallback>
                              {conversation.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.participants[0]?.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-medium text-sm truncate",
                                conversation.unreadCount > 0 ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                              )}>
                                {sidebarCollapsed ?
                                  conversation.participants[0]?.name.split(' ')[0] :
                                  conversation.participants[0]?.name
                                }
                              </h3>
                              {conversation.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                              {conversation.pinned && <Pin className="h-3 w-3 text-blue-500" />}
                              {conversation.muted && <BellOff className="h-3 w-3 text-gray-400" />}
                            </div>
                            {!sidebarCollapsed && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">
                                  {conversation.lastMessage && formatTimestamp(conversation.lastMessage.timestamp)}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-blue-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {!sidebarCollapsed && (
                            <>
                              <p className="text-xs text-gray-500 mb-1">
                                {conversation.participants[0]?.firm}
                              </p>

                              {conversation.lastMessage && (
                                <div className="flex items-center gap-1">
                                  {conversation.lastMessage.sender === 'me' && (
                                    <div className="flex items-center">
                                      {conversation.lastMessage.delivered ? (
                                        conversation.lastMessage.read ? (
                                          <CheckCheck className="h-3 w-3 text-blue-500" />
                                        ) : (
                                          <Check className="h-3 w-3 text-gray-400" />
                                        )
                                      ) : (
                                        <Clock className="h-3 w-3 text-gray-400" />
                                      )}
                                    </div>
                                  )}
                                  <p className={cn(
                                    "text-xs truncate flex-1",
                                    conversation.unreadCount > 0 ? "font-medium text-gray-900 dark:text-white" : "text-gray-500"
                                  )}>
                                    {conversation.lastMessage.type === 'file' ? (
                                      <span className="flex items-center gap-1">
                                        <Paperclip className="h-3 w-3" />
                                        {conversation.lastMessage.attachments?.[0]?.name || 'File attachment'}
                                      </span>
                                    ) : (
                                      conversation.lastMessage.text
                                    )}
                                  </p>
                                </div>
                              )}

                              {conversation.tags.length > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  {conversation.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {conversation.tags.length > 2 && (
                                    <span className="text-xs text-gray-400">+{conversation.tags.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.participants[0]?.avatar} />
                      <AvatarFallback>
                        {selectedConversation.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.participants[0]?.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.participants[0]?.role} • {selectedConversation.participants[0]?.firm}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="h-4 w-4 mr-2" />
                          Star conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="h-4 w-4 mr-2" />
                          Mute notifications
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Conversation Header */}
                  <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                      Conversation started on {new Date(selectedConversation.createdAt).toLocaleDateString()}
                    </p>
                    {selectedConversation.claimId && (
                      <Badge variant="outline" className="mt-2">
                        Claim: {selectedConversation.claimId}
                      </Badge>
                    )}
                  </div>

                  {/* Messages */}
                  {selectedConversation.messages.map((message, index) => {
                    const isMe = message.sender === 'me'
                    const showAvatar = !isMe && (
                      index === 0 ||
                      selectedConversation.messages[index - 1]?.sender !== message.sender
                    )

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isMe ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isMe && (
                          <div className="w-8">
                            {showAvatar ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedConversation.participants[0]?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {selectedConversation.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ) : null}
                          </div>
                        )}

                        <div className={cn(
                          "max-w-[70%] space-y-1",
                          isMe && "flex flex-col items-end"
                        )}>
                          <div className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            isMe
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
                            message.priority === 'urgent' && "ring-2 ring-red-500",
                            message.priority === 'high' && "ring-1 ring-orange-500"
                          )}>
                            {message.type === 'text' && (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            )}

                            {message.type === 'file' && message.attachments && (
                              <div className="space-y-2">
                                {message.text && (
                                  <p className="whitespace-pre-wrap">{message.text}</p>
                                )}
                                {message.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-lg border",
                                      isMe
                                        ? "bg-blue-500 border-blue-400"
                                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                    )}
                                  >
                                    <div className={cn(
                                      "p-2 rounded",
                                      isMe ? "bg-blue-400" : "bg-gray-100 dark:bg-gray-600"
                                    )}>
                                      {attachment.type.startsWith('image/') ? (
                                        <Image className="h-4 w-4" />
                                      ) : attachment.type === 'application/pdf' ? (
                                        <FileText className="h-4 w-4" />
                                      ) : (
                                        <File className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={cn(
                                        "font-medium text-sm truncate",
                                        isMe ? "text-white" : "text-gray-900 dark:text-white"
                                      )}>
                                        {attachment.name}
                                      </p>
                                      <p className={cn(
                                        "text-xs",
                                        isMe ? "text-blue-100" : "text-gray-500"
                                      )}>
                                        {formatFileSize(attachment.size)}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-8 w-8 p-0",
                                        isMe
                                          ? "text-white hover:bg-blue-500"
                                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                      )}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {message.edited && (
                              <p className={cn(
                                "text-xs mt-1 opacity-70",
                                isMe ? "text-blue-100" : "text-gray-500"
                              )}>
                                (edited)
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(message.timestamp)}
                            </span>
                            {isMe && (
                              <div className="flex items-center">
                                {message.delivered ? (
                                  message.read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-400" />
                                  )
                                ) : (
                                  <Clock className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            )}
                            {message.priority === 'urgent' && (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                            {message.encrypted && (
                              <Lock className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing indicator */}
                  {selectedConversation.typing && selectedConversation.typing.length > 0 && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedConversation.participants[0]?.avatar} />
                        <AvatarFallback className="text-xs">
                          {selectedConversation.participants[0]?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Replies</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickReplies(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {quickReplies.slice(0, 5).map((reply) => (
                        <Button
                          key={reply.id}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto py-2 px-3"
                          onClick={() => {
                            setNewMessage(reply.text)
                            setShowQuickReplies(false)
                            messageInputRef.current?.focus()
                          }}
                        >
                          <div className="flex-1">
                            <p className="text-sm">{reply.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {reply.category} • Used {reply.usage} times
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload Progress */}
                {uploadingFiles.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {uploadingFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <File className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <Progress
                            value={uploadProgress[`file-${Date.now()}-${index}`] || 0}
                            className="h-2 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      ref={messageInputRef}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        handleTyping()
                      }}
                      className="min-h-[44px] max-h-32 resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {/* File Upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files)
                        }
                      }}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* Quick Replies Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      title="Quick replies"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>

                    {/* Voice Recording */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className={cn(isRecording && "text-red-500")}
                      title={isRecording ? "Stop recording" : "Voice message"}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    {/* Send Button */}
                    <Button
                      size="sm"
                      disabled={!newMessage.trim() || sendingMessage}
                      onClick={sendMessage}
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Typing indicator for current user */}
                {isTyping && (
                  <div className="mt-2 text-xs text-gray-500">
                    You are typing...
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 mb-4">
                  Choose a conversation from the sidebar to start messaging
                </p>
                <Button onClick={() => setShowNewConversation(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start new conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
