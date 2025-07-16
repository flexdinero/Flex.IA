"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Filter,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Building2,
  Calendar,
  Phone,
  Mail,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Target,
  Plus,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ClaimsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("available-claims")

  // All claims data (available + in progress + completed)
  const allClaims = [
    {
      id: "CLM-2024-001",
      firm: "Crawford & Company",
      type: "Property Damage",
      location: "Houston, TX",
      address: "1234 Main St, Houston, TX 77001",
      status: "Available",
      priority: "High",
      amount: "$2,500",
      estimatedLoss: "$15,000",
      deadline: "2024-01-15",
      dateCreated: "2024-01-10",
      description: "Residential water damage assessment due to burst pipe",
      contact: {
        name: "Sarah Johnson",
        phone: "(555) 123-4567",
        email: "sarah.johnson@crawford.com",
      },
      details: {
        policyNumber: "POL-789456123",
        insured: "John & Mary Smith",
        lossDate: "2024-01-08",
        reportedDate: "2024-01-09",
        causeOfLoss: "Water Damage - Burst Pipe",
      },
      attachments: [
        { name: "Initial Report.pdf", size: "2.3 MB" },
        { name: "Photos.zip", size: "15.7 MB" },
        { name: "Policy Documents.pdf", size: "1.8 MB" },
      ],
    },
    {
      id: "CLM-2024-002",
      firm: "Sedgwick",
      type: "Auto Collision",
      location: "Dallas, TX",
      address: "5678 Oak Ave, Dallas, TX 75201",
      status: "In Progress",
      priority: "Medium",
      amount: "$1,800",
      estimatedLoss: "$8,500",
      deadline: "2024-01-18",
      dateCreated: "2024-01-11",
      description: "Vehicle collision damage evaluation - Multi-vehicle accident",
      contact: {
        name: "Mike Rodriguez",
        phone: "(555) 987-6543",
        email: "mike.rodriguez@sedgwick.com",
      },
      details: {
        policyNumber: "AUTO-456789012",
        insured: "Jennifer Davis",
        lossDate: "2024-01-10",
        reportedDate: "2024-01-10",
        causeOfLoss: "Vehicle Collision",
      },
      attachments: [
        { name: "Accident Report.pdf", size: "1.2 MB" },
        { name: "Vehicle Photos.zip", size: "8.4 MB" },
      ],
    },
    {
      id: "CLM-2024-003",
      firm: "Pilot Catastrophe",
      type: "Storm Damage",
      location: "Austin, TX",
      address: "9012 Cedar Ln, Austin, TX 73301",
      status: "Available",
      priority: "High",
      amount: "$3,200",
      estimatedLoss: "$45,000",
      deadline: "2024-01-12",
      dateCreated: "2024-01-09",
      description: "Hail damage inspection - Commercial property roof assessment",
      contact: {
        name: "Lisa Chen",
        phone: "(555) 456-7890",
        email: "lisa.chen@pilotcat.com",
      },
      details: {
        policyNumber: "COM-123456789",
        insured: "Austin Business Center LLC",
        lossDate: "2024-01-07",
        reportedDate: "2024-01-08",
        causeOfLoss: "Hail Damage",
      },
      attachments: [
        { name: "Weather Report.pdf", size: "3.1 MB" },
        { name: "Roof Assessment.pdf", size: "2.7 MB" },
        { name: "Damage Photos.zip", size: "22.3 MB" },
      ],
    },
    {
      id: "CLM-2024-004",
      firm: "Eberl Claims",
      type: "Fire Damage",
      location: "San Antonio, TX",
      address: "3456 Pine St, San Antonio, TX 78201",
      status: "Completed",
      priority: "High",
      amount: "$4,500",
      estimatedLoss: "$25,000",
      deadline: "2024-01-08",
      dateCreated: "2024-01-05",
      description: "Kitchen fire damage assessment - Residential property",
      contact: {
        name: "Robert Wilson",
        phone: "(555) 234-5678",
        email: "robert.wilson@eberlclaims.com",
      },
      details: {
        policyNumber: "HOM-987654321",
        insured: "Michael Thompson",
        lossDate: "2024-01-03",
        reportedDate: "2024-01-04",
        causeOfLoss: "Fire Damage - Kitchen",
      },
      attachments: [
        { name: "Fire Report.pdf", size: "4.2 MB" },
        { name: "Damage Assessment.pdf", size: "3.8 MB" },
        { name: "Repair Estimates.pdf", size: "2.1 MB" },
      ],
      completedDate: "2024-01-08",
      rating: 5,
      performance: {
        efficiency: 95,
        accuracy: 98,
        clientSatisfaction: 5,
        bonusEarned: 450,
      },
    },
    {
      id: "CLM-2024-005",
      firm: "ESIS",
      type: "Commercial Property",
      location: "Fort Worth, TX",
      address: "7890 Business Blvd, Fort Worth, TX 76101",
      status: "Available",
      priority: "Medium",
      amount: "$5,000",
      estimatedLoss: "$75,000",
      deadline: "2024-01-20",
      dateCreated: "2024-01-12",
      description: "Commercial building water damage from roof leak",
      contact: {
        name: "Amanda Foster",
        phone: "(555) 345-6789",
        email: "amanda.foster@esis.com",
      },
      details: {
        policyNumber: "COM-555666777",
        insured: "Tech Solutions Inc.",
        lossDate: "2024-01-11",
        reportedDate: "2024-01-11",
        causeOfLoss: "Water Damage - Roof Leak",
      },
      attachments: [
        { name: "Building Plans.pdf", size: "5.1 MB" },
        { name: "Initial Photos.zip", size: "12.3 MB" },
      ],
    },
  ]

  // Completed claims with performance data
  const completedClaims = allClaims
    .filter((claim) => claim.status === "Completed")
    .map((claim) => ({
      ...claim,
      completedDate: claim.completedDate || "2024-01-08",
      rating: claim.rating || 4,
      performance: claim.performance || {
        efficiency: 90,
        accuracy: 95,
        clientSatisfaction: 4,
        bonusEarned: 200,
      },
    }))

  const getFilteredClaims = () => {
    let claims = allClaims

    if (activeTab === "available-claims") {
      claims = allClaims
    } else if (activeTab === "my-claims") {
      claims = allClaims.filter((claim) => claim.status === "Available" || claim.status === "In Progress")
    } else if (activeTab === "available") {
      claims = allClaims.filter((claim) => claim.status === "Available")
    } else if (activeTab === "in-progress") {
      claims = allClaims.filter((claim) => claim.status === "In Progress")
    } else if (activeTab === "completed") {
      claims = completedClaims
    }

    return claims.filter((claim) => {
      const matchesSearch =
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.firm.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFirm = selectedFirm === "all" || claim.firm === selectedFirm
      const matchesStatus = selectedStatus === "all" || claim.status === selectedStatus
      const matchesType = selectedType === "all" || claim.type === selectedType

      return matchesSearch && matchesFirm && matchesStatus && matchesType
    })
  }

  const filteredClaims = getFilteredClaims()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Completed":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "Overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const handleClaimNow = (claimId: string) => {
    console.log(`Claiming ${claimId}`)
  }

  const handleScheduleInspection = (claimId: string) => {
    console.log(`Scheduling inspection for ${claimId}`)
  }

  // Calculate stats
  const stats = {
    totalClaims: allClaims.length,
    availableClaims: allClaims.length,
    myClaims: allClaims.filter((c) => c.status === "Available" || c.status === "In Progress").length,
    inProgressClaims: allClaims.filter((c) => c.status === "In Progress").length,
    completedClaims: allClaims.filter((c) => c.status === "Completed").length,
    totalEarnings: completedClaims.reduce(
      (sum, claim) => sum + Number.parseFloat(claim.amount.replace(/[$,]/g, "")),
      0,
    ),
    averageRating: completedClaims.reduce((sum, claim) => sum + (claim.rating || 0), 0) / completedClaims.length || 0,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Claims Management
            </h1>
            <p className="text-muted-foreground">Manage all your claims from connected IA firms</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            New Claim Request
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClaims}</div>
              <div className="text-xs text-muted-foreground">All claims</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.availableClaims}</div>
              <div className="text-xs text-muted-foreground">Ready to claim</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressClaims}</div>
              <div className="text-xs text-muted-foreground">Currently working</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.completedClaims}</div>
              <div className="text-xs text-muted-foreground">Successfully finished</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">From completed claims</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Claims</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by ID, type, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firm">Firm</Label>
                <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Firms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Firms</SelectItem>
                    <SelectItem value="Crawford & Company">Crawford & Company</SelectItem>
                    <SelectItem value="Sedgwick">Sedgwick</SelectItem>
                    <SelectItem value="Pilot Catastrophe">Pilot Catastrophe</SelectItem>
                    <SelectItem value="Eberl Claims">Eberl Claims</SelectItem>
                    <SelectItem value="ESIS">ESIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Claim Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Property Damage">Property Damage</SelectItem>
                    <SelectItem value="Auto Collision">Auto Collision</SelectItem>
                    <SelectItem value="Storm Damage">Storm Damage</SelectItem>
                    <SelectItem value="Fire Damage">Fire Damage</SelectItem>
                    <SelectItem value="Commercial Property">Commercial Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="available-claims" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Available Claims ({stats.availableClaims})</span>
              <span className="sm:hidden">Available ({stats.availableClaims})</span>
            </TabsTrigger>
            <TabsTrigger value="my-claims" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">My Claims ({stats.myClaims})</span>
              <span className="sm:hidden">Mine ({stats.myClaims})</span>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">In Progress ({stats.inProgressClaims})</span>
              <span className="sm:hidden">Progress ({stats.inProgressClaims})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Completed ({stats.completedClaims})</span>
              <span className="sm:hidden">Done ({stats.completedClaims})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available-claims" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Claims ({filteredClaims.length})</CardTitle>
                <CardDescription>All available claims from connected firms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header Row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-lg">{claim.id}</span>
                            <Badge variant="outline">{claim.firm}</Badge>
                            <Badge className={getStatusColor(claim.status)}>
                              {getStatusIcon(claim.status)}
                              <span className="ml-1">{claim.status}</span>
                            </Badge>
                            <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                            {claim.status === "Completed" && claim.rating && (
                              <div className="flex items-center gap-1">{renderStars(claim.rating)}</div>
                            )}
                          </div>

                          {/* Details Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{claim.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{claim.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold text-green-600">{claim.amount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Due: {claim.deadline}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm">{claim.description}</p>

                          {/* Performance metrics for completed claims */}
                          {claim.status === "Completed" && claim.performance && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                                <span>{claim.performance.efficiency}% Efficiency</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-green-500" />
                                <span>{claim.performance.accuracy}% Accuracy</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-purple-500" />
                                <span>${claim.performance.bonusEarned} Bonus</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span>Completed: {claim.completedDate}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedClaim(claim)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {claim.status === "Completed" ? (
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-blue-500" />
                                  )}
                                  Claim Details - {selectedClaim?.id}
                                  <Badge className={getStatusColor(selectedClaim?.status || "")}>
                                    {selectedClaim?.status}
                                  </Badge>
                                </DialogTitle>
                                <DialogDescription>Complete claim information and details</DialogDescription>
                              </DialogHeader>

                              {selectedClaim && (
                                <div className="space-y-6">
                                  {/* Performance Metrics for Completed Claims */}
                                  {selectedClaim.status === "Completed" && selectedClaim.performance && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <div className="text-2xl font-bold text-green-600">
                                            {selectedClaim.amount}
                                          </div>
                                          <div className="text-sm text-muted-foreground">Total Earned</div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <div className="text-2xl font-bold text-purple-600">
                                            ${selectedClaim.performance.bonusEarned}
                                          </div>
                                          <div className="text-sm text-muted-foreground">Bonus Earned</div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <div className="text-2xl font-bold text-blue-600">
                                            {selectedClaim.performance.efficiency}%
                                          </div>
                                          <div className="text-sm text-muted-foreground">Efficiency</div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                            {renderStars(selectedClaim.rating || 0)}
                                          </div>
                                          <div className="text-sm text-muted-foreground">Client Rating</div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}

                                  {/* Basic Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Claim Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <span className="font-medium">Claim ID:</span>
                                          <span>{selectedClaim.id}</span>
                                          <span className="font-medium">Firm:</span>
                                          <span>{selectedClaim.firm}</span>
                                          <span className="font-medium">Type:</span>
                                          <span>{selectedClaim.type}</span>
                                          <span className="font-medium">Priority:</span>
                                          <Badge className={getPriorityColor(selectedClaim.priority)} size="sm">
                                            {selectedClaim.priority}
                                          </Badge>
                                          <span className="font-medium">Amount:</span>
                                          <span className="font-semibold text-green-600">{selectedClaim.amount}</span>
                                          <span className="font-medium">Deadline:</span>
                                          <span>{selectedClaim.deadline}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Location & Contact</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                              <div>{selectedClaim.location}</div>
                                              <div className="text-muted-foreground">{selectedClaim.address}</div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedClaim.contact.phone}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedClaim.contact.email}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedClaim.contact.name}</span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Policy Details */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Policy Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">Policy Number:</span>
                                          <div>{selectedClaim.details.policyNumber}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Insured:</span>
                                          <div>{selectedClaim.details.insured}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Loss Date:</span>
                                          <div>{selectedClaim.details.lossDate}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Reported Date:</span>
                                          <div>{selectedClaim.details.reportedDate}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Cause of Loss:</span>
                                          <div>{selectedClaim.details.causeOfLoss}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Estimated Loss:</span>
                                          <div className="font-semibold text-green-600">
                                            {selectedClaim.estimatedLoss}
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Description */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm">{selectedClaim.description}</p>
                                    </CardContent>
                                  </Card>

                                  {/* Attachments */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Attachments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {selectedClaim.attachments.map((attachment, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-2 border rounded"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">{attachment.name}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {attachment.size}
                                              </Badge>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Action Buttons */}
                                  <div className="flex justify-end gap-2 pt-4 border-t">
                                    {selectedClaim.status === "Available" && (
                                      <>
                                        <Button onClick={() => handleClaimNow(selectedClaim.id)}>Claim Now</Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleScheduleInspection(selectedClaim.id)}
                                        >
                                          <Calendar className="h-4 w-4 mr-2" />
                                          Schedule Inspection
                                        </Button>
                                      </>
                                    )}
                                    <Button variant="outline">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Open in Firm Portal
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {claim.status === "Available" && (
                            <Button size="sm" onClick={() => handleClaimNow(claim.id)}>
                              Claim Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-claims" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Claims ({filteredClaims.length})</CardTitle>
                <CardDescription>Claims you have claimed or are currently working on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-lg">{claim.id}</span>
                            <Badge variant="outline">{claim.firm}</Badge>
                            <Badge className={getStatusColor(claim.status)}>
                              {getStatusIcon(claim.status)}
                              <span className="ml-1">{claim.status}</span>
                            </Badge>
                            <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{claim.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{claim.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold text-green-600">{claim.amount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Due: {claim.deadline}</span>
                            </div>
                          </div>
                          <p className="text-sm">{claim.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {claim.status === "Available" && (
                            <Button size="sm" onClick={() => handleClaimNow(claim.id)}>
                              Claim Now
                            </Button>
                          )}
                          {claim.status === "In Progress" && (
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Update Progress
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Claims ({filteredClaims.length})</CardTitle>
                <CardDescription>Claims you are currently working on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-lg">{claim.id}</span>
                            <Badge variant="outline">{claim.firm}</Badge>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                            <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{claim.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{claim.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold text-green-600">{claim.amount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Due: {claim.deadline}</span>
                            </div>
                          </div>
                          <p className="text-sm">{claim.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Update Progress
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Claims ({filteredClaims.length})</CardTitle>
                <CardDescription>Successfully completed claims with performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-lg">{claim.id}</span>
                            <Badge variant="outline">{claim.firm}</Badge>
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            <div className="flex items-center gap-1">{renderStars(claim.rating || 0)}</div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{claim.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{claim.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold text-green-600">{claim.amount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Completed: {claim.completedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{claim.performance?.efficiency}% Efficiency</span>
                            </div>
                          </div>
                          <p className="text-sm">{claim.description}</p>
                          {claim.performance && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-green-500" />
                                <span>{claim.performance.accuracy}% Accuracy</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-purple-500" />
                                <span>${claim.performance.bonusEarned} Bonus</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{claim.performance.clientSatisfaction}/5 Satisfaction</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedClaim(claim)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
