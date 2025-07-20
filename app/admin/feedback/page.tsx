"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  Filter,
  Search,
  Reply,
  Archive,
  Trash2,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Eye,
  Star
} from "lucide-react"
import { toast } from "sonner"
import { AdminLayout } from "@/components/admin-layout"

interface FeedbackTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  type: 'bug' | 'feature' | 'question' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  subject: string
  description: string
  attachments: string[]
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: FeedbackResponse[]
  tags: string[]
  rating?: number
}

interface FeedbackResponse {
  id: string
  authorId: string
  authorName: string
  authorRole: 'admin' | 'user'
  message: string
  createdAt: string
  isInternal: boolean
}

export default function AdminFeedbackPage() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [isInternal, setIsInternal] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockTickets: FeedbackTicket[] = [
      {
        id: "TICK-001",
        userId: "user-001",
        userName: "John Doe",
        userEmail: "john.doe@example.com",
        userAvatar: "/avatars/john.jpg",
        type: "bug",
        priority: "high",
        status: "open",
        subject: "Dashboard widgets not loading properly",
        description: "When I try to resize widgets on the dashboard, they sometimes disappear or don't save their new positions. This happens consistently on Chrome browser.",
        attachments: ["screenshot1.png", "console-log.txt"],
        createdAt: "2024-01-20T10:30:00Z",
        updatedAt: "2024-01-20T10:30:00Z",
        responses: [],
        tags: ["dashboard", "widgets", "chrome"],
        rating: undefined
      },
      {
        id: "TICK-002",
        userId: "user-002",
        userName: "Sarah Johnson",
        userEmail: "sarah.j@example.com",
        type: "feature",
        priority: "medium",
        status: "in-progress",
        subject: "Add export functionality for claim reports",
        description: "It would be great to have the ability to export claim reports to PDF or Excel format for sharing with clients and for record keeping.",
        attachments: [],
        createdAt: "2024-01-19T14:15:00Z",
        updatedAt: "2024-01-20T09:45:00Z",
        assignedTo: "admin-001",
        responses: [
          {
            id: "resp-001",
            authorId: "admin-001",
            authorName: "Admin User",
            authorRole: "admin",
            message: "Thanks for the suggestion! We're currently working on implementing export functionality. Expected completion is next week.",
            createdAt: "2024-01-20T09:45:00Z",
            isInternal: false
          }
        ],
        tags: ["export", "reports", "enhancement"],
        rating: undefined
      },
      {
        id: "TICK-003",
        userId: "user-003",
        userName: "Mike Wilson",
        userEmail: "mike.w@example.com",
        type: "question",
        priority: "low",
        status: "resolved",
        subject: "How to update payment information?",
        description: "I need to update my payment method but can't find the option in settings. Can you help me locate this feature?",
        attachments: [],
        createdAt: "2024-01-18T16:20:00Z",
        updatedAt: "2024-01-19T11:30:00Z",
        responses: [
          {
            id: "resp-002",
            authorId: "admin-002",
            authorName: "Support Team",
            authorRole: "admin",
            message: "You can update your payment information by going to Settings > Billing > Payment Methods. Let me know if you need further assistance!",
            createdAt: "2024-01-19T11:30:00Z",
            isInternal: false
          },
          {
            id: "resp-003",
            authorId: "user-003",
            authorName: "Mike Wilson",
            authorRole: "user",
            message: "Perfect, found it! Thank you for the quick help.",
            createdAt: "2024-01-19T12:15:00Z",
            isInternal: false
          }
        ],
        tags: ["billing", "payment", "settings"],
        rating: 5
      }
    ]
    setTickets(mockTickets)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4" />
      case 'feature': return <Lightbulb className="h-4 w-4" />
      case 'question': return <HelpCircle className="h-4 w-4" />
      case 'general': return <MessageSquare className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800'
      case 'feature': return 'bg-blue-100 text-blue-800'
      case 'question': return 'bg-yellow-100 text-yellow-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-3 w-3" />
      case 'in-progress': return <Clock className="h-3 w-3" />
      case 'resolved': return <CheckCircle className="h-3 w-3" />
      case 'closed': return <Archive className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesType = typeFilter === "all" || ticket.type === typeFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
          : ticket
      ))
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null)
      }
      
      toast.success(`Ticket ${ticketId} status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update ticket status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newResponse: FeedbackResponse = {
        id: `resp-${Date.now()}`,
        authorId: "admin-current",
        authorName: "Current Admin",
        authorRole: "admin",
        message: responseText,
        createdAt: new Date().toISOString(),
        isInternal: isInternal
      }
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              responses: [...ticket.responses, newResponse],
              updatedAt: new Date().toISOString(),
              status: ticket.status === 'open' ? 'in-progress' : ticket.status
            }
          : ticket
      ))
      
      setSelectedTicket(prev => prev ? {
        ...prev,
        responses: [...prev.responses, newResponse],
        status: prev.status === 'open' ? 'in-progress' : prev.status
      } : null)
      
      setResponseText("")
      setIsInternal(false)
      toast.success("Response sent successfully")
    } catch (error) {
      toast.error("Failed to send response")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    avgRating: tickets.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / tickets.filter(t => t.rating).length || 0
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
        <p className="text-muted-foreground">
          Manage user feedback, bug reports, and feature requests.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Tickets</CardTitle>
              <CardDescription>Manage and respond to user feedback</CardDescription>

              {/* Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredTickets.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tickets found matching your criteria</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(ticket.type)}>
                              {getTypeIcon(ticket.type)}
                              <span className="ml-1 capitalize">{ticket.type}</span>
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status}</span>
                          </Badge>
                        </div>

                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{ticket.subject}</h4>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{ticket.userName}</span>
                          <span>•</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.responses.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{ticket.responses.length} responses</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedTicket.type)}
                      {selectedTicket.subject}
                    </CardTitle>
                    <CardDescription>
                      Ticket #{selectedTicket.id} • Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleStatusUpdate(selectedTicket.id, value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedTicket.userAvatar} alt={selectedTicket.userName} />
                      <AvatarFallback>
                        {selectedTicket.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedTicket.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedTicket.userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(selectedTicket.type)}>
                      {getTypeIcon(selectedTicket.type)}
                      <span className="ml-1 capitalize">{selectedTicket.type}</span>
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1">{selectedTicket.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Original Message */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Original Message</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>

                  {selectedTicket.attachments.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTicket.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTicket.tags.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTicket.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversation */}
                {selectedTicket.responses.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Conversation</h4>
                    <div className="space-y-3">
                      {selectedTicket.responses.map((response) => (
                        <div key={response.id} className={`p-3 rounded-lg ${
                          response.authorRole === 'admin'
                            ? response.isInternal
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{response.authorName}</p>
                              <Badge variant={response.authorRole === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                {response.authorRole}
                              </Badge>
                              {response.isInternal && (
                                <Badge variant="outline" className="text-xs text-yellow-600">
                                  Internal
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(response.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Form */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Add Response</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="internal"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="internal" className="text-sm">
                          Internal note (not visible to user)
                        </label>
                      </div>

                      <Button
                        onClick={handleResponse}
                        disabled={isLoading || !responseText.trim()}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        {isLoading ? "Sending..." : "Send Response"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {selectedTicket.rating && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">User Rating</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedTicket.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedTicket.rating}/5 stars
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details and respond</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}
