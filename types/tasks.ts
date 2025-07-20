export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  progress: number // 0-100
  tags: string[]
  subtasks?: SubTask[]
  assignee?: string
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface TaskCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export interface TaskFilter {
  status?: 'all' | 'completed' | 'pending' | 'overdue'
  priority?: 'low' | 'medium' | 'high' | 'all'
  category?: string | 'all'
  dueDate?: 'today' | 'week' | 'month' | 'overdue' | 'all'
  search?: string
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
  avgCompletionTime: number
}

export interface BulkAction {
  type: 'complete' | 'delete' | 'move' | 'priority' | 'category'
  value?: any
}

export interface TaskNotification {
  id: string
  taskId: string
  type: 'due_soon' | 'overdue' | 'completed' | 'assigned'
  message: string
  createdAt: Date
  read: boolean
}

export interface TaskSettings {
  defaultCategory: string
  defaultPriority: 'low' | 'medium' | 'high'
  autoSave: boolean
  notifications: {
    dueSoon: boolean
    overdue: boolean
    completed: boolean
  }
  theme: 'light' | 'dark' | 'auto'
  compactView: boolean
  showProgress: boolean
  showSubtasks: boolean
}
