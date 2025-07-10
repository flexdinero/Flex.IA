"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Globe,
  Shield,
  Activity,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function FirmsPage() {
  const [showAddFirm, setShowAddFirm] = useState(false)
  const [selectedFirm, setSelectedFirm] = useState<any>(null)
  const [newFirm, setNewFirm] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
    apiKey: "",
    syncEnabled: true,
    syncInterval: "60",
  })

  const firms = [
    {
      id: 1,
      name: "Crawford & Company",
      url: "https://portal.crawford.com",
      status: "Connected",
      lastSync: "2 minutes ago",
      nextSync: "58 minutes",
      claims: 8,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "Web Scraping",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: false,
      },
      stats: {
        totalClaims: 156,
        activeClaims: 8,
        completedClaims: 148,
        avgResponseTime: "2.3 hours",
        successRate: 98.5,
      },
      lastError: null,
    },
    {
      id: 2,
      name: "Sedgwick",
      url: "https://claims.sedgwick.com",
      status: "Connected",
      lastSync: "5 minutes ago",
      nextSync: "55 minutes",
      claims: 6,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "API",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: true,
      },
      stats: {
        totalClaims: 89,
        activeClaims: 6,
        completedClaims: 83,
        avgResponseTime: "1.8 hours",
        successRate: 99.2,
      },
      lastError: null,
    },
    {
      id: 3,
      name: "Pilot Catastrophe",
      url: "https://portal.pilotcat.com",
      status: "Connected",
      lastSync: "1 minute ago",
      nextSync: "59 minutes",
      claims: 4,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "Web Scraping",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: false,
      },
      stats: {
        totalClaims: 67,
        activeClaims: 4,
        completedClaims: 63,
        avgResponseTime: "3.1 hours",
        successRate: 97.8,
      },
      lastError: null,
    },
    {
      id: 4,
      name: "Eberl Claims",
      url: "https://portal.eberlclaims.com",
      status: "Syncing",
      lastSync: "Syncing...",
      nextSync: "In progress",
      claims: 3,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "Web Scraping",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: false,
      },
      stats: {
        totalClaims: 45,
        activeClaims: 3,
        completedClaims: 42,
        avgResponseTime: "2.7 hours",
        successRate: 96.4,
      },
      lastError: null,
    },
    {
      id: 5,
      name: "ESIS",
      url: "https://portal.esis.com",
      status: "Connected",
      lastSync: "3 minutes ago",
      nextSync: "57 minutes",
      claims: 2,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "API",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: true,
      },
      stats: {
        totalClaims: 34,
        activeClaims: 2,
        completedClaims: 32,
        avgResponseTime: "1.5 hours",
        successRate: 99.8,
      },
      lastError: null,
    },
    {
      id: 6,
      name: "Gallagher Bassett",
      url: "https://portal.gb.com",
      status: "Error",
      lastSync: "1 hour ago",
      nextSync: "Retrying in 15 min",
      claims: 0,
      syncEnabled: true,
      syncInterval: 60,
      connectionType: "Web Scraping",
      credentials: {
        username: "john.smith@email.com",
        hasPassword: true,
        hasApiKey: false,
      },
      stats: {
        totalClaims: 23,
        activeClaims: 0,
        completedClaims: 23,
        avgResponseTime: "4.2 hours",
        successRate: 94.1,
      },
      lastError: "Authentication failed - password may have expired",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Syncing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Disabled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "Error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Disabled":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const handleAddFirm = () => {
    // Simulate adding firm
    console.log("Adding firm:", newFirm)
    setShowAddFirm(false)
    setNewFirm({
      name: "",
      url: "",
      username: "",
      password: "",
      apiKey: "",
      syncEnabled: true,
      syncInterval: "60",
    })
  }

  const handleTestConnection = (firmId: number) => {
    console.log("Testing connection for firm:", firmId)
  }

  const handleSyncNow = (firmId: number) => {
    console.log("Syncing firm:", firmId)
  }

  const handleDeleteFirm = (firmId: number) => {
    console.log("Deleting firm:", firmId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Connected Firms</h1>
            <p className="text-muted-foreground">Manage your IA firm connections and sync settings</p>
          </div>
          <Dialog open={showAddFirm} onOpenChange={setShowAddFirm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Firm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Firm</DialogTitle>
                <DialogDescription>Connect a new IA firm to your dashboard</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input
                    id="firmName"
                    placeholder="e.g., Crawford & Company"
                    value={newFirm.name}
                    onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmUrl">Portal URL</Label>
                  <Input
                    id="firmUrl"
                    placeholder="https://portal.example.com"
                    value={newFirm.url}
                    onChange={(e) => setNewFirm({ ...newFirm, url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username/Email</Label>
                  <Input
                    id="username"
                    placeholder="your.email@example.com"
                    value={newFirm.username}
                    onChange={(e) => setNewFirm({ ...newFirm, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your portal password"
                    value={newFirm.password}
                    onChange={(e) => setNewFirm({ ...newFirm, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    placeholder="API key if available"
                    value={newFirm.apiKey}
                    onChange={(e) => setNewFirm({ ...newFirm, apiKey: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="syncEnabled"
                    checked={newFirm.syncEnabled}
                    onCheckedChange={(checked) => setNewFirm({ ...newFirm, syncEnabled: checked })}
                  />
                  <Label htmlFor="syncEnabled">Enable automatic sync</Label>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>Your credentials are encrypted with AES-256 and stored securely.</AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddFirm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFirm}>Add Firm</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats - Moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{firms.length}</div>
              <p className="text-xs text-muted-foreground">
                {firms.filter((f) => f.status === "Connected").length} connected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{firms.reduce((sum, firm) => sum + firm.claims, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all firms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(firms.reduce((sum, firm) => sum + firm.stats.successRate, 0) / firms.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">All time average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{firms.filter((f) => f.status === "Error").length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Firms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {firms.map((firm) => (
            <Card key={firm.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{firm.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {firm.url}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(firm.status)}>
                    {getStatusIcon(firm.status)}
                    <span className="ml-1">{firm.status}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Connection Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Connection Type:</span>
                    <div className="font-medium">{firm.connectionType}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Claims:</span>
                    <div className="font-medium">{firm.claims}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Sync:</span>
                    <div className="font-medium">{firm.lastSync}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Sync:</span>
                    <div className="font-medium">{firm.nextSync}</div>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{firm.stats.successRate}%</span>
                  </div>
                  <Progress value={firm.stats.successRate} className="h-2" />
                </div>

                {/* Error Alert */}
                {firm.lastError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{firm.lastError}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedFirm(firm)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {selectedFirm?.name}
                        </DialogTitle>
                        <DialogDescription>Detailed information and statistics</DialogDescription>
                      </DialogHeader>

                      {selectedFirm && (
                        <div className="space-y-6">
                          {/* Connection Details */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Connection Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <Badge className={getStatusColor(selectedFirm.status)} size="sm">
                                    {selectedFirm.status}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="font-medium">Connection Type:</span>
                                  <div>{selectedFirm.connectionType}</div>
                                </div>
                                <div>
                                  <span className="font-medium">Username:</span>
                                  <div>{selectedFirm.credentials.username}</div>
                                </div>
                                <div>
                                  <span className="font-medium">Sync Interval:</span>
                                  <div>{selectedFirm.syncInterval} minutes</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Statistics */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-primary">
                                    {selectedFirm.stats.totalClaims}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Total Claims</div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    {selectedFirm.stats.activeClaims}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Active Claims</div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {selectedFirm.stats.completedClaims}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Completed</div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {selectedFirm.stats.avgResponseTime}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Avg Response</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Actions */}
                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => handleTestConnection(selectedFirm.id)}>
                              Test Connection
                            </Button>
                            <Button variant="outline" onClick={() => handleSyncNow(selectedFirm.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </Button>
                            <Button variant="outline">
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncNow(firm.id)}
                    disabled={firm.status === "Syncing"}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${firm.status === "Syncing" ? "animate-spin" : ""}`} />
                    Sync
                  </Button>

                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
