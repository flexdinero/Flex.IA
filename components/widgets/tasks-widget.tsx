"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Search, 
  Filter, 
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
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Task, TaskFilter, TaskStats } from '@/types/tasks'
import { TaskForm } from './task-form'
import { TaskItem } from './task-item'
import { TaskFilters } from './task-filters'
import { TaskStats as TaskStatsComponent } from './task-stats'
import { BulkActions } from './bulk-actions'
import { useTasks } from '@/hooks/use-tasks'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface TasksWidgetProps {
  className?: string
  compact?: boolean
  maxHeight?: number
}

export function TasksWidget({ className, compact = false, maxHeight = 600 }: TasksWidgetProps) {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    bulkUpdateTasks,
    stats
  } = useTasks()

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all', priority: 'all', category: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Status filter
    if (filter.status === 'completed' && !task.completed) return false
    if (filter.status === 'pending' && task.completed) return false
    if (filter.status === 'overdue' && (task.completed || !task.dueDate || task.dueDate > new Date())) return false

    // Priority filter
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false

    // Category filter
    if (filter.category !== 'all' && task.category !== filter.category) return false

    return true
  })

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed, updatedAt: new Date() })
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId)
    setSelectedTasks(prev => prev.filter(id => id !== taskId))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    reorderTasks(sourceIndex, destinationIndex)
  }

  const handleBulkSelect = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTasks(prev => [...prev, taskId])
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (task: Task) => {
    if (task.completed) return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (task.dueDate && task.dueDate < new Date()) return <AlertCircle className="h-4 w-4 text-red-600" />
    return <Circle className="h-4 w-4 text-gray-400" />
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Tasks
            {filteredTasks.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredTasks.filter(t => !t.completed).length}/{filteredTasks.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {!compact && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStats(!showStats)}
                  className="h-8 w-8"
                  title="View statistics"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 w-8"
                  title="Filter tasks"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingTask(null)
                setShowForm(true)
              }}
              className="h-8 w-8"
              title="Add new task"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Quick Stats */}
        {!compact && stats && (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
              <div className="text-xs text-blue-600">Total</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Done</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {/* Filters */}
        {showFilters && (
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Stats */}
        {showStats && stats && (
          <TaskStatsComponent
            stats={stats}
            onClose={() => setShowStats(false)}
          />
        )}

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <BulkActions
            selectedCount={selectedTasks.length}
            onSelectAll={handleSelectAll}
            onClearSelection={() => setSelectedTasks([])}
            onBulkAction={(action) => {
              bulkUpdateTasks(selectedTasks, action)
              setSelectedTasks([])
            }}
          />
        )}

        {/* Task List */}
        <ScrollArea className="h-full" style={{ maxHeight: maxHeight - 200 }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading tasks</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                {searchQuery || filter.status !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first task
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-1 p-3"
                  >
                    {filteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "transition-all duration-200",
                              snapshot.isDragging && "shadow-lg scale-105"
                            )}
                          >
                            <TaskItem
                              task={task}
                              compact={compact}
                              selected={selectedTasks.includes(task.id)}
                              onSelect={(selected) => handleBulkSelect(task.id, selected)}
                              onComplete={(completed) => handleTaskComplete(task.id, completed)}
                              onEdit={() => handleTaskEdit(task)}
                              onDelete={() => handleTaskDelete(task.id)}
                              dragHandleProps={provided.dragHandleProps}
                              showBulkSelect={bulkMode || selectedTasks.length > 0}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </ScrollArea>
      </CardContent>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={(taskData) => {
            if (editingTask) {
              updateTask(editingTask.id, { ...taskData, updatedAt: new Date() })
            } else {
              addTask(taskData)
            }
            setShowForm(false)
            setEditingTask(null)
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </Card>
  )
}
