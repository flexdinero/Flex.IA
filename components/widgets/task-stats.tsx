"use client"

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  X,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Calendar,
  Timer
} from 'lucide-react'
import { TaskStats as TaskStatsType } from '@/types/tasks'

interface TaskStatsProps {
  stats: TaskStatsType
  onClose: () => void
}

export function TaskStats({ stats, onClose }: TaskStatsProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50'
    if (rate >= 60) return 'text-blue-600 bg-blue-50'
    if (rate >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Task Statistics</h3>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Total Tasks</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-500">All time</div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-500">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-medium text-gray-700">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-gray-500">
            {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% remaining
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-gray-700">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-xs text-gray-500">Need attention</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          </div>
          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${getCompletionColor(stats.completionRate)}`}>
            {Math.round(stats.completionRate)}%
          </div>
        </div>
        
        <Progress value={stats.completionRate} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{stats.completed} completed</span>
          <span>{stats.pending} remaining</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Average Completion Time */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Avg. Completion Time</span>
          </div>
          
          <div className="text-xl font-bold text-indigo-600 mb-1">
            {formatTime(stats.avgCompletionTime)}
          </div>
          
          <div className="text-xs text-gray-500">
            Per task average
          </div>
        </div>

        {/* Productivity Trend */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Productivity</span>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xl font-bold text-green-600">
              {stats.completionRate > 75 ? 'High' : stats.completionRate > 50 ? 'Good' : 'Needs Work'}
            </div>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          
          <div className="text-xs text-gray-500">
            Based on completion rate
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Quick Insights</span>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600">
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {stats.completionRate >= 80 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Great job! You're maintaining a high completion rate</span>
            </div>
          )}
          
          {stats.pending > 10 && (
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-3 w-3" />
              <span>Consider breaking down large tasks into smaller ones</span>
            </div>
          )}
          
          {stats.avgCompletionTime > 120 && (
            <div className="flex items-center gap-2 text-blue-600">
              <Timer className="h-3 w-3" />
              <span>Tasks are taking longer than expected on average</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
