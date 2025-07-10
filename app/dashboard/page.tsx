"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Award,
  Target,
  MessageSquare,
  Vault,
  Plus,
  ArrowRight,
  Trophy,
  Zap,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  // Mock data
  const stats = {
    totalEarnings: 156750,
    monthlyEarnings: 18500,
    totalClaims: 247,
    activeClaims: 12,
    completedClaims: 235,
    averageRating: 4.8,
    completionRate: 98.5,
    responseTime: 2.3,
  }

  const recentClaims = [
    {
      id: "CLM-2024-001",
      firm: "Crawford & Company",
      type: "Property Damage",
      location: "Houston, TX",
      amount: "$2,500",
      status: "Available",
      priority: "High",
      deadline: "2024-01-15",
    },
    {
      id: "CLM-2024-002",
      firm: "Sedgwick",
      type: "Auto Collision",
      location: "Dallas, TX",
      amount: "$1,800",
      status: "In Progress",
      priority: "Medium",
      deadline: "2024-01-18",
    },
    {
      id: "CLM-2024-003",
      firm: "Pilot Catastrophe",
      type: "Storm Damage",
      location: "Austin, TX",
      amount: "$3,200",
      status: "Available",
      priority: "High",
      deadline: "2024-01-12",
    },
  ]

  const recentMessages = [
    {
      id: 1,
      from: "Sarah Johnson",
      firm: "Crawford & Company",
      message: "The property inspection report looks great. We'll process the payment by Friday.",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      from: "Mike Rodriguez",
      firm: "Sedgwick",
      message: "Thanks for the quick turnaround on the auto claim assessment.",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 3,
      from: "Lisa Chen",
      firm: "Pilot Catastrophe",
      message: "Storm season is approaching. Are you available for deployment?",
      time: "3 hours ago",
      unread: true,
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: "Property Inspection - Houston",
      type: "Inspection",
      time: "Tomorrow 9:00 AM",
      location: "1234 Main St, Houston, TX",
      priority: "High",
    },
    {
      id: 2,
      title: "Submit Final Report - CLM-2024-002",
      type: "Report",
      time: "Today 5:00 PM",
      location: "Remote",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Client Meeting - Storm Damage Assessment",
      type: "Meeting",
      time: "Friday 2:00 PM",
      location: "Austin, TX",
      priority: "High",
    },
  ]

  const quickActions = [
    {
      title: "View Available Claims",
      description: "Browse and claim new assignments",
      icon: FileText,
      href: "/dashboard/claims",
      color: "bg-blue-500",
      count: 8,
    },
    {
      title: "Check Messages",
      description: "Review communications from firms",
      icon: MessageSquare,
      href: "/dashboard/messages",
      color: "bg-green-500",
      count: 3,
    },
    {
      title: "Update Calendar",
      description: "Schedule inspections and meetings",
      icon: Calendar,
      href: "/dashboard/calendar",
      color: "bg-purple-500",
      count: 6,
    },
    {
      title: "Access Vault",
      description: "Manage documents and contracts",
      icon: Vault,
      href: "/dashboard/vault",
      color: "bg-orange-500",
      count: 2,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your adjuster business today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              New Claim Request
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeClaims}</div>
              <div className="text-xs text-muted-foreground">{stats.totalClaims} total claims handled</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}/5</div>
              <div className="text-xs text-muted-foreground">Based on {stats.completedClaims} completed claims</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Avg response time: {stats.responseTime} days</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to your most important tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="group relative p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-primary/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      {action.count > 0 && <Badge className="bg-red-500 text-white">{action.count}</Badge>}
                    </div>
                    <ArrowRight className="absolute top-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Claims */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Latest claim assignments and updates</CardDescription>
              </div>
              <Link href="/dashboard/claims">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{claim.id}</h3>
                        <p className="text-sm text-muted-foreground">{claim.firm}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                        <Badge className={getPriorityColor(claim.priority)}>{claim.priority}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span>{claim.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{claim.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-green-600">{claim.amount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>Due: {claim.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest communications from IA firms</CardDescription>
              </div>
              <Link href="/dashboard/messages">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={message.from} />
                        <AvatarFallback>
                          {message.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{message.from}</span>
                            {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{message.firm}</p>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your scheduled inspections and deadlines</CardDescription>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="outline" size="sm">
                View Calendar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.type}</p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{task.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{task.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyEarnings.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Monthly earnings</div>
              <Progress value={75} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">75% of monthly goal</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <div className="text-xs text-muted-foreground">Task completion rate</div>
              <Progress value={94} className="mt-2" />
              <div className="text-xs text-green-600 mt-1">+5% from last month</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="text-xs text-muted-foreground">Average client rating</div>
              <Progress value={96} className="mt-2" />
              <div className="text-xs text-green-600 mt-1">Excellent performance</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
