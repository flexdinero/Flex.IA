"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRight,
  Building,
  Star,
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus,
  UserMinus,
  Eye,
  Plus,
  Wifi,
  WifiOff,
  Sync,
  LogOut,
  Shield
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Firm {
  id: string
  name: string
  logo?: string
  rating: number
  totalReviews: number
  location: string
  phone: string
  email: string
  website: string
  connectionStatus: 'Connected' | 'Pending' | 'Invited' | 'Disconnected'
  activeClaims: number
  completedClaims: number
  totalEarnings: number
  averagePayoutTime: number
  lastInteraction: string
  specialties: string[]
  paymentTerms: string
  preferredAdjusters: boolean
  responseTime: string
  communicationRating: number
}

interface MyFirmsWidgetProps {
  isCompact?: boolean
}

export function MyFirmsWidget({ isCompact = false }: MyFirmsWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({
    firmId: '',
    username: '',
    password: '',
    rememberMe: false
  })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Available firms for login
  const availableFirms = [
    { id: 'crawford', name: 'Crawford & Company', logo: '/logos/crawford.png' },
    { id: 'sedgwick', name: 'Sedgwick', logo: '/logos/sedgwick.png' },
    { id: 'gallagher', name: 'Gallagher Bassett', logo: '/logos/gallagher.png' },
    { id: 'chubb', name: 'Chubb', logo: '/logos/chubb.png' },
    { id: 'liberty', name: 'Liberty Mutual', logo: '/logos/liberty.png' },
    { id: 'travelers', name: 'Travelers', logo: '/logos/travelers.png' },
    { id: 'zurich', name: 'Zurich', logo: '/logos/zurich.png' },
    { id: 'aig', name: 'AIG', logo: '/logos/aig.png' }
  ]

  // Mock data with firm information
  const [firms, setFirms] = useState<Firm[]>([
    {
      id: "FIRM-001",
      name: "Crawford & Company",
      logo: "/logos/crawford.png",
      rating: 4.8,
      totalReviews: 156,
      location: "Tampa, FL",
      phone: "(813) 555-0123",
      email: "adjusters@crawford.com",
      website: "www.crawfordandcompany.com",
      connectionStatus: "Connected",
      activeClaims: 5,
      completedClaims: 23,
      totalEarnings: 45750,
      averagePayoutTime: 7,
      lastInteraction: "2 hours ago",
      specialties: ["Hurricane", "Water Damage", "Fire"],
      paymentTerms: "Net 15",
      preferredAdjuster: true,
      responseTime: "< 2 hours",
      communicationRating: 4.9
    },
    {
      id: "FIRM-002",
      name: "Sedgwick Claims",
      logo: "/logos/sedgwick.png",
      rating: 4.6,
      totalReviews: 89,
      location: "Orlando, FL",
      phone: "(407) 555-0456",
      email: "network@sedgwick.com",
      website: "www.sedgwick.com",
      connectionStatus: "Connected",
      activeClaims: 3,
      completedClaims: 18,
      totalEarnings: 32100,
      averagePayoutTime: 10,
      lastInteraction: "1 day ago",
      specialties: ["Commercial", "Auto", "Property"],
      paymentTerms: "Net 30",
      preferredAdjuster: false,
      responseTime: "< 4 hours",
      communicationRating: 4.5
    },
    {
      id: "FIRM-003",
      name: "Gallagher Bassett",
      logo: "/logos/gallagher.png",
      rating: 4.7,
      totalReviews: 134,
      location: "Jacksonville, FL",
      phone: "(904) 555-0789",
      email: "adjusters@gallagherbassett.com",
      website: "www.gallagherbassett.com",
      connectionStatus: "Pending",
      activeClaims: 0,
      completedClaims: 0,
      totalEarnings: 0,
      averagePayoutTime: 0,
      lastInteraction: "3 days ago",
      specialties: ["Workers Comp", "Liability", "Property"],
      paymentTerms: "Net 21",
      preferredAdjuster: false,
      responseTime: "< 6 hours",
      communicationRating: 4.6
    },
    {
      id: "FIRM-004",
      name: "Pilot Catastrophe",
      logo: "/logos/pilot.png",
      rating: 4.9,
      totalReviews: 67,
      location: "Miami, FL",
      phone: "(305) 555-0321",
      email: "cat@pilotcat.com",
      website: "www.pilotcatastrophe.com",
      connectionStatus: "Invited",
      activeClaims: 0,
      completedClaims: 0,
      totalEarnings: 0,
      averagePayoutTime: 0,
      lastInteraction: "1 week ago",
      specialties: ["Hurricane", "Catastrophe", "Emergency"],
      paymentTerms: "Net 10",
      preferredAdjuster: false,
      responseTime: "< 1 hour",
      communicationRating: 4.8
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Invited': return 'bg-blue-100 text-blue-800'
      case 'Disconnected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected': return <CheckCircle className="h-3 w-3" />
      case 'Pending': return <Clock className="h-3 w-3" />
      case 'Invited': return <UserPlus className="h-3 w-3" />
      case 'Disconnected': return <AlertCircle className="h-3 w-3" />
      default: return <Building className="h-3 w-3" />
    }
  }

  const filteredFirms = firms.filter(firm => {
    const matchesSearch = firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         firm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         firm.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || firm.connectionStatus === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime()
      case 'rating': return b.rating - a.rating
      case 'earnings': return b.totalEarnings - a.totalEarnings
      case 'claims': return b.activeClaims - a.activeClaims
      default: return 0
    }
  })

  const handleFirmAction = async (firmId: string, action: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (action === 'connect') {
        setFirms(prev => prev.map(firm => 
          firm.id === firmId 
            ? { ...firm, connectionStatus: 'Pending' as const, lastInteraction: 'Just now' }
            : firm
        ))
        toast.success(`Connection request sent to ${firms.find(f => f.id === firmId)?.name}`)
      } else if (action === 'disconnect') {
        setFirms(prev => prev.map(firm => 
          firm.id === firmId 
            ? { ...firm, connectionStatus: 'Disconnected' as const }
            : firm
        ))
        toast.success(`Disconnected from ${firms.find(f => f.id === firmId)?.name}`)
      } else if (action === 'message') {
        toast.success(`Opening messages with ${firms.find(f => f.id === firmId)?.name}`)
      } else if (action === 'view') {
        toast.success(`Opening profile for ${firms.find(f => f.id === firmId)?.name}`)
      } else if (action === 'call') {
        const firm = firms.find(f => f.id === firmId)
        toast.success(`Calling ${firm?.name} at ${firm?.phone}`)
      } else if (action === 'sync') {
        // Update last sync time
        setFirms(prev => prev.map(firm =>
          firm.id === firmId
            ? { ...firm, lastInteraction: 'Just now' }
            : firm
        ))
        toast.success(`Synced data with ${firms.find(f => f.id === firmId)?.name}`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} firm`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFirmLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      // Validate form
      if (!loginForm.firmId || !loginForm.username || !loginForm.password) {
        throw new Error('Please fill in all required fields')
      }

      // Simulate API call to firm login
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Find the selected firm
      const selectedFirm = availableFirms.find(f => f.id === loginForm.firmId)
      if (!selectedFirm) {
        throw new Error('Selected firm not found')
      }

      // Create new connected firm
      const newFirm: Firm = {
        id: `FIRM-${Date.now()}`,
        name: selectedFirm.name,
        logo: selectedFirm.logo,
        rating: 4.5,
        totalReviews: 150,
        location: 'Multiple Locations',
        phone: '1-800-CLAIMS',
        email: 'adjusters@' + selectedFirm.id + '.com',
        website: 'www.' + selectedFirm.id + '.com',
        connectionStatus: 'Connected',
        activeClaims: Math.floor(Math.random() * 10) + 1,
        completedClaims: Math.floor(Math.random() * 50) + 10,
        totalEarnings: Math.floor(Math.random() * 10000) + 5000,
        averagePayoutTime: Math.floor(Math.random() * 10) + 5,
        lastInteraction: 'Just now',
        specialties: ['Auto', 'Property', 'Liability']
      }

      // Add to firms list
      setFirms(prev => [newFirm, ...prev])

      // Reset form and close modal
      setLoginForm({
        firmId: '',
        username: '',
        password: '',
        rememberMe: false
      })
      setShowLoginModal(false)

      toast.success(`Successfully connected to ${selectedFirm.name}!`)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.')
    } finally {
      setLoginLoading(false)
    }
  }

  const connectedFirms = firms.filter(f => f.connectionStatus === 'Connected')
  const totalActiveClaims = connectedFirms.reduce((sum, f) => sum + f.activeClaims, 0)
  const totalEarnings = connectedFirms.reduce((sum, f) => sum + f.totalEarnings, 0)

  const displayFirms = isCompact ? filteredFirms.slice(0, 3) : filteredFirms

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            My Firms
            <Badge className="bg-blue-100 text-blue-800">
              {connectedFirms.length} Connected
            </Badge>
          </CardTitle>
          <CardDescription>Manage your insurance firm connections</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" title="Connect to Firm">
                <Plus className="h-4 w-4" />
                {!isCompact && "Connect"}
              </Button>
            </DialogTrigger>
          </Dialog>
          <Link href="/dashboard/firms">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCompact && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Active Claims</p>
                    <p className="text-2xl font-bold text-blue-700">{totalActiveClaims}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-700">${totalEarnings.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {connectedFirms.length > 0 ? (connectedFirms.reduce((sum, f) => sum + f.rating, 0) / connectedFirms.length).toFixed(1) : '0.0'}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search firms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Connected">Connected</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Invited">Invited</SelectItem>
                  <SelectItem value="Disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="claims">Claims</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-3">
          {displayFirms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No firms found matching your criteria</p>
            </div>
          ) : (
            displayFirms.map((firm) => (
              <div key={firm.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start gap-4 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={firm.logo} alt={firm.name} />
                    <AvatarFallback>
                      {firm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{firm.name}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{firm.rating}</span>
                            <span className="text-xs text-muted-foreground">({firm.totalReviews})</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{firm.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{firm.location}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(firm.connectionStatus)}>
                        {getStatusIcon(firm.connectionStatus)}
                        <span className="ml-1">{firm.connectionStatus}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {firm.connectionStatus === 'Connected' && (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span>{firm.activeClaims} active claims</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        <span>{firm.completedClaims} completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="font-semibold text-green-600">${firm.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{firm.paymentTerms}</span>
                      </div>
                    </div>

                    {/* Connection Status and Sync Info */}
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700">Connected & Synced</span>
                        <span className="text-xs text-green-600">Last sync: {firm.lastInteraction}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFirmAction(firm.id, 'sync')}
                        disabled={isLoading}
                        className="h-6 px-2 text-xs text-green-700 hover:bg-green-100"
                      >
                        <Sync className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last contact: {firm.lastInteraction}</span>
                    <div className="flex flex-wrap gap-1">
                      {firm.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleFirmAction(firm.id, 'view')}
                      disabled={isLoading}
                      className="h-8 px-2 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    {firm.connectionStatus === 'Connected' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleFirmAction(firm.id, 'message')}
                          disabled={isLoading}
                          className="h-8 px-2 text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleFirmAction(firm.id, 'call')}
                          disabled={isLoading}
                          className="h-8 px-2 text-xs"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </>
                    )}
                    
                    {firm.connectionStatus === 'Invited' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleFirmAction(firm.id, 'connect')}
                        disabled={isLoading}
                        className="h-8 px-2 text-xs"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                    )}
                    
                    {firm.connectionStatus === 'Disconnected' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleFirmAction(firm.id, 'connect')}
                        disabled={isLoading}
                        className="h-8 px-2 text-xs"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    )}
                    
                    {firm.connectionStatus === 'Connected' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleFirmAction(firm.id, 'disconnect')}
                        disabled={isLoading}
                        className="h-8 px-2 text-xs text-red-600"
                      >
                        <UserMinus className="h-3 w-3 mr-1" />
                        Disconnect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isCompact && filteredFirms.length > 3 && (
          <div className="text-center pt-2">
            <Link href="/dashboard/firms">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                +{filteredFirms.length - 3} more firms
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      {/* Firm Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Connect to Insurance Firm
            </DialogTitle>
            <DialogDescription>
              Login to your insurance firm portal to connect and sync your claims data.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFirmLogin} className="space-y-4">
            {/* Firm Selection */}
            <div className="space-y-2">
              <Label htmlFor="firm">Select Firm *</Label>
              <Select
                value={loginForm.firmId}
                onValueChange={(value) => setLoginForm(prev => ({ ...prev, firmId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your insurance firm" />
                </SelectTrigger>
                <SelectContent>
                  {availableFirms.map((firm) => (
                    <SelectItem key={firm.id} value={firm.id}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {firm.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Username/Email */}
            <div className="space-y-2">
              <Label htmlFor="username">Username/Email *</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username or email"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={loginForm.rememberMe}
                onCheckedChange={(checked) =>
                  setLoginForm(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
              />
              <Label htmlFor="remember" className="text-sm">
                Remember my credentials
              </Label>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLoginModal(false)}
                className="flex-1"
                disabled={loginLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loginLoading || !loginForm.firmId || !loginForm.username || !loginForm.password}
              >
                {loginLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default MyFirmsWidget
