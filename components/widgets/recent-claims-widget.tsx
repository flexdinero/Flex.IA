"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowRight, 
  FileText, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Claim {
  id: string
  firm: string
  type: string
  location: string
  amount: string
  deadline: string
  status: 'New' | 'In Progress' | 'Under Review' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  description: string
  assignedDate: string
  lastUpdate: string
  documents: number
  messages: number
}

interface RecentClaimsWidgetProps {
  isCompact?: boolean
}

export function RecentClaimsWidget({ isCompact = false }: RecentClaimsWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data with more detailed information
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-2024-001",
      firm: "Crawford & Company",
      type: "Hurricane Damage",
      location: "Miami, FL",
      amount: "$32,500",
      deadline: "Jan 25, 2024",
      status: "In Progress",
      priority: "High",
      description: "Property damage assessment following Hurricane Milton",
      assignedDate: "Jan 15, 2024",
      lastUpdate: "2 hours ago",
      documents: 8,
      messages: 3
    },
    {
      id: "CLM-2024-002",
      firm: "Sedgwick Claims",
      type: "Water Damage",
      location: "Orlando, FL",
      amount: "$18,750",
      deadline: "Jan 28, 2024",
      status: "New",
      priority: "Medium",
      description: "Residential water damage from burst pipe",
      assignedDate: "Jan 18, 2024",
      lastUpdate: "1 day ago",
      documents: 4,
      messages: 1
    },
    {
      id: "CLM-2024-003",
      firm: "Gallagher Bassett",
      type: "Fire Damage",
      location: "Tampa, FL",
      amount: "$45,200",
      deadline: "Feb 2, 2024",
      status: "Under Review",
      priority: "Urgent",
      description: "Commercial fire damage assessment",
      assignedDate: "Jan 12, 2024",
      lastUpdate: "3 hours ago",
      documents: 12,
      messages: 7
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Under Review': return 'bg-purple-100 text-purple-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'On Hold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800'
      case 'Medium': return 'bg-blue-100 text-blue-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <AlertCircle className="h-3 w-3" />
      case 'In Progress': return <Clock className="h-3 w-3" />
      case 'Under Review': return <Eye className="h-3 w-3" />
      case 'Completed': return <CheckCircle className="h-3 w-3" />
      case 'On Hold': return <AlertCircle className="h-3 w-3" />
      default: return <FileText className="h-3 w-3" />
    }
  }

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter
    const matchesPriority = priorityFilter === "all" || claim.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleClaimAction = async (claimId: string, action: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (action === 'view') {
        // Navigate to claim details (would use router in real app)
        toast.success(`Opening claim ${claimId}`)
      } else if (action === 'update') {
        // Update claim status
        setClaims(prev => prev.map(claim => 
          claim.id === claimId 
            ? { ...claim, status: 'In Progress' as const, lastUpdate: 'Just now' }
            : claim
        ))
        toast.success(`Claim ${claimId} status updated`)
      } else if (action === 'message') {
        toast.success(`Opening messages for claim ${claimId}`)
      } else if (action === 'download') {
        toast.success(`Downloading documents for claim ${claimId}`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} claim`)
    } finally {
      setIsLoading(false)
    }
  }

  const displayClaims = isCompact ? filteredClaims.slice(0, 3) : filteredClaims

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Claims
          </CardTitle>
          <CardDescription>Latest claim assignments and updates</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isCompact && (
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          )}
          <Link href="/dashboard/claims">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCompact && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
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
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          {displayClaims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No claims found matching your criteria</p>
            </div>
          ) : (
            displayClaims.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{claim.id}</h3>
                    <p className="text-sm text-muted-foreground">{claim.firm}</p>
                    <p className="text-sm text-muted-foreground mt-1">{claim.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(claim.status)}>
                      {getStatusIcon(claim.status)}
                      <span className="ml-1">{claim.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>{claim.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{claim.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-semibold text-green-600">{claim.amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Due: {claim.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Updated: {claim.lastUpdate}</span>
                    <span>{claim.documents} docs</span>
                    <span>{claim.messages} messages</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'view')}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'update')}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'message')}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'download')}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isCompact && filteredClaims.length > 3 && (
          <div className="text-center pt-2">
            <Link href="/dashboard/claims">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                +{filteredClaims.length - 3} more claims
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
