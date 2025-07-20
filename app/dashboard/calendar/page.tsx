"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Navigation,
  AlertCircle,
  CheckCircle,
  FileText,
  Building2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FilterBar } from "@/components/ui/filter-bar"
import { calendarFilterConfig } from "@/lib/filter-configs"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddInspection, setShowAddInspection] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [viewMode, setViewMode] = useState("month")
  const [searchTerm, setSearchTerm] = useState("")

  // Standardized filter state
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    status: 'all'
  })

  // Filter handling functions
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearAllFilters = () => {
    setActiveFilters({
      type: 'all',
      status: 'all'
    })
    setSearchTerm('')
  }

  const inspections = [
    {
      id: "INS-2024-001",
      title: "Property Damage Assessment",
      claimId: "CLM-2024-001",
      firm: "Crawford & Company",
      date: "2024-01-15",
      time: "09:00 AM",
      duration: 120,
      status: "Scheduled",
      priority: "High",
      type: "Property Damage",
      location: {
        address: "1234 Main St, Houston, TX 77001",
        coordinates: { lat: 29.7604, lng: -95.3698 },
      },
      contact: {
        name: "Sarah Johnson",
        phone: "(555) 123-4567",
        email: "sarah.johnson@crawford.com",
        role: "Claims Adjuster",
      },
      insured: {
        name: "John & Mary Smith",
        phone: "(555) 987-6543",
        email: "johnsmith@email.com",
      },
      details: {
        description: "Residential water damage assessment due to burst pipe in kitchen area",
        specialInstructions: "Property is occupied. Please call ahead to confirm access.",
        equipmentNeeded: ["Moisture meter", "Camera", "Measuring tools"],
        estimatedValue: "$15,000",
      },
      weather: {
        condition: "Partly Cloudy",
        temperature: "72°F",
        precipitation: "10%",
      },
    },
    {
      id: "INS-2024-002",
      title: "Auto Collision Inspection",
      claimId: "CLM-2024-002",
      firm: "Sedgwick",
      date: "2024-01-15",
      time: "02:00 PM",
      duration: 90,
      status: "Scheduled",
      priority: "Medium",
      type: "Auto Collision",
      location: {
        address: "Auto Body Shop, 5678 Oak Ave, Dallas, TX 75201",
        coordinates: { lat: 32.7767, lng: -96.797 },
      },
      contact: {
        name: "Mike Rodriguez",
        phone: "(555) 987-6543",
        email: "mike.rodriguez@sedgwick.com",
        role: "Claims Specialist",
      },
      insured: {
        name: "Jennifer Davis",
        phone: "(555) 456-7890",
        email: "jdavis@email.com",
      },
      details: {
        description: "Multi-vehicle collision damage evaluation",
        specialInstructions: "Vehicle is at certified repair facility",
        equipmentNeeded: ["Camera", "Measuring tools", "Laptop"],
        estimatedValue: "$8,500",
      },
      weather: {
        condition: "Clear",
        temperature: "75°F",
        precipitation: "0%",
      },
    },
    {
      id: "INS-2024-003",
      title: "Storm Damage Assessment",
      claimId: "CLM-2024-003",
      firm: "Pilot Catastrophe",
      date: "2024-01-16",
      time: "10:30 AM",
      duration: 180,
      status: "Confirmed",
      priority: "High",
      type: "Storm Damage",
      location: {
        address: "9012 Cedar Ln, Austin, TX 73301",
        coordinates: { lat: 30.2672, lng: -97.7431 },
      },
      contact: {
        name: "Lisa Chen",
        phone: "(555) 456-7890",
        email: "lisa.chen@pilotcat.com",
        role: "Senior Adjuster",
      },
      insured: {
        name: "Austin Business Center LLC",
        phone: "(555) 234-5678",
        email: "manager@austinbiz.com",
      },
      details: {
        description: "Commercial property roof assessment following hail storm",
        specialInstructions: "Bring ladder and safety equipment. Property manager will meet on-site.",
        equipmentNeeded: ["Ladder", "Safety harness", "Drone", "Camera", "Measuring tools"],
        estimatedValue: "$45,000",
      },
      weather: {
        condition: "Sunny",
        temperature: "68°F",
        precipitation: "0%",
      },
    },
    {
      id: "INS-2024-004",
      title: "Fire Damage Inspection",
      claimId: "CLM-2024-004",
      firm: "Eberl Claims",
      date: "2024-01-17",
      time: "11:00 AM",
      duration: 150,
      status: "Completed",
      priority: "High",
      type: "Fire Damage",
      location: {
        address: "3456 Pine St, San Antonio, TX 78201",
        coordinates: { lat: 29.4241, lng: -98.4936 },
      },
      contact: {
        name: "Robert Wilson",
        phone: "(555) 234-5678",
        email: "robert.wilson@eberlclaims.com",
        role: "Fire Claims Specialist",
      },
      insured: {
        name: "Michael Thompson",
        phone: "(555) 345-6789",
        email: "mthompson@email.com",
      },
      details: {
        description: "Kitchen fire damage assessment in residential property",
        specialInstructions: "Property is uninhabitable. Coordinate with fire department for access.",
        equipmentNeeded: ["Camera", "Air quality meter", "Measuring tools", "Flashlight"],
        estimatedValue: "$25,000",
      },
      weather: {
        condition: "Overcast",
        temperature: "65°F",
        precipitation: "20%",
      },
    },
  ]

  const upcomingInspections = inspections.filter(
    (inspection) => new Date(inspection.date) >= new Date() && inspection.status !== "Completed",
  )

  const todayInspections = inspections.filter(
    (inspection) => inspection.date === new Date().toISOString().split("T")[0],
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Rescheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
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
      case "Scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleAddInspection = () => {
    setShowAddInspection(false)
    // Add inspection logic here
  }

  const handleEditInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    // Edit inspection logic here
  }

  const handleDeleteInspection = (inspectionId: string) => {
    // Delete inspection logic here
    console.log("Deleting inspection:", inspectionId)
  }

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inspection Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your property inspections</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showAddInspection} onOpenChange={setShowAddInspection}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Inspection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Inspection</DialogTitle>
                  <DialogDescription>Add a new property inspection to your calendar</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Inspection Title</Label>
                    <Input id="title" placeholder="Property Damage Assessment" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claimId">Claim ID</Label>
                    <Input id="claimId" placeholder="CLM-2024-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firm">Firm</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select firm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crawford">Crawford & Company</SelectItem>
                        <SelectItem value="sedgwick">Sedgwick</SelectItem>
                        <SelectItem value="pilot">Pilot Catastrophe</SelectItem>
                        <SelectItem value="eberl">Eberl Claims</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Inspection Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property">Property Damage</SelectItem>
                        <SelectItem value="auto">Auto Collision</SelectItem>
                        <SelectItem value="storm">Storm Damage</SelectItem>
                        <SelectItem value="fire">Fire Damage</SelectItem>
                        <SelectItem value="liability">Liability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input id="address" placeholder="1234 Main St, Houston, TX 77001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" placeholder="Sarah Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" placeholder="(555) 123-4567" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Detailed description of the inspection..." />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea id="instructions" placeholder="Any special instructions or notes..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddInspection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddInspection}>Schedule Inspection</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Standardized Filter Bar */}
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search inspections, claims, locations..."
          filters={calendarFilterConfig}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
          showSearch={true}
          showFilterToggle={true}
          className="rounded-lg border"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">Today's Inspections</CardTitle>
              <Calendar className="h-3 w-3 text-blue-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{todayInspections.length}</div>
              <p className="text-xs text-muted-foreground truncate">
                {todayInspections.length > 0 ? `Next at ${todayInspections[0]?.time}` : "No inspections today"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">This Week</CardTitle>
              <Clock className="h-3 w-3 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{upcomingInspections.length}</div>
              <p className="text-xs text-muted-foreground truncate">Upcoming inspections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">High Priority</CardTitle>
              <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">
                {inspections.filter((i) => i.priority === "High" && i.status !== "Completed").length}
              </div>
              <p className="text-xs text-muted-foreground truncate">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">Completed</CardTitle>
              <CheckCircle className="h-3 w-3 text-gray-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{inspections.filter((i) => i.status === "Completed").length}</div>
              <p className="text-xs text-muted-foreground truncate">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Changed order to start with Calendar View */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <div className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-6">
              <TabsTrigger value="calendar" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="today" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">Today</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Visual calendar with all your scheduled inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium text-sm p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(2024, 0, i - 6) // January 2024, starting from a Sunday
                    const dayInspections = inspections.filter(
                      (inspection) => inspection.date === date.toISOString().split("T")[0],
                    )
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isCurrentMonth = date.getMonth() === 0 // January

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] p-2 border rounded-lg ${
                          isToday ? "bg-primary/10 border-primary" : ""
                        } ${!isCurrentMonth ? "opacity-50" : ""}`}
                      >
                        <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                        <div className="space-y-1">
                          {dayInspections.slice(0, 2).map((inspection, idx) => (
                            <div
                              key={idx}
                              className={`text-xs p-1 rounded truncate ${getStatusColor(inspection.status)}`}
                            >
                              {inspection.time} - {inspection.title.substring(0, 15)}...
                            </div>
                          ))}
                          {dayInspections.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayInspections.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your inspections scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayInspections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No inspections scheduled for today</p>
                    </div>
                  ) : (
                    todayInspections.map((inspection) => (
                      <div key={inspection.id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{inspection.title}</span>
                              <Badge className={getPriorityColor(inspection.priority)}>{inspection.priority}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{inspection.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{inspection.location.address.split(",")[0]}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Navigation className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Start</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Inspections</CardTitle>
                <CardDescription>Your scheduled property inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInspections.map((inspection) => (
                    <div key={inspection.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-lg">{inspection.title}</span>
                            <Badge variant="outline">{inspection.firm}</Badge>
                            <Badge className={getStatusColor(inspection.status)}>
                              {getStatusIcon(inspection.status)}
                              <span className="ml-1">{inspection.status}</span>
                            </Badge>
                            <Badge className={getPriorityColor(inspection.priority)}>{inspection.priority}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{inspection.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {inspection.time} ({inspection.duration}min)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{inspection.location.address.split(",")[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{inspection.type}</span>
                            </div>
                          </div>

                          <p className="text-sm">{inspection.details.description}</p>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{inspection.contact.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Weather:</span>
                              <span>
                                {inspection.weather.condition}, {inspection.weather.temperature}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedInspection(inspection)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Inspection Details - {selectedInspection?.id}
                                  <Badge className={getStatusColor(selectedInspection?.status || "")}>
                                    {selectedInspection?.status}
                                  </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  Complete inspection information and contact details
                                </DialogDescription>
                              </DialogHeader>

                              {selectedInspection && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Inspection Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <span className="font-medium">Inspection ID:</span>
                                          <span>{selectedInspection.id}</span>
                                          <span className="font-medium">Claim ID:</span>
                                          <span>{selectedInspection.claimId}</span>
                                          <span className="font-medium">Type:</span>
                                          <span>{selectedInspection.type}</span>
                                          <span className="font-medium">Priority:</span>
                                          <Badge className={getPriorityColor(selectedInspection.priority)} size="sm">
                                            {selectedInspection.priority}
                                          </Badge>
                                          <span className="font-medium">Date & Time:</span>
                                          <span>
                                            {selectedInspection.date} at {selectedInspection.time}
                                          </span>
                                          <span className="font-medium">Duration:</span>
                                          <span>{selectedInspection.duration} minutes</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Location & Weather</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                              <div>{selectedInspection.location.address}</div>
                                              <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 h-auto text-xs"
                                                onClick={() => handleGetDirections(selectedInspection.location.address)}
                                              >
                                                <Navigation className="h-3 w-3 mr-1" />
                                                Get Directions
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 pt-2 border-t">
                                            <span className="font-medium">Weather:</span>
                                            <span>{selectedInspection.weather.condition}</span>
                                            <span>{selectedInspection.weather.temperature}</span>
                                            <span>({selectedInspection.weather.precipitation} rain)</span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Contact Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <div className="font-medium text-sm">Claims Contact</div>
                                          <div className="space-y-1 text-sm">
                                            <div>
                                              {selectedInspection.contact.name} - {selectedInspection.contact.role}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Phone className="h-3 w-3" />
                                              <span>{selectedInspection.contact.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Mail className="h-3 w-3" />
                                              <span>{selectedInspection.contact.email}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="border-t pt-3">
                                          <div className="font-medium text-sm">Insured Party</div>
                                          <div className="space-y-1 text-sm">
                                            <div>{selectedInspection.insured.name}</div>
                                            <div className="flex items-center gap-2">
                                              <Phone className="h-3 w-3" />
                                              <span>{selectedInspection.insured.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Mail className="h-3 w-3" />
                                              <span>{selectedInspection.insured.email}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Equipment & Notes</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <div className="font-medium text-sm mb-2">Required Equipment</div>
                                          <div className="flex flex-wrap gap-1">
                                            {selectedInspection.details.equipmentNeeded.map(
                                              (item: string, index: number) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                  {item}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-medium text-sm mb-1">Estimated Value</div>
                                          <div className="text-lg font-semibold text-green-600">
                                            {selectedInspection.details.estimatedValue}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Description & Instructions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <div className="font-medium text-sm mb-1">Description</div>
                                        <p className="text-sm">{selectedInspection.details.description}</p>
                                      </div>
                                      <div>
                                        <div className="font-medium text-sm mb-1">Special Instructions</div>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedInspection.details.specialInstructions}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button variant="outline" onClick={() => handleEditInspection(selectedInspection)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button variant="outline">
                                      <Navigation className="h-4 w-4 mr-2" />
                                      Directions
                                    </Button>
                                    <Button>Mark Complete</Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGetDirections(inspection.location.address)}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleEditInspection(inspection)}>
                            <Edit className="h-4 w-4" />
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
                <CardTitle>Completed Inspections</CardTitle>
                <CardDescription>Your recently completed property inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspections
                    .filter((inspection) => inspection.status === "Completed")
                    .map((inspection) => (
                      <div key={inspection.id} className="border rounded-lg p-4 opacity-75">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{inspection.title}</span>
                              <Badge className={getStatusColor(inspection.status)}>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {inspection.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{inspection.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{inspection.location.address.split(",")[0]}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span>{inspection.firm}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
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
