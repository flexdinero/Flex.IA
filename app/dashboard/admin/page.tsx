"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Settings,
  Database,
  Server,
  DollarSign,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showAddUser, setShowAddUser] = useState(false)

  // Mock admin data
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalClaims: 15678,
    activeClaims: 3456,
    totalFirms: 45,
    connectedFirms: 42,
    monthlyRevenue: 127890,
    yearlyRevenue: 1534680,
    churnRate: 3.2,
    avgRevenuePerUser: 97,
    newSignupsToday: 12,
    newSignupsThisMonth: 234,
    activeSubscriptions: 892,
    cancelledSubscriptions: 45,
    trialUsers: 156,
    conversionRate: 68.5,
    systemUptime: "99.9%",
    avgResponseTime: "245ms",
  }

  const salesData = [
    { month: 'Jan', revenue: 89450, signups: 156, churn: 12 },
    { month: 'Feb', revenue: 95230, signups: 178, churn: 15 },
    { month: 'Mar', revenue: 102890, signups: 203, churn: 18 },
    { month: 'Apr', revenue: 118760, signups: 234, churn: 22 },
    { month: 'May', revenue: 127890, signups: 267, churn: 19 },
    { month: 'Jun', revenue: 134560, signups: 289, churn: 25 }
  ]

  const recentSignups = [
    { id: 1, name: 'John Smith', email: 'john@example.com', plan: 'Monthly', amount: 97, date: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Yearly', amount: 984, date: '2024-01-15', status: 'Active' },
    { id: 3, name: 'Mike Rodriguez', email: 'mike@example.com', plan: 'Monthly', amount: 97, date: '2024-01-14', status: 'Trial' },
    { id: 4, name: 'Emily Chen', email: 'emily@example.com', plan: 'Yearly', amount: 984, date: '2024-01-14', status: 'Active' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', plan: 'Monthly', amount: 97, date: '2024-01-13', status: 'Cancelled' }
  ]

  const waitlistData = [
    { id: 1, email: 'adjuster1@example.com', source: 'ai-automation', date: '2024-01-15', status: 'pending' },
    { id: 2, email: 'adjuster2@example.com', source: 'ai-automation', date: '2024-01-14', status: 'contacted' },
    { id: 3, email: 'adjuster3@example.com', source: 'ai-automation', date: '2024-01-13', status: 'converted' }
  ]

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      role: "Adjuster",
      status: "Active",
      lastLogin: "2024-01-15 09:30 AM",
      claimsCount: 156,
      earnings: 127500,
      joinDate: "2023-03-15",
      subscription: "Professional",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "Adjuster",
      status: "Active",
      lastLogin: "2024-01-15 08:45 AM",
      claimsCount: 89,
      earnings: 78900,
      joinDate: "2023-06-22",
      subscription: "Starter",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike.r@email.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15 10:15 AM",
      claimsCount: 0,
      earnings: 0,
      joinDate: "2022-11-10",
      subscription: "Enterprise",
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      role: "Adjuster",
      status: "Suspended",
      lastLogin: "2024-01-10 02:30 PM",
      claimsCount: 234,
      earnings: 189000,
      joinDate: "2022-08-05",
      subscription: "Professional",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@email.com",
      role: "Adjuster",
      status: "Inactive",
      lastLogin: "2023-12-20 11:20 AM",
      claimsCount: 67,
      earnings: 45600,
      joinDate: "2023-09-12",
      subscription: "Starter",
    },
  ]

  const firms = [
    {
      id: 1,
      name: "Crawford & Company",
      status: "Active",
      connectedUsers: 234,
      totalClaims: 5678,
      avgResponseTime: "2.1 hours",
      successRate: 98.5,
      lastSync: "2 minutes ago",
    },
    {
      id: 2,
      name: "Sedgwick",
      status: "Active",
      connectedUsers: 189,
      totalClaims: 4321,
      avgResponseTime: "1.8 hours",
      successRate: 99.2,
      lastSync: "5 minutes ago",
    },
    {
      id: 3,
      name: "Pilot Catastrophe",
      status: "Active",
      connectedUsers: 156,
      totalClaims: 3456,
      avgResponseTime: "3.2 hours",
      successRate: 97.8,
      lastSync: "1 minute ago",
    },
    {
      id: 4,
      name: "Eberl Claims",
      status: "Warning",
      connectedUsers: 98,
      totalClaims: 2134,
      avgResponseTime: "4.1 hours",
      successRate: 94.1,
      lastSync: "1 hour ago",
    },
    {
      id: 5,
      name: "ESIS",
      status: "Active",
      connectedUsers: 67,
      totalClaims: 1890,
      avgResponseTime: "1.5 hours",
      successRate: 99.8,
      lastSync: "3 minutes ago",
    },
  ]

  const systemLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 10:30:15",
      level: "INFO",
      message: "User john.smith@email.com logged in successfully",
      source: "Authentication",
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:28:42",
      level: "WARNING",
      message: "High API response time detected for Eberl Claims (4.2s)",
      source: "Firm Sync",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:25:33",
      level: "ERROR",
      message: "Failed to sync claims from Gallagher Bassett - Authentication failed",
      source: "Firm Sync",
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:20:18",
      level: "INFO",
      message: "Scheduled backup completed successfully",
      source: "System",
    },
    {
      id: 5,
      timestamp: "2024-01-15 10:15:07",
      level: "INFO",
      message: "New claim CLM-2024-1567 created for Crawford & Company",
      source: "Claims",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "ERROR":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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

  const handleSuspendUser = (userId: number) => {
    console.log("Suspending user:", userId)
  }

  const handleDeleteUser = (userId: number) => {
    console.log("Deleting user:", userId)
  }

  const handleRestartService = (service: string) => {
    console.log("Restarting service:", service)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">System administration and user management</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">Total Users</CardTitle>
              <Users className="h-3 w-3 text-blue-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground truncate">{systemStats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">Total Claims</CardTitle>
              <Activity className="h-3 w-3 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{systemStats.totalClaims.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground truncate">{systemStats.activeClaims.toLocaleString()} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">Connected Firms</CardTitle>
              <Shield className="h-3 w-3 text-purple-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{systemStats.connectedFirms}</div>
              <p className="text-xs text-muted-foreground truncate">of {systemStats.totalFirms} total firms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
              <CardTitle className="text-xs font-medium truncate">System Uptime</CardTitle>
              <Server className="h-3 w-3 text-orange-600 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold">{systemStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground truncate">{systemStats.avgResponseTime} avg response</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <div className="w-full">
            <TabsList className="grid grid-cols-8 w-full h-6">
              <TabsTrigger value="dashboard" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Sales</span>
                <span className="sm:hidden">Sales</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Customers</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Subscriptions</span>
                <span className="sm:hidden">Subs</span>
              </TabsTrigger>
              <TabsTrigger value="waitlist" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Waitlist</span>
                <span className="sm:hidden">Wait</span>
              </TabsTrigger>
              <TabsTrigger value="firms" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Firms</span>
                <span className="sm:hidden">Firms</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">System</span>
                <span className="sm:hidden">System</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs px-0.5 py-0.5 h-5">
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(systemStats.monthlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Signups</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{systemStats.newSignupsToday}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.newSignupsThisMonth} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{systemStats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Trial to paid conversion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{systemStats.churnRate}%</div>
                  <p className="text-xs text-muted-foreground">Monthly churn rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Signups</CardTitle>
                  <CardDescription>Latest customer acquisitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSignups.slice(0, 5).map((signup) => (
                      <div key={signup.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{signup.name}</p>
                          <p className="text-sm text-muted-foreground">{signup.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(signup.amount)}</p>
                          <Badge variant={signup.status === 'Active' ? 'default' : signup.status === 'Trial' ? 'secondary' : 'destructive'}>
                            {signup.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.slice(-6).map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{data.month}</p>
                          <p className="text-sm text-muted-foreground">{data.signups} signups</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(data.revenue)}</p>
                          <p className="text-sm text-muted-foreground">{data.churn} churned</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Revenue and signup trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Signups</TableHead>
                        <TableHead>Churn</TableHead>
                        <TableHead>Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((data, index) => {
                        const prevRevenue = index > 0 ? salesData[index - 1].revenue : data.revenue
                        const growth = ((data.revenue - prevRevenue) / prevRevenue * 100).toFixed(1)
                        return (
                          <TableRow key={data.month}>
                            <TableCell className="font-medium">{data.month}</TableCell>
                            <TableCell>{formatCurrency(data.revenue)}</TableCell>
                            <TableCell>{data.signups}</TableCell>
                            <TableCell>{data.churn}</TableCell>
                            <TableCell className={index > 0 ? (parseFloat(growth) > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                              {index > 0 ? `${growth}%` : '-'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Current performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">ARPU</span>
                      <span className="font-medium">{formatCurrency(systemStats.avgRevenuePerUser)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium">{systemStats.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${systemStats.conversionRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Churn Rate</span>
                      <span className="font-medium">{systemStats.churnRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${systemStats.churnRate * 10}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="userName">Full Name</Label>
                          <Input id="userName" placeholder="John Smith" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userEmail">Email</Label>
                          <Input id="userEmail" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userRole">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adjuster">Adjuster</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userSubscription">Subscription</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowAddUser(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setShowAddUser(false)}>Create User</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.claimsCount}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(user.earnings)}</TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
                                  <DialogDescription>Complete user information and activity</DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Email</Label>
                                        <div className="font-medium">{selectedUser.email}</div>
                                      </div>
                                      <div>
                                        <Label>Role</Label>
                                        <div className="font-medium">{selectedUser.role}</div>
                                      </div>
                                      <div>
                                        <Label>Status</Label>
                                        <Badge className={getStatusColor(selectedUser.status)}>
                                          {selectedUser.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label>Subscription</Label>
                                        <div className="font-medium">{selectedUser.subscription}</div>
                                      </div>
                                      <div>
                                        <Label>Join Date</Label>
                                        <div className="font-medium">{selectedUser.joinDate}</div>
                                      </div>
                                      <div>
                                        <Label>Last Login</Label>
                                        <div className="font-medium">{selectedUser.lastLogin}</div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold">{selectedUser.claimsCount}</div>
                                        <div className="text-sm text-muted-foreground">Total Claims</div>
                                      </div>
                                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <div className="text-2xl font-bold">
                                          {formatCurrency(selectedUser.earnings)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Total Earnings</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === "Active" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-yellow-600"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="firms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Firm Management</CardTitle>
                <CardDescription>Monitor and manage connected IA firms</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firm</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firms.map((firm) => (
                      <TableRow key={firm.id}>
                        <TableCell className="font-medium">{firm.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(firm.status)}>{firm.status}</Badge>
                        </TableCell>
                        <TableCell>{firm.connectedUsers}</TableCell>
                        <TableCell>{firm.totalClaims.toLocaleString()}</TableCell>
                        <TableCell>{firm.avgResponseTime}</TableCell>
                        <TableCell>{firm.successRate}%</TableCell>
                        <TableCell className="text-sm">{firm.lastSync}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Monitor system performance and health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Database</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>API Services</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>Firm Sync Service</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Notification Service</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                  <CardDescription>Perform system maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Restart Firm Sync</div>
                      <div className="text-sm text-muted-foreground">Restart the firm synchronization service</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRestartService("firm-sync")}>
                      Restart
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Clear Cache</div>
                      <div className="text-sm text-muted-foreground">Clear application cache</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Clear
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Database Backup</div>
                      <div className="text-sm text-muted-foreground">Create manual database backup</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Backup
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">System Maintenance</div>
                      <div className="text-sm text-muted-foreground">Enable maintenance mode</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>Monitor system activity and errors</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Errors</SelectItem>
                        <SelectItem value="warning">Warnings</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge className={getLogLevelColor(log.level)} size="sm">
                        {log.level}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{log.message}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.timestamp} • {log.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Maximum Users</Label>
                    <Input id="maxUsers" type="number" defaultValue="2000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                    <Input id="syncInterval" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-muted-foreground">Enable system maintenance mode</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Debug Logging</div>
                      <div className="text-sm text-muted-foreground">Enable detailed debug logs</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input id="passwordMinLength" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input id="lockoutDuration" type="number" defaultValue="30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Require 2FA</div>
                      <div className="text-sm text-muted-foreground">Require two-factor authentication</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">IP Whitelist</div>
                      <div className="text-sm text-muted-foreground">Enable IP address restrictions</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Manage system backups and recovery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">Daily</div>
                    <div className="text-sm text-muted-foreground">Backup Frequency</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">30</div>
                    <div className="text-sm text-muted-foreground">Retention Days</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">2.3 GB</div>
                    <div className="text-sm text-muted-foreground">Last Backup Size</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
