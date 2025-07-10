"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  FileSignature,
  Eye,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  PenTool,
  FileText,
  Target,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedContract, setSelectedContract] = useState<any>(null)

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
    {
      id: 4,
      contractNumber: "CTR-2024-003",
      firm: "Eberl Claims",
      title: "Specialty Lines Agreement",
      status: "Under Review",
      signedDate: null,
      effectiveDate: "2024-03-01",
      expiryDate: "2025-02-28",
      autoRenew: true,
      territory: ["Texas"],
      specialties: ["Fire Investigation", "Liability", "Workers Comp"],
      paymentTerms: "Net 45",
      baseRate: 80,
      bonusStructure: "Complexity-based",
      description: "Specialized agreement for complex liability and fire investigation claims",
      clauses: [
        "Expert Witness Provision",
        "Court Appearance Compensation",
        "Continuing Education Requirements",
        "Specialized Equipment Access",
      ],
      attachments: [
        { name: "Draft Agreement.pdf", size: "3.1 MB" },
        { name: "Specialty Rates.pdf", size: "1.4 MB" },
      ],
      requiresSignature: false,
      lastModified: "2024-01-25",
    },
  ]

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.specialties.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === "all" || contract.status === selectedStatus
    const matchesFirm = selectedFirm === "all" || contract.firm === selectedFirm

    return matchesSearch && matchesStatus && matchesFirm
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending Signature":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pending Signature":
        return <PenTool className="h-4 w-4 text-yellow-500" />
      case "Under Review":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Expired":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSign = (contractId: number) => {
    console.log(`Sign contract ${contractId}`)
  }

  const stats = {
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
              <FileSignature className="h-8 w-8 text-purple-600" />
              My Contracts
            </h1>
            <p className="text-muted-foreground">Manage your contracts with IA firms and track agreement status</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts}</div>
              <div className="text-xs text-muted-foreground">All agreements</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeContracts}</div>
              <div className="text-xs text-muted-foreground">Currently effective</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
              <PenTool className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingSignature}</div>
              <div className="text-xs text-muted-foreground">Awaiting signature</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expiredContracts}</div>
              <div className="text-xs text-muted-foreground">Need renewal</div>
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
                <Label htmlFor="search">Search Contracts</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by number, firm, title..."
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
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending Signature">Pending Signature</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Contracts ({filteredContracts.length})</CardTitle>
            <CardDescription>
              Showing {filteredContracts.length} of {contracts.length} contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-lg">{contract.contractNumber}</span>
                        <Badge variant="outline">{contract.firm}</Badge>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusIcon(contract.status)}
                          <span className="ml-1">{contract.status}</span>
                        </Badge>
                        {contract.requiresSignature && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            <PenTool className="h-3 w-3 mr-1" />
                            Signature Required
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-medium">{contract.title}</h3>

                      {/* Details Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Effective: {contract.effectiveDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Expires: {contract.expiryDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${contract.baseRate}/hr base rate</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{contract.territory.join(", ")}</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1">
                        {contract.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-sm">{contract.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedContract(contract)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FileSignature className="h-5 w-5 text-purple-600" />
                              Contract Details - {selectedContract?.contractNumber}
                            </DialogTitle>
                            <DialogDescription>Complete contract information and terms</DialogDescription>
                          </DialogHeader>

                          {selectedContract && (
                            <div className="space-y-6">
                              {/* Basic Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Contract Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <span className="font-medium">Contract #:</span>
                                      <span>{selectedContract.contractNumber}</span>
                                      <span className="font-medium">Firm:</span>
                                      <span>{selectedContract.firm}</span>
                                      <span className="font-medium">Title:</span>
                                      <span>{selectedContract.title}</span>
                                      <span className="font-medium">Status:</span>
                                      <Badge className={getStatusColor(selectedContract.status)}>
                                        {selectedContract.status}
                                      </Badge>
                                      <span className="font-medium">Auto Renew:</span>
                                      <span>{selectedContract.autoRenew ? "Yes" : "No"}</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Dates & Terms</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <span className="font-medium">Effective Date:</span>
                                      <span>{selectedContract.effectiveDate}</span>
                                      <span className="font-medium">Expiry Date:</span>
                                      <span>{selectedContract.expiryDate}</span>
                                      {selectedContract.signedDate && (
                                        <>
                                          <span className="font-medium">Signed Date:</span>
                                          <span>{selectedContract.signedDate}</span>
                                        </>
                                      )}
                                      <span className="font-medium">Payment Terms:</span>
                                      <span>{selectedContract.paymentTerms}</span>
                                      <span className="font-medium">Last Modified:</span>
                                      <span>{selectedContract.lastModified}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Financial Terms */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Financial Terms</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Base Rate:</span>
                                      <div className="text-lg font-semibold text-green-600">
                                        ${selectedContract.baseRate}/hour
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Bonus Structure:</span>
                                      <div>{selectedContract.bonusStructure}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Payment Terms:</span>
                                      <div>{selectedContract.paymentTerms}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Territory & Specialties */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Territory Coverage</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedContract.territory.map((state, index) => (
                                        <Badge key={index} variant="outline">
                                          <MapPin className="h-3 w-3 mr-1" />
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
                                      {selectedContract.specialties.map((specialty, index) => (
                                        <Badge key={index} variant="outline">
                                          <Target className="h-3 w-3 mr-1" />
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
                                  <CardTitle className="text-lg">Key Contract Clauses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {selectedContract.clauses.map((clause, index) => (
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
                                  <p className="text-sm">{selectedContract.description}</p>
                                </CardContent>
                              </Card>

                              {/* Attachments */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Contract Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {selectedContract.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
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
                                {selectedContract.requiresSignature && (
                                  <Button onClick={() => handleSign(selectedContract.id)}>
                                    <PenTool className="h-4 w-4 mr-2" />
                                    Sign Contract
                                  </Button>
                                )}
                                <Button variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {contract.requiresSignature && (
                        <Button size="sm" onClick={() => handleSign(contract.id)}>
                          <PenTool className="h-4 w-4 mr-2" />
                          Sign Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
