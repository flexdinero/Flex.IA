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
  FileText,
  Building2,
  Calendar,
  Phone,
  Mail,
  Download,
  Trophy,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Target,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ClaimsWonPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [selectedClaim, setSelectedClaim] = useState<any>(null)

  const claimsWon = [
    {
      id: "CLM-2024-001",
      firm: "Crawford & Company",
      type: "Property Damage",
      location: "Houston, TX",
      address: "1234 Main St, Houston, TX 77001",
      completedDate: "2024-01-15",
      startDate: "2024-01-10",
      payout: 2500,
      estimatedLoss: 15000,
      rating: 5,
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
        finalSettlement: "$14,750",
        timeToComplete: "5 days",
      },
      performance: {
        efficiency: 95,
        accuracy: 98,
        clientSatisfaction: 5,
        bonusEarned: 250,
      },
      attachments: [
        { name: "Final Report.pdf", size: "3.2 MB" },
        { name: "Settlement Photos.zip", size: "18.7 MB" },
        { name: "Completion Certificate.pdf", size: "1.1 MB" },
      ],
    },
    {
      id: "CLM-2024-002",
      firm: "Sedgwick",
      type: "Auto Collision",
      location: "Dallas, TX",
      address: "5678 Oak Ave, Dallas, TX 75201",
      completedDate: "2024-01-18",
      startDate: "2024-01-11",
      payout: 1800,
      estimatedLoss: 8500,
      rating: 4,
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
        finalSettlement: "$8,200",
        timeToComplete: "7 days",
      },
      performance: {
        efficiency: 88,
        accuracy: 94,
        clientSatisfaction: 4,
        bonusEarned: 150,
      },
      attachments: [
        { name: "Final Assessment.pdf", size: "2.1 MB" },
        { name: "Repair Documentation.zip", size: "12.4 MB" },
      ],
    },
    {
      id: "CLM-2024-003",
      firm: "Pilot Catastrophe",
      type: "Storm Damage",
      location: "Austin, TX",
      address: "9012 Cedar Ln, Austin, TX 73301",
      completedDate: "2024-01-12",
      startDate: "2024-01-09",
      payout: 3200,
      estimatedLoss: 45000,
      rating: 5,
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
        finalSettlement: "$42,500",
        timeToComplete: "3 days",
      },
      performance: {
        efficiency: 98,
        accuracy: 99,
        clientSatisfaction: 5,
        bonusEarned: 400,
      },
      attachments: [
        { name: "Storm Assessment Report.pdf", size: "4.8 MB" },
        { name: "Roof Damage Analysis.pdf", size: "3.2 MB" },
        { name: "Settlement Documentation.zip", size: "25.1 MB" },
      ],
    },
  ]

  const filteredClaims = claimsWon.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.firm.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFirm = selectedFirm === "all" || claim.firm === selectedFirm

    let matchesTimeframe = true
    if (selectedTimeframe !== "all") {
      const claimDate = new Date(claim.completedDate)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (selectedTimeframe) {
        case "week":
          matchesTimeframe = daysDiff <= 7
          break
        case "month":
          matchesTimeframe = daysDiff <= 30
          break
        case "quarter":
          matchesTimeframe = daysDiff <= 90
          break
      }
    }

    return matchesSearch && matchesFirm && matchesTimeframe
  })

  const totalEarnings = filteredClaims.reduce((sum, claim) => sum + claim.payout, 0)
  const totalBonuses = filteredClaims.reduce((sum, claim) => sum + claim.performance.bonusEarned, 0)
  const averageRating = filteredClaims.reduce((sum, claim) => sum + claim.rating, 0) / filteredClaims.length || 0
  const averageEfficiency =
    filteredClaims.reduce((sum, claim) => sum + claim.performance.efficiency, 0) / filteredClaims.length || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Claims Won
            </h1>
            <p className="text-muted-foreground">Track your successfully completed claims and performance metrics</p>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</div>
              <div className="text-xs text-muted-foreground">From {filteredClaims.length} completed claims</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bonus Earnings</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalBonuses)}</div>
              <div className="text-xs text-muted-foreground">Performance bonuses earned</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5</div>
              <div className="flex items-center gap-1 mt-1">{renderStars(Math.round(averageRating))}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{averageEfficiency.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Performance efficiency</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
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

        {/* Claims List */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Claims ({filteredClaims.length})</CardTitle>
                <CardDescription>
                  Showing {filteredClaims.length} of {claimsWon.length} completed claims
                </CardDescription>
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
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            <div className="flex items-center gap-1">{renderStars(claim.rating)}</div>
                          </div>

                          {/* Details Row */}
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
                              <span className="font-semibold text-green-600">{formatCurrency(claim.payout)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Completed: {claim.completedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{claim.performance.efficiency}% Efficiency</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm">{claim.description}</p>
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
                                  <Trophy className="h-5 w-5 text-yellow-500" />
                                  Claim Details - {selectedClaim?.id}
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    Completed
                                  </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  Complete claim information and performance metrics
                                </DialogDescription>
                              </DialogHeader>

                              {selectedClaim && (
                                <div className="space-y-6">
                                  {/* Performance Metrics */}
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                          {formatCurrency(selectedClaim.payout)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Total Earned</div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                          {formatCurrency(selectedClaim.performance.bonusEarned)}
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
                                          {renderStars(selectedClaim.rating)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Client Rating</div>
                                      </CardContent>
                                    </Card>
                                  </div>

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
                                          <span className="font-medium">Started:</span>
                                          <span>{selectedClaim.startDate}</span>
                                          <span className="font-medium">Completed:</span>
                                          <span>{selectedClaim.completedDate}</span>
                                          <span className="font-medium">Duration:</span>
                                          <span>{selectedClaim.details.timeToComplete}</span>
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

                                  {/* Settlement Details */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Settlement Details</CardTitle>
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
                                          <span className="font-medium">Cause of Loss:</span>
                                          <div>{selectedClaim.details.causeOfLoss}</div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Final Settlement:</span>
                                          <div className="font-semibold text-green-600">
                                            {selectedClaim.details.finalSettlement}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="font-medium">Your Payout:</span>
                                          <div className="font-semibold text-green-600">
                                            {formatCurrency(selectedClaim.payout)}
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Performance Breakdown */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-blue-600">
                                            {selectedClaim.performance.efficiency}%
                                          </div>
                                          <div className="text-sm text-muted-foreground">Efficiency Score</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600">
                                            {selectedClaim.performance.accuracy}%
                                          </div>
                                          <div className="text-sm text-muted-foreground">Accuracy Score</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                            {renderStars(selectedClaim.performance.clientSatisfaction)}
                                          </div>
                                          <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Attachments */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Final Documentation</CardTitle>
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
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{claim.id}</CardTitle>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Won
                      </Badge>
                    </div>
                    <CardDescription>{claim.firm}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3" />
                        <span>{claim.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{claim.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold text-green-600">{formatCurrency(claim.payout)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>Completed: {claim.completedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">{renderStars(claim.rating)}</div>
                      <Badge variant="outline" className="text-xs">
                        {claim.performance.efficiency}% Efficiency
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{claim.description}</p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setSelectedClaim(claim)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
