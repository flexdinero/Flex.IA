"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckSquare,
  Square,
  Trash2,
  Flag,
  Tag,
  X,
  CheckCircle2,
  Circle
} from 'lucide-react'
import { BulkAction } from '@/types/tasks'

interface BulkActionsProps {
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkAction: (action: BulkAction) => void
}

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High Priority', color: 'text-red-600' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
  { value: 'low', label: 'Low Priority', color: 'text-green-600' }
]

const CATEGORY_OPTIONS = [
  { value: 'work', label: 'Work', color: 'text-blue-600' },
  { value: 'personal', label: 'Personal', color: 'text-green-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
  { value: 'health', label: 'Health', color: 'text-purple-600' },
  { value: 'finance', label: 'Finance', color: 'text-yellow-600' },
  { value: 'learning', label: 'Learning', color: 'text-indigo-600' },
  { value: 'other', label: 'Other', color: 'text-gray-600' }
]

export function BulkActions({ 
  selectedCount, 
  onSelectAll, 
  onClearSelection, 
  onBulkAction 
}: BulkActionsProps) {
  return (
    <div className="border-b border-gray-200 bg-blue-50 p-3">
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-xs h-7 text-blue-700 hover:text-blue-800"
          >
            <CheckSquare className="h-3 w-3 mr-1" />
            Select All
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs h-7 text-gray-600 hover:text-gray-800"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {/* Complete/Incomplete */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction({ type: 'complete', value: true })}
            className="text-xs h-7 bg-white"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Complete
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction({ type: 'complete', value: false })}
            className="text-xs h-7 bg-white"
          >
            <Circle className="h-3 w-3 mr-1" />
            Incomplete
          </Button>

          {/* Priority */}
          <Select onValueChange={(value) => onBulkAction({ type: 'priority', value })}>
            <SelectTrigger className="h-7 w-32 text-xs bg-white">
              <div className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Flag className={`h-3 w-3 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category */}
          <Select onValueChange={(value) => onBulkAction({ type: 'category', value })}>
            <SelectTrigger className="h-7 w-32 text-xs bg-white">
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>Category</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Tag className={`h-3 w-3 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Delete */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction({ type: 'delete' })}
            className="text-xs h-7 bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
