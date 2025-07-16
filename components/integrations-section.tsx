"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  DollarSign,
  Cloud,
  MessageSquare,
  Building2,
  MapPin,
  Zap,
  FileText,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Settings,
  AlertTriangle,
  Info,
  Plus
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  category: string
  connected: boolean
  premium?: boolean
  comingSoon?: boolean
  benefits: string[]
  setupUrl?: string
}

export function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    googleCalendar: true,
    quickbooks: false,
    dropbox: true,
    slack: false,
    crawford: false,
    weatherAPI: true,
    googleMaps: true,
    zapier: false
  })

  const [showAddIntegration, setShowAddIntegration] = useState(false)

  const integrationsList: Integration[] = [
    {
      id: 'googleCalendar',
      name: 'Google Calendar',
      description: 'Sync inspections, deadlines, and appointments',
      icon: Calendar,
      category: 'Essential',
      connected: integrations.googleCalendar,
      benefits: ['Auto-sync claim deadlines', 'Inspection scheduling', 'Reminder notifications'],
      setupUrl: '/api/integrations/google-calendar/auth'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Automatically sync earnings and expenses',
      icon: DollarSign,
      category: 'Essential',
      connected: integrations.quickbooks,
      benefits: ['Auto expense tracking', 'Invoice generation', 'Tax preparation'],
      setupUrl: '/api/integrations/quickbooks/auth'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Backup claim photos and documents',
      icon: Cloud,
      category: 'Essential',
      connected: integrations.dropbox,
      benefits: ['Automatic photo backup', 'Document organization', 'Team file sharing'],
      setupUrl: '/api/integrations/dropbox/auth'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: MessageSquare,
      category: 'Essential',
      connected: integrations.slack,
      benefits: ['Instant claim alerts', 'Team collaboration', 'File sharing'],
      setupUrl: '/api/integrations/slack/auth'
    },
    {
      id: 'crawford',
      name: 'Crawford & Company',
      description: 'Direct claim assignment integration',
      icon: Building2,
      category: 'Essential',
      connected: integrations.crawford,
      premium: true,
      benefits: ['Priority claim access', 'Faster payments', 'Direct communication'],
      setupUrl: '/api/integrations/crawford/auth'
    },
    {
      id: 'weatherAPI',
      name: 'Weather Data',
      description: 'Real-time weather for claim locations',
      icon: MapPin,
      category: 'Essential',
      connected: integrations.weatherAPI,
      benefits: ['Historical weather data', 'Storm tracking', 'Damage correlation'],
      setupUrl: '/api/integrations/weather/setup'
    },
    {
      id: 'googleMaps',
      name: 'Google Maps',
      description: 'Location services and routing',
      icon: MapPin,
      category: 'Essential',
      connected: integrations.googleMaps,
      benefits: ['Optimized routing', 'Traffic updates', 'Location validation'],
      setupUrl: '/api/integrations/google-maps/setup'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows between apps',
      icon: Zap,
      category: 'Essential',
      connected: integrations.zapier,
      benefits: ['Custom automations', '3000+ app connections', 'Workflow optimization'],
      setupUrl: '/api/integrations/zapier/auth'
    }
  ]

  const categories = [...new Set(integrationsList.map(i => i.category))]

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getStatusBadge = (integration: Integration) => {
    if (integration.comingSoon) {
      return <Badge variant="outline">Coming Soon</Badge>
    }
    if (integration.connected) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
    }
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Essential Integrations
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Connect with the tools you already use to streamline your workflow
        </p>
        <Button
          onClick={() => setShowAddIntegration(true)}
          variant="outline"
          className="mb-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add More Integrations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map(integration => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <integration.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{integration.name}</span>
                            {integration.premium && (
                              <Badge variant="outline" className="text-xs">Premium</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(integration)}
                        {!integration.comingSoon && (
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Benefits:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {integration.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {integration.connected ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : !integration.comingSoon ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(integration.setupUrl, '_blank')}
                      >
                        Connect {integration.name}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
        ))}
      </div>

      {/* Add More Integrations Modal */}
      {showAddIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Request Additional Integrations</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddIntegration(false)}
                >
                  ✕
                </Button>
              </div>
              <CardDescription>
                Tell us which integrations you'd like to see added to Flex.IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Integration Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Salesforce, HubSpot, etc."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Why do you need this integration?</label>
                  <textarea
                    placeholder="Describe how this integration would help your workflow..."
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority Level</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Nice to have</option>
                    <option>Important</option>
                    <option>Critical for my workflow</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">Submit Request</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddIntegration(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Need a Custom Integration?</CardTitle>
          <CardDescription>
            We can build custom integrations for Enterprise customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Contact our team to discuss custom API integrations, webhooks, and specialized workflows.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom API development</li>
                <li>• Dedicated integration support</li>
                <li>• White-label solutions</li>
              </ul>
            </div>
            <Button>Contact Sales</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
