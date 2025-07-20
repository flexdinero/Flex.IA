"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MoreVertical, 
  Calendar,
  Clock,
  Flag,
  Tag,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  GripVertical,
  Star,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Task } from '@/types/tasks'
import { formatDistanceToNow, isToday, isPast } from 'date-fns'

interface TaskItemProps {
  task: Task
  compact?: boolean
  selected?: boolean
  onSelect?: (selected: boolean) => void
  onComplete: (completed: boolean) => void
  onEdit: () => void
  onDelete: () => void
  dragHandleProps?: any
  showBulkSelect?: boolean
}

export function TaskItem({
  task,
  compact = false,
  selected = false,
  onSelect,
  onComplete,
  onEdit,
  onDelete,
  dragHandleProps,
  showBulkSelect = false
}: TaskItemProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700'
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700'
      case 'low': return 'border-green-500 bg-green-50 text-green-700'
      default: return 'border-gray-300 bg-gray-50 text-gray-700'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="h-3 w-3 text-red-600" />
      case 'medium': return <Flag className="h-3 w-3 text-yellow-600" />
      case 'low': return <Flag className="h-3 w-3 text-green-600" />
      default: return <Flag className="h-3 w-3 text-gray-400" />
    }
  }

  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed
  const isDueToday = task.dueDate && isToday(task.dueDate)

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isPast(date)) return `Overdue ${formatDistanceToNow(date)} ago`
    return `Due ${formatDistanceToNow(date)}`
  }

  return (
    <div
      className={cn(
        "group border rounded-lg p-3 transition-all duration-200 hover:shadow-md",
        task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200",
        isOverdue && "border-red-200 bg-red-50",
        isDueToday && !task.completed && "border-blue-200 bg-blue-50",
        selected && "ring-2 ring-blue-500 border-blue-500"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Bulk Select Checkbox */}
        {showBulkSelect && (
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            className="mt-0.5"
          />
        )}

        {/* Task Completion Checkbox */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={onComplete}
          className="mt-0.5"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={cn(
                "font-medium text-sm truncate",
                task.completed && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h4>
            
            {task.priority !== 'low' && (
              <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", getPriorityColor(task.priority))}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && !compact && (
            <p className={cn(
              "text-xs text-gray-600 mb-2 line-clamp-2",
              task.completed && "text-gray-400"
            )}>
              {task.description}
            </p>
          )}

          {/* Progress Bar */}
          {task.progress > 0 && task.progress < 100 && !compact && (
            <div className="mb-2">
              <Progress value={task.progress} className="h-1.5" />
              <span className="text-xs text-gray-500">{task.progress}% complete</span>
            </div>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Due Date */}
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600",
                isDueToday && "text-blue-600"
              )}>
                <Calendar className="h-3 w-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* Category */}
            {task.category && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span className="capitalize">{task.category}</span>
              </div>
            )}

            {/* Estimated Time */}
            {task.estimatedTime && !compact && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{task.estimatedTime}m</span>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && !compact && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee}</span>
              </div>
            )}

            {/* Subtasks Count */}
            {task.subtasks && task.subtasks.length > 0 && !compact && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Subtasks */}
          {showDetails && task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <h5 className="text-xs font-medium text-gray-700 mb-2">Subtasks</h5>
              <div className="space-y-1">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => {
                        // Handle subtask completion
                      }}
                      className="h-3 w-3"
                    />
                    <span className={cn(
                      "text-xs",
                      subtask.completed && "line-through text-gray-500"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Task
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onComplete(!task.completed)}>
              {task.completed ? (
                <>
                  <Circle className="h-4 w-4 mr-2" />
                  Mark Incomplete
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </DropdownMenuItem>

            {task.subtasks && task.subtasks.length > 0 && (
              <DropdownMenuItem onClick={() => setShowDetails(!showDetails)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Subtasks
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
