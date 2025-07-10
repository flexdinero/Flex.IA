"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  FileBarChart,
  Download,
  CalendarIcon,
  TrendingUp,
  DollarSign,
  FileText,
  Building2,
  Target,
  Filter,
  RefreshCw,
  Share,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { format } from "date-fns"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedFirm, setSelectedFirm] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("ytd")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const monthlyEarnings = [
    { month: "Jan", earnings: 8500, claims: 12 },
    { month: "Feb", earnings: 12300, claims: 18 },
    { month: "Mar", earnings: 9800, claims: 14 },
    { month: "Apr", earnings: 15600, claims: 22 },
    { month: "May", earnings: 11200, claims: 16 },
    { month: "Jun", earnings: 13800, claims: 20 },
    { month: "Jul", earnings: 16500, claims: 24 },
    { month: "Aug", earnings: 14200, claims: 19 },
    { month: "Sep", earnings: 17800, claims: 26 },
    { month: "Oct", earnings: 19200, claims: 28 },
    { month: "Nov", earnings: 16800, claims: 23 },
    { month: "Dec", earnings: 21500, claims: 31 },
  ]

  const firmPerformance = [
    { firm: "Crawford & Company", claims: 45, earnings: 67500, avgRating: 4.8, efficiency: 92 },
    { firm: "Sedgwick", claims: 38, earnings: 52800, avgRating: 4.6, efficiency: 88 },
    { firm: "Pilot Catastrophe", claims: 32, earnings: 58400, avgRating: 4.9, efficiency: 95 },
    { firm: "Eberl Claims", claims: 28, earnings: 41200, avgRating: 4.5, efficiency: 85 },
    { firm: "ESIS", claims: 22, earnings: 35600, avgRating: 4.7, efficiency: 90 },
  ]

  const claimTypes = [
    { type: "Property Damage", count: 65, value: 45, color: "#8884d8" },
    { type: "Auto Collision", count: 48, value: 33, color: "#82ca9d" },
    { type: "Storm Damage", count: 32, value: 22, color: "#ffc658" },
    { type: "Fire Damage", count: 18, value: 12, color: "#ff7300" },
    { type: "Commercial", count: 12, value: 8, color: "#00ff88" },
  ]

  const performanceMetrics = [
    { metric: "Avg Completion Time", value: "3.2 days", change: "-0.5", trend: "down" },
    { metric: "Client Satisfaction", value: "4.7/5", change: "+0.2", trend: "up" },
    { metric: "Accuracy Rate", value: "96.8%", change: "+1.2%", trend: "up" },
    { metric: "Bonus Earnings", value: "$12,450", change: "+$2,100", trend: "up" },
  ]

  const territoryData = [
    { state: "Texas", claims: 89, earnings: 134500 },
    { state: "Louisiana", claims: 34, earnings: 51200 },
    { state: "Oklahoma", claims: 28, earnings: 42800 },
    { state: "Arkansas", claims: 18, earnings: 27600 },
    { state: "New Mexico", claims: 12, earnings: 18400 },
  ]

  const handleExportReport = () => {
    console.log("Exporting report...")
  }

  const handleRefreshData = () => {
    console.log("Refreshing data...")
  }

  const handleShareReport = () => {
    console.log("Sharing report...")
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  // Calculate totals
  const totalEarnings = monthlyEarnings.reduce((sum, month) => sum + month.earnings, 0)
  const totalClaims = monthlyEarnings.reduce((sum, month) => sum + month.claims, 0)
  const avgEarningsPerClaim = totalEarnings / totalClaims

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileBarChart className="h-8 w-8 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">Comprehensive insights into your adjuster performance and earnings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleShareReport}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Time Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtd">Month to Date</SelectItem>
                    <SelectItem value="qtd">Quarter to Date</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>IA Firm</Label>
                <Select value={selectedFirm} onValueChange={setSelectedFirm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Firms</SelectItem>
                    <SelectItem value="crawford">Crawford & Company</SelectItem>
                    <SelectItem value="sedgwick">Sedgwick</SelectItem>
                    <SelectItem value="pilot">Pilot Catastrophe</SelectItem>
                    <SelectItem value="eberl">Eberl Claims</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
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

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="firms">Firms</TabsTrigger>
            <TabsTrigger value="territory">Territory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +12.5% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalClaims}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +8.3% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg per Claim</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">${avgEarningsPerClaim.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +3.8% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Firms</CardTitle>
                  <Building2 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{firmPerformance.length}</div>
                  <div className="text-xs text-muted-foreground">Connected IA firms</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`text-xs flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                      {metric.change} from last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings Trend</CardTitle>
                  <CardDescription>Earnings and claim volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      earnings: {
                        label: "Earnings",
                        color: "hsl(var(--chart-1))",
                      },
                      claims: {
                        label: "Claims",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyEarnings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="earnings" fill="var(--color-earnings)" name="Earnings ($)" />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="claims"
                          stroke="var(--color-claims)"
                          name="Claims"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claim Types Distribution</CardTitle>
                  <CardDescription>Breakdown of claims by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Claims",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={claimTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, value }) => `${type}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {claimTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your earnings performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    earnings: {
                      label: "Monthly Earnings",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="earnings" fill="var(--color-earnings)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Highest Earning Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">December</div>
                  <div className="text-lg text-muted-foreground">$21,500</div>
                  <div className="text-sm text-muted-foreground">31 claims completed</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">${(totalEarnings / 12).toLocaleString()}</div>
                  <div className="text-lg text-muted-foreground">{Math.round(totalClaims / 12)} claims</div>
                  <div className="text-sm text-muted-foreground">per month average</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">+15.3%</div>
                  <div className="text-lg text-muted-foreground">Year over year</div>
                  <div className="text-sm text-muted-foreground">earnings growth</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`text-xs flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                      {metric.change} from last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track your key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Completion Time Trend</h4>
                      <div className="text-2xl font-bold text-green-600">3.2 days</div>
                      <div className="text-sm text-muted-foreground">Average completion time</div>
                      <div className="text-xs text-green-600">-0.5 days improvement</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Client Satisfaction</h4>
                      <div className="text-2xl font-bold text-blue-600">4.7/5</div>
                      <div className="text-sm text-muted-foreground">Average rating</div>
                      <div className="text-xs text-green-600">+0.2 improvement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="firms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Firm Performance Comparison</CardTitle>
                <CardDescription>Compare your performance across different IA firms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {firmPerformance.map((firm, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{firm.firm}</h3>
                        <Badge variant="outline">{firm.claims} claims</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Earnings:</span>
                          <div className="font-semibold text-green-600">${firm.earnings.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Rating:</span>
                          <div className="font-semibold text-blue-600">{firm.avgRating}/5</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Efficiency:</span>
                          <div className="font-semibold text-purple-600">{firm.efficiency}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg per Claim:</span>
                          <div className="font-semibold">${Math.round(firm.earnings / firm.claims)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="territory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Territory Performance</CardTitle>
                <CardDescription>Performance breakdown by geographic territory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {territoryData.map((territory, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{territory.state}</h3>
                        <Badge variant="outline">{territory.claims} claims</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Earnings:</span>
                          <div className="font-semibold text-green-600">${territory.earnings.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg per Claim:</span>
                          <div className="font-semibold text-blue-600">
                            ${Math.round(territory.earnings / territory.claims)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Share:</span>
                          <div className="font-semibold text-purple-600">
                            {Math.round((territory.claims / totalClaims) * 100)}%
                          </div>
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
