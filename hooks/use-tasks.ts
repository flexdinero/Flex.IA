"use client"

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskStats, BulkAction } from '@/types/tasks'

// Local storage key
const TASKS_STORAGE_KEY = 'flex-ia-tasks'

// Mock initial tasks for demonstration
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review insurance claim documentation',
    description: 'Go through the submitted documents for claim #12345 and verify all required information is present.',
    completed: false,
    priority: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    progress: 60,
    tags: ['urgent', 'documentation'],
    estimatedTime: 120,
    assignee: 'John Doe'
  },
  {
    id: '2',
    title: 'Schedule property inspection',
    description: 'Contact property owner to arrange inspection for water damage claim.',
    completed: true,
    priority: 'medium',
    category: 'work',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    progress: 100,
    tags: ['inspection', 'contact'],
    estimatedTime: 30,
    actualTime: 25
  },
  {
    id: '3',
    title: 'Update personal fitness goals',
    description: 'Review and adjust monthly fitness targets based on current progress.',
    completed: false,
    priority: 'low',
    category: 'personal',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 0,
    tags: ['health', 'goals'],
    estimatedTime: 45
  },
  {
    id: '4',
    title: 'Complete quarterly tax preparation',
    description: 'Gather all necessary documents and file quarterly tax returns.',
    completed: false,
    priority: 'high',
    category: 'finance',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    progress: 25,
    tags: ['taxes', 'deadline'],
    estimatedTime: 180
  }
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }))
        setTasks(parsedTasks)
      } else {
        // First time - use initial tasks
        setTasks(INITIAL_TASKS)
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS))
      }
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError('Failed to load tasks')
      setTasks(INITIAL_TASKS)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  const saveTasks = useCallback((newTasks: Task[]) => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks))
    } catch (err) {
      console.error('Error saving tasks:', err)
      setError('Failed to save tasks')
    }
  }, [])

  // Add new task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTasks(prev => {
      const updated = [newTask, ...prev]
      saveTasks(updated)
      return updated
    })
  }, [saveTasks])

  // Update existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
      saveTasks(updated)
      return updated
    })
  }, [saveTasks])

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const updated = prev.filter(task => task.id !== taskId)
      saveTasks(updated)
      return updated
    })
  }, [saveTasks])

  // Reorder tasks (for drag and drop)
  const reorderTasks = useCallback((sourceIndex: number, destinationIndex: number) => {
    setTasks(prev => {
      const updated = [...prev]
      const [removed] = updated.splice(sourceIndex, 1)
      updated.splice(destinationIndex, 0, removed)
      saveTasks(updated)
      return updated
    })
  }, [saveTasks])

  // Bulk update tasks
  const bulkUpdateTasks = useCallback((taskIds: string[], action: BulkAction) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (!taskIds.includes(task.id)) return task

        const updates: Partial<Task> = { updatedAt: new Date() }

        switch (action.type) {
          case 'complete':
            updates.completed = action.value
            if (action.value) updates.progress = 100
            break
          case 'priority':
            updates.priority = action.value
            break
          case 'category':
            updates.category = action.value
            break
          case 'delete':
            return null // Will be filtered out
          default:
            return task
        }

        return { ...task, ...updates }
      }).filter(Boolean) as Task[]

      saveTasks(updated)
      return updated
    })
  }, [saveTasks])

  // Calculate statistics
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      task.dueDate < new Date()
    ).length,
    completionRate: tasks.length > 0 
      ? (tasks.filter(task => task.completed).length / tasks.length) * 100 
      : 0,
    avgCompletionTime: tasks
      .filter(task => task.completed && task.actualTime)
      .reduce((acc, task) => acc + (task.actualTime || 0), 0) / 
      Math.max(1, tasks.filter(task => task.completed && task.actualTime).length)
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    bulkUpdateTasks,
    stats
  }
}
