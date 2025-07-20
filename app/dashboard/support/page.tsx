"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Paperclip,
  Book,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  // Mock support data
  const tickets = [
    {
      id: "1",
      ticketNumber: "TKT-2024-001",
      subject: "Unable to upload claim photos",
      category: "Technical Issue",
      priority: "HIGH",
      status: "OPEN",
      createdAt: "2024-01-15T10:00:00Z",
      lastMessage: "I'm having trouble uploading photos for my claim. The upload button doesn't respond.",
      messages: [
        {
          id: "1",
          content: "I'm having trouble uploading photos for my claim. The upload button doesn't respond.",
          isFromSupport: false,
          createdAt: "2024-01-15T10:00:00Z",
          sender: { firstName: "John", lastName: "Adjuster" }
        },
        {
          id: "2",
          content: "Hi John, thank you for contacting support. Can you please try clearing your browser cache and try again?",
          isFromSupport: true,
          createdAt: "2024-01-15T11:30:00Z",
          sender: { firstName: "Sarah", lastName: "Support" }
        }
      ]
    },
    {
      id: "2",
      ticketNumber: "TKT-2024-002",
      subject: "Payment not received",
      category: "Billing",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdAt: "2024-01-14T14:30:00Z",
      lastMessage: "I completed a claim last week but haven't received payment yet.",
      messages: []
    }
  ]

  const categories = [
    "Technical Issue",
    "Billing",
    "Account",
    "Claims",
    "General Question"
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'RESOLVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // TODO: Implement send message API call
    setNewMessage("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get help with your account, claims, and technical issues
            </p>
          </div>
          <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll help you resolve it quickly
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewTicket(false)}>
                    Create Ticket
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Support Tickets
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search tickets..." className="pl-10" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-2">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-600">
                              {ticket.ticketNumber}
                            </span>
                            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{ticket.subject}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {ticket.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ticket Details */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedTicket.subject}</CardTitle>
                          <CardDescription>
                            {selectedTicket.ticketNumber} • {selectedTicket.category}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(selectedTicket.status)}>
                            {selectedTicket.status}
                          </Badge>
                          <Badge className={getPriorityColor(selectedTicket.priority)}>
                            {selectedTicket.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Messages */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectedTicket.messages.map((message: any) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.isFromSupport
                                ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                                : 'bg-gray-50 dark:bg-gray-800 mr-8'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">
                                {message.sender.firstName} {message.sender.lastName}
                              </span>
                              {message.isFromSupport && (
                                <Badge variant="secondary" className="text-xs">Support</Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply */}
                      {selectedTicket.status !== 'CLOSED' && (
                        <div className="border-t pt-4">
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              rows={3}
                            />
                            <div className="flex justify-between">
                              <Button variant="outline" size="sm">
                                <Paperclip className="h-4 w-4 mr-2" />
                                Attach File
                              </Button>
                              <Button onClick={handleSendMessage}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Select a Ticket</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Choose a ticket from the list to view details and messages
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Setting up your profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Finding and applying for claims
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Understanding the dashboard
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Common Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Upload problems
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Payment delays
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Account verification
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Billing & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Payment schedules
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Tax documentation
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                        Subscription management
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">support@flex.ia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">1-800-FLEX-IA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri 8AM-6PM CST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>
                    For urgent issues requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-300">
                        Emergency Hotline
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      For critical system issues or urgent claim problems
                    </p>
                    <p className="font-mono text-lg text-red-800 dark:text-red-300 mt-2">
                      1-800-URGENT-1
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Emergency support is available 24/7 for critical issues only.
                    Please use regular support channels for non-urgent matters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
