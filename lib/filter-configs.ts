import { 
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Archive,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Shield,
  Filter,
  Flag,
  Tag
} from 'lucide-react'
import { FilterConfig } from '@/components/ui/filter-bar'

// Claims Page Filters
export const claimsFilterConfig: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Statuses', icon: Filter },
      { value: 'Available', label: 'Available', icon: Clock, color: 'text-blue-600' },
      { value: 'In Progress', label: 'In Progress', icon: AlertCircle, color: 'text-yellow-600' },
      { value: 'Completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
      { value: 'Overdue', label: 'Overdue', icon: AlertCircle, color: 'text-red-600' }
    ]
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types', icon: FileText },
      { value: 'Property', label: 'Property', icon: Building2, color: 'text-blue-600' },
      { value: 'Auto', label: 'Auto', icon: FileText, color: 'text-green-600' },
      { value: 'Liability', label: 'Liability', icon: Shield, color: 'text-purple-600' },
      { value: 'Hail Damage', label: 'Hail Damage', icon: AlertCircle, color: 'text-orange-600' },
      { value: 'Water Damage', label: 'Water Damage', icon: AlertCircle, color: 'text-cyan-600' }
    ]
  },
  {
    key: 'firm',
    label: 'Firm',
    options: [
      { value: 'all', label: 'All Firms', icon: Building2 },
      { value: 'Crawford & Company', label: 'Crawford & Company', icon: Building2 },
      { value: 'Sedgwick', label: 'Sedgwick', icon: Building2 },
      { value: 'Gallagher Bassett', label: 'Gallagher Bassett', icon: Building2 },
      { value: 'Pilot Catastrophe', label: 'Pilot Catastrophe', icon: Building2 }
    ]
  },
  {
    key: 'priority',
    label: 'Priority',
    options: [
      { value: 'all', label: 'All Priorities', icon: Flag },
      { value: 'High', label: 'High Priority', icon: Flag, color: 'text-red-600' },
      { value: 'Medium', label: 'Medium Priority', icon: Flag, color: 'text-yellow-600' },
      { value: 'Low', label: 'Low Priority', icon: Flag, color: 'text-green-600' }
    ]
  }
]

// Messages Page Filters
export const messagesFilterConfig: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Messages', icon: MessageSquare },
      { value: 'unread', label: 'Unread', icon: AlertCircle, color: 'text-red-600' },
      { value: 'starred', label: 'Starred', icon: Star, color: 'text-yellow-600' },
      { value: 'archived', label: 'Archived', icon: Archive, color: 'text-gray-600' }
    ]
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types', icon: MessageSquare },
      { value: 'direct', label: 'Direct Messages', icon: MessageSquare, color: 'text-blue-600' },
      { value: 'group', label: 'Group Messages', icon: Users, color: 'text-green-600' }
    ]
  },
  {
    key: 'firm',
    label: 'Firm',
    options: [
      { value: 'all', label: 'All Firms', icon: Building2 },
      { value: 'Crawford & Company', label: 'Crawford & Company', icon: Building2 },
      { value: 'Sedgwick', label: 'Sedgwick', icon: Building2 },
      { value: 'Gallagher Bassett', label: 'Gallagher Bassett', icon: Building2 }
    ]
  }
]

// Firms Page Filters
export const firmsFilterConfig: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Statuses', icon: Filter },
      { value: 'Connected', label: 'Connected', icon: CheckCircle, color: 'text-green-600' },
      { value: 'Pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
      { value: 'Disconnected', label: 'Disconnected', icon: AlertCircle, color: 'text-red-600' }
    ]
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types', icon: Building2 },
      { value: 'National', label: 'National', icon: Building2, color: 'text-blue-600' },
      { value: 'Regional', label: 'Regional', icon: Building2, color: 'text-green-600' },
      { value: 'Local', label: 'Local', icon: Building2, color: 'text-purple-600' }
    ]
  },
  {
    key: 'rating',
    label: 'Rating',
    options: [
      { value: 'all', label: 'All Ratings', icon: Star },
      { value: '5', label: '5 Stars', icon: Star, color: 'text-yellow-600' },
      { value: '4', label: '4+ Stars', icon: Star, color: 'text-yellow-600' },
      { value: '3', label: '3+ Stars', icon: Star, color: 'text-yellow-600' }
    ]
  }
]

