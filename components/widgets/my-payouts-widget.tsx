"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowRight, 
  DollarSign, 
  Calendar, 
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  CreditCard,
  Building
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Payout {
  id: string
  claimId: string
  firm: string
  amount: number
  status: 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Cancelled'
  paymentMethod: 'Direct Deposit' | 'Check' | 'Wire Transfer'
  dateRequested: string
  datePaid?: string
  description: string
  invoiceNumber: string
  taxWithheld: number
  netAmount: number
}

interface MyPayoutsWidgetProps {
  isCompact?: boolean
}

export function MyPayoutsWidget({ isCompact = false }: MyPayoutsWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data with detailed payout information
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "PAY-2024-001",
      claimId: "CLM-2024-001",
      firm: "Crawford & Company",
      amount: 2850.00,
      status: "Paid",
      paymentMethod: "Direct Deposit",
      dateRequested: "Jan 15, 2024",
      datePaid: "Jan 18, 2024",
      description: "Hurricane damage assessment - CLM-2024-001",
      invoiceNumber: "INV-001-2024",
      taxWithheld: 285.00,
      netAmount: 2565.00
    },
    {
      id: "PAY-2024-002",
      claimId: "CLM-2024-002",
      firm: "Sedgwick Claims",
      amount: 1750.00,
      status: "Processing",
      paymentMethod: "Direct Deposit",
      dateRequested: "Jan 20, 2024",
      description: "Water damage assessment - CLM-2024-002",
      invoiceNumber: "INV-002-2024",
      taxWithheld: 175.00,
      netAmount: 1575.00
    },
    {
      id: "PAY-2024-003",
      claimId: "CLM-2024-003",
      firm: "Gallagher Bassett",
      amount: 3200.00,
      status: "Pending",
      paymentMethod: "Wire Transfer",
      dateRequested: "Jan 22, 2024",
      description: "Fire damage assessment - CLM-2024-003",
      invoiceNumber: "INV-003-2024",
      taxWithheld: 320.00,
      netAmount: 2880.00
    },
    {
      id: "PAY-2024-004",
      claimId: "CLM-2023-089",
      firm: "Crawford & Company",
      amount: 2100.00,
      status: "Failed",
      paymentMethod: "Direct Deposit",
      dateRequested: "Jan 10, 2024",
      description: "Storm damage assessment - CLM-2023-089",
      invoiceNumber: "INV-004-2024",
      taxWithheld: 210.00,
      netAmount: 1890.00
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-3 w-3" />
      case 'Processing': return <TrendingUp className="h-3 w-3" />
      case 'Paid': return <CheckCircle className="h-3 w-3" />
      case 'Failed': return <AlertCircle className="h-3 w-3" />
      case 'Cancelled': return <AlertCircle className="h-3 w-3" />
      default: return <DollarSign className="h-3 w-3" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Direct Deposit': return <Building className="h-3 w-3" />
      case 'Check': return <FileText className="h-3 w-3" />
      case 'Wire Transfer': return <CreditCard className="h-3 w-3" />
      default: return <DollarSign className="h-3 w-3" />
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    
    // Period filter logic (simplified for demo)
    const matchesPeriod = periodFilter === "all" || true // Would implement date filtering
    
    return matchesSearch && matchesStatus && matchesPeriod
  })

  const handlePayoutAction = async (payoutId: string, action: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (action === 'download') {
        toast.success(`Downloading statement for ${payoutId}`)
      } else if (action === 'retry') {
        // Retry failed payment
        setPayouts(prev => prev.map(payout => 
          payout.id === payoutId 
            ? { ...payout, status: 'Processing' as const }
            : payout
        ))
        toast.success(`Retrying payment for ${payoutId}`)
      } else if (action === 'view') {
        toast.success(`Opening details for ${payoutId}`)
      }
    } catch (error) {
      toast.error(`Failed to ${action} payout`)
    } finally {
      setIsLoading(false)
    }
  }

  const totalEarnings = payouts
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.netAmount, 0)

  const pendingAmount = payouts
    .filter(p => p.status === 'Pending' || p.status === 'Processing')
    .reduce((sum, p) => sum + p.netAmount, 0)

  const displayPayouts = isCompact ? filteredPayouts.slice(0, 3) : filteredPayouts

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            My Payouts
          </CardTitle>
          <CardDescription>Payment history and pending payouts</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isCompact && (
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
          <Link href="/dashboard/payouts">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Paid</p>
                    <p className="text-2xl font-bold text-green-700">${totalEarnings.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">${pendingAmount.toLocaleString()}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payouts..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-3">
          {displayPayouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payouts found matching your criteria</p>
            </div>
          ) : (
            displayPayouts.map((payout) => (
              <div key={payout.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{payout.id}</h3>
                    <p className="text-sm text-muted-foreground">{payout.firm}</p>
                    <p className="text-sm text-muted-foreground mt-1">{payout.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(payout.status)}>
                      {getStatusIcon(payout.status)}
                      <span className="ml-1">{payout.status}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-semibold">${payout.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span className="font-semibold text-green-600">${payout.netAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getPaymentMethodIcon(payout.paymentMethod)}
                    <span>{payout.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{payout.datePaid || payout.dateRequested}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Invoice: {payout.invoiceNumber}</span>
                    <span>Tax: ${payout.taxWithheld}</span>
                    <span>Claim: {payout.claimId}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handlePayoutAction(payout.id, 'view')}
                      disabled={isLoading}
                      className="h-8 px-2 text-xs"
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handlePayoutAction(payout.id, 'download')}
                      disabled={isLoading}
                      className="h-8 px-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Statement
                    </Button>
                    {payout.status === 'Failed' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePayoutAction(payout.id, 'retry')}
                        disabled={isLoading}
                        className="h-8 px-2 text-xs text-blue-600"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isCompact && filteredPayouts.length > 3 && (
          <div className="text-center pt-2">
            <Link href="/dashboard/payouts">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                +{filteredPayouts.length - 3} more payouts
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
