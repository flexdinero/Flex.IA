"use client"

import React, { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { withPerformanceMonitoring, PerformanceMonitor } from '@/lib/performance'

// TypeScript interfaces for better type safety
interface WidgetSize {
  w: number
  h: number
}

// Removed unused WidgetConfig interface

interface DashboardWidgetsProps {
  editMode?: boolean
  onEditModeChange?: (editMode: boolean) => void
  onRef?: (ref: any) => void
}
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  DollarSign,
  Building2,
  TrendingUp,
  Settings,
  X,
  Plus,
  CheckCircle,
  CheckCircle2,
  Brain,
  BarChart3,
  CloudRain,
  Calendar,
  Bell,
  Check,
  CheckCheck,
  CheckSquare,
  FolderOpen,
  MapPin,
  MessageSquare,
  Reply,
  Send,
  Zap,
  LineChart,
  Shield,
  Clock,
  AlertTriangle,
  Edit3
} from 'lucide-react'

// Import CSS
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import '../styles/react-grid-layout.css'

// Import Tasks Widget
import { TasksWidget } from './widgets/tasks-widget'

const ResponsiveGridLayout = WidthProvider(Responsive)

// Widget type definitions
interface WidgetData {
  id: string
  title: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  maxSize?: { w: number; h: number }
}

