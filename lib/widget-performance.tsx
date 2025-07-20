/**
 * Widget Performance Optimization Utilities
 * 
 * Provides optimized widget components with lazy loading,
 * memoization, and performance monitoring
 */

import React, { memo, Suspense, lazy, ComponentType } from 'react'
import { withPerformanceMonitoring } from './performance'

// Widget loading skeleton
const WidgetSkeleton = () => (
  <div className="widget-container animate-pulse">
    <div className="widget-header">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="widget-content space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
)

// Error fallback component
const WidgetErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="widget-container border-red-200 bg-red-50">
    <div className="widget-header">
      <h3 className="text-red-700 font-medium">Widget Error</h3>
    </div>
    <div className="widget-content text-center py-4">
      <p className="text-red-600 text-sm mb-3">
        Failed to load widget: {error.message}
      </p>
      <button
        onClick={retry}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  </div>
)

// Higher-order component for widget optimization
export function withWidgetOptimization<P extends object>(
  WrappedComponent: ComponentType<P>,
  displayName: string
) {
  const OptimizedWidget = memo<P>((props) => {
    const MonitoredComponent = withPerformanceMonitoring(
      WrappedComponent,
      `widget-${displayName}`
    )
    
    return <MonitoredComponent {...props} />
  })
  
  OptimizedWidget.displayName = `Optimized${displayName}Widget`
  return OptimizedWidget
}

// Lazy widget wrapper with error boundary
export function createLazyWidget(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  displayName: string
) {
  const LazyComponent = lazy(importFn)
  
  return memo((props: any) => (
    <Suspense fallback={<WidgetSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  ))
}

// Widget performance metrics
export interface WidgetMetrics {
  renderTime: number
  memoryUsage: number
  rerenderCount: number
  lastRender: Date
}

// Widget performance tracker
class WidgetPerformanceTracker {
  private metrics = new Map<string, WidgetMetrics>()
  
  trackRender(widgetId: string, renderTime: number) {
    const existing = this.metrics.get(widgetId)
    
    this.metrics.set(widgetId, {
      renderTime,
      memoryUsage: this.getMemoryUsage(),
      rerenderCount: (existing?.rerenderCount || 0) + 1,
      lastRender: new Date()
    })
  }
  
  getMetrics(widgetId: string): WidgetMetrics | undefined {
    return this.metrics.get(widgetId)
  }
  
  getAllMetrics(): Map<string, WidgetMetrics> {
    return new Map(this.metrics)
  }
  
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024 // MB
    }
    return 0
  }
  
  getSlowWidgets(threshold: number = 100): string[] {
    const slowWidgets: string[] = []
    
    for (const [widgetId, metrics] of this.metrics) {
      if (metrics.renderTime > threshold) {
        slowWidgets.push(widgetId)
      }
    }
    
    return slowWidgets
  }
  
  getFrequentlyRerendering(threshold: number = 10): string[] {
    const frequent: string[] = []
    
    for (const [widgetId, metrics] of this.metrics) {
      if (metrics.rerenderCount > threshold) {
        frequent.push(widgetId)
      }
    }
    
    return frequent
  }
}

export const widgetPerformanceTracker = new WidgetPerformanceTracker()

// Performance monitoring hook for widgets
export function useWidgetPerformance(widgetId: string) {
  const startTime = React.useRef<number>()
  
  React.useEffect(() => {
    startTime.current = performance.now()
    
    return () => {
      if (startTime.current) {
        const renderTime = performance.now() - startTime.current
        widgetPerformanceTracker.trackRender(widgetId, renderTime)
      }
    }
  })
  
  return {
    getMetrics: () => widgetPerformanceTracker.getMetrics(widgetId),
    getAllMetrics: () => widgetPerformanceTracker.getAllMetrics()
  }
}

// Optimized widget container
export const OptimizedWidgetContainer = memo<{
  children: React.ReactNode
  widgetId: string
  className?: string
}>(({ children, widgetId, className = '' }) => {
  useWidgetPerformance(widgetId)
  
  return (
    <div className={`widget-container ${className}`} data-widget-id={widgetId}>
      {children}
    </div>
  )
})

OptimizedWidgetContainer.displayName = 'OptimizedWidgetContainer'

// Virtual scrolling for large widget lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleRange = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      items.length - 1,
      startIndex + Math.ceil(containerHeight / itemHeight)
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length])
  
  const visibleItems = React.useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    visibleRange
  }
}

// Debounced widget updates
export function useDebouncedWidgetUpdate<T>(
  value: T,
  delay: number = 300
): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Widget intersection observer for lazy loading
export function useWidgetIntersection(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )
    
    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])
  
  return isIntersecting
}

// Performance budget checker for widgets
export function checkWidgetPerformanceBudget() {
  const slowWidgets = widgetPerformanceTracker.getSlowWidgets(100) // 100ms threshold
  const frequentWidgets = widgetPerformanceTracker.getFrequentlyRerendering(10)
  
  if (slowWidgets.length > 0) {
    console.warn('🐌 Slow widgets detected:', slowWidgets)
  }
  
  if (frequentWidgets.length > 0) {
    console.warn('🔄 Frequently re-rendering widgets:', frequentWidgets)
  }
  
  return {
    slowWidgets,
    frequentWidgets,
    passed: slowWidgets.length === 0 && frequentWidgets.length === 0
  }
}
