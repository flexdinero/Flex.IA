"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Share2,
  BarChart3,
  Target,
  Gift,
  CreditCard,
  FileText,
  Mail,
  Globe,
  Smartphone,
  Image,
  Link,
  QrCode,
  Megaphone,
  Award,
  Star,
  Eye,
  MousePointer,
  ShoppingCart,
  Percent
} from 'lucide-react'
import { toast } from 'sonner'

interface AffiliateData {
  affiliate: {
    id: string
    affiliateCode: string
    companyName?: string
    website?: string
    commissionRate: number
    paymentMethod: string
    paymentDetails?: string
    status: string
    totalEarnings: number
    totalReferrals: number
    createdAt: string
    referrals: any[]
    commissions: any[]
  } | null
  stats: {
    totalReferrals: number
    convertedReferrals: number
    pendingReferrals: number
    totalEarnings: number
    pendingCommissions: number
    paidCommissions: number
    conversionRate: string
  }
}

export default function AffiliateDashboard() {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    paymentMethod: 'PAYPAL',
    paymentDetails: ''
  })
  const [customUrl, setCustomUrl] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [marketingAssets, setMarketingAssets] = useState([
    { type: 'banner', name: 'Flex.IA Banner 728x90', url: '/assets/banner-728x90.png', downloads: 45 },
    { type: 'logo', name: 'Flex.IA Logo PNG', url: '/assets/logo.png', downloads: 123 },
    { type: 'video', name: 'Product Demo Video', url: '/assets/demo.mp4', downloads: 67 },
    { type: 'social', name: 'Social Media Kit', url: '/assets/social-kit.zip', downloads: 89 }
  ])

  useEffect(() => {
    fetchAffiliateData()
  }, [])

  const fetchAffiliateData = async () => {
    try {
      const response = await fetch('/api/affiliate')
      const data = await response.json()
      
      if (response.ok) {
        setAffiliateData(data)
        if (data.affiliate) {
          setFormData({
            companyName: data.affiliate.companyName || '',
            website: data.affiliate.website || '',
            paymentMethod: data.affiliate.paymentMethod || 'PAYPAL',
            paymentDetails: data.affiliate.paymentDetails || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error)
      toast.error('Failed to load affiliate data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAffiliate = async () => {
    try {
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Affiliate application submitted! Awaiting approval.')
        fetchAffiliateData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create affiliate account')
      }
    } catch (error) {
      toast.error('Failed to create affiliate account')
    }
  }

  const handleUpdateAffiliate = async () => {
    try {
      const response = await fetch('/api/affiliate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Affiliate information updated successfully')
        setIsEditing(false)
        fetchAffiliateData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update affiliate information')
      }
    } catch (error) {
      toast.error('Failed to update affiliate information')
    }
  }

  const copyAffiliateLink = () => {
    if (affiliateData?.affiliate) {
      const link = `${window.location.origin}/signup?ref=${affiliateData.affiliate.affiliateCode}`
      navigator.clipboard.writeText(link)
      toast.success('Affiliate link copied to clipboard!')
    }
  }

  const generateCustomLink = () => {
    if (affiliateData?.affiliate && customUrl.trim()) {
      // Clean up the URL - remove leading slash if present, add it back
      let cleanUrl = customUrl.trim()
      if (!cleanUrl.startsWith('/')) {
        cleanUrl = '/' + cleanUrl
      }

      // Generate the affiliate link
      const link = `${window.location.origin}${cleanUrl}?ref=${affiliateData.affiliate.affiliateCode}`
      setGeneratedLink(link)
      toast.success('Custom affiliate link generated!')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
      SUSPENDED: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      TERMINATED: { color: 'bg-gray-100 text-gray-800', label: 'Terminated' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return <Badge className={config.color}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!affiliateData?.affiliate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Become an Affiliate Partner
          </CardTitle>
          <CardDescription>
            Join our affiliate program and earn commissions by referring new users to Flex.IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Your company name"
              />
            </div>
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAYPAL">PayPal</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CHECK">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentDetails">Payment Details</Label>
            <Textarea
              id="paymentDetails"
              value={formData.paymentDetails}
              onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
              placeholder="Enter your payment details (PayPal email, bank account info, mailing address, etc.)"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Affiliate Program Benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Earn 10% commission on all referred subscriptions</li>
              <li>• Monthly commission payouts</li>
              <li>• Real-time tracking and analytics</li>
              <li>• Marketing materials and support</li>
            </ul>
          </div>

          <Button onClick={handleCreateAffiliate} className="w-full">
            Apply to Become an Affiliate Partner
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${affiliateData.stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-blue-600">{affiliateData.stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600">{affiliateData.stats.convertedReferrals} converted</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{affiliateData.stats.conversionRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Progress value={parseFloat(affiliateData.stats.conversionRate)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payout</p>
                <p className="text-2xl font-bold text-orange-600">${affiliateData.stats.pendingCommissions.toFixed(2)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Calendar className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-orange-600">Next payout: 1st</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Banner */}
      <Card className="border-l-4 border-l-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Affiliate Status: {getStatusBadge(affiliateData.affiliate.status)}</p>
                <p className="text-sm text-green-700">
                  Affiliate Code: <code className="bg-green-100 px-2 py-1 rounded font-mono">{affiliateData.affiliate.affiliateCode}</code>
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={copyAffiliateLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Your Affiliate Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/signup?ref=${affiliateData.affiliate.affiliateCode}`}
              className="flex-1"
            />
            <Button onClick={copyAffiliateLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link to earn commissions when users sign up and subscribe
          </p>
        </CardContent>
      </Card>

      {/* Comprehensive Affiliate Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Links & Tools</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Assets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clicks This Month</span>
                    <span className="text-lg font-bold">1,247</span>
                  </div>
                  <Progress value={75} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conversions</span>
                    <span className="text-lg font-bold">89</span>
                  </div>
                  <Progress value={60} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Generated</span>
                    <span className="text-lg font-bold">$4,567</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New referral signed up', time: '2 hours ago', amount: '$29' },
                    { action: 'Commission earned', time: '1 day ago', amount: '$15.50' },
                    { action: 'Link clicked 15 times', time: '2 days ago', amount: null },
                    { action: 'Payout processed', time: '1 week ago', amount: '$234.75' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {activity.amount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Link className="h-6 w-6" />
                    <span className="text-sm">Create Link</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <QrCode className="h-6 w-6" />
                    <span className="text-sm">QR Code</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Share2 className="h-6 w-6" />
                    <span className="text-sm">Share Kit</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Sarah Johnson', earnings: '$2,456', badge: 'gold' },
                    { rank: 2, name: 'Mike Chen', earnings: '$1,987', badge: 'silver' },
                    { rank: 3, name: 'You', earnings: '$1,234', badge: 'bronze' },
                    { rank: 4, name: 'Lisa Park', earnings: '$987', badge: null }
                  ].map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          performer.badge === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                          performer.badge === 'silver' ? 'bg-gray-100 text-gray-800' :
                          performer.badge === 'bronze' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {performer.rank}
                        </div>
                        <span className={`text-sm ${performer.name === 'You' ? 'font-bold' : ''}`}>
                          {performer.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{performer.earnings}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Link Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Link Generator
                </CardTitle>
                <CardDescription>
                  Create custom affiliate links for specific pages or campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    placeholder="https://flex-ia.com/pricing"
                    defaultValue="https://flex-ia.com"
                  />
                </div>
                <div>
                  <Label htmlFor="campaign">Campaign Name (Optional)</Label>
                  <Input
                    id="campaign"
                    placeholder="summer-promo"
                  />
                </div>
                <Button className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Generate Link
                </Button>
              </CardContent>
            </Card>

            {/* QR Code Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Generator
                </CardTitle>
                <CardDescription>
                  Generate QR codes for offline marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
                  <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Custom Site URL Sharing */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Custom Site URL Sharing
                </CardTitle>
                <CardDescription>
                  Create affiliate links for any page on the Flex.IA website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* URL Generator */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Generate Custom Affiliate Link
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="custom-url">Enter any Flex.IA page URL</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="custom-url"
                            placeholder="e.g., /dashboard/claims, /pricing, /features"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={generateCustomLink} disabled={!customUrl.trim()}>
                            Generate
                          </Button>
                        </div>
                      </div>
                      {generatedLink && (
                        <div className="p-3 bg-white rounded border">
                          <Label className="text-sm font-medium">Generated Affiliate Link:</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              readOnly
                              value={generatedLink}
                              className="flex-1 font-mono text-sm"
                            />
                            <Button size="sm" variant="outline" onClick={() => {
                              navigator.clipboard.writeText(generatedLink)
                              toast.success('Custom link copied to clipboard!')
                            }}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => window.open(generatedLink, '_blank')}>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pre-built Links */}
                  <div>
                    <h4 className="font-medium mb-3">Popular Pages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: 'Home Page', path: '/', description: 'Main landing page' },
                        { name: 'Pricing', path: '/pricing', description: 'Subscription plans' },
                        { name: 'Features', path: '/features', description: 'Product features' },
                        { name: 'Dashboard Demo', path: '/dashboard', description: 'Live dashboard' },
                        { name: 'Claims Management', path: '/dashboard/claims', description: 'Claims workflow' },
                        { name: 'Earnings Tracker', path: '/dashboard/earnings', description: 'Earnings overview' }
                      ].map((page, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-sm">{page.name}</h5>
                              <p className="text-xs text-gray-500">{page.description}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => {
                                const link = `${window.location.origin}${page.path}?ref=${affiliateData.affiliate.affiliateCode}`
                                navigator.clipboard.writeText(link)
                                toast.success(`${page.name} link copied!`)
                              }}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                const link = `${window.location.origin}${page.path}?ref=${affiliateData.affiliate.affiliateCode}`
                                window.open(link, '_blank')
                              }}>
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs font-mono bg-gray-50 p-1 rounded truncate">
                            {page.path}?ref={affiliateData.affiliate.affiliateCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Links */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Your Affiliate Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Main Landing Page',
                      url: `${window.location.origin}?ref=${affiliateData.affiliate.affiliateCode}`,
                      clicks: 1247,
                      conversions: 89
                    },
                    {
                      name: 'Pricing Page',
                      url: `${window.location.origin}/pricing?ref=${affiliateData.affiliate.affiliateCode}`,
                      clicks: 567,
                      conversions: 34
                    },
                    {
                      name: 'Features Page',
                      url: `${window.location.origin}/features?ref=${affiliateData.affiliate.affiliateCode}`,
                      clicks: 234,
                      conversions: 12
                    }
                  ].map((link, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{link.name}</h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            navigator.clipboard.writeText(link.url)
                            toast.success('Link copied to clipboard!')
                          }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mb-2 truncate">
                        {link.url}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {link.clicks} clicks
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {link.conversions} conversions
                        </span>
                        <span className="flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          {((link.conversions / link.clicks) * 100).toFixed(1)}% rate
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing">
          <div className="space-y-6">
            {/* Marketing Assets Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Marketing Assets Library
                </CardTitle>
                <CardDescription>
                  Download professional marketing materials to promote Flex.IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketingAssets.map((asset, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        {asset.type === 'banner' && <Image className="h-8 w-8 text-blue-600" />}
                        {asset.type === 'logo' && <Star className="h-8 w-8 text-yellow-600" />}
                        {asset.type === 'video' && <Smartphone className="h-8 w-8 text-purple-600" />}
                        {asset.type === 'social' && <Share2 className="h-8 w-8 text-green-600" />}
                        <div>
                          <h4 className="font-medium">{asset.name}</h4>
                          <p className="text-sm text-gray-500">{asset.downloads} downloads</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>
                  Pre-written email templates for your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Introduction Email',
                      subject: 'Discover Flex.IA - The Ultimate Insurance Adjuster Platform',
                      preview: 'Hi [Name], I wanted to share an amazing platform that has transformed how I manage insurance claims...'
                    },
                    {
                      name: 'Feature Highlight',
                      subject: 'How I Save 10+ Hours Per Week with Flex.IA',
                      preview: 'The automation features in Flex.IA have been a game-changer for my business...'
                    },
                    {
                      name: 'Special Offer',
                      subject: 'Exclusive 20% Discount on Flex.IA (Limited Time)',
                      preview: 'As a valued subscriber, you get exclusive access to this special discount...'
                    }
                  ].map((template, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-600">{template.preview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Kit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Kit
                </CardTitle>
                <CardDescription>
                  Ready-to-post content for your social media channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      platform: 'LinkedIn',
                      content: 'Just discovered Flex.IA - a game-changing platform for independent insurance adjusters! The automation features alone save me hours every week. Check it out: [LINK]',
                      hashtags: '#InsuranceAdjuster #Automation #Productivity'
                    },
                    {
                      platform: 'Twitter',
                      content: 'Flex.IA has revolutionized my claims management process! 🚀 From automated submissions to real-time tracking, it\'s everything an independent adjuster needs. [LINK]',
                      hashtags: '#InsuranceTech #ClaimsManagement #Efficiency'
                    },
                    {
                      platform: 'Facebook',
                      content: 'Fellow adjusters! I\'ve been using Flex.IA for my claims management and the results are incredible. The platform handles everything from firm connections to payment tracking. Highly recommended!',
                      hashtags: '#Insurance #BusinessTools #Recommendation'
                    }
                  ].map((post, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {post.platform}
                        </h4>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                      <p className="text-sm text-blue-600">{post.hashtags}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {affiliateData.affiliate.referrals.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No referrals yet. Start sharing your affiliate link!</p>
              ) : (
                <div className="space-y-4">
                  {affiliateData.affiliate.referrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {referral.referredUser.firstName} {referral.referredUser.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{referral.referredUser.email}</div>
                        <div className="text-sm text-gray-500">
                          Referred: {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {referral.status === 'CONVERTED' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {referral.status === 'PENDING' && <Clock className="h-5 w-5 text-yellow-600" />}
                        <Badge variant={referral.status === 'CONVERTED' ? 'default' : 'secondary'}>
                          {referral.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                      <p className="text-2xl font-bold">7.2%</p>
                    </div>
                    <MousePointer className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+0.8% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-2xl font-bold">$89</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+$12 from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                      <p className="text-2xl font-bold">10%</p>
                    </div>
                    <Percent className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <Award className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600">Top tier rate</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Direct Links', percentage: 45, color: 'bg-blue-500' },
                    { source: 'Social Media', percentage: 30, color: 'bg-green-500' },
                    { source: 'Email Campaigns', percentage: 15, color: 'bg-purple-500' },
                    { source: 'Blog Posts', percentage: 10, color: 'bg-orange-500' }
                  ].map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                        <span className="text-sm font-medium">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${source.color}`}
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{source.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: 'United States', conversions: 67, revenue: '$3,456' },
                    { country: 'Canada', conversions: 12, revenue: '$789' },
                    { country: 'United Kingdom', conversions: 8, revenue: '$567' },
                    { country: 'Australia', conversions: 5, revenue: '$234' }
                  ].map((geo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{geo.country}</span>
                      <div className="flex gap-4 text-sm">
                        <span>{geo.conversions} conversions</span>
                        <span className="font-medium">{geo.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Payout</p>
                      <p className="text-2xl font-bold text-green-600">${affiliateData.stats.pendingCommissions.toFixed(2)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Due: January 1st, 2025</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Paid</p>
                      <p className="text-2xl font-bold">${affiliateData.stats.paidCommissions.toFixed(2)}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Method</p>
                      <p className="text-2xl font-bold">{affiliateData.affiliate.paymentMethod}</p>
                    </div>
                    <Gift className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Active method</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2024-12-01', amount: '$234.75', status: 'Paid', method: 'PayPal' },
                    { date: '2024-11-01', amount: '$189.50', status: 'Paid', method: 'PayPal' },
                    { date: '2024-10-01', amount: '$156.25', status: 'Paid', method: 'PayPal' },
                    { date: '2024-09-01', amount: '$98.75', status: 'Paid', method: 'PayPal' }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.amount}</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 mb-1">
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tax Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tax Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">2024 Tax Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Total Earnings:</p>
                        <p className="font-bold text-blue-900">${affiliateData.stats.totalEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Tax Year:</p>
                        <p className="font-bold text-blue-900">2024</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download 1099 Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              {affiliateData.affiliate.commissions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No commissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {affiliateData.affiliate.commissions.map((commission: any) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">${commission.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          From: {commission.referral.referredUser.firstName} {commission.referral.referredUser.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge 
                        variant={commission.status === 'PAID' ? 'default' : 'secondary'}
                        className={
                          commission.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          commission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {commission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <div className="text-sm text-gray-600">{affiliateData.affiliate.companyName || 'Not set'}</div>
                  </div>
                  <div>
                    <Label>Website</Label>
                    <div className="text-sm text-gray-600">{affiliateData.affiliate.website || 'Not set'}</div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <div className="text-sm text-gray-600">{affiliateData.affiliate.paymentMethod}</div>
                  </div>
                  <div>
                    <Label>Commission Rate</Label>
                    <div className="text-sm text-gray-600">{(affiliateData.affiliate.commissionRate * 100).toFixed(1)}%</div>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editCompanyName">Company Name</Label>
                    <Input
                      id="editCompanyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editWebsite">Website</Label>
                    <Input
                      id="editWebsite"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPaymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAYPAL">PayPal</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CHECK">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editPaymentDetails">Payment Details</Label>
                    <Textarea
                      id="editPaymentDetails"
                      value={formData.paymentDetails}
                      onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateAffiliate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