// Earnings Page Filters
export const earningsFilterConfig: FilterConfig[] = [
  {
    key: 'period',
    label: 'Period',
    options: [
      { value: 'all', label: 'All Time', icon: Calendar },
      { value: 'week', label: 'This Week', icon: Calendar, color: 'text-blue-600' },
      { value: 'month', label: 'This Month', icon: Calendar, color: 'text-green-600' },
      { value: 'quarter', label: 'This Quarter', icon: Calendar, color: 'text-purple-600' },
      { value: 'year', label: 'This Year', icon: Calendar, color: 'text-orange-600' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Payments', icon: DollarSign },
      { value: 'paid', label: 'Paid', icon: CheckCircle, color: 'text-green-600' },
      { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
      { value: 'processing', label: 'Processing', icon: AlertCircle, color: 'text-blue-600' }
    ]
  },
  {
    key: 'firm',
    label: 'Firm',
    options: [
      { value: 'all', label: 'All Firms', icon: Building2 },
      { value: 'Crawford & Company', label: 'Crawford & Company', icon: Building2 },
      { value: 'Sedgwick', label: 'Sedgwick', icon: Building2 },
      { value: 'Gallagher Bassett', label: 'Gallagher Bassett', icon: Building2 }
    ]
  }
]

// Calendar Page Filters
export const calendarFilterConfig: FilterConfig[] = [
  {
    key: 'type',
    label: 'Event Type',
    options: [
      { value: 'all', label: 'All Events', icon: Calendar },
      { value: 'inspection', label: 'Inspections', icon: FileText, color: 'text-blue-600' },
      { value: 'meeting', label: 'Meetings', icon: Users, color: 'text-green-600' },
      { value: 'deadline', label: 'Deadlines', icon: AlertCircle, color: 'text-red-600' },
      { value: 'appointment', label: 'Appointments', icon: Clock, color: 'text-purple-600' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Statuses', icon: Filter },
      { value: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'text-blue-600' },
      { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
      { value: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'text-red-600' }
    ]
  }
]

// Analytics Page Filters
export const analyticsFilterConfig: FilterConfig[] = [
  {
    key: 'metric',
    label: 'Metric',
    options: [
      { value: 'all', label: 'All Metrics', icon: BarChart3 },
      { value: 'earnings', label: 'Earnings', icon: DollarSign, color: 'text-green-600' },
      { value: 'claims', label: 'Claims', icon: FileText, color: 'text-blue-600' },
      { value: 'performance', label: 'Performance', icon: BarChart3, color: 'text-purple-600' }
    ]
  },
  {
    key: 'period',
    label: 'Period',
    options: [
      { value: 'week', label: 'This Week', icon: Calendar, color: 'text-blue-600' },
      { value: 'month', label: 'This Month', icon: Calendar, color: 'text-green-600' },
      { value: 'quarter', label: 'This Quarter', icon: Calendar, color: 'text-purple-600' },
      { value: 'year', label: 'This Year', icon: Calendar, color: 'text-orange-600' }
    ]
  }
]

// Vault Page Filters
export const vaultFilterConfig: FilterConfig[] = [
  {
    key: 'type',
    label: 'Document Type',
    options: [
      { value: 'all', label: 'All Documents', icon: FileText },
      { value: 'contract', label: 'Contracts', icon: FileText, color: 'text-blue-600' },
      { value: 'report', label: 'Reports', icon: FileText, color: 'text-green-600' },
      { value: 'photo', label: 'Photos', icon: FileText, color: 'text-purple-600' },
      { value: 'certificate', label: 'Certificates', icon: Shield, color: 'text-orange-600' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Statuses', icon: Filter },
      { value: 'active', label: 'Active', icon: CheckCircle, color: 'text-green-600' },
      { value: 'archived', label: 'Archived', icon: Archive, color: 'text-gray-600' },
      { value: 'expired', label: 'Expired', icon: AlertCircle, color: 'text-red-600' }
    ]
  }
]
