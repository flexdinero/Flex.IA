"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showNewConversation, setShowNewConversation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversations = [
    {
      id: 1,
      firm: "Crawford & Company",
      contact: {
        name: "Sarah Johnson",
        role: "Claims Manager",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
        lastSeen: "Active now",
      },
      lastMessage: {
        text: "The property inspection report looks great. We'll process the payment by Friday.",
        time: "2 min ago",
        sender: "them",
        read: false,
      },
      unreadCount: 2,
      claimId: "CLM-2024-001",
      priority: "high",
      starred: true,
      archived: false,
      type: "direct",
      messages: [
        {
          id: 1,
          text: "Hi John, I've reviewed your initial assessment for the water damage claim. Great work on the detailed documentation.",
          time: "10:30 AM",
          timestamp: "2024-01-15T10:30:00",
          sender: "them",
          read: true,
          type: "text",
        },
        {
          id: 2,
          text: "Thank you! I made sure to capture all the affected areas and document the moisture readings thoroughly.",
          time: "10:35 AM",
          timestamp: "2024-01-15T10:35:00",
          sender: "me",
          read: true,
          type: "text",
        },
        {
          id: 3,
          text: "Perfect. Could you also provide an estimate for the drying equipment rental costs?",
          time: "10:40 AM",
          timestamp: "2024-01-15T10:40:00",
          sender: "them",
          read: true,
          type: "text",
        },
        {
          id: 4,
          text: "Absolutely. Based on the affected area, I estimate $450-500 for industrial dehumidifiers and air movers for 3-4 days.",
          time: "11:15 AM",
          timestamp: "2024-01-15T11:15:00",
          sender: "me",
          read: true,
          type: "text",
        },
        {
          id: 5,
          text: "The property inspection report looks great. We'll process the payment by Friday.",
          time: "2 min ago",
          timestamp: "2024-01-15T14:28:00",
          sender: "them",
          read: false,
          type: "text",
        },
        {
          id: 6,
          text: "",
          time: "1 min ago",
          timestamp: "2024-01-15T14:29:00",
          sender: "them",
          read: false,
          type: "file",
          fileName: "Payment_Authorization.pdf",
          fileSize: "2.3 MB",
        },
      ],
    },
    {
      id: 2,
      firm: "Sedgwick",
      contact: {
        name: "Mike Rodriguez",
        role: "Senior Adjuster",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
        lastSeen: "2 hours ago",
      },
      lastMessage: {
        text: "Thanks for the quick turnaround on the auto claim assessment.",
        time: "1 hour ago",
        sender: "them",
        read: true,
      },
      unreadCount: 0,
      claimId: "CLM-2024-002",
      priority: "medium",
      starred: false,
      archived: false,
      type: "direct",
      messages: [
        {
          id: 1,
          text: "John, we have an urgent auto collision case that needs immediate attention. Can you take it?",
          time: "Yesterday 3:20 PM",
          timestamp: "2024-01-14T15:20:00",
          sender: "them",
          read: true,
          type: "text",
        },
        {
          id: 2,
          text: "Yes, I can handle it. Please send me the details and I'll head out first thing tomorrow morning.",
          time: "Yesterday 3:25 PM",
          timestamp: "2024-01-14T15:25:00",
          sender: "me",
          read: true,
          type: "text",
        },
        {
          id: 3,
          text: "Thanks for the quick turnaround on the auto claim assessment.",
          time: "1 hour ago",
          timestamp: "2024-01-15T13:30:00",
          sender: "them",
          read: true,
          type: "text",
        },
      ],
    },
    {
      id: 3,
      firm: "Pilot Catastrophe",
      contact: {
        name: "Lisa Chen",
        role: "CAT Team Lead",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
        lastSeen: "Active now",
      },
      lastMessage: {
        text: "Storm season is approaching. Are you available for deployment?",
        time: "3 hours ago",
        sender: "them",
        read: false,
      },
      unreadCount: 1,
      claimId: null,
      priority: "high",
      starred: false,
      archived: false,
      type: "direct",
      messages: [
        {
          id: 1,
          text: "Hi John! Hope you're doing well. Storm season is approaching and we're building our CAT team roster.",
          time: "3 hours ago",
          timestamp: "2024-01-15T11:30:00",
          sender: "them",
          read: false,
          type: "text",
        },
        {
          id: 2,
          text: "Storm season is approaching. Are you available for deployment?",
          time: "3 hours ago",
          timestamp: "2024-01-15T11:30:00",
          sender: "them",
          read: false,
          type: "text",
        },
      ],
    },
    {
      id: 4,
      firm: "CAT Response Team",
      contact: {
        name: "Emergency Response Group",
        role: "Multi-Firm Team",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
        lastSeen: "Active now",
      },
      lastMessage: {
        text: "Weather alert: Severe storms expected in East Texas this weekend.",
        time: "30 min ago",
        sender: "system",
        read: false,
      },
      unreadCount: 3,
      claimId: null,
      priority: "high",
      starred: false,
      archived: false,
      type: "group",
      participants: ["Sarah Johnson", "Mike Rodriguez", "Lisa Chen", "You"],
      messages: [
        {
          id: 1,
          text: "Weather alert: Severe storms expected in East Texas this weekend.",
          time: "30 min ago",
          timestamp: "2024-01-15T14:00:00",
          sender: "system",
          read: false,
          type: "alert",
        },
        {
          id: 2,
          text: "All adjusters should be on standby for potential CAT deployment.",
          time: "25 min ago",
          timestamp: "2024-01-15T14:05:00",
          sender: "system",
          read: false,
          type: "text",
        },
      ],
    },
  ]

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && conv.unreadCount > 0) ||
      (activeTab === "starred" && conv.starred) ||
      (activeTab === "archived" && conv.archived) ||
      (activeTab === "groups" && conv.type === "group")

    return matchesSearch && matchesTab
  })

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg = {
        id: selectedConversation.messages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date().toISOString(),
        sender: "me",
        read: true,
        type: "text",
      }

      selectedConversation.messages.push(newMsg)
      setNewMessage("")
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatTime = (timeStr: string) => {
    if (timeStr.includes("min ago") || timeStr.includes("hour ago") || timeStr.includes("day ago")) {
      return timeStr
    }
    return timeStr
  }

  const handleStarConversation = (convId: number) => {
    const conv = conversations.find((c) => c.id === convId)
    if (conv) {
      conv.starred = !conv.starred
    }
  }

  const handleArchiveConversation = (convId: number) => {
    const conv = conversations.find((c) => c.id === convId)
    if (conv) {
      conv.archived = !conv.archived
    }
  }

  const handleDeleteConversation = (convId: number) => {
    console.log(`Delete conversation ${convId}`)
  }

  const handleMessageAction = (action: string, messageId: number) => {
    console.log(`${action} message ${messageId}`)
  }

  const stats = {
    totalConversations: conversations.length,
    unreadConversations: conversations.filter((c) => c.unreadCount > 0).length,
    starredConversations: conversations.filter((c) => c.starred).length,
    groupConversations: conversations.filter((c) => c.type === "group").length,
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Conversations List */}
        <div className="w-1/3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                  <CardDescription>Communicate with IA firms and adjusters</CardDescription>
                </div>
                <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start New Conversation</DialogTitle>
                      <DialogDescription>Choose a contact to start messaging</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Contact</label>
                        <div className="space-y-2">
                          {["Sarah Johnson - Crawford", "Mike Rodriguez - Sedgwick", "Lisa Chen - Pilot CAT"].map(
                            (contact, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {contact
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{contact}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNewConversation(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setShowNewConversation(false)}>Start Conversation</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Unread
                    {stats.unreadConversations > 0 && (
                      <Badge className="ml-1 h-4 w-4 p-0 text-xs">{stats.unreadConversations}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs">
                    Starred
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="text-xs">
                    Groups
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="text-xs">
                    Archive
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer transition-colors border-b hover:bg-muted/50 ${
                      selectedConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.contact.avatar || "/placeholder.svg"}
                            alt={conversation.contact.name}
                          />
                          <AvatarFallback>
                            {conversation.contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.contact.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {conversation.type === "group" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Users className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{conversation.contact.name}</span>
                            {conversation.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            <Badge variant="outline" className="text-xs">
                              {conversation.firm}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <Badge className={getPriorityColor(conversation.priority)} size="sm">
                              {conversation.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {conversation.lastMessage.sender === "me" && "You: "}
                            {conversation.lastMessage.text || "📎 Attachment"}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(conversation.lastMessage.time)}
                          </span>
                        </div>

                        {conversation.claimId && (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conversation.claimId}
                            </Badge>
                          </div>
                        )}

                        {conversation.type === "group" && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {conversation.participants?.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <Card className="flex-1 flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConversation.contact.avatar || "/placeholder.svg"}
                          alt={selectedConversation.contact.name}
                        />
                        <AvatarFallback>
                          {selectedConversation.contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{selectedConversation.contact.name}</span>
                        <Badge variant="outline">{selectedConversation.contact.role}</Badge>
                        {selectedConversation.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{selectedConversation.firm}</span>
                        <span>•</span>
                        <span>{selectedConversation.contact.lastSeen}</span>
                        {selectedConversation.claimId && (
                          <>
                            <span>•</span>
                            <span>{selectedConversation.claimId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleStarConversation(selectedConversation.id)}>
                      <Star
                        className={`h-4 w-4 ${selectedConversation.starred ? "text-yellow-500 fill-current" : ""}`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStarConversation(selectedConversation.id)}>
                          <Star className="mr-2 h-4 w-4" />
                          {selectedConversation.starred ? "Unstar" : "Star"} Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveConversation(selectedConversation.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report Conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteConversation(selectedConversation.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className="group relative max-w-[70%]">
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "me"
                            ? "bg-primary text-primary-foreground"
                            : message.type === "alert"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-muted"
                        }`}
                      >
                        {message.type === "text" && <p className="text-sm">{message.text}</p>}
                        {message.type === "file" && (
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium">{message.fileName}</p>
                              <p className="text-xs opacity-70">{message.fileSize}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {message.type === "alert" && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-sm">{message.text}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">{message.time}</span>
                          {message.sender === "me" && (
                            <div className="ml-2">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3 opacity-70" />
                              ) : (
                                <Check className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message Actions */}
                      <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 ml-2">
                          <Button variant="ghost" size="sm" onClick={() => handleMessageAction("reply", message.id)}>
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleMessageAction("forward", message.id)}>
                            <Forward className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleMessageAction("copy", message.id)}>
                                <Copy className="mr-2 h-3 w-3" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMessageAction("pin", message.id)}>
                                <Pin className="mr-2 h-3 w-3" />
                                Pin
                              </DropdownMenuItem>
                              {message.sender === "me" && (
                                <DropdownMenuItem onClick={() => handleMessageAction("edit", message.id)}>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleMessageAction("delete", message.id)}>
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <File className="mr-2 h-4 w-4" />
                        Attach File
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Attach Image
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>

                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>

                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  {selectedConversation.contact.online && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {selectedConversation.contact.name} is online
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                <Button className="mt-4" onClick={() => setShowNewConversation(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
