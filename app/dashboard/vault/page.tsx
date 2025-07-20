"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  Upload,
  Eye,
  Download,
  Share,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Vault,
  Plus,
  Filter,
  Grid,
  List,
  FileSignature,
  PenTool,
  Building2,
  MapPin,
  Target,
  Award,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FilterBar } from "@/components/ui/filter-bar"
import { vaultFilterConfig } from "@/lib/filter-configs"

export default function VaultPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedItem, setSelectedItem] = useState<any>(null)

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
  const [activeTab, setActiveTab] = useState("documents")

  // Documents data
  const documents = [
    {
      id: 1,
      name: "Texas Adjuster License",
      category: "License",
      type: "PDF",
      size: "2.3 MB",
      uploadDate: "2024-01-15",
      expiryDate: "2025-12-31",
      status: "Active",
      description: "Texas Department of Insurance Adjuster License",
      tags: ["Texas", "Adjuster", "License"],
      shared: false,
      url: "/placeholder.pdf",
    },
    {
      id: 2,
      name: "HAAG Certification",
      category: "Certification",
      type: "PDF",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      expiryDate: "2025-06-15",
      status: "Active",
      description: "HAAG Engineering Residential Roof Inspector Certification",
      tags: ["HAAG", "Roof", "Certification"],
      shared: true,
      url: "/placeholder.pdf",
    },
    {
      id: 3,
      name: "E&O Insurance Policy",
      category: "Insurance",
      type: "PDF",
      size: "3.1 MB",
      uploadDate: "2024-01-05",
      expiryDate: "2024-12-31",
      status: "Expiring Soon",
      description: "Errors & Omissions Insurance Policy",
      tags: ["Insurance", "E&O", "Policy"],
      shared: false,
      url: "/placeholder.pdf",
    },
    {
      id: 4,
      name: "ITEL Certification",
      category: "Certification",
      type: "PDF",
      size: "2.1 MB",
      uploadDate: "2023-11-20",
      expiryDate: "2024-11-20",
      status: "Expired",
      description: "ITEL Electrical Damage Assessment Certification",
      tags: ["ITEL", "Electrical", "Certification"],
      shared: false,
      url: "/placeholder.pdf",
    },
  ]

  // Contracts data
  const contracts = [
    {
      id: 1,
      contractNumber: "CTR-2024-001",
      firm: "Crawford & Company",
      title: "Independent Adjuster Agreement",
      status: "Active",
      signedDate: "2024-01-01",
      effectiveDate: "2024-01-01",
      expiryDate: "2024-12-31",
      autoRenew: true,
      territory: ["Texas", "Louisiana", "Oklahoma"],
      specialties: ["Property", "Auto", "Commercial"],
      paymentTerms: "Net 30",
      baseRate: 65,
      bonusStructure: "Performance-based",
      description: "Standard independent adjuster agreement for property and casualty claims",
      clauses: ["Confidentiality Agreement", "Non-Compete Clause (6 months)", "Indemnification", "Termination Clause"],
      attachments: [
        { name: "Signed Contract.pdf", size: "2.1 MB" },
        { name: "Rate Schedule.pdf", size: "1.3 MB" },
        { name: "Territory Map.pdf", size: "3.2 MB" },
      ],
      requiresSignature: false,
      lastModified: "2024-01-01",
    },
    {
      id: 2,
      contractNumber: "CTR-2024-002",
      firm: "Sedgwick",
      title: "CAT Response Agreement",
      status: "Pending Signature",
      signedDate: null,
      effectiveDate: "2024-02-01",
      expiryDate: "2025-01-31",
      autoRenew: false,
      territory: ["Texas", "Arkansas", "Mississippi"],
      specialties: ["Storm Damage", "Hail", "Wind"],
      paymentTerms: "Net 15",
      baseRate: 75,
      bonusStructure: "Volume-based",
      description: "Catastrophe response agreement for storm season deployment",
      clauses: ["Emergency Deployment Clause", "Travel Reimbursement", "Equipment Provision", "Performance Standards"],
      attachments: [
        { name: "Draft Contract.pdf", size: "2.8 MB" },
        { name: "CAT Procedures.pdf", size: "1.9 MB" },
      ],
      requiresSignature: true,
      lastModified: "2024-01-20",
    },
    {
      id: 3,
      contractNumber: "CTR-2023-015",
      firm: "Pilot Catastrophe",
      title: "Annual Service Agreement",
      status: "Expired",
      signedDate: "2023-01-15",
      effectiveDate: "2023-01-15",
      expiryDate: "2024-01-15",
      autoRenew: false,
      territory: ["Texas", "New Mexico"],
      specialties: ["Property", "Commercial", "Industrial"],
      paymentTerms: "Net 30",
      baseRate: 70,
      bonusStructure: "Tiered performance",
      description: "Annual service agreement for property damage assessments",
      clauses: ["Quality Standards", "Reporting Requirements", "Insurance Requirements", "Renewal Options"],
      attachments: [
        { name: "Expired Contract.pdf", size: "2.5 MB" },
        { name: "Performance Report.pdf", size: "1.7 MB" },
      ],
      requiresSignature: false,
      lastModified: "2023-01-15",
    },
  ]

  const getFilteredItems = () => {
    const items = activeTab === "documents" ? documents : contracts

    return items.filter((item) => {
      const searchFields =
        activeTab === "documents"
          ? [item.name, item.description, ...(item.tags || [])]
          : [item.contractNumber, item.firm, item.title, item.description]

      const matchesSearch = searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        selectedCategory === "all" ||
        (activeTab === "documents" ? item.category === selectedCategory : item.firm === selectedCategory)

      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }

  const filteredItems = getFilteredItems()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Expiring Soon":
      case "Pending Signature":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Expiring Soon":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Pending Signature":
        return <PenTool className="h-4 w-4 text-yellow-500" />
      case "Expired":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Under Review":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "License":
        return <Shield className="h-4 w-4" />
      case "Certification":
        return <Award className="h-4 w-4" />
      case "Insurance":
        return <Shield className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleUpload = () => {
    console.log("Upload document")
  }

  const handleShare = (itemId: number) => {
    console.log(`Share item ${itemId}`)
  }

  const handleDelete = (itemId: number) => {
    console.log(`Delete item ${itemId}`)
  }

  const handleSign = (contractId: number) => {
    console.log(`Sign contract ${contractId}`)
  }

  // Calculate stats
  const documentStats = {
    totalDocuments: documents.length,
    activeDocuments: documents.filter((d) => d.status === "Active").length,
    expiringDocuments: documents.filter((d) => d.status === "Expiring Soon").length,
    expiredDocuments: documents.filter((d) => d.status === "Expired").length,
  }

  const contractStats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter((c) => c.status === "Active").length,
    pendingSignature: contracts.filter((c) => c.status === "Pending Signature").length,
    expiredContracts: contracts.filter((c) => c.status === "Expired").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Vault className="h-8 w-8 text-purple-600" />
              Vault
            </h1>
            <p className="text-muted-foreground">Securely manage your documents, contracts, and important files</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>Upload a document or create a new contract</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="document" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="document">Upload Document</TabsTrigger>
                    <TabsTrigger value="contract">New Contract</TabsTrigger>
                  </TabsList>

                  <TabsContent value="document" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="document-name">Document Name</Label>
                        <Input id="document-name" placeholder="Enter document name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="license">License</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                        <Input id="expiry-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" placeholder="Enter tags separated by commas" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Brief description of the document" />
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                      <Button variant="outline" className="mt-2 bg-transparent" onClick={handleUpload}>
                        Choose File
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="contract" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-title">Contract Title</Label>
                        <Input id="contract-title" placeholder="e.g., Annual Adjuster Agreement" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firm">IA Firm</Label>
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
                        <Label htmlFor="effective-date">Effective Date</Label>
                        <Input id="effective-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date-contract">Expiry Date</Label>
                        <Input id="expiry-date-contract" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract-description">Description</Label>
                      <Textarea id="contract-description" placeholder="Brief description of the contract" />
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Standardized Filter Bar */}
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search documents, contracts, files..."
          filters={vaultFilterConfig}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
          showSearch={true}
          showFilterToggle={true}
          className="rounded-lg border"
        />

        {/* Stats */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Stats */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Total Documents</CardTitle>
                  <FileText className="h-3 w-3 text-blue-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold">{documentStats.totalDocuments}</div>
                  <div className="text-xs text-muted-foreground truncate">Documents stored</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Active</CardTitle>
                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-green-600">{documentStats.activeDocuments}</div>
                  <div className="text-xs text-muted-foreground truncate">Currently valid</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Expiring Soon</CardTitle>
                  <Clock className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-yellow-600">{documentStats.expiringDocuments}</div>
                  <div className="text-xs text-muted-foreground truncate">Need attention</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Expired</CardTitle>
                  <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-red-600">{documentStats.expiredDocuments}</div>
                  <div className="text-xs text-muted-foreground truncate">Need renewal</div>
                </CardContent>
              </Card>
            </div>

            {/* Document Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Documents</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name, description, tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="License">License</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>View Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
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

            {/* Documents Grid/List */}
            <Card>
              <CardHeader>
                <CardTitle>Documents ({filteredItems.length})</CardTitle>
                <CardDescription>
                  Showing {filteredItems.length} of {documents.length} documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((document) => (
                      <Card key={document.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(document.category)}
                              <div>
                                <CardTitle className="text-lg">{document.name}</CardTitle>
                                <CardDescription>{document.category}</CardDescription>
                              </div>
                            </div>
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{document.description}</p>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span>{document.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Uploaded:</span>
                              <span>{document.uploadDate}</span>
                            </div>
                            {document.expiryDate && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Expires:</span>
                                <span>{document.expiryDate}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {document.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-transparent"
                                  onClick={() => setSelectedItem(document)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    {selectedItem?.name} Details
                                  </DialogTitle>
                                  <DialogDescription>Complete document information</DialogDescription>
                                </DialogHeader>

                                {selectedItem && (
                                  <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Document Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="font-medium">Name:</span>
                                            <span>{selectedItem.name}</span>
                                            <span className="font-medium">Category:</span>
                                            <span>{selectedItem.category}</span>
                                            <span className="font-medium">Status:</span>
                                            <Badge className={getStatusColor(selectedItem.status)} size="sm">
                                              {selectedItem.status}
                                            </Badge>
                                            <span className="font-medium">Uploaded Date:</span>
                                            <span>{selectedItem.uploadDate}</span>
                                            <span className="font-medium">Expiry Date:</span>
                                            <span>{selectedItem.expiryDate}</span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Description */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Description</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-sm">{selectedItem.description}</p>
                                      </CardContent>
                                    </Card>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                      <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                      </Button>
                                      <Button variant="outline">
                                        <Share className="h-4 w-4 mr-2" />
                                        Share Document
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare(document.id)}
                              className="bg-transparent"
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((document) => (
                      <div key={document.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getCategoryIcon(document.category)}
                            <div>
                              <h3 className="font-semibold">{document.name}</h3>
                              <p className="text-sm text-muted-foreground">{document.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{document.category}</span>
                                <span>{document.size}</span>
                                <span>Uploaded: {document.uploadDate}</span>
                                {document.expiryDate && <span>Expires: {document.expiryDate}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            {/* Contract Stats */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Total Contracts</CardTitle>
                  <FileSignature className="h-3 w-3 text-blue-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold">{contractStats.totalContracts}</div>
                  <div className="text-xs text-muted-foreground truncate">Contracts managed</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Active</CardTitle>
                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-green-600">{contractStats.activeContracts}</div>
                  <div className="text-xs text-muted-foreground truncate">Currently active</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Pending Signature</CardTitle>
                  <PenTool className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-yellow-600">{contractStats.pendingSignature}</div>
                  <div className="text-xs text-muted-foreground truncate">Awaiting signature</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                  <CardTitle className="text-xs font-medium truncate">Expired</CardTitle>
                  <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-red-600">{contractStats.expiredContracts}</div>
                  <div className="text-xs text-muted-foreground truncate">Need renewal</div>
                </CardContent>
              </Card>
            </div>

            {/* Contract Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-contracts">Search Contracts</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-contracts"
                        placeholder="Search by number, firm, title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firm-filter">Firm</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Firms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Firms</SelectItem>
                        <SelectItem value="Crawford & Company">Crawford & Company</SelectItem>
                        <SelectItem value="Sedgwick">Sedgwick</SelectItem>
                        <SelectItem value="Pilot Catastrophe">Pilot Catastrophe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract-status">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending Signature">Pending Signature</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>View Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
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

            {/* Contracts Grid/List */}
            <Card>
              <CardHeader>
                <CardTitle>Contracts ({filteredItems.length})</CardTitle>
                <CardDescription>
                  Showing {filteredItems.length} of {contracts.length} contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((contract) => (
                      <Card key={contract.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <FileSignature className="h-5 w-5 text-blue-600" />
                              <div>
                                <CardTitle className="text-lg">{contract.title}</CardTitle>
                                <CardDescription>{contract.contractNumber}</CardDescription>
                              </div>
                            </div>
                            <Badge className={getStatusColor(contract.status)}>
                              {getStatusIcon(contract.status)}
                              <span className="ml-1">{contract.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{contract.firm}</span>
                          </div>

                          <p className="text-sm text-muted-foreground">{contract.description}</p>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Base Rate:</span>
                              <span className="font-medium">${contract.baseRate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Effective:</span>
                              <span>{contract.effectiveDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expires:</span>
                              <span>{contract.expiryDate}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Territory:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contract.territory?.map((state, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {state}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Specialties:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contract.specialties?.map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-transparent"
                                  onClick={() => setSelectedItem(contract)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileSignature className="h-5 w-5 text-blue-600" />
                                    Contract Details - {selectedItem?.contractNumber}
                                    <Badge className={getStatusColor(selectedItem?.status || "")}>
                                      {selectedItem?.status}
                                    </Badge>
                                  </DialogTitle>
                                  <DialogDescription>Complete contract information and terms</DialogDescription>
                                </DialogHeader>

                                {selectedItem && (
                                  <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Contract Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="font-medium">Contract Number:</span>
                                            <span>{selectedItem.contractNumber}</span>
                                            <span className="font-medium">Title:</span>
                                            <span>{selectedItem.title}</span>
                                            <span className="font-medium">Firm:</span>
                                            <span>{selectedItem.firm}</span>
                                            <span className="font-medium">Status:</span>
                                            <Badge className={getStatusColor(selectedItem.status)} size="sm">
                                              {selectedItem.status}
                                            </Badge>
                                            <span className="font-medium">Effective Date:</span>
                                            <span>{selectedItem.effectiveDate}</span>
                                            <span className="font-medium">Expiry Date:</span>
                                            <span>{selectedItem.expiryDate}</span>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Financial Terms</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="font-medium">Base Rate:</span>
                                              <span className="font-semibold text-green-600">
                                                ${selectedItem.baseRate}/hour
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="font-medium">Payment Terms:</span>
                                              <span>{selectedItem.paymentTerms}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="font-medium">Bonus Structure:</span>
                                              <span>{selectedItem.bonusStructure}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="font-medium">Auto Renew:</span>
                                              <Badge variant={selectedItem.autoRenew ? "default" : "secondary"}>
                                                {selectedItem.autoRenew ? "Yes" : "No"}
                                              </Badge>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Territory and Specialties */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Territory Coverage</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedItem.territory?.map((state, index) => (
                                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {state}
                                              </Badge>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Specialties</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedItem.specialties?.map((specialty, index) => (
                                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                <Target className="h-3 w-3" />
                                                {specialty}
                                              </Badge>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Contract Clauses */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Contract Clauses</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {selectedItem.clauses?.map((clause, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                              <CheckCircle className="h-4 w-4 text-green-500" />
                                              <span>{clause}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Description */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Description</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-sm">{selectedItem.description}</p>
                                      </CardContent>
                                    </Card>

                                    {/* Attachments */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Attachments</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-2">
                                          {selectedItem.attachments?.map((attachment, index) => (
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
                                      {selectedItem.requiresSignature && (
                                        <Button onClick={() => handleSign(selectedItem.id)}>
                                          <PenTool className="h-4 w-4 mr-2" />
                                          Sign Contract
                                        </Button>
                                      )}
                                      <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                      </Button>
                                      <Button variant="outline">
                                        <Share className="h-4 w-4 mr-2" />
                                        Share Contract
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {contract.requiresSignature && (
                              <Button size="sm" onClick={() => handleSign(contract.id)}>
                                <PenTool className="h-4 w-4 mr-2" />
                                Sign
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((contract) => (
                      <div key={contract.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <FileSignature className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold">{contract.title}</h3>
                              <p className="text-sm text-muted-foreground">{contract.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{contract.contractNumber}</span>
                                <span>{contract.firm}</span>
                                <span>${contract.baseRate}/hr</span>
                                <span>Expires: {contract.expiryDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(contract.status)}>
                              {getStatusIcon(contract.status)}
                              <span className="ml-1">{contract.status}</span>
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {contract.requiresSignature && (
                              <Button size="sm" onClick={() => handleSign(contract.id)}>
                                <PenTool className="h-4 w-4 mr-2" />
                                Sign
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