// Individual widget components with performance optimization
const RecentClaimsWidget = memo(() => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [claims, setClaims] = useState([
    {
      id: 'CLM-2024-001',
      type: 'Property',
      amount: '$45,000',
      status: 'In Progress',
      priority: 'High',
      date: '2024-01-15',
      description: 'Water damage assessment for residential property',
      location: 'Dallas, TX',
      firm: 'Crawford & Company',
      nextAction: 'Submit initial report',
      dueDate: '2024-01-18'
    },
    {
      id: 'CLM-2024-002',
      type: 'Auto',
      amount: '$12,500',
      status: 'Pending',
      priority: 'Medium',
      date: '2024-01-14',
      description: 'Vehicle collision damage assessment',
      location: 'Houston, TX',
      firm: 'Sedgwick',
      nextAction: 'Schedule inspection',
      dueDate: '2024-01-17'
    },
    {
      id: 'CLM-2024-003',
      type: 'Liability',
      amount: '$78,000',
      status: 'Completed',
      priority: 'Low',
      date: '2024-01-13',
      description: 'Slip and fall incident investigation',
      location: 'Austin, TX',
      firm: 'Gallagher Bassett',
      nextAction: 'Case closed',
      dueDate: 'N/A'
    },
    {
      id: 'CLM-2024-004',
      type: 'Property',
      amount: '$32,000',
      status: 'Review',
      priority: 'High',
      date: '2024-01-12',
      description: 'Fire damage evaluation',
      location: 'San Antonio, TX',
      firm: 'Crawford & Company',
      nextAction: 'Await carrier approval',
      dueDate: '2024-01-16'
    }
  ])

  const handleStatusUpdate = (claimId: string, newStatus: string) => {
    setClaims(prev => prev.map(claim =>
      claim.id === claimId ? { ...claim, status: newStatus } : claim
    ))
  }

  const handlePriorityUpdate = (claimId: string, newPriority: string) => {
    setClaims(prev => prev.map(claim =>
      claim.id === claimId ? { ...claim, priority: newPriority } : claim
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <FileText className="h-5 w-5" />
          Recent Claims
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/dashboard/claims'}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="widget-content">
        {!selectedClaim ? (
          // Claims List View
          <div className="space-y-2">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{claim.id}</p>
                    <Badge
                      variant={claim.priority === 'High' ? 'destructive' : claim.priority === 'Medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {claim.priority}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-green-600">{claim.amount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{claim.type} • {claim.date}</p>
                  <Badge className={`text-xs ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{claim.nextAction}</p>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs mt-3"
              onClick={() => window.location.href = '/dashboard/claims'}
            >
              View All Claims
            </Button>
          </div>
        ) : (
          // Claim Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClaim(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = `/dashboard/claims/${selectedClaim.id}`}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Claim Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{selectedClaim.id}</h4>
                  <Badge
                    variant={selectedClaim.priority === 'High' ? 'destructive' : selectedClaim.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedClaim.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedClaim.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Amount</p>
                  <p className="text-green-600 font-semibold">{selectedClaim.amount}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Type</p>
                  <p>{selectedClaim.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                  <p>{selectedClaim.location}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Firm</p>
                  <p>{selectedClaim.firm}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedClaim.status}
                    onChange={(e) => handleStatusUpdate(selectedClaim.id, e.target.value)}
                    className="text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={selectedClaim.priority}
                    onChange={(e) => handlePriorityUpdate(selectedClaim.id, e.target.value)}
                    className="text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Request Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const EarningsWidget = memo(() => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isGeneratingTax, setIsGeneratingTax] = useState(false)

  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
  ]

  const getEarningsForPeriod = (period: string) => {
    const earnings = {
      week: {
        total: '$6,200',
        change: '+8%',
        breakdown: [
          { type: 'Completed Claims', amount: '$4,500', count: 3 },
          { type: 'Bonuses', amount: '$1,200', count: 2 },
          { type: 'Adjustments', amount: '$500', count: 1 }
        ],
        thisWeek: '$6,200',
        ytd: '$89,400'
      },
      month: {
        total: '$24,750',
        change: '+12%',
        breakdown: [
          { type: 'Completed Claims', amount: '$18,500', count: 12 },
          { type: 'Bonuses', amount: '$3,250', count: 5 },
          { type: 'Adjustments', amount: '$3,000', count: 3 }
        ],
        thisWeek: '$6,200',
        ytd: '$89,400'
      },
      quarter: {
        total: '$78,500',
        change: '+18%',
        breakdown: [
          { type: 'Completed Claims', amount: '$58,200', count: 35 },
          { type: 'Bonuses', amount: '$12,800', count: 15 },
          { type: 'Adjustments', amount: '$7,500', count: 8 }
        ],
        thisWeek: '$6,200',
        ytd: '$89,400'
      },
      year: {
        total: '$285,000',
        change: '+22%',
        breakdown: [
          { type: 'Completed Claims', amount: '$215,000', count: 125 },
          { type: 'Bonuses', amount: '$45,000', count: 48 },
          { type: 'Adjustments', amount: '$25,000', count: 22 }
        ],
        thisWeek: '$6,200',
        ytd: '$285,000'
      }
    }
    return earnings[period as keyof typeof earnings]
  }

  const [payments] = useState([
    {
      id: 'PAY-2024-001',
      amount: '$4,500',
      firm: 'Crawford & Company',
      date: '2024-01-15',
      status: 'Paid',
      claimId: 'CLM-2024-001',
      type: 'Property Inspection'
    },
    {
      id: 'PAY-2024-002',
      amount: '$2,800',
      firm: 'Sedgwick',
      date: '2024-01-12',
      status: 'Pending',
      claimId: 'CLM-2024-002',
      type: 'Auto Assessment'
    },
    {
      id: 'PAY-2024-003',
      amount: '$6,200',
      firm: 'Gallagher Bassett',
      date: '2024-01-10',
      status: 'Processing',
      claimId: 'CLM-2024-003',
      type: 'Liability Investigation'
    }
  ])

  const currentEarnings = getEarningsForPeriod(selectedPeriod)

  const handlePaymentClick = (payment: any) => {
    setSelectedPayment(payment)
  }

  const handleGenerateTaxDoc = async () => {
    setIsGeneratingTax(true)

    // Simulate tax document generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Create mock tax document
    const taxData = {
      period: selectedPeriod,
      totalEarnings: currentEarnings.total,
      breakdown: currentEarnings.breakdown,
      generatedAt: new Date().toISOString(),
      taxYear: 2024
    }

    const blob = new Blob([JSON.stringify(taxData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tax-document-${selectedPeriod}-2024.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGeneratingTax(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <DollarSign className="h-5 w-5" />
          Earnings
        </h3>
        <div className="widget-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs p-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="widget-content">
        {!selectedPayment ? (
          // Main Earnings View
          <div className="space-y-4">
            {/* Total Earnings */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {currentEarnings.total}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>{currentEarnings.change} from last {selectedPeriod}</span>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="space-y-2">
              {currentEarnings.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => window.location.href = `/dashboard/earnings?filter=${item.type.toLowerCase().replace(' ', '-')}`}
                >
                  <div>
                    <span className="text-sm font-medium">{item.type}</span>
                    <div className="text-xs text-gray-500">{item.count} items</div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-sm">{item.amount}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400 inline ml-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Payments */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Recent Payments</p>
              {payments.slice(0, 2).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handlePaymentClick(payment)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{payment.amount}</span>
                      <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{payment.firm} • {payment.date}</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => window.location.href = '/dashboard/earnings'}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Full Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleGenerateTaxDoc}
                disabled={isGeneratingTax}
              >
                {isGeneratingTax ? (
                  <>
                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Tax Doc
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Payment Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPayment(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Badge className={`text-xs ${getStatusColor(selectedPayment.status)}`}>
                {selectedPayment.status}
              </Badge>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {selectedPayment.amount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPayment.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Payment ID</p>
                  <p>{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Claim ID</p>
                  <p>{selectedPayment.claimId}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Firm</p>
                  <p>{selectedPayment.firm}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Date</p>
                  <p>{selectedPayment.date}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => window.location.href = `/dashboard/claims/${selectedPayment.claimId}`}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View Claim Details
                </Button>
                {selectedPayment.status === 'Pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => alert('Payment inquiry sent to firm')}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Inquire About Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const ActiveFirmsWidget = memo(() => {
  const [selectedFirm, setSelectedFirm] = useState<any>(null)
  const [showAddFirm, setShowAddFirm] = useState(false)
  const [newFirmName, setNewFirmName] = useState('')
  const [newFirmEmail, setNewFirmEmail] = useState('')
  const [firms, setFirms] = useState([
    {
      id: 1,
      name: 'Crawford & Company',
      claims: 8,
      status: 'Active',
      rating: 4.8,
      lastContact: '2 days ago',
      revenue: '$45,200',
      email: 'contact@crawford.com',
      phone: '(555) 123-4567',
      location: 'Dallas, TX',
      contactPerson: 'Sarah Johnson',
      relationship: 'Preferred Partner'
    },
    {
      id: 2,
      name: 'Sedgwick',
      claims: 5,
      status: 'Active',
      rating: 4.6,
      lastContact: '1 week ago',
      revenue: '$28,500',
      email: 'adjusters@sedgwick.com',
      phone: '(555) 987-6543',
      location: 'Houston, TX',
      contactPerson: 'Mike Chen',
      relationship: 'Standard Partner'
    },
    {
      id: 3,
      name: 'Gallagher Bassett',
      claims: 3,
      status: 'Pending',
      rating: 4.2,
      lastContact: '3 days ago',
      revenue: '$15,800',
      email: 'claims@gb.com',
      phone: '(555) 456-7890',
      location: 'Austin, TX',
      contactPerson: 'Lisa Rodriguez',
      relationship: 'New Partner'
    }
  ])

  const handleFirmClick = (firm: any) => {
    setSelectedFirm(firm)
  }

  const handleAddFirm = () => {
    if (!newFirmName.trim() || !newFirmEmail.trim()) return

    const newFirm = {
      id: Date.now(),
      name: newFirmName,
      claims: 0,
      status: 'Pending',
      rating: 0,
      lastContact: 'Never',
      revenue: '$0',
      email: newFirmEmail,
      phone: '',
      location: '',
      contactPerson: '',
      relationship: 'New Partner'
    }

    setFirms(prev => [...prev, newFirm])
    setNewFirmName('')
    setNewFirmEmail('')
    setShowAddFirm(false)

    alert('Firm connection request sent!')
  }

  const handleUpdateStatus = (firmId: number, newStatus: string) => {
    setFirms(prev => prev.map(firm =>
      firm.id === firmId ? { ...firm, status: newStatus } : firm
    ))
  }

  const handleContactFirm = (firm: any) => {
    alert(`Opening message thread with ${firm.contactPerson} at ${firm.name}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Building2 className="h-5 w-5" />
          Active Firms
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddFirm(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="widget-content">
        {!selectedFirm ? (
          // Firms List View
          <div className="space-y-2">
            {firms.map((firm) => (
              <div
                key={firm.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => handleFirmClick(firm)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{firm.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{firm.claims} claims</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">★ {firm.rating}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(firm.status)}`}>
                    {firm.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Last contact: {firm.lastContact}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">{firm.revenue}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs mt-3"
              onClick={() => window.location.href = '/dashboard/firms'}
            >
              Manage Partnerships
            </Button>
          </div>
        ) : (
          // Firm Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFirm(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Badge className={`text-xs ${getStatusColor(selectedFirm.status)}`}>
                {selectedFirm.status}
              </Badge>
            </div>

            {/* Firm Info */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">{selectedFirm.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedFirm.relationship}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Contact</p>
                  <p>{selectedFirm.contactPerson}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                  <p>{selectedFirm.location}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Claims</p>
                  <p>{selectedFirm.claims} active</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Revenue</p>
                  <p className="text-green-600">{selectedFirm.revenue}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedFirm.status}
                    onChange={(e) => handleUpdateStatus(selectedFirm.id, e.target.value)}
                    className="text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => handleContactFirm(selectedFirm)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => window.location.href = `/dashboard/firms/${selectedFirm.id}`}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Firm Modal */}
        {showAddFirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Connect New Firm</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddFirm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Firm Name
                  </label>
                  <input
                    type="text"
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    placeholder="Enter firm name..."
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={newFirmEmail}
                    onChange={(e) => setNewFirmEmail(e.target.value)}
                    placeholder="contact@firm.com"
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setShowAddFirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs flex-1"
                    onClick={handleAddFirm}
                    disabled={!newFirmName.trim() || !newFirmEmail.trim()}
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const PerformanceWidget = memo(() => (
  <div className="widget-container">
    <div className="widget-header">
      <h3 className="widget-title">
        <TrendingUp className="h-5 w-5" />
        Performance Metrics
      </h3>
      <div className="widget-actions">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="widget-content">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            94%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            4.8
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</p>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xs ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            ))}
          </div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            2.3
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Days Avg</p>
          <p className="text-xs text-green-600 mt-1">-0.5 days</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            156
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Claims</p>
          <p className="text-xs text-green-600 mt-1">+12 this month</p>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Performance Trend</span>
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +8.2%
          </span>
        </div>
      </div>
    </div>
  </div>
))

const AvailableClaimsWidget = memo(() => {
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [appliedClaims, setAppliedClaims] = useState<string[]>([])
  const [isApplying, setIsApplying] = useState<string | null>(null)
  const [availableClaims, setAvailableClaims] = useState([
    {
      id: 'AVL-2024-001',
      type: 'Property',
      amount: '$65,000',
      location: 'Dallas, TX',
      urgency: 'High',
      posted: '2 hours ago',
      firm: 'Crawford & Company',
      description: 'Hail damage assessment for commercial property. Requires immediate inspection.',
      requirements: ['Property inspection certification', 'Available within 24 hours'],
      estimatedDuration: '2-3 days',
      deadline: '2024-01-17',
      distance: '15 miles'
    },
    {
      id: 'AVL-2024-002',
      type: 'Auto',
      amount: '$18,500',
      location: 'Houston, TX',
      urgency: 'Medium',
      posted: '4 hours ago',
      firm: 'Sedgwick',
      description: 'Multi-vehicle collision assessment. Standard auto damage evaluation.',
      requirements: ['Auto inspection experience', 'Available this week'],
      estimatedDuration: '1-2 days',
      deadline: '2024-01-20',
      distance: '45 miles'
    },
    {
      id: 'AVL-2024-003',
      type: 'Liability',
      amount: '$95,000',
      location: 'Austin, TX',
      urgency: 'Low',
      posted: '1 day ago',
      firm: 'Gallagher Bassett',
      description: 'Workplace injury investigation. Detailed liability assessment required.',
      requirements: ['Liability investigation experience', 'Available next week'],
      estimatedDuration: '3-5 days',
      deadline: '2024-01-25',
      distance: '120 miles'
    }
  ])

  const handleApply = async (claimId: string) => {
    setIsApplying(claimId)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setAppliedClaims(prev => [...prev, claimId])
    setIsApplying(null)

    // Show success message (in real app, would use toast notification)
    alert('Application submitted successfully!')
  }

  const handleQuickAccept = async (claimId: string) => {
    setIsApplying(claimId)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setAppliedClaims(prev => [...prev, claimId])
    setIsApplying(null)

    // Remove from available claims
    setAvailableClaims(prev => prev.filter(claim => claim.id !== claimId))

    alert('Claim accepted! Check your dashboard for next steps.')
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <FileText className="h-5 w-5" />
          Available Claims
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/dashboard/claims'}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="widget-content">
        {!selectedClaim ? (
          // Claims List View
          <div className="space-y-2">
            {availableClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{claim.id}</p>
                    <Badge className={`text-xs ${getUrgencyColor(claim.urgency)}`}>
                      {claim.urgency}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-green-600">{claim.amount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{claim.type} • {claim.location}</p>
                  <p className="text-xs text-gray-500">{claim.firm} • Posted {claim.posted}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-blue-600">{claim.distance} away</p>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs mt-3"
              onClick={() => window.location.href = '/dashboard/claims'}
            >
              Browse All Available Claims
            </Button>
          </div>
        ) : (
          // Claim Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClaim(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Badge className={`text-xs ${getUrgencyColor(selectedClaim.urgency)}`}>
                {selectedClaim.urgency} Priority
              </Badge>
            </div>

            {/* Claim Details */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">{selectedClaim.id}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedClaim.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Amount</p>
                  <p className="text-green-600 font-semibold">{selectedClaim.amount}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Type</p>
                  <p>{selectedClaim.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                  <p>{selectedClaim.location}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Distance</p>
                  <p>{selectedClaim.distance}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Duration</p>
                  <p>{selectedClaim.estimatedDuration}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Deadline</p>
                  <p>{selectedClaim.deadline}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-xs mb-1">Requirements</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {selectedClaim.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {appliedClaims.includes(selectedClaim.id) ? (
                  <div className="text-center py-2">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-green-600">Application Submitted</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickAccept(selectedClaim.id)}
                      disabled={isApplying === selectedClaim.id}
                    >
                      {isApplying === selectedClaim.id ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Quick Accept
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleApply(selectedClaim.id)}
                      disabled={isApplying === selectedClaim.id}
                    >
                      {isApplying === selectedClaim.id ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-1" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// New AI-focused widget components
const AIInsightsWidget = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'fraud-detection',
      title: 'Fraud Detection Alert',
      description: 'Claim CLM-2024-001 shows unusual patterns. Recommend additional review.',
      severity: 'high',
      confidence: 87,
      claimId: 'CLM-2024-001',
      recommendation: 'Request additional documentation and schedule in-person inspection',
      details: {
        patterns: ['Inconsistent damage timeline', 'Multiple similar claims in area', 'Unusual repair estimates'],
        riskFactors: ['High claim amount', 'New policyholder', 'Remote location'],
        suggestedActions: ['Verify identity', 'Cross-reference databases', 'Schedule SIU review']
      }
    },
    {
      id: 2,
      type: 'settlement',
      title: 'Settlement Recommendation',
      description: 'Based on similar cases, suggest $18,500 settlement for CLM-2024-002.',
      severity: 'medium',
      confidence: 92,
      claimId: 'CLM-2024-002',
      recommendation: 'Offer settlement within recommended range to expedite closure',
      details: {
        comparableCases: ['CLM-2023-456: $17,200', 'CLM-2023-789: $19,800', 'CLM-2024-012: $18,100'],
        factors: ['Vehicle age and condition', 'Market value analysis', 'Repair cost estimates'],
        savings: ['Reduced legal fees', 'Faster claim closure', 'Customer satisfaction']
      }
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Efficiency Optimization',
      description: 'Schedule property inspections in the same area to save 2.5 hours travel time.',
      severity: 'low',
      confidence: 95,
      claimId: null,
      recommendation: 'Batch inspections by geographic proximity for optimal routing',
      details: {
        opportunities: ['3 claims within 5-mile radius', 'Same day scheduling available', 'Reduced mileage costs'],
        savings: ['2.5 hours travel time', '$45 fuel savings', '15% efficiency increase'],
        implementation: ['Use route optimization', 'Coordinate with claimants', 'Block calendar time']
      }
    }
  ])

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight)
  }

  const handleGenerateInsights = async () => {
    setIsGenerating(true)

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))

    const newInsight = {
      id: Date.now(),
      type: 'prediction',
      title: 'Claim Volume Prediction',
      description: 'Weather patterns suggest 25% increase in property claims next week.',
      severity: 'medium',
      confidence: 78,
      claimId: null,
      recommendation: 'Prepare additional adjuster capacity and expedite current claims',
      details: {
        forecast: ['Heavy rain expected', 'Wind speeds 40+ mph', 'Hail probability 60%'],
        preparation: ['Alert standby adjusters', 'Stock emergency supplies', 'Prepare CAT response'],
        timeline: ['Storm arrival: 3 days', 'Peak claims: 5-7 days', 'Resolution: 2-3 weeks']
      }
    }

    setInsights(prev => [newInsight, ...prev])
    setIsGenerating(false)

    alert('New AI insights generated based on latest data!')
  }

  const handleAcceptRecommendation = (insight: any) => {
    alert(`Recommendation accepted for ${insight.title}. Implementation initiated.`)

    // Mark insight as accepted
    setInsights(prev => prev.map(ins =>
      ins.id === insight.id ? { ...ins, status: 'accepted' } : ins
    ))
  }

  const handleDismissInsight = (insightId: number) => {
    setInsights(prev => prev.filter(ins => ins.id !== insightId))
    setSelectedInsight(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
      case 'low': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
    }
  }

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud-detection': return Shield
      case 'settlement': return DollarSign
      case 'efficiency': return Zap
      case 'prediction': return Brain
      default: return AlertTriangle
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Brain className="h-5 w-5" />
          AI Insights
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Clock className="h-3 w-3 animate-spin" />
            ) : (
              <Brain className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <div className="widget-content">
        {!selectedInsight ? (
          // Insights List View
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight) => {
              const TypeIcon = getTypeIcon(insight.type)
              return (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getSeverityColor(insight.severity)}`}
                  onClick={() => handleInsightClick(insight)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${getSeverityDot(insight.severity)}`}></div>
                    <TypeIcon className="h-3 w-3" />
                    <span className="text-sm font-medium flex-1">{insight.title}</span>
                    <span className="text-xs opacity-75">{insight.confidence}%</span>
                  </div>
                  <p className="text-xs opacity-90 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-75">
                      {insight.claimId ? `Claim: ${insight.claimId}` : 'General Insight'}
                    </span>
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </div>
                </div>
              )
            })}

            {isGenerating && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">Generating AI insights...</span>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs mt-3"
              onClick={() => window.location.href = '/dashboard/ai-insights'}
            >
              View All Insights
            </Button>
          </div>
        ) : (
          // Insight Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInsight(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{selectedInsight.confidence}% confidence</span>
                <Badge className={`text-xs ${getSeverityColor(selectedInsight.severity)}`}>
                  {selectedInsight.severity}
                </Badge>
              </div>
            </div>

            {/* Insight Details */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">{selectedInsight.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedInsight.description}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">AI Recommendation</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedInsight.recommendation}</p>
              </div>

              {/* Detailed Analysis */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Detailed Analysis</p>
                {Object.entries(selectedInsight.details).map(([key, values]: [string, any]) => (
                  <div key={key} className="text-xs">
                    <p className="font-medium text-gray-600 dark:text-gray-400 capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </p>
                    <ul className="list-disc list-inside text-gray-500 dark:text-gray-500 space-y-1 ml-2">
                      {values.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => handleAcceptRecommendation(selectedInsight)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleDismissInsight(selectedInsight.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ClaimAnalyticsWidget = () => (
  <div className="widget-container">
    <div className="widget-header">
      <h3 className="widget-title">
        <BarChart3 className="h-5 w-5" />
        Claim Analytics
      </h3>
    </div>
    <div className="widget-content">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Claims</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Property Claims</span>
          <span className="font-medium">45%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="flex justify-between text-sm">
          <span>Auto Claims</span>
          <span className="font-medium">35%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
        </div>
        <div className="flex justify-between text-sm">
          <span>Liability Claims</span>
          <span className="font-medium">20%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
        </div>
      </div>
    </div>
  </div>
)

const WeatherAlertsWidget = () => {
  const [currentLocation, setCurrentLocation] = useState('Dallas, TX')
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [newLocation, setNewLocation] = useState('')
  const [showExtendedForecast, setShowExtendedForecast] = useState(false)
  const [weatherData, setWeatherData] = useState({
    current: {
      temp: '72°F',
      condition: 'Partly Cloudy',
      humidity: '65%',
      windSpeed: '8 mph'
    },
    alerts: [
      {
        id: 1,
        type: 'severe',
        title: 'Severe Storm Warning',
        description: 'Hail expected 3-5 PM',
        location: 'Dallas, TX',
        severity: 'high',
        expires: '6:00 PM',
        impact: 'Property damage possible - postpone outdoor inspections'
      },
      {
        id: 2,
        type: 'watch',
        title: 'Flood Watch',
        description: 'Heavy rain next 48hrs',
        location: 'Houston, TX',
        severity: 'medium',
        expires: 'Tomorrow 8:00 PM',
        impact: 'Travel delays possible - plan accordingly'
      }
    ],
    forecast: [
      { day: 'Today', high: '75°F', low: '62°F', condition: 'Thunderstorms', icon: '⛈️' },
      { day: 'Tomorrow', high: '78°F', low: '65°F', condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Thursday', high: '82°F', low: '68°F', condition: 'Sunny', icon: '☀️' },
      { day: 'Friday', high: '79°F', low: '66°F', condition: 'Rain', icon: '🌧️' }
    ]
  })

  const handleLocationChange = () => {
    if (!newLocation.trim()) return

    setCurrentLocation(newLocation)
    setNewLocation('')
    setShowLocationForm(false)

    // In real app, would fetch weather data for new location
    alert(`Weather location updated to ${newLocation}`)
  }

  const handleAlertClick = (alert: any) => {
    // Show detailed alert information
    alert(`${alert.title}\n\nLocation: ${alert.location}\nExpires: ${alert.expires}\n\nImpact: ${alert.impact}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
      case 'medium': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
      case 'low': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
    }
  }

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-amber-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <CloudRain className="h-5 w-5" />
          Weather
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLocationForm(true)}
          >
            <MapPin className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="widget-content">
        {!showExtendedForecast ? (
          // Main Weather View
          <div className="space-y-3">
            {/* Current Location & Weather */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span className="text-sm font-medium">{currentLocation}</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {weatherData.current.temp}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {weatherData.current.condition}
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="space-y-2">
              {weatherData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getSeverityColor(alert.severity)}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getSeverityDot(alert.severity)}`}></div>
                    <span className="text-sm font-medium">{alert.title}</span>
                  </div>
                  <p className="text-xs opacity-90">{alert.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-75">Expires: {alert.expires}</span>
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Weather Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="font-medium">Humidity</div>
                <div className="text-blue-600">{weatherData.current.humidity}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="font-medium">Wind</div>
                <div className="text-blue-600">{weatherData.current.windSpeed}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => setShowExtendedForecast(true)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                5-Day Forecast
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => window.open(`https://weather.com/weather/today/l/${currentLocation.replace(' ', '+').replace(',', '')}`)}
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          // Extended Forecast View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExtendedForecast(false)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <span className="text-xs text-gray-500">{currentLocation}</span>
            </div>

            {/* 5-Day Forecast */}
            <div className="space-y-2">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{day.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="text-xs text-gray-500">{day.condition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{day.high}</div>
                    <div className="text-xs text-gray-500">{day.low}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Change Form */}
        {showLocationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Change Location</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLocationForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter city, state..."
                  className="w-full text-sm p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setShowLocationForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs flex-1"
                    onClick={handleLocationChange}
                    disabled={!newLocation.trim()}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const CalendarWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventTime, setNewEventTime] = useState('')
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = January
  const [currentYear, setCurrentYear] = useState(2024)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Property Inspection',
      date: 15,
      time: '2:00 PM - 4:00 PM',
      type: 'inspection',
      color: 'blue',
      description: 'Inspect property damage for claim #CL-2024-001'
    },
    {
      id: 2,
      title: 'Client Meeting',
      date: 16,
      time: '10:00 AM - 11:00 AM',
      type: 'meeting',
      color: 'green',
      description: 'Discuss settlement options with client'
    },
    {
      id: 3,
      title: 'Report Deadline',
      date: 22,
      time: 'All Day',
      type: 'deadline',
      color: 'orange',
      description: 'Submit final inspection report'
    }
  ])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const handleDateClick = (day: number) => {
    if (day > 0 && day <= 31) {
      setSelectedDate(day)
      setShowEventForm(true)
      setEditingEvent(null)
      setNewEventTitle('')
      setNewEventTime('')
    }
  }

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEvent(event)
    setNewEventTitle(event.title)
    setNewEventTime(event.time)
    setSelectedDate(event.date)
    setShowEventForm(true)
  }

  const handleSaveEvent = () => {
    if (!newEventTitle.trim() || !selectedDate) return

    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event =>
        event.id === editingEvent.id
          ? { ...event, title: newEventTitle, time: newEventTime, date: selectedDate }
          : event
      ))
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(),
        title: newEventTitle,
        date: selectedDate,
        time: newEventTime || 'All Day',
        type: 'custom',
        color: 'purple',
        description: ''
      }
      setEvents(prev => [...prev, newEvent])
    }

    setShowEventForm(false)
    setEditingEvent(null)
    setNewEventTitle('')
    setNewEventTime('')
    setSelectedDate(null)
  }

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.filter(event => event.id !== editingEvent.id))
      setShowEventForm(false)
      setEditingEvent(null)
    }
  }

  const getEventsForDate = (date: number) => {
    return events.filter(event => event.date === date)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Calendar className="h-5 w-5" />
          Calendar
        </h3>
        <div className="widget-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDate(15) // Today
              setShowEventForm(true)
              setEditingEvent(null)
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="widget-content">
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11)
                  setCurrentYear(prev => prev - 1)
                } else {
                  setCurrentMonth(prev => prev - 1)
                }
              }}
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Today is {monthNames[0]} 15th
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0)
                  setCurrentYear(prev => prev + 1)
                } else {
                  setCurrentMonth(prev => prev + 1)
                }
              }}
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          {!isExpanded ? (
            // Compact view - upcoming events
            <div className="space-y-2">
              {events
                .filter(event => event.date >= 15 && event.date <= 17) // Today and next 2 days
                .sort((a, b) => a.date - b.date)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getColorClasses(event.color)}`}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="text-center min-w-[40px]">
                      <div className="text-xs font-medium">
                        {event.date === 15 ? 'Today' : event.date === 16 ? 'Tomorrow' : `${event.date}th`}
                      </div>
                      <div className="text-lg font-bold">{event.date}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{event.title}</div>
                      <div className="text-xs opacity-75 mt-1">{event.time}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event, e)
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              {events.filter(event => event.date >= 15 && event.date <= 17).length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => {
                      setSelectedDate(15)
                      setShowEventForm(true)
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Full calendar view
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-xs text-center font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + 1
                  const isToday = day === 15
                  const dayEvents = getEventsForDate(day)
                  const hasEvent = dayEvents.length > 0
                  return (
                    <div
                      key={i}
                      className={`p-1 text-center rounded-lg cursor-pointer transition-colors relative ${
                        day > 0 && day <= 31
                          ? isToday
                            ? 'bg-blue-500 text-white font-bold shadow-md'
                            : hasEvent
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="text-xs">{day > 0 && day <= 31 ? day : ''}</div>
                      {hasEvent && (
                        <div className="flex justify-center mt-1">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Event details in expanded view */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Upcoming Events</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedDate(15)
                      setShowEventForm(true)
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {events
                    .sort((a, b) => a.date - b.date)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${getColorClasses(event.color)}`}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          event.color === 'blue' ? 'bg-blue-500' :
                          event.color === 'green' ? 'bg-green-500' :
                          event.color === 'orange' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-xs font-medium">{event.title}</div>
                          <div className="text-xs opacity-75">
                            {event.date === 15 ? 'Today' : event.date === 16 ? 'Tomorrow' : `Jan ${event.date}`} {event.time}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event, e)
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Event Form Modal */}
          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">
                    {editingEvent ? 'Edit Event' : 'New Event'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEventForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Enter event title..."
                      className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="e.g., 2:00 PM - 4:00 PM"
                      className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Date: January {selectedDate}, 2024
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {editingEvent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleDeleteEvent}
                      >
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1"
                      onClick={() => setShowEventForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs flex-1"
                      onClick={handleSaveEvent}
                      disabled={!newEventTitle.trim()}
                    >
                      {editingEvent ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium px-4 py-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <Calendar className="h-3 w-3 mr-1" />
                  Show Upcoming
                </>
              ) : (
                <>
                  <Calendar className="h-3 w-3 mr-1" />
                  View Full Calendar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Removed duplicate NotificationsWidget - using enhanced version below

// Removed duplicate TaskManagerWidget - using enhanced version below

// Removed duplicate DocumentVaultWidget - using enhanced version below

const CommunicationWidget = React.memo(() => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Sarah Johnson',
      message: 'Updated photos uploaded for claim review',
      time: '10 min ago',
      unread: true,
      avatar: 'SJ',
      conversation: [
        { id: 1, text: 'Hi! I\'ve uploaded the updated photos for claim #CL-2024-001. Please review when you have a chance.', sender: 'Sarah Johnson', time: '10 min ago', status: 'delivered' },
        { id: 2, text: 'The photos include damage to the roof, interior water damage, and the affected personal property.', sender: 'Sarah Johnson', time: '9 min ago', status: 'delivered' }
      ]
    },
    {
      id: 2,
      from: 'Mike Chen',
      message: 'Settlement amount approved',
      time: '1 hour ago',
      unread: false,
      avatar: 'MC',
      conversation: [
        { id: 1, text: 'Great news! The settlement amount of $15,750 has been approved by the carrier.', sender: 'Mike Chen', time: '1 hour ago', status: 'read' },
        { id: 2, text: 'Payment should be processed within 3-5 business days.', sender: 'Mike Chen', time: '1 hour ago', status: 'read' }
      ]
    },
    {
      id: 3,
      from: 'Lisa Rodriguez',
      message: 'Need additional documentation',
      time: '3 hours ago',
      unread: true,
      avatar: 'LR',
      conversation: [
        { id: 1, text: 'Hi there! We need some additional documentation for claim #CL-2024-003.', sender: 'Lisa Rodriguez', time: '3 hours ago', status: 'delivered' },
        { id: 2, text: 'Specifically, we need the police report and witness statements.', sender: 'Lisa Rodriguez', time: '3 hours ago', status: 'delivered' }
      ]
    }
  ])

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message)
    setIsReplying(false)
    // Mark as read
    setMessages(prev => prev.map(msg =>
      msg.id === message.id ? { ...msg, unread: false } : msg
    ))
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return

    setIsSending(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newReply = {
      id: Date.now(),
      text: replyText,
      sender: 'You',
      time: 'Just now',
      status: 'sending'
    }

    // Update the conversation
    setMessages(prev => prev.map(msg =>
      msg.id === selectedMessage.id
        ? { ...msg, conversation: [...msg.conversation, newReply] }
        : msg
    ))

    // Update selected message
    setSelectedMessage((prev: any) => ({
      ...prev,
      conversation: [...prev.conversation, newReply]
    }))

    setReplyText('')
    setIsSending(false)

    // Simulate message status update
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === selectedMessage.id
          ? {
              ...msg,
              conversation: msg.conversation.map(conv =>
                conv.id === newReply.id ? { ...conv, status: 'delivered' } : conv
              )
            }
          : msg
      ))
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-gray-400" />
      case 'delivered': return <Check className="h-3 w-3 text-gray-400" />
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />
      default: return null
    }
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <MessageSquare className="h-5 w-5" />
          Messages
        </h3>
        {selectedMessage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMessage(null)}
            className="text-xs"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
        )}
      </div>
      <div className="widget-content">
        {!selectedMessage ? (
          // Messages List View
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  msg.unread ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : 'bg-gray-50 dark:bg-gray-800'
                }`}
                onClick={() => handleMessageClick(msg)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {msg.avatar}
                  </div>
                  <p className="text-sm font-medium flex-1">{msg.from}</p>
                  {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">{msg.message}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{msg.time}</p>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs"
              onClick={() => window.location.href = '/dashboard/messages'}
            >
              View All Messages
            </Button>
          </div>
        ) : (
          // Conversation View
          <div className="flex flex-col h-full">
            {/* Conversation Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {selectedMessage.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedMessage.from}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-2 mb-3 max-h-32 overflow-y-auto">
              {selectedMessage.conversation.map((conv: any) => (
                <div key={conv.id} className={`flex ${conv.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    conv.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <p className="text-xs">{conv.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">{conv.time}</span>
                      {conv.sender === 'You' && getStatusIcon(conv.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Interface */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              {!isReplying ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setIsReplying(true)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={2}
                    disabled={isSending}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{replyText.length}/500</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs px-2"
                        onClick={() => {
                          setIsReplying(false)
                          setReplyText('')
                        }}
                        disabled={isSending}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs px-2"
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                      >
                        {isSending ? (
                          <>
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                            Sending
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const QuickActionsWidget = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showNewClaimForm, setShowNewClaimForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [newClaimType, setNewClaimType] = useState('')
  const [newClaimDescription, setNewClaimDescription] = useState('')
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')

  const quickActions = [
    {
      id: 'new-claim',
      icon: Plus,
      label: 'New Claim',
      color: 'blue',
      action: () => setShowNewClaimForm(true)
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: 'Schedule',
      color: 'green',
      action: () => setShowScheduleForm(true)
    },
    {
      id: 'report',
      icon: FileText,
      label: 'Report',
      color: 'purple',
      action: () => handleGenerateReport()
    },
    {
      id: 'message',
      icon: MessageSquare,
      label: 'Message',
      color: 'orange',
      action: () => handleOpenMessages()
    }
  ]

  const handleAction = async (actionId: string, actionFn: () => void) => {
    setIsLoading(actionId)

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    actionFn()
    setIsLoading(null)
  }

  const handleNewClaim = async () => {
    if (!newClaimType.trim() || !newClaimDescription.trim()) return

    setIsLoading('new-claim')

    // Simulate claim creation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const claimId = `CLM-${Date.now()}`
    alert(`New ${newClaimType} claim created successfully!\nClaim ID: ${claimId}`)

    setNewClaimType('')
    setNewClaimDescription('')
    setShowNewClaimForm(false)
    setIsLoading(null)
  }

  const handleScheduleEvent = async () => {
    if (!scheduleTitle.trim() || !scheduleDate.trim()) return

    setIsLoading('schedule')

    // Simulate event scheduling
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert(`Event "${scheduleTitle}" scheduled for ${scheduleDate}`)

    setScheduleTitle('')
    setScheduleDate('')
    setShowScheduleForm(false)
    setIsLoading(null)
  }

  const handleGenerateReport = async () => {
    setIsLoading('report')

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create mock report
    const reportData = {
      type: 'Quick Report',
      generatedAt: new Date().toISOString(),
      summary: 'Dashboard activity summary'
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quick-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsLoading(null)
  }

  const handleOpenMessages = () => {
    window.location.href = '/dashboard/messages'
  }

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20',
      green: 'hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20',
      purple: 'hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20',
      orange: 'hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Zap className="h-5 w-5" />
          Quick Actions
        </h3>
      </div>
      <div className="widget-content">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isActionLoading = isLoading === action.id

            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className={`h-auto p-3 flex flex-col gap-1 transition-all ${getActionColor(action.color)}`}
                onClick={() => handleAction(action.id, action.action)}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="text-xs">{action.label}</span>
              </Button>
            )
          })}
        </div>

        {/* New Claim Form Modal */}
        {showNewClaimForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Create New Claim</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewClaimForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Claim Type
                  </label>
                  <select
                    value={newClaimType}
                    onChange={(e) => setNewClaimType(e.target.value)}
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select type...</option>
                    <option value="Property">Property</option>
                    <option value="Auto">Auto</option>
                    <option value="Liability">Liability</option>
                    <option value="Workers Comp">Workers Comp</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={newClaimDescription}
                    onChange={(e) => setNewClaimDescription(e.target.value)}
                    placeholder="Brief description of the claim..."
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setShowNewClaimForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs flex-1"
                    onClick={handleNewClaim}
                    disabled={!newClaimType.trim() || !newClaimDescription.trim() || isLoading === 'new-claim'}
                  >
                    {isLoading === 'new-claim' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Claim'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Schedule Event</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduleForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    placeholder="Enter event title..."
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full mt-1 text-xs p-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs flex-1"
                    onClick={handleScheduleEvent}
                    disabled={!scheduleTitle.trim() || !scheduleDate.trim() || isLoading === 'schedule'}
                  >
                    {isLoading === 'schedule' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      'Schedule'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const MarketTrendsWidget = () => (
  <div className="widget-container">
    <div className="widget-header">
      <h3 className="widget-title">
        <LineChart className="h-5 w-5" />
        Market Trends
      </h3>
    </div>
    <div className="widget-content">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">+12%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Property Claims</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">-5%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Auto Claims</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">+8%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Settlement</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Market Activity</span>
            <span className="text-green-600 dark:text-green-400">High</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg Processing Time</span>
            <span>14 days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Success Rate</span>
            <span className="text-green-600 dark:text-green-400">89%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ComplianceTrackerWidget = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [complianceItems, setComplianceItems] = useState([
    {
      id: 1,
      name: 'License Renewal',
      status: 'Valid',
      dueDate: '2024-12-15',
      description: 'Professional adjuster license',
      requirements: ['Complete renewal application', 'Pay renewal fee', 'Submit continuing education'],
      progress: 100
    },
    {
      id: 2,
      name: 'CE Credits',
      status: 'Due Soon',
      dueDate: '2024-02-28',
      description: 'Continuing education requirements',
      requirements: ['Complete 24 hours CE', 'Submit certificates', 'Pay processing fee'],
      progress: 65
    },
    {
      id: 3,
      name: 'E&O Insurance',
      status: 'Active',
      dueDate: '2024-08-30',
      description: 'Errors & Omissions insurance coverage',
      requirements: ['Renew policy', 'Submit proof of coverage', 'Update beneficiaries'],
      progress: 100
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Due Soon': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
  }

  const handleUpdateProgress = (itemId: number, newProgress: number) => {
    setComplianceItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, progress: newProgress } : item
    ))
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Shield className="h-5 w-5" />
          Compliance Tracker
        </h3>
      </div>
      <div className="widget-content">
        {!selectedItem ? (
          <div className="space-y-2">
            {complianceItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Due: {item.dueDate}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{item.progress}%</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs mt-3"
              onClick={() => window.location.href = '/dashboard/compliance'}
            >
              View All Requirements
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Badge className={`text-xs ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">{selectedItem.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Due Date</p>
                  <p>{selectedItem.dueDate}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Progress</p>
                  <p>{selectedItem.progress}% Complete</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements</p>
                <ul className="space-y-1">
                  {selectedItem.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Update Progress</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedItem.progress}
                  onChange={(e) => handleUpdateProgress(selectedItem.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => window.location.href = `/dashboard/compliance/${selectedItem.id}`}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Manage Compliance
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const RecentActivityWidget = () => {
  const [filter, setFilter] = useState('all')
  const [activities, setActivities] = useState([
    {
      id: 1,
      icon: CheckCircle,
      message: 'Claim CLM-2024-001 completed',
      time: '2 hours ago',
      type: 'success',
      read: false,
      actionUrl: '/dashboard/claims/CLM-2024-001',
      details: 'Property inspection completed successfully. Final report submitted.'
    },
    {
      id: 2,
      icon: FileText,
      message: 'New claim assigned: CLM-2024-015',
      time: '4 hours ago',
      type: 'info',
      read: false,
      actionUrl: '/dashboard/claims/CLM-2024-015',
      details: 'Auto damage assessment assigned by Crawford & Company.'
    },
    {
      id: 3,
      icon: DollarSign,
      message: 'Payment processed: $3,250',
      time: '6 hours ago',
      type: 'success',
      read: true,
      actionUrl: '/dashboard/earnings',
      details: 'Payment for claim CLM-2024-003 has been processed and deposited.'
    },
    {
      id: 4,
      icon: AlertTriangle,
      message: 'Deadline approaching for CLM-2024-008',
      time: '8 hours ago',
      type: 'warning',
      read: false,
      actionUrl: '/dashboard/claims/CLM-2024-008',
      details: 'Report deadline is tomorrow. Please submit final documentation.'
    },
    {
      id: 5,
      icon: MessageSquare,
      message: 'New message from Sedgwick',
      time: '1 day ago',
      type: 'info',
      read: true,
      actionUrl: '/dashboard/messages',
      details: 'Message regarding claim CLM-2024-012 requirements.'
    }
  ])

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warnings' },
    { value: 'info', label: 'Info' }
  ]

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    if (filter === 'unread') return !activity.read
    return activity.type === filter
  })

  const handleActivityClick = (activity: any) => {
    // Mark as read
    setActivities(prev => prev.map(act =>
      act.id === activity.id ? { ...act, read: true } : act
    ))

    // Navigate to relevant page
    window.location.href = activity.actionUrl
  }

  const handleMarkAllRead = () => {
    setActivities(prev => prev.map(act => ({ ...act, read: true })))
  }

  const unreadCount = activities.filter(act => !act.read).length

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Clock className="h-5 w-5" />
          Recent Activity
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </h3>
        <div className="widget-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs p-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {filters.map(filterOption => (
              <option key={filterOption.value} value={filterOption.value}>
                {filterOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="widget-content">
        <div className="space-y-2">
          {filteredActivities.slice(0, 4).map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  activity.read
                    ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-l-2 border-blue-500'
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                <Icon className={`h-4 w-4 mt-1 ${
                  activity.type === 'success' ? 'text-green-500' :
                  activity.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${!activity.read ? 'font-medium' : ''}`}>
                      {activity.message}
                    </p>
                    {!activity.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {activity.details}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
            )
          })}

          {filteredActivities.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities found</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1"
              onClick={handleMarkAllRead}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1"
            onClick={() => window.location.href = '/dashboard/activity'}
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  )
}

const AnalyticsWidget = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
  ]

  const getMetricsForPeriod = (period: string) => {
    const metrics = {
      week: {
        activeClaims: { value: 8, change: '+3', trend: 'up' },
        earnings: { value: '$6,250', change: '+8%', trend: 'up' },
        completionRate: { value: '92%', change: '+1%', trend: 'up' },
        activeFirms: { value: 6, change: '+1', trend: 'up' }
      },
      month: {
        activeClaims: { value: 12, change: '+2', trend: 'up' },
        earnings: { value: '$24,750', change: '+12%', trend: 'up' },
        completionRate: { value: '94%', change: '+3%', trend: 'up' },
        activeFirms: { value: 8, change: '+2', trend: 'up' }
      },
      quarter: {
        activeClaims: { value: 45, change: '+8', trend: 'up' },
        earnings: { value: '$78,500', change: '+18%', trend: 'up' },
        completionRate: { value: '96%', change: '+5%', trend: 'up' },
        activeFirms: { value: 12, change: '+4', trend: 'up' }
      },
      year: {
        activeClaims: { value: 156, change: '+24', trend: 'up' },
        earnings: { value: '$285,000', change: '+22%', trend: 'up' },
        completionRate: { value: '95%', change: '+7%', trend: 'up' },
        activeFirms: { value: 15, change: '+6', trend: 'up' }
      }
    }
    return metrics[period as keyof typeof metrics]
  }

  const currentMetrics = getMetricsForPeriod(selectedPeriod)

  const handleMetricClick = (metric: any, title: string, description: string) => {
    setSelectedMetric({
      title,
      description,
      value: metric.value,
      change: metric.change,
      trend: metric.trend,
      period: selectedPeriod,
      details: getMetricDetails(title, selectedPeriod)
    })
  }

  const getMetricDetails = (metricType: string, _period: string) => {
    const details = {
      'Active Claims': {
        breakdown: [
          { label: 'Property', value: '45%', count: Math.floor(parseInt(currentMetrics.activeClaims.value.toString()) * 0.45) },
          { label: 'Auto', value: '30%', count: Math.floor(parseInt(currentMetrics.activeClaims.value.toString()) * 0.30) },
          { label: 'Liability', value: '25%', count: Math.floor(parseInt(currentMetrics.activeClaims.value.toString()) * 0.25) }
        ],
        trend: 'Steady increase in property claims due to recent weather events'
      },
      'Monthly Earnings': {
        breakdown: [
          { label: 'Property Claims', value: '60%', count: '$14,850' },
          { label: 'Auto Claims', value: '25%', count: '$6,188' },
          { label: 'Liability Claims', value: '15%', count: '$3,712' }
        ],
        trend: 'Higher earnings from property claims this period'
      },
      'Completion Rate': {
        breakdown: [
          { label: 'On Time', value: '94%', count: 'Excellent' },
          { label: 'Late', value: '4%', count: 'Acceptable' },
          { label: 'Cancelled', value: '2%', count: 'Low' }
        ],
        trend: 'Consistently high completion rate maintained'
      },
      'Active Firms': {
        breakdown: [
          { label: 'Crawford & Company', value: '35%', count: '3 claims' },
          { label: 'Sedgwick', value: '25%', count: '2 claims' },
          { label: 'Gallagher Bassett', value: '40%', count: '3 claims' }
        ],
        trend: 'Balanced distribution across major firms'
      }
    }
    return details[metricType as keyof typeof details]
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, would generate and download report
    const reportData = {
      period: selectedPeriod,
      metrics: currentMetrics,
      generatedAt: new Date().toISOString()
    }

    // Create and download file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <BarChart3 className="h-5 w-5" />
          My Stats
        </h3>
        <div className="widget-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs p-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="widget-content">
        {!selectedMetric ? (
          // Main Stats View
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer transition-all hover:shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={() => handleMetricClick(currentMetrics.activeClaims, 'Active Claims', 'Claims currently in progress')}
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentMetrics.activeClaims.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Claims</div>
                <div className="text-xs text-green-600 dark:text-green-400">{currentMetrics.activeClaims.change} from last {selectedPeriod}</div>
              </div>
              <div
                className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer transition-all hover:shadow-sm hover:bg-green-100 dark:hover:bg-green-900/30"
                onClick={() => handleMetricClick(currentMetrics.earnings, 'Monthly Earnings', 'Total earnings for the period')}
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentMetrics.earnings.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Earnings</div>
                <div className="text-xs text-green-600 dark:text-green-400">{currentMetrics.earnings.change} from last {selectedPeriod}</div>
              </div>
              <div
                className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer transition-all hover:shadow-sm hover:bg-purple-100 dark:hover:bg-purple-900/30"
                onClick={() => handleMetricClick(currentMetrics.completionRate, 'Completion Rate', 'Percentage of claims completed on time')}
              >
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentMetrics.completionRate.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</div>
                <div className="text-xs text-green-600 dark:text-green-400">{currentMetrics.completionRate.change} this {selectedPeriod}</div>
              </div>
              <div
                className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer transition-all hover:shadow-sm hover:bg-orange-100 dark:hover:bg-orange-900/30"
                onClick={() => handleMetricClick(currentMetrics.activeFirms, 'Active Firms', 'Number of firms you are working with')}
              >
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentMetrics.activeFirms.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Firms</div>
                <div className="text-xs text-green-600 dark:text-green-400">{currentMetrics.activeFirms.change} new partnerships</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => window.location.href = '/dashboard/analytics'}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Full Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Clock className="h-3 w-3 animate-spin" />
                ) : (
                  <ArrowRight className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Metric Details View
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMetric(null)}
                className="text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Badge variant="outline" className="text-xs">
                {selectedMetric.period}
              </Badge>
            </div>

            {/* Metric Overview */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {selectedMetric.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedMetric.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {selectedMetric.description}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                {selectedMetric.change} from last {selectedMetric.period}
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Breakdown</p>
              {selectedMetric.details.breakdown.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.count}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trend */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Trend Analysis</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{selectedMetric.details.trend}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Error Boundary Component for Individual Widgets
const ErrorBoundary: React.FC<{ children: React.ReactNode; widgetId: string }> = ({ children, widgetId }) => {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setHasError(true)
      setError(new Error(error.message))
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="widget-container">
        <div className="widget-header">
          <h3 className="widget-title">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Widget Error
          </h3>
        </div>
        <div className="widget-content">
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              Failed to load widget
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Widget ID: {widgetId}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setHasError(false)
                setError(null)
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  try {
    return <>{children}</>
  } catch (err) {
    setHasError(true)
    setError(err as Error)
    return null
  }
}

// Missing Widget Implementations
const NotificationsWidget = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New claim assigned', message: 'CLM-2024-015 requires immediate attention', type: 'info', read: false, time: '5 min ago' },
    { id: 2, title: 'Payment processed', message: '$3,250 deposited to your account', type: 'success', read: false, time: '1 hour ago' },
    { id: 3, title: 'Deadline reminder', message: 'Report due for CLM-2024-008 tomorrow', type: 'warning', read: true, time: '2 hours ago' }
  ])

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <Bell className="h-5 w-5" />
          Notifications
        </h3>
      </div>
      <div className="widget-content">
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                notif.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
              }`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{notif.title}</span>
                {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{notif.message}</p>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TaskManagerWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete inspection report', completed: false, priority: 'high', dueDate: '2024-01-16' },
    { id: 2, title: 'Submit photos for CLM-2024-001', completed: true, priority: 'medium', dueDate: '2024-01-15' },
    { id: 3, title: 'Schedule follow-up meeting', completed: false, priority: 'low', dueDate: '2024-01-18' }
  ])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <CheckSquare className="h-5 w-5" />
          Task Manager
        </h3>
      </div>
      <div className="widget-content">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="rounded"
              />
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </p>
                <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
              </div>
              <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DocumentVaultWidget = () => {
  const [documents] = useState([
    { id: 1, name: 'CLM-2024-001-Report.pdf', type: 'report', size: '2.4 MB', date: '2024-01-15' },
    { id: 2, name: 'Property-Photos.zip', type: 'photos', size: '15.8 MB', date: '2024-01-14' },
    { id: 3, name: 'Settlement-Agreement.docx', type: 'legal', size: '1.2 MB', date: '2024-01-13' }
  ])

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">
          <FolderOpen className="h-5 w-5" />
          Document Vault
        </h3>
      </div>
      <div className="widget-content">
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <FileText className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Available widgets configuration - Comprehensive AI Dashboard Library
const AVAILABLE_WIDGETS: WidgetData[] = [
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    icon: Clock,
    component: RecentActivityWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 6 }
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: CheckCircle2,
    component: TasksWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 6, h: 8 }
  },
  {
    id: 'analytics',
    title: 'My Stats',
    icon: BarChart3,
    component: AnalyticsWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    maxSize: { w: 6, h: 4 }
  },
  {
    id: 'recent-claims',
    title: 'Recent Claims',
    icon: FileText,
    component: RecentClaimsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'earnings',
    title: 'Monthly Earnings',
    icon: DollarSign,
    component: EarningsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 6 }
  },
  {
    id: 'active-firms',
    title: 'Active Firms',
    icon: Building2,
    component: ActiveFirmsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'performance',
    title: 'Performance Metrics',
    icon: TrendingUp,
    component: PerformanceWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 6 }
  },
  {
    id: 'available-claims',
    title: 'Available Claims',
    icon: FileText,
    component: AvailableClaimsWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    icon: Brain,
    component: AIInsightsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 8, h: 6 }
  },
  {
    id: 'claim-analytics',
    title: 'Claim Analytics',
    icon: BarChart3,
    component: ClaimAnalyticsWidget,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 12, h: 8 }
  },
  {
    id: 'weather-alerts',
    title: 'Weather Alerts',
    icon: CloudRain,
    component: WeatherAlertsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 6 }
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    component: CalendarWidget,
    defaultSize: { w: 5, h: 6 },
    minSize: { w: 4, h: 5 },
    maxSize: { w: 8, h: 10 }
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    component: NotificationsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 8 }
  },
  {
    id: 'task-manager',
    title: 'Task Manager',
    icon: CheckSquare,
    component: TaskManagerWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'document-vault',
    title: 'Document Vault',
    icon: FolderOpen,
    component: DocumentVaultWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'communication',
    title: 'Messages',
    icon: MessageSquare,
    component: CommunicationWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 8 }
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    icon: Zap,
    component: QuickActionsWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 6, h: 6 }
  },
  {
    id: 'market-trends',
    title: 'Market Trends',
    icon: LineChart,
    component: MarketTrendsWidget,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 12, h: 6 }
  },
  {
    id: 'compliance-tracker',
    title: 'Compliance Tracker',
    icon: Shield,
    component: ComplianceTrackerWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 8, h: 6 }
  }
]

// Responsive breakpoints - Fixed for proper desktop/mobile detection
const BREAKPOINTS = { lg: 1200, md: 992, sm: 768, xs: 576, xxs: 0 }
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
const ROW_HEIGHT = 80
const MARGINS = { lg: [12, 12], md: [12, 12], sm: [8, 8], xs: [8, 8], xxs: [4, 4] }
const CONTAINER_PADDING = { lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0], xxs: [0, 0] }

interface DashboardWidgetsProps {
  editMode?: boolean
  onEditModeChange?: (editMode: boolean) => void
}

export default function DashboardWidgets({ editMode = false, onEditModeChange, onRef }: DashboardWidgetsProps) {
  const [activeWidgets, setActiveWidgets] = useState<string[]>(['recent-activity', 'analytics', 'recent-claims', 'earnings', 'active-firms'])
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [mounted, setMounted] = useState(false)
  const [internalEditMode, setInternalEditMode] = useState(editMode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure component is mounted before rendering grid
  useEffect(() => {
    setMounted(true)

    // Add error handling for localStorage
    try {
      const savedLayouts = localStorage.getItem('dashboard-layouts')
      if (savedLayouts) {
        setLayouts(JSON.parse(savedLayouts))
      }

      const savedActiveWidgets = localStorage.getItem('dashboard-active-widgets')
      if (savedActiveWidgets) {
        setActiveWidgets(JSON.parse(savedActiveWidgets))
      }
    } catch (err) {
      console.warn('Failed to load saved dashboard data:', err)
      setError('Failed to load saved dashboard layout')
    }
  }, [])

  // Load saved layouts from localStorage
  useEffect(() => {
    if (mounted) {
      const savedLayouts = localStorage.getItem('dashboard-layouts')
      if (savedLayouts) {
        try {
          setLayouts(JSON.parse(savedLayouts))
        } catch (error) {
          console.error('Failed to parse saved layouts:', error)
        }
      }
    }
  }, [mounted])

  // Generate default layouts for all breakpoints with smart positioning
  const generateLayouts = useCallback(() => {
    const newLayouts: { [key: string]: Layout[] } = {}

    Object.keys(COLS).forEach(breakpoint => {
      const cols = COLS[breakpoint as keyof typeof COLS]
      let currentX = 0
      let currentY = 0

      newLayouts[breakpoint] = activeWidgets.map((widgetId) => {
        const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId)
        if (!widget) return { i: widgetId, x: 0, y: 0, w: 3, h: 3 }

        // Adjust widget size for smaller screens
        let widgetWidth = widget.defaultSize.w
        let widgetHeight = widget.defaultSize.h

        if (breakpoint === 'xs' || breakpoint === 'xxs') {
          widgetWidth = Math.min(widgetWidth, cols)
          widgetHeight = Math.max(4, widgetHeight) // Ensure minimum height of 4 for readability
        } else if (breakpoint === 'sm') {
          widgetWidth = Math.min(widgetWidth, Math.floor(cols / 2))
          widgetHeight = Math.max(3, widgetHeight) // Ensure minimum height of 3 for small screens
        }

        // Check if widget fits in current row
        if (currentX + widgetWidth > cols) {
          currentX = 0
          currentY += widgetHeight
        }

        const layout = {
          i: widgetId,
          x: currentX,
          y: currentY,
          w: widgetWidth,
          h: widgetHeight,
          minW: Math.min(widget.minSize.w, cols),
          minH: widget.minSize.h,
          maxW: widget.maxSize?.w || cols,
          maxH: widget.maxSize?.h || 8
        }

        currentX += widgetWidth

        return layout
      })
    })

    return newLayouts
  }, [activeWidgets])

  // Memoized layouts with error handling
  const currentLayouts = useMemo(() => {
    try {
      if (Object.keys(layouts).length === 0) {
        return generateLayouts()
      }
      return layouts
    } catch (err) {
      console.error('Failed to generate layouts:', err)
      setError('Failed to generate widget layouts')
      return {}
    }
  }, [layouts, generateLayouts])

  // Handle layout change with error handling
  const handleLayoutChange = useCallback((_currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    try {
      setLayouts(allLayouts)
      localStorage.setItem('dashboard-layouts', JSON.stringify(allLayouts))
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error('Failed to save layout:', err)
      setError('Failed to save dashboard layout')
    }
  }, [])

  // Add widget with proper sizing and error handling
  const addWidget = useCallback((widgetId: string) => {
    try {
      if (!activeWidgets.includes(widgetId)) {
        setIsLoading(true)
        setActiveWidgets(prev => [...prev, widgetId])
        setError(null)

        // Force regeneration of layouts to ensure proper default sizing
        setTimeout(() => {
          try {
            const newLayouts = generateLayouts()
            setLayouts(newLayouts)
            localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts))
            localStorage.setItem('dashboard-active-widgets', JSON.stringify([...activeWidgets, widgetId]))
            setIsLoading(false)
          } catch (err) {
            console.error('Failed to generate layouts:', err)
            setError('Failed to add widget layout')
            setIsLoading(false)
          }
        }, 0)
      }
    } catch (err) {
      console.error('Failed to add widget:', err)
      setError('Failed to add widget')
      setIsLoading(false)
    }
  }, [activeWidgets, generateLayouts])

  // Remove widget with error handling
  const removeWidget = useCallback((widgetId: string) => {
    try {
      const newActiveWidgets = activeWidgets.filter(id => id !== widgetId)
      setActiveWidgets(newActiveWidgets)

      // Remove from layouts
      const newLayouts = { ...layouts }
      Object.keys(newLayouts).forEach(breakpoint => {
        newLayouts[breakpoint] = newLayouts[breakpoint].filter(item => item.i !== widgetId)
      })
      setLayouts(newLayouts)
      localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts))
      localStorage.setItem('dashboard-active-widgets', JSON.stringify(newActiveWidgets))
      setError(null)
    } catch (err) {
      console.error('Failed to remove widget:', err)
      setError('Failed to remove widget')
    }
  }, [layouts])

  // Sync internal edit mode with prop
  useEffect(() => {
    setInternalEditMode(editMode)
  }, [editMode])

  // Save layout method
  const saveLayout = useCallback(() => {
    try {
      localStorage.setItem('dashboard-layouts', JSON.stringify(layouts))
      localStorage.setItem('dashboard-active-widgets', JSON.stringify(activeWidgets))
      console.log('Dashboard layout saved successfully')
    } catch (err) {
      console.error('Failed to save dashboard layout:', err)
      setError('Failed to save dashboard layout')
    }
  }, [layouts, activeWidgets])

  // Expose methods to parent component
  useEffect(() => {
    if (onRef) {
      onRef({
        addWidget,
        saveLayout,
        getAvailableWidgets: () => AVAILABLE_WIDGETS.filter(widget => !activeWidgets.includes(widget.id))
      })
    }
  }, [onRef, addWidget, saveLayout, activeWidgets])

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    const newEditMode = !internalEditMode
    setInternalEditMode(newEditMode)
    onEditModeChange?.(newEditMode)
  }, [internalEditMode, onEditModeChange])

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96" />
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm">Updating dashboard...</span>
            </div>
          </div>
        </div>
      )}

      {/* Widget Status Display - Only show in edit mode */}
      {internalEditMode && (
        <div className="flex justify-center">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {activeWidgets.length} active • {AVAILABLE_WIDGETS.length - activeWidgets.length} available
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={currentLayouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        margin={MARGINS}
        containerPadding={CONTAINER_PADDING}
        isDraggable={internalEditMode}
        isResizable={internalEditMode}
        onLayoutChange={handleLayoutChange}
        useCSSTransforms={true}
        compactType="vertical"
        preventCollision={false}
        autoSize={true}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        draggableHandle=".widget-header"
      >
        {activeWidgets.map(widgetId => {
          const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId)
          if (!widget) return null

          const WidgetComponent = widget.component

          return (
            <div
              key={widgetId}
              className={`widget-grid-item ${internalEditMode ? 'edit-mode' : ''}`}
            >
              {internalEditMode && (
                <>
                  {/* Remove Widget Button */}
                  <div className="absolute -top-1 -right-1 z-30 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 bg-red-500/95 hover:bg-red-600 text-white shadow-md rounded-full border border-white/20 hover:scale-110 transition-all duration-200"
                      onClick={() => removeWidget(widgetId)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>

                  {/* Edit Mode Overlay */}
                  <div className="absolute inset-0 z-10 bg-blue-500/5 border-2 border-blue-500/30 rounded-lg pointer-events-none" />
                </>
              )}

              <div className="relative h-full w-full overflow-hidden">
                <ErrorBoundary widgetId={widgetId}>
                  <WidgetComponent />
                </ErrorBoundary>
              </div>
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}
