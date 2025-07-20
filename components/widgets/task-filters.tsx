"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  X,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Tag,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TaskFilter } from '@/types/tasks'

interface TaskFiltersProps {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  onClose: () => void
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Tasks', icon: Filter },
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  { value: 'overdue', label: 'Overdue', icon: AlertCircle }
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities', icon: Flag },
  { value: 'high', label: 'High Priority', icon: Flag, color: 'text-red-600' },
  { value: 'medium', label: 'Medium Priority', icon: Flag, color: 'text-yellow-600' },
  { value: 'low', label: 'Low Priority', icon: Flag, color: 'text-green-600' }
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories', icon: Tag },
  { value: 'work', label: 'Work', icon: Tag, color: 'text-blue-600' },
  { value: 'personal', label: 'Personal', icon: Tag, color: 'text-green-600' },
  { value: 'urgent', label: 'Urgent', icon: Tag, color: 'text-red-600' },
  { value: 'health', label: 'Health', icon: Tag, color: 'text-purple-600' },
  { value: 'finance', label: 'Finance', icon: Tag, color: 'text-yellow-600' },
  { value: 'learning', label: 'Learning', icon: Tag, color: 'text-indigo-600' },
  { value: 'other', label: 'Other', icon: Tag, color: 'text-gray-600' }
]

const DUE_DATE_OPTIONS = [
  { value: 'all', label: 'All Dates', icon: Calendar },
  { value: 'today', label: 'Due Today', icon: Calendar, color: 'text-blue-600' },
  { value: 'week', label: 'This Week', icon: Calendar, color: 'text-green-600' },
  { value: 'month', label: 'This Month', icon: Calendar, color: 'text-purple-600' },
  { value: 'overdue', label: 'Overdue', icon: Calendar, color: 'text-red-600' }
]

export function TaskFilters({ filter, onFilterChange, onClose }: TaskFiltersProps) {
  const updateFilter = (key: keyof TaskFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value })
  }

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      dueDate: 'all'
    })
  }

  const hasActiveFilters = 
    filter.status !== 'all' || 
    filter.priority !== 'all' || 
    filter.category !== 'all' || 
    filter.dueDate !== 'all'

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-7"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Status</label>
          <Select
            value={filter.status || 'all'}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", option.color || "text-gray-600")} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Priority</label>
          <Select
            value={filter.priority || 'all'}
            onValueChange={(value) => updateFilter('priority', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", option.color || "text-gray-600")} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Category</label>
          <Select
            value={filter.category || 'all'}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", option.color || "text-gray-600")} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Due Date Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Due Date</label>
          <Select
            value={filter.dueDate || 'all'}
            onValueChange={(value) => updateFilter('dueDate', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DUE_DATE_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", option.color || "text-gray-600")} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filter.status !== 'all' && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              Status: {STATUS_OPTIONS.find(o => o.value === filter.status)?.label}
              <button
                onClick={() => updateFilter('status', 'all')}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filter.priority !== 'all' && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              Priority: {PRIORITY_OPTIONS.find(o => o.value === filter.priority)?.label}
              <button
                onClick={() => updateFilter('priority', 'all')}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filter.category !== 'all' && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              Category: {CATEGORY_OPTIONS.find(o => o.value === filter.category)?.label}
              <button
                onClick={() => updateFilter('category', 'all')}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filter.dueDate !== 'all' && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              Due: {DUE_DATE_OPTIONS.find(o => o.value === filter.dueDate)?.label}
              <button
                onClick={() => updateFilter('dueDate', 'all')}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
