"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Building,
  Star,
  Activity,
  BarChart3,
  ArrowRight
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalFeedback: number
  openTickets: number
  resolvedTickets: number
  totalRevenue: number
  monthlyRevenue: number
  avgRating: number
  totalClaims: number
  activeClaims: number
  completedClaims: number
}

interface RecentActivity {
  id: string
  type: 'user_signup' | 'feedback' | 'payment' | 'claim' | 'system'
  description: string
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'success'
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalFeedback: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgRating: 0,
    totalClaims: 0,
    activeClaims: 0,
    completedClaims: 0
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        newUsersToday: 23,
        totalFeedback: 156,
        openTickets: 12,
        resolvedTickets: 144,
        totalRevenue: 89750,
        monthlyRevenue: 12450,
        avgRating: 4.6,
        totalClaims: 3421,
        activeClaims: 287,
        completedClaims: 3134
      })

      setRecentActivity([
        {
          id: "1",
          type: "feedback",
          description: "New bug report: Dashboard widgets not loading",
          timestamp: "2 minutes ago",
          severity: "warning"
        },
        {
          id: "2",
          type: "user_signup",
          description: "New user registration: john.doe@example.com",
          timestamp: "15 minutes ago",
          severity: "success"
        },
        {
          id: "3",
          type: "payment",
          description: "Payment received: $99.00 from Sarah Johnson",
          timestamp: "1 hour ago",
          severity: "success"
        },
        {
          id: "4",
          type: "claim",
          description: "Claim CLM-2024-001 marked as completed",
          timestamp: "2 hours ago",
          severity: "info"
        },
        {
          id: "5",
          type: "system",
          description: "Database backup completed successfully",
          timestamp: "3 hours ago",
          severity: "info"
        }
      ])
    }, 1000)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="h-4 w-4" />
      case 'feedback': return <MessageSquare className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'claim': return <FileText className="h-4 w-4" />
      case 'system': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of system performance and user activity.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg sm:text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.newUsersToday}</span> new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg sm:text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg sm:text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg sm:text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Based on user feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Tickets</span>
                <span className="font-medium">{stats.totalFeedback}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Open Tickets</span>
                <Badge variant="destructive">{stats.openTickets}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolved</span>
                <Badge variant="secondary">{stats.resolvedTickets}</Badge>
              </div>
              <Link href="/admin/feedback">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Feedback
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Claims Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Claims</span>
                <span className="font-medium">{stats.totalClaims.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <Badge variant="default">{stats.activeClaims}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="secondary">{stats.completedClaims.toLocaleString()}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Analytics
                <BarChart3 className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Revenue</span>
                <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month</span>
                <Badge variant="default">${stats.monthlyRevenue.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Growth</span>
                <Badge variant="secondary" className="text-green-600">+12.5%</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Payment Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`p-1 rounded ${getActivityColor(activity.severity)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
