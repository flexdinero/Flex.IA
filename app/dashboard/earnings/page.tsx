"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Building2,
  BarChart3,
  Download,
  Eye,
  Clock,
  AlertCircle,
  Target,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedYear, setSelectedYear] = useState("2024")

  // Comprehensive earnings data for independent adjusters
  const earningsOverview = {
    currentMonth: {
      total: 12450,
      claims: 24,
      avgPerClaim: 518.75,
      growth: 15.2,
    },
    currentYear: {
      total: 127500,
      claims: 285,
      avgPerClaim: 447.37,
      growth: 22.8,
    },
    lastMonth: {
      total: 10800,
      claims: 21,
      avgPerClaim: 514.29,
    },
    pending: {
      amount: 8750,
      claims: 12,
      expectedDate: "2024-02-15",
    },
  }

  const earningsByFirm = [
    {
      firm: "Crawford & Company",
      monthlyEarnings: 4200,
      yearlyEarnings: 45600,
      claims: 8,
      avgPayout: 525,
      paymentTerms: "Net 30",
      lastPayment: "2024-01-15",
      status: "Current",
      growth: 18.5,
    },
    {
      firm: "Sedgwick",
      monthlyEarnings: 3150,
      yearlyEarnings: 38900,
      claims: 6,
      avgPayout: 525,
      paymentTerms: "Net 45",
      lastPayment: "2024-01-10",
      status: "Current",
      growth: 12.3,
    },
    {
      firm: "Pilot Catastrophe",
      monthlyEarnings: 2800,
      yearlyEarnings: 28400,
      claims: 4,
      avgPayout: 700,
      paymentTerms: "Net 30",
      lastPayment: "2024-01-12",
      status: "Current",
      growth: 25.7,
    },
    {
      firm: "Eberl Claims",
      monthlyEarnings: 1650,
      yearlyEarnings: 18200,
      claims: 3,
      avgPayout: 550,
      paymentTerms: "Net 60",
      lastPayment: "2023-12-28",
      status: "Overdue",
      growth: -5.2,
    },
    {
      firm: "ESIS",
      monthlyEarnings: 650,
      yearlyEarnings: 7800,
      claims: 2,
      avgPayout: 325,
      paymentTerms: "Net 30",
      lastPayment: "2024-01-08",
      status: "Current",
      growth: 8.9,
    },
  ]

  const earningsByClaimType = [
    { type: "Property Damage", earnings: 45600, claims: 89, avgPayout: 512, percentage: 35.8 },
    { type: "Auto Collision", earnings: 32400, claims: 108, avgPayout: 300, percentage: 25.4 },
    { type: "Storm Damage", earnings: 28700, claims: 41, avgPayout: 700, percentage: 22.5 },
    { type: "Fire Damage", earnings: 15200, claims: 28, avgPayout: 543, percentage: 11.9 },
    { type: "Liability", earnings: 5600, claims: 19, avgPayout: 295, percentage: 4.4 },
  ]

  const paymentSchedule = [
    {
      id: "PAY-2024-001",
      firm: "Crawford & Company",
      amount: 2625,
      claims: 5,
      dueDate: "2024-02-15",
      status: "Pending",
      invoiceDate: "2024-01-16",
      paymentMethod: "ACH",
    },
    {
      id: "PAY-2024-002",
      firm: "Sedgwick",
      amount: 1575,
      claims: 3,
      dueDate: "2024-02-20",
      status: "Pending",
      invoiceDate: "2024-01-06",
      paymentMethod: "Check",
    },
    {
      id: "PAY-2024-003",
      firm: "Pilot Catastrophe",
      amount: 2100,
      claims: 3,
      dueDate: "2024-02-12",
      status: "Pending",
      invoiceDate: "2024-01-13",
      paymentMethod: "ACH",
    },
    {
      id: "PAY-2023-045",
      firm: "Eberl Claims",
      amount: 2450,
      claims: 4,
      dueDate: "2024-01-28",
      status: "Overdue",
      invoiceDate: "2023-11-29",
      paymentMethod: "Check",
    },
  ]

  const monthlyTrends = [
    { month: "Aug", earnings: 8900, claims: 18 },
    { month: "Sep", earnings: 9800, claims: 22 },
    { month: "Oct", earnings: 11200, claims: 25 },
    { month: "Nov", earnings: 10800, claims: 21 },
    { month: "Dec", earnings: 12450, claims: 24 },
    { month: "Jan", earnings: 13200, claims: 26 },
  ]

  const taxInformation = {
    ytdEarnings: 127500,
    estimatedTaxes: 31875, // 25% estimated
    deductions: 8500,
    mileage: 12500,
    mileageDeduction: 7250, // $0.58 per mile
    equipmentDepreciation: 2400,
    officeExpenses: 1850,
  }

  const performanceMetrics = {
    claimsPerMonth: 23.75,
    avgDaysToComplete: 4.2,
    clientSatisfactionScore: 4.8,
    repeatBusinessRate: 78,
    referralRate: 23,
    efficiencyScore: 92,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive earnings tracking and financial insights for independent adjusters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsOverview.currentMonth.total)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {formatPercentage(earningsOverview.currentMonth.growth)} from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yearly Earnings</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsOverview.currentYear.total)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {formatPercentage(earningsOverview.currentYear.growth)} from last year
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Per Claim</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsOverview.currentMonth.avgPerClaim)}</div>
              <p className="text-xs text-muted-foreground">{earningsOverview.currentMonth.claims} claims this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(earningsOverview.pending.amount)}</div>
              <p className="text-xs text-muted-foreground">
                {earningsOverview.pending.claims} claims • Due {earningsOverview.pending.expectedDate}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="firms">By Firm</TabsTrigger>
            <TabsTrigger value="types">By Type</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="taxes">Tax Info</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings Trend</CardTitle>
                  <CardDescription>Last 6 months earnings and claim volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 text-sm font-medium">{month.month}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{formatCurrency(month.earnings)}</span>
                              <span className="text-muted-foreground">{month.claims} claims</span>
                            </div>
                            <Progress value={(month.earnings / 15000) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Highlights</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.claimsPerMonth}</div>
                      <div className="text-sm text-muted-foreground">Claims/Month</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.avgDaysToComplete}</div>
                      <div className="text-sm text-muted-foreground">Avg Days</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {performanceMetrics.clientSatisfactionScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{performanceMetrics.efficiencyScore}%</div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="firms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Firm</CardTitle>
                <CardDescription>Detailed breakdown of earnings from each connected IA firm</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm</TableHead>
                      <TableHead>Monthly</TableHead>
                      <TableHead>Yearly</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Avg Payout</TableHead>
                      <TableHead>Payment Terms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earningsByFirm.map((firm, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {firm.firm}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(firm.monthlyEarnings)}</TableCell>
                        <TableCell>{formatCurrency(firm.yearlyEarnings)}</TableCell>
                        <TableCell>{firm.claims}</TableCell>
                        <TableCell>{formatCurrency(firm.avgPayout)}</TableCell>
                        <TableCell>{firm.paymentTerms}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(firm.status)}>{firm.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {firm.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={firm.growth > 0 ? "text-green-600" : "text-red-600"}>
                              {formatPercentage(firm.growth)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Claim Type</CardTitle>
                <CardDescription>Revenue breakdown by different types of insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsByClaimType.map((type, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{type.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(type.earnings)}</div>
                          <div className="text-sm text-muted-foreground">
                            {type.claims} claims • {formatCurrency(type.avgPayout)} avg
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={type.percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-12">{type.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>Track pending and overdue payments from IA firms</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Firm</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentSchedule.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell>{payment.firm}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.claims}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === "Pending" && <Clock className="h-3 w-3 mr-1" />}
                            {payment.status === "Overdue" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Summary</CardTitle>
                  <CardDescription>Year-to-date tax information and estimates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">YTD Earnings</div>
                      <div className="text-2xl font-bold">{formatCurrency(taxInformation.ytdEarnings)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Est. Taxes (25%)</div>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(taxInformation.estimatedTaxes)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Deductions</span>
                      <span className="font-medium">{formatCurrency(taxInformation.deductions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mileage ({taxInformation.mileage} miles)</span>
                      <span className="font-medium">{formatCurrency(taxInformation.mileageDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Equipment Depreciation</span>
                      <span className="font-medium">{formatCurrency(taxInformation.equipmentDepreciation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Office Expenses</span>
                      <span className="font-medium">{formatCurrency(taxInformation.officeExpenses)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Estimates</CardTitle>
                  <CardDescription>Estimated quarterly tax payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"].map((quarter, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{quarter}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {["Apr 15", "Jun 15", "Sep 15", "Jan 15"][index]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(taxInformation.estimatedTaxes / 4)}</div>
                          <Badge className={index < 1 ? getStatusColor("Paid") : getStatusColor("Pending")}>
                            {index < 1 ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for your adjusting business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Claims per Month</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.claimsPerMonth}</span>
                      </div>
                      <Progress value={(performanceMetrics.claimsPerMonth / 30) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Avg Days to Complete</span>
                        <span className="text-sm text-muted-foreground">
                          {performanceMetrics.avgDaysToComplete} days
                        </span>
                      </div>
                      <Progress value={100 - (performanceMetrics.avgDaysToComplete / 10) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Client Satisfaction</span>
                        <span className="text-sm text-muted-foreground">
                          {performanceMetrics.clientSatisfactionScore}/5.0
                        </span>
                      </div>
                      <Progress value={(performanceMetrics.clientSatisfactionScore / 5) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Repeat Business Rate</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.repeatBusinessRate}%</span>
                      </div>
                      <Progress value={performanceMetrics.repeatBusinessRate} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Growth</CardTitle>
                  <CardDescription>Track your business development metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.referralRate}%</div>
                      <div className="text-sm text-muted-foreground">Referral Rate</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.repeatBusinessRate}%</div>
                      <div className="text-sm text-muted-foreground">Repeat Business</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.efficiencyScore}%</div>
                      <div className="text-sm text-muted-foreground">Efficiency Score</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">A+</div>
                      <div className="text-sm text-muted-foreground">Overall Grade</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
