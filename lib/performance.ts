/**
 * Performance Optimization Utilities for Flex.IA
 * 
 * Utilities for lazy loading, memoization, and performance monitoring
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react'
import { debounce } from 'lodash'

// Lazy loading with error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const module = await importFn()
      return module
    } catch (error) {
      console.error('Failed to load component:', error)
      // Return fallback component or error component
      if (fallback) {
        return { default: fallback }
      }
      throw error
    }
  })
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const duration = end - start
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }
      
      this.metrics.get(label)!.push(duration)
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`)
      }
    }
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } | null {
    const times = this.metrics.get(label)
    if (!times || times.length === 0) return null

    return {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    }
  }

  getAllMetrics(): Record<string, ReturnType<PerformanceMonitor['getMetrics']>> {
    const result: Record<string, any> = {}
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label)
    }
    return result
  }

  clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label)
    } else {
      this.metrics.clear()
    }
  }
}

// Performance timing decorator
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  label: string
): T {
  const monitor = PerformanceMonitor.getInstance()
  
  return ((...args: Parameters<T>) => {
    const endTiming = monitor.startTiming(label)
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(endTiming)
      }
      
      endTiming()
      return result
    } catch (error) {
      endTiming()
      throw error
    }
  }) as T
}

// Debounced state updater
export function createDebouncedUpdater<T>(
  setter: (value: T) => void,
  delay: number = 300
) {
  return debounce(setter, delay)
}

// Memoization utilities
export function createMemoizedSelector<T, R>(
  selector: (data: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) {
  let lastInput: T
  let lastOutput: R
  let hasRun = false

  return (input: T): R => {
    if (!hasRun || input !== lastInput) {
      const newOutput = selector(input)
      
      if (!hasRun || !equalityFn || !equalityFn(lastOutput, newOutput)) {
        lastOutput = newOutput
      }
      
      lastInput = input
      hasRun = true
    }
    
    return lastOutput
  }
}

// Virtual scrolling utilities
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { startIndex: number; endIndex: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = options
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2)
  const offsetY = startIndex * itemHeight

  return { startIndex, endIndex, offsetY }
}

// Image lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// Bundle size analysis
export function logBundleSize(componentName: string, size?: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Component loaded: ${componentName}${size ? ` (${size}kb)` : ''}`)
  }
}

// Memory usage monitoring
export function monitorMemoryUsage(label: string) {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log(`🧠 Memory usage for ${label}:`, {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
    })
  }
}

// React performance utilities
export function shouldComponentUpdate<T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
  keys?: (keyof T)[]
): boolean {
  const keysToCheck = keys || Object.keys(nextProps) as (keyof T)[]
  
  return keysToCheck.some(key => prevProps[key] !== nextProps[key])
}

// Throttled scroll handler
export function createThrottledScrollHandler(
  handler: (event: Event) => void,
  delay: number = 16 // ~60fps
) {
  let ticking = false
  
  return (event: Event) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler(event)
        ticking = false
      })
      ticking = true
    }
  }
}

// Preload resources
export function preloadResource(href: string, as: string = 'script'): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

// Code splitting utilities
export const WIDGET_CHUNKS = {
  RECENT_CLAIMS: () => import('../components/widgets/recent-claims-widget'),
  MY_PAYOUTS: () => import('../components/widgets/my-payouts-widget'),
  AVAILABLE_CLAIMS: () => import('../components/widgets/available-claims-widget'),
  MY_FIRMS: () => import('../components/widgets/my-firms-widget'),
  ANALYTICS: () => import('../components/widgets/analytics-widget'),
  RECENT_ACTIVITY: () => import('../components/widgets/recent-activity-widget'),
  CALENDAR: () => import('../components/widgets/calendar-widget'),
  NOTIFICATIONS: () => import('../components/widgets/notifications-widget'),
  WEATHER: () => import('../components/widgets/weather-widget'),
  AI_INSIGHTS: () => import('../components/widgets/ai-insights-widget')
} as const

export type WidgetType = keyof typeof WIDGET_CHUNKS

// Lazy load widget components
export function createLazyWidget(type: WidgetType) {
  return createLazyComponent(WIDGET_CHUNKS[type])
}

// Performance budget monitoring
export interface PerformanceBudget {
  maxBundleSize: number // KB
  maxLoadTime: number // ms
  maxMemoryUsage: number // MB
}

export function checkPerformanceBudget(
  budget: PerformanceBudget,
  actual: Partial<PerformanceBudget>
): { passed: boolean; violations: string[] } {
  const violations: string[] = []
  
  if (actual.maxBundleSize && actual.maxBundleSize > budget.maxBundleSize) {
    violations.push(`Bundle size exceeded: ${actual.maxBundleSize}KB > ${budget.maxBundleSize}KB`)
  }
  
  if (actual.maxLoadTime && actual.maxLoadTime > budget.maxLoadTime) {
    violations.push(`Load time exceeded: ${actual.maxLoadTime}ms > ${budget.maxLoadTime}ms`)
  }
  
  if (actual.maxMemoryUsage && actual.maxMemoryUsage > budget.maxMemoryUsage) {
    violations.push(`Memory usage exceeded: ${actual.maxMemoryUsage}MB > ${budget.maxMemoryUsage}MB`)
  }
  
  return {
    passed: violations.length === 0,
    violations
  }
}
