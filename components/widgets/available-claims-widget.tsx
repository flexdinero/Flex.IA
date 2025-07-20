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
  Star,
  Building,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Eye,
  UserPlus,
  Zap
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface AvailableClaim {
  id: string
  firm: string
  firmRating: number
  type: string
  location: string
  amount: string
  estimatedPayout: number
  deadline: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  description: string
  postedDate: string
  requirements: string[]
  distance: number
  complexity: 'Simple' | 'Moderate' | 'Complex'
  urgency: 'Standard' | 'Rush' | 'Emergency'
  applicants: number
  maxApplicants: number
  isHotLead: boolean
}

interface AvailableClaimsWidgetProps {
  isCompact?: boolean
}

export function AvailableClaimsWidget({ isCompact = false }: AvailableClaimsWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data with available claims
  const [availableClaims, setAvailableClaims] = useState<AvailableClaim[]>([
    {
      id: "AVL-2024-001",
      firm: "State Farm",
      firmRating: 4.8,
      type: "Hail Damage",
      location: "Jacksonville, FL",
      amount: "$28,500",
      estimatedPayout: 2850,
      deadline: "Jan 30, 2024",
      priority: "High",
      description: "Residential roof damage from recent hailstorm",
      postedDate: "2 hours ago",
      requirements: ["Licensed in FL", "Hail damage experience", "Available within 48hrs"],
      distance: 15,
      complexity: "Moderate",
      urgency: "Rush",
      applicants: 3,
      maxApplicants: 5,
      isHotLead: true
    },
    {
      id: "AVL-2024-002",
      firm: "Allstate",
      firmRating: 4.6,
      type: "Water Damage",
      location: "Tampa, FL",
      amount: "$15,200",
      estimatedPayout: 1520,
      deadline: "Feb 5, 2024",
      priority: "Medium",
      description: "Commercial water damage from pipe burst",
      postedDate: "5 hours ago",
      requirements: ["Commercial experience", "Available weekends"],
      distance: 45,
      complexity: "Simple",
      urgency: "Standard",
      applicants: 1,
      maxApplicants: 3,
      isHotLead: false
    },
    {
      id: "AVL-2024-003",
      firm: "Progressive",
      firmRating: 4.7,
      type: "Fire Damage",
      location: "Orlando, FL",
      amount: "$42,000",
      estimatedPayout: 4200,
      deadline: "Jan 28, 2024",
      priority: "Urgent",
      description: "Residential fire damage assessment needed urgently",
      postedDate: "1 day ago",
      requirements: ["Fire damage certification", "Immediate availability", "Photo documentation"],
      distance: 25,
      complexity: "Complex",
      urgency: "Emergency",
      applicants: 7,
      maxApplicants: 8,
      isHotLead: true
    },
    {
      id: "AVL-2024-004",
      firm: "GEICO",
      firmRating: 4.5,
      type: "Vehicle Damage",
      location: "Miami, FL",
      amount: "$8,750",
      estimatedPayout: 875,
      deadline: "Feb 10, 2024",
      priority: "Low",
      description: "Auto accident damage assessment",
      postedDate: "3 days ago",
      requirements: ["Auto damage experience"],
      distance: 85,
      complexity: "Simple",
      urgency: "Standard",
      applicants: 2,
      maxApplicants: 4,
      isHotLead: false
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800'
      case 'Medium': return 'bg-blue-100 text-blue-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800'
      case 'Complex': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return <Zap className="h-3 w-3 text-red-500" />
      case 'Rush': return <Clock className="h-3 w-3 text-orange-500" />
      case 'Standard': return <Calendar className="h-3 w-3 text-blue-500" />
      default: return <Calendar className="h-3 w-3" />
    }
  }

  const filteredClaims = availableClaims.filter(claim => {
    const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || claim.type === typeFilter
    const matchesLocation = locationFilter === "all" || claim.location.includes(locationFilter)
    
    return matchesSearch && matchesType && matchesLocation
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case 'payout': return b.estimatedPayout - a.estimatedPayout
      case 'deadline': return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case 'distance': return a.distance - b.distance
      default: return 0
    }
  })

  const handleClaimAction = async (claimId: string, action: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (action === 'apply') {
        // Apply for claim
        setAvailableClaims(prev => prev.map(claim => 
          claim.id === claimId 
            ? { ...claim, applicants: claim.applicants + 1 }
            : claim
        ))
        toast.success(`Application submitted for claim ${claimId}`)
      } else if (action === 'view') {
        toast.success(`Opening details for claim ${claimId}`)
      } else if (action === 'save') {
        toast.success(`Claim ${claimId} saved to watchlist`)
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
            Available Claims
            {filteredClaims.filter(c => c.isHotLead).length > 0 && (
              <Badge className="bg-red-100 text-red-800 ml-2">
                <Zap className="h-3 w-3 mr-1" />
                {filteredClaims.filter(c => c.isHotLead).length} Hot
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Browse and apply for new claim assignments</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isCompact && (
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Advanced
            </Button>
          )}
          <Link href="/dashboard/available-claims">
            <Button variant="outline" size="sm" className="gap-2">
              Browse All
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
                placeholder="Search available claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Hail Damage">Hail Damage</SelectItem>
                <SelectItem value="Water Damage">Water Damage</SelectItem>
                <SelectItem value="Fire Damage">Fire Damage</SelectItem>
                <SelectItem value="Vehicle Damage">Vehicle Damage</SelectItem>
                <SelectItem value="Wind Damage">Wind Damage</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="payout">Highest Pay</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          {displayClaims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No available claims found matching your criteria</p>
            </div>
          ) : (
            displayClaims.map((claim) => (
              <div key={claim.id} className={`border rounded-lg p-4 hover:bg-muted/50 transition-colors group relative ${claim.isHotLead ? 'border-red-200 bg-red-50/30' : ''}`}>
                {claim.isHotLead && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-100 text-red-800">
                      <Zap className="h-3 w-3 mr-1" />
                      Hot Lead
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3 pr-20">
                  <div>
                    <h3 className="font-semibold text-lg">{claim.id}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">{claim.firm}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{claim.firmRating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{claim.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                    <Badge className={getComplexityColor(claim.complexity)}>{claim.complexity}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>{claim.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{claim.location} ({claim.distance}mi)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-semibold text-green-600">{claim.amount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getUrgencyIcon(claim.urgency)}
                    <span>Due: {claim.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Posted: {claim.postedDate}</span>
                    <span>Est. payout: ${claim.estimatedPayout}</span>
                    <span>{claim.applicants}/{claim.maxApplicants} applicants</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'view')}
                      disabled={isLoading}
                      className="h-8 px-2 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'save')}
                      disabled={isLoading}
                      className="h-8 px-2 text-xs"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleClaimAction(claim.id, 'apply')}
                      disabled={isLoading || claim.applicants >= claim.maxApplicants}
                      className="h-8 px-2 text-xs"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      {claim.applicants >= claim.maxApplicants ? 'Full' : 'Apply'}
                    </Button>
                  </div>
                </div>

                {claim.requirements.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {claim.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {isCompact && filteredClaims.length > 3 && (
          <div className="text-center pt-2">
            <Link href="/dashboard/available-claims">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                +{filteredClaims.length - 3} more claims available
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
