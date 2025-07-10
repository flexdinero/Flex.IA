"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  Shield,
  Smartphone,
  Mail,
  Calendar,
  Globe,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Key,
  CreditCard,
  Plus,
  Edit,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showCancelSubscription, setShowCancelSubscription] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    licenseNumber: "ADJ123456",
    state: "TX",
    bio: "Experienced independent insurance adjuster specializing in property damage and storm claims.",
    website: "https://johnsmithadjuster.com",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newClaims: true,
    claimUpdates: true,
    paymentAlerts: true,
    firmUpdates: true,
    weeklyReports: true,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowDirectContact: true,
    dataSharing: false,
    analyticsTracking: true,
  })

  const [integrations, setIntegrations] = useState({
    googleCalendar: true,
    outlookCalendar: false,
    quickbooks: false,
    dropbox: true,
    googleDrive: false,
  })

  const [billing, setBilling] = useState({
    currentPlan: "Professional",
    billingCycle: "monthly",
    nextBillingDate: "2024-02-15",
    amount: 79,
    autoRenew: true,
  })

  const connectedDevices = [
    {
      id: 1,
      name: "MacBook Pro",
      type: "Desktop",
      location: "Houston, TX",
      lastActive: "Currently active",
      current: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      type: "Mobile",
      location: "Houston, TX",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      name: "iPad Air",
      type: "Tablet",
      location: "Dallas, TX",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      brand: "Mastercard",
      last4: "8888",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]

  const billingHistory = [
    {
      id: "INV-2024-001",
      date: "Jan 15, 2024",
      amount: 79.0,
      status: "Paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-012",
      date: "Dec 15, 2023",
      amount: 79.0,
      status: "Paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-011",
      date: "Nov 15, 2023",
      amount: 79.0,
      status: "Paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-010",
      date: "Oct 15, 2023",
      amount: 79.0,
      status: "Paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#",
    },
  ]

  const loginHistory = [
    { date: "2024-01-15 09:30 AM", location: "Houston, TX", device: "MacBook Pro", status: "Success" },
    { date: "2024-01-15 07:45 AM", location: "Houston, TX", device: "iPhone 15 Pro", status: "Success" },
    { date: "2024-01-14 06:20 PM", location: "Dallas, TX", device: "iPad Air", status: "Success" },
    { date: "2024-01-14 02:15 PM", location: "Austin, TX", device: "Unknown Device", status: "Blocked" },
    { date: "2024-01-13 11:30 AM", location: "Houston, TX", device: "MacBook Pro", status: "Success" },
  ]

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    // Add success toast here
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications)
    // Add success toast here
  }

  const handleDeleteAccount = () => {
    console.log("Deleting account")
    setShowDeleteDialog(false)
    // Add account deletion logic here
  }

  const handleExportData = () => {
    console.log("Exporting data")
    // Add data export logic here
  }

  const handleRevokeDevice = (deviceId: number) => {
    console.log("Revoking device:", deviceId)
    // Add device revocation logic here
  }

  const handleAddPaymentMethod = () => {
    console.log("Adding payment method")
    setShowAddCard(false)
    // Add payment method logic here
  }

  const handleDeletePaymentMethod = (methodId: number) => {
    console.log("Deleting payment method:", methodId)
    // Add payment method deletion logic here
  }

  const handleChangePlan = (newPlan: string) => {
    console.log("Changing plan to:", newPlan)
    // Add plan change logic here
  }

  const handleCancelSubscription = () => {
    console.log("Cancelling subscription")
    setShowCancelSubscription(false)
    // Add subscription cancellation logic here
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
    // Add invoice download logic here
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-lg">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={profile.state} onValueChange={(value) => setProfile({ ...profile, state: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell others about your experience and specializations..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about important updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive notifications via text message</div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Push Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive browser and mobile push notifications
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">New Claims Available</div>
                        <div className="text-sm text-muted-foreground">Get notified when new claims are posted</div>
                      </div>
                      <Switch
                        checked={notifications.newClaims}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newClaims: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Claim Updates</div>
                        <div className="text-sm text-muted-foreground">Updates on your active claims</div>
                      </div>
                      <Switch
                        checked={notifications.claimUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, claimUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Payment Alerts</div>
                        <div className="text-sm text-muted-foreground">Notifications about payments and invoices</div>
                      </div>
                      <Switch
                        checked={notifications.paymentAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Firm Updates</div>
                        <div className="text-sm text-muted-foreground">Updates from connected IA firms</div>
                      </div>
                      <Switch
                        checked={notifications.firmUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, firmUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Weekly Reports</div>
                        <div className="text-sm text-muted-foreground">Weekly performance and earnings summaries</div>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Marketing Emails</div>
                        <div className="text-sm text-muted-foreground">Product updates and promotional content</div>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>Manage your password and two-factor authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                  </div>
                  <Button>Update Password</Button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>

                  {twoFactorEnabled && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      View Recovery Codes
                    </Button>
                    <Button variant="outline">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Reconfigure Authenticator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Manage devices that have access to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {device.name}
                            {device.current && <Badge variant="secondary">Current</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {device.type} • {device.location} • {device.lastActive}
                          </div>
                        </div>
                      </div>
                      {!device.current && (
                        <Button variant="outline" size="sm" onClick={() => handleRevokeDevice(device.id)}>
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent login activity on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{login.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {login.device} • {login.location}
                        </div>
                      </div>
                      <Badge
                        className={
                          login.status === "Success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {login.status === "Success" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {login.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Visibility */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Who can see your profile?</Label>
                      <Select
                        value={privacy.profileVisibility}
                        onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see</SelectItem>
                          <SelectItem value="firms">IA Firms Only</SelectItem>
                          <SelectItem value="private">Private - Only you</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show Email Address</div>
                        <div className="text-sm text-muted-foreground">Allow others to see your email</div>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show Phone Number</div>
                        <div className="text-sm text-muted-foreground">Allow others to see your phone number</div>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Allow Direct Contact</div>
                        <div className="text-sm text-muted-foreground">Let IA firms contact you directly</div>
                      </div>
                      <Switch
                        checked={privacy.allowDirectContact}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDirectContact: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Data & Analytics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data & Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Data Sharing</div>
                        <div className="text-sm text-muted-foreground">
                          Share anonymized data to improve the platform
                        </div>
                      </div>
                      <Switch
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Analytics Tracking</div>
                        <div className="text-sm text-muted-foreground">Help us improve by tracking usage analytics</div>
                      </div>
                      <Switch
                        checked={privacy.analyticsTracking}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, analyticsTracking: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your personal data and account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Export Your Data</div>
                    <div className="text-sm text-muted-foreground">
                      Download a copy of all your data including claims, earnings, and settings
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive">
                  <div>
                    <div className="font-medium text-destructive">Delete Account</div>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </div>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            All your claims, earnings data, and firm connections will be permanently lost.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <Label htmlFor="confirmDelete">Type "DELETE" to confirm</Label>
                          <Input id="confirmDelete" placeholder="DELETE" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Connect your favorite tools and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar Integrations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Calendar</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="font-medium">Google Calendar</div>
                          <div className="text-sm text-muted-foreground">
                            Sync your inspections with Google Calendar
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integrations.googleCalendar && <Badge variant="secondary">Connected</Badge>}
                        <Switch
                          checked={integrations.googleCalendar}
                          onCheckedChange={(checked) => setIntegrations({ ...integrations, googleCalendar: checked })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-800" />
                        <div>
                          <div className="font-medium">Outlook Calendar</div>
                          <div className="text-sm text-muted-foreground">
                            Sync your inspections with Outlook Calendar
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integrations.outlookCalendar && <Badge variant="secondary">Connected</Badge>}
                        <Switch
                          checked={integrations.outlookCalendar}
                          onCheckedChange={(checked) => setIntegrations({ ...integrations, outlookCalendar: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accounting */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accounting</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="font-medium">QuickBooks</div>
                        <div className="text-sm text-muted-foreground">Automatically sync earnings and expenses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integrations.quickbooks && <Badge variant="secondary">Connected</Badge>}
                      <Switch
                        checked={integrations.quickbooks}
                        onCheckedChange={(checked) => setIntegrations({ ...integrations, quickbooks: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Cloud Storage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cloud Storage</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">Dropbox</div>
                          <div className="text-sm text-muted-foreground">Backup your claim photos and documents</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integrations.dropbox && <Badge variant="secondary">Connected</Badge>}
                        <Switch
                          checked={integrations.dropbox}
                          onCheckedChange={(checked) => setIntegrations({ ...integrations, dropbox: checked })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-8 w-8 text-yellow-600" />
                        <div>
                          <div className="font-medium">Google Drive</div>
                          <div className="text-sm text-muted-foreground">Store and organize your claim files</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integrations.googleDrive && <Badge variant="secondary">Connected</Badge>}
                        <Switch
                          checked={integrations.googleDrive}
                          onCheckedChange={(checked) => setIntegrations({ ...integrations, googleDrive: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-6 bg-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{billing.currentPlan} Plan</h4>
                      <p className="text-muted-foreground">Perfect for established adjusters</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${billing.amount}</div>
                      <div className="text-sm text-muted-foreground">per {billing.billingCycle}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Unlimited firm connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Advanced analytics & forecasting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Calendar integration</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Next billing date: {billing.nextBillingDate}</span>
                    <span>Auto-renewal: {billing.autoRenew ? "Enabled" : "Disabled"}</span>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change Plan</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Change Subscription Plan</DialogTitle>
                          <DialogDescription>Choose the plan that best fits your needs</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          {[
                            {
                              name: "Starter",
                              price: 29,
                              features: ["Up to 3 firm connections", "Basic analytics", "Email support"],
                              current: false,
                            },
                            {
                              name: "Professional",
                              price: 79,
                              features: ["Unlimited firm connections", "Advanced analytics", "Priority support"],
                              current: true,
                            },
                            {
                              name: "Enterprise",
                              price: 149,
                              features: ["Everything in Professional", "White-label options", "Dedicated support"],
                              current: false,
                            },
                          ].map((plan) => (
                            <Card key={plan.name} className={plan.current ? "ring-2 ring-primary" : ""}>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  {plan.name}
                                  {plan.current && <Badge>Current</Badge>}
                                </CardTitle>
                                <div className="text-2xl font-bold">${plan.price}/month</div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 mb-4">
                                  {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  className="w-full"
                                  variant={plan.current ? "secondary" : "default"}
                                  disabled={plan.current}
                                  onClick={() => handleChangePlan(plan.name)}
                                >
                                  {plan.current ? "Current Plan" : "Select Plan"}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Switch
                      checked={billing.autoRenew}
                      onCheckedChange={(checked) => setBilling({ ...billing, autoRenew: checked })}
                    />
                    <span className="text-sm text-muted-foreground">Auto-renewal</span>

                    <Dialog open={showCancelSubscription} onOpenChange={setShowCancelSubscription}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-destructive bg-transparent">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel your subscription? You'll lose access to all premium
                            features.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Your subscription will remain active until {billing.nextBillingDate}, after which you'll
                              be downgraded to the free plan.
                            </AlertDescription>
                          </Alert>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCancelSubscription(false)}>
                              Keep Subscription
                            </Button>
                            <Button variant="destructive" onClick={handleCancelSubscription}>
                              Cancel Subscription
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                  </div>
                  <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>Add a new credit or debit card to your account</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Smith" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddress">Billing Address</Label>
                          <Input id="billingAddress" placeholder="123 Main St, City, State 12345" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddCard(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {method.brand} •••• {method.last4}
                            {method.isDefault && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!method.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{bill.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {bill.date} • Invoice {bill.id}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">${bill.amount.toFixed(2)}</div>
                          <Badge
                            className={
                              bill.status === "Paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {bill.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(bill.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage & Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Usage & Limits</CardTitle>
                <CardDescription>Track your current usage against plan limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Firm Connections</span>
                    <span className="text-sm text-muted-foreground">8 / Unlimited</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Monthly Claims</span>
                    <span className="text-sm text-muted-foreground">24 / Unlimited</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Storage Used</span>
                    <span className="text-sm text-muted-foreground">2.3 GB / 50 GB</span>
                  </div>
                  <Progress value={4.6} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">API Calls</span>
                    <span className="text-sm text-muted-foreground">1,247 / 10,000</span>
                  </div>
                  <Progress value={12.47} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
