"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, Target, FileText, Award, AlertTriangle, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("earnings")

  // Comprehensive analytics data
  const performanceMetrics = {
    earnings: {
      current: 12450,
      previous: 10800,
      growth: 15.3,
      target: 15000,
      ytd: 127500,
    },
    claims: {
      current: 24,
      previous: 21,
      growth: 14.3,
      target: 30,
      ytd: 285,
    },
    efficiency: {
      current: 92.5,
      previous: 89.2,
      growth: 3.7,
      target: 95,
      avgDaysToComplete: 4.2,
    },
    satisfaction: {
      current: 4.8,
      previous: 4.6,
      growth: 4.3,
      target: 4.9,
      totalReviews: 156,
    },
  }

  const monthlyTrends = [
    { month: "Jul", earnings: 8900, claims: 18, efficiency: 88, satisfaction: 4.5 },
    { month: "Aug", earnings: 9800, claims: 22, efficiency: 90, satisfaction: 4.6 },
    { month: "Sep", earnings: 11200, claims: 25, efficiency: 91, satisfaction: 4.7 },
    { month: "Oct", earnings: 10800, claims: 21, efficiency: 89, satisfaction: 4.6 },
    { month: "Nov", earnings: 12450, claims: 24, efficiency: 92, satisfaction: 4.8 },
    { month: "Dec", earnings: 13200, claims: 26, efficiency: 93, satisfaction: 4.9 },
  ]

  const firmPerformance = [
    {
      firm: "Crawford & Company",
      claims: 89,
      earnings: 45600,
      avgPayout: 512,
      efficiency: 94,
      satisfaction: 4.9,
      growth: 18.5,
      responseTime: "2.1 hours",
    },
    {
      firm: "Sedgwick",
      claims: 108,
      earnings: 32400,
      avgPayout: 300,
      efficiency: 91,
      satisfaction: 4.7,
      growth: 12.3,
      responseTime: "1.8 hours",
    },
    {
      firm: "Pilot Catastrophe",
      claims: 41,
      earnings: 28700,
      avgPayout: 700,
      efficiency: 96,
      satisfaction: 4.8,
      growth: 25.7,
      responseTime: "3.2 hours",
    },
    {
      firm: "Eberl Claims",
      claims: 28,
      earnings: 15200,
      avgPayout: 543,
      efficiency: 88,
      satisfaction: 4.6,
      growth: -5.2,
      responseTime: "4.1 hours",
    },
    {
      firm: "ESIS",
      claims: 19,
      earnings: 5600,
      avgPayout: 295,
      efficiency: 89,
      satisfaction: 4.5,
      growth: 8.9,
      responseTime: "1.5 hours",
    },
  ]

  const claimTypeAnalysis = [
    {
      type: "Property Damage",
      count: 89,
      earnings: 45600,
      avgPayout: 512,
      avgDays: 4.2,
      satisfaction: 4.8,
      trend: 12.5,
    },
    {
      type: "Auto Collision",
      count: 108,
      earnings: 32400,
      avgPayout: 300,
      avgDays: 3.1,
      satisfaction: 4.6,
      trend: 8.3,
    },
    {
      type: "Storm Damage",
      count: 41,
      earnings: 28700,
      avgPayout: 700,
      avgDays: 5.8,
      satisfaction: 4.9,
      trend: 22.1,
    },
    {
      type: "Fire Damage",
      count: 28,
      earnings: 15200,
      avgPayout: 543,
      avgDays: 6.2,
      satisfaction: 4.7,
      trend: 15.7,
    },
    {
      type: "Liability",
      count: 19,
      earnings: 5600,
      avgPayout: 295,
      avgDays: 2.8,
      satisfaction: 4.4,
      trend: -3.2,
    },
  ]

  const timeAnalysis = {
    peakHours: [
      { hour: "9:00 AM", claims: 12, efficiency: 95 },
      { hour: "10:00 AM", claims: 15, efficiency: 92 },
      { hour: "11:00 AM", claims: 18, efficiency: 89 },
      { hour: "2:00 PM", claims: 14, efficiency: 91 },
      { hour: "3:00 PM", claims: 11, efficiency: 94 },
    ],
    peakDays: [
      { day: "Monday", claims: 45, efficiency: 88 },
      { day: "Tuesday", claims: 52, efficiency: 91 },
      { day: "Wednesday", claims: 48, efficiency: 93 },
      { day: "Thursday", claims: 41, efficiency: 89 },
      { day: "Friday", claims: 38, efficiency: 87 },
    ],
    seasonalTrends: [
      { season: "Spring", claims: 78, avgPayout: 485, types: ["Storm", "Property"] },
      { season: "Summer", claims: 65, avgPayout: 420, types: ["Auto", "Liability"] },
      { season: "Fall", claims: 89, avgPayout: 520, types: ["Property", "Fire"] },
      { season: "Winter", claims: 53, avgPayout: 380, types: ["Auto", "Property"] },
    ],
  }

  const competitiveAnalysis = {
    industryAverage: {
      claimsPerMonth: 18.5,
      avgPayout: 425,
      efficiency: 85,
      satisfaction: 4.3,
    },
    yourPerformance: {
      claimsPerMonth: 23.75,
      avgPayout: 447,
      efficiency: 92.5,
      satisfaction: 4.8,
    },
    ranking: {
      earnings: { position: 12, outOf: 150, percentile: 92 },
      efficiency: { position: 8, outOf: 150, percentile: 95 },
      satisfaction: { position: 5, outOf: 150, percentile: 97 },
    },
  }

  const forecasting = {
    nextMonth: {
      expectedClaims: 28,
      expectedEarnings: 14200,
      confidence: 87,
    },
    nextQuarter: {
      expectedClaims: 82,
      expectedEarnings: 41500,
      confidence: 78,
    },
    yearEnd: {
      expectedClaims: 340,
      expectedEarnings: 152000,
      confidence: 72,
    },
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

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive performance analytics and business insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
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

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(performanceMetrics.earnings.current)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(performanceMetrics.earnings.growth)}
                <span className={`ml-1 ${getGrowthColor(performanceMetrics.earnings.growth)}`}>
                  {formatPercentage(performanceMetrics.earnings.growth)}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <div className="mt-2">
                <Progress
                  value={(performanceMetrics.earnings.current / performanceMetrics.earnings.target) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {((performanceMetrics.earnings.current / performanceMetrics.earnings.target) * 100).toFixed(0)}% of
                  target
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Claims Processed</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.claims.current}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(performanceMetrics.claims.growth)}
                <span className={`ml-1 ${getGrowthColor(performanceMetrics.claims.growth)}`}>
                  {formatPercentage(performanceMetrics.claims.growth)}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <div className="mt-2">
                <Progress
                  value={(performanceMetrics.claims.current / performanceMetrics.claims.target) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {((performanceMetrics.claims.current / performanceMetrics.claims.target) * 100).toFixed(0)}% of target
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.efficiency.current}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(performanceMetrics.efficiency.growth)}
                <span className={`ml-1 ${getGrowthColor(performanceMetrics.efficiency.growth)}`}>
                  {formatPercentage(performanceMetrics.efficiency.growth)}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <div className="mt-2">
                <Progress value={performanceMetrics.efficiency.current} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  Avg {performanceMetrics.efficiency.avgDaysToComplete} days to complete
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.satisfaction.current}/5.0</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(performanceMetrics.satisfaction.growth)}
                <span className={`ml-1 ${getGrowthColor(performanceMetrics.satisfaction.growth)}`}>
                  {formatPercentage(performanceMetrics.satisfaction.growth)}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <div className="mt-2">
                <Progress value={(performanceMetrics.satisfaction.current / 5) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  Based on {performanceMetrics.satisfaction.totalReviews} reviews
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="firms">Firms</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>6-month performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((month, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{month.month}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(month.earnings)}</div>
                            <div className="text-sm text-muted-foreground">{month.claims} claims</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Efficiency</span>
                              <span>{month.efficiency}%</span>
                            </div>
                            <Progress value={month.efficiency} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Satisfaction</span>
                              <span>{month.satisfaction}/5</span>
                            </div>
                            <Progress value={(month.satisfaction / 5) * 100} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goal Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Progress</CardTitle>
                  <CardDescription>Track your monthly and yearly targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Monthly Earnings Goal</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(performanceMetrics.earnings.current)} /{" "}
                        {formatCurrency(performanceMetrics.earnings.target)}
                      </span>
                    </div>
                    <Progress
                      value={(performanceMetrics.earnings.current / performanceMetrics.earnings.target) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Monthly Claims Goal</span>
                      <span className="text-sm text-muted-foreground">
                        {performanceMetrics.claims.current} / {performanceMetrics.claims.target}
                      </span>
                    </div>
                    <Progress
                      value={(performanceMetrics.claims.current / performanceMetrics.claims.target) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Efficiency Goal</span>
                      <span className="text-sm text-muted-foreground">
                        {performanceMetrics.efficiency.current}% / {performanceMetrics.efficiency.target}%
                      </span>
                    </div>
                    <Progress
                      value={(performanceMetrics.efficiency.current / performanceMetrics.efficiency.target) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Satisfaction Goal</span>
                      <span className="text-sm text-muted-foreground">
                        {performanceMetrics.satisfaction.current} / {performanceMetrics.satisfaction.target}
                      </span>
                    </div>
                    <Progress
                      value={(performanceMetrics.satisfaction.current / performanceMetrics.satisfaction.target) * 100}
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="firms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Firm Performance Analysis</CardTitle>
                <CardDescription>Detailed performance metrics by IA firm</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Avg Payout</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firmPerformance.map((firm, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{firm.firm}</TableCell>
                        <TableCell>{firm.claims}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(firm.earnings)}</TableCell>
                        <TableCell>{formatCurrency(firm.avgPayout)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={firm.efficiency} className="w-16 h-2" />
                            <span className="text-sm">{firm.efficiency}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={(firm.satisfaction / 5) * 100} className="w-16 h-2" />
                            <span className="text-sm">{firm.satisfaction}/5</span>
                          </div>
                        </TableCell>
                        <TableCell>{firm.responseTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(firm.growth)}
                            <span className={getGrowthColor(firm.growth)}>{formatPercentage(firm.growth)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Claim Type Analysis</CardTitle>
                <CardDescription>Performance breakdown by claim type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claimTypeAnalysis.map((type, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{type.type}</h3>
                          <div className="text-sm text-muted-foreground">
                            {type.count} claims • {formatCurrency(type.avgPayout)} avg payout
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(type.earnings)}</div>
                          <div className="flex items-center gap-1 text-sm">
                            {getGrowthIcon(type.trend)}
                            <span className={getGrowthColor(type.trend)}>{formatPercentage(type.trend)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Avg Days</div>
                          <div className="font-medium">{type.avgDays}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Satisfaction</div>
                          <div className="font-medium">{type.satisfaction}/5</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Volume</div>
                          <Progress value={(type.count / 150) * 100} className="h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Performance Hours</CardTitle>
                  <CardDescription>Your most productive hours of the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeAnalysis.peakHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium w-20">{hour.hour}</span>
                          <div className="flex-1">
                            <Progress value={(hour.claims / 20) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{hour.claims} claims</div>
                          <div className="text-muted-foreground">{hour.efficiency}% efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Performance by day of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeAnalysis.peakDays.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium w-20">{day.day}</span>
                          <div className="flex-1">
                            <Progress value={(day.claims / 60) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{day.claims} claims</div>
                          <div className="text-muted-foreground">{day.efficiency}% efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>Performance patterns throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {timeAnalysis.seasonalTrends.map((season, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{season.season}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Claims</span>
                          <span className="font-medium">{season.claims}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Payout</span>
                          <span className="font-medium">{formatCurrency(season.avgPayout)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Common Types:</span>
                          <div className="flex gap-1 mt-1">
                            {season.types.map((type, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Comparison</CardTitle>
                  <CardDescription>How you compare to industry averages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Claims per Month</span>
                      <div className="text-right">
                        <div className="font-semibold">{competitiveAnalysis.yourPerformance.claimsPerMonth}</div>
                        <div className="text-sm text-muted-foreground">
                          vs {competitiveAnalysis.industryAverage.claimsPerMonth} avg
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={(competitiveAnalysis.yourPerformance.claimsPerMonth / 30) * 100}
                        className="h-2"
                      />
                      <Progress
                        value={(competitiveAnalysis.industryAverage.claimsPerMonth / 30) * 100}
                        className="h-2 opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Payout</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(competitiveAnalysis.yourPerformance.avgPayout)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          vs {formatCurrency(competitiveAnalysis.industryAverage.avgPayout)} avg
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={(competitiveAnalysis.yourPerformance.avgPayout / 600) * 100} className="h-2" />
                      <Progress
                        value={(competitiveAnalysis.industryAverage.avgPayout / 600) * 100}
                        className="h-2 opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Efficiency Score</span>
                      <div className="text-right">
                        <div className="font-semibold">{competitiveAnalysis.yourPerformance.efficiency}%</div>
                        <div className="text-sm text-muted-foreground">
                          vs {competitiveAnalysis.industryAverage.efficiency}% avg
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={competitiveAnalysis.yourPerformance.efficiency} className="h-2" />
                      <Progress value={competitiveAnalysis.industryAverage.efficiency} className="h-2 opacity-50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Rankings</CardTitle>
                  <CardDescription>Your position among independent adjusters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">Top 10%</div>
                      <div className="text-sm text-muted-foreground">Overall Performance</div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Earnings Rank</span>
                        <div className="text-right">
                          <div className="font-semibold">
                            #{competitiveAnalysis.ranking.earnings.position} of{" "}
                            {competitiveAnalysis.ranking.earnings.outOf}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {competitiveAnalysis.ranking.earnings.percentile}th percentile
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Efficiency Rank</span>
                        <div className="text-right">
                          <div className="font-semibold">
                            #{competitiveAnalysis.ranking.efficiency.position} of{" "}
                            {competitiveAnalysis.ranking.efficiency.outOf}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {competitiveAnalysis.ranking.efficiency.percentile}th percentile
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Satisfaction Rank</span>
                        <div className="text-right">
                          <div className="font-semibold">
                            #{competitiveAnalysis.ranking.satisfaction.position} of{" "}
                            {competitiveAnalysis.ranking.satisfaction.outOf}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {competitiveAnalysis.ranking.satisfaction.percentile}th percentile
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Next Month Forecast</CardTitle>
                  <CardDescription>Projected performance for next month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(forecasting.nextMonth.expectedEarnings)}</div>
                    <div className="text-sm text-muted-foreground">Expected Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{forecasting.nextMonth.expectedClaims}</div>
                    <div className="text-sm text-muted-foreground">Expected Claims</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-sm">
                      {forecasting.nextMonth.confidence}% Confidence
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Quarter Forecast</CardTitle>
                  <CardDescription>3-month projection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(forecasting.nextQuarter.expectedEarnings)}</div>
                    <div className="text-sm text-muted-foreground">Expected Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{forecasting.nextQuarter.expectedClaims}</div>
                    <div className="text-sm text-muted-foreground">Expected Claims</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-sm">
                      {forecasting.nextQuarter.confidence}% Confidence
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Year-End Forecast</CardTitle>
                  <CardDescription>Full year projection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(forecasting.yearEnd.expectedEarnings)}</div>
                    <div className="text-sm text-muted-foreground">Expected Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{forecasting.yearEnd.expectedClaims}</div>
                    <div className="text-sm text-muted-foreground">Expected Claims</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-sm">
                      {forecasting.yearEnd.confidence}% Confidence
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>AI-powered insights to improve your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Focus on Storm Damage Claims</div>
                      <div className="text-sm text-muted-foreground">
                        Storm damage claims show 22% growth and highest average payout. Consider specializing in this
                        area.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Optimize Tuesday-Wednesday Schedule</div>
                      <div className="text-sm text-muted-foreground">
                        Your efficiency peaks on these days. Consider scheduling more complex claims during this period.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Improve Eberl Claims Performance</div>
                      <div className="text-sm text-muted-foreground">
                        This firm shows -5.2% growth. Consider reviewing processes or renegotiating terms.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Leverage High Satisfaction Scores</div>
                      <div className="text-sm text-muted-foreground">
                        Your 4.8/5 satisfaction rate is excellent. Use this as leverage for better rates and more
                        claims.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
