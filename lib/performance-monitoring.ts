/**
 * Production Performance Monitoring System
 * 
 * Comprehensive performance monitoring for Flex.IA including
 * Core Web Vitals, custom metrics, and real-time monitoring
 */

// Core Web Vitals and performance metrics
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  fcp: number | null // First Contentful Paint
  ttfb: number | null // Time to First Byte
  
  // Custom metrics
  pageLoadTime: number
  domContentLoaded: number
  resourceLoadTime: number
  memoryUsage: number
  
  // User experience metrics
  timeToInteractive: number | null
  totalBlockingTime: number | null
  
  // Page info
  url: string
  userAgent: string
  timestamp: Date
  userId?: string
  sessionId: string
}

// Performance observer for Core Web Vitals
class PerformanceMonitoringService {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeMonitoring()
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }
  
  private initializeMonitoring() {
    if (typeof window === 'undefined') return
    
    // Initialize basic metrics
    this.metrics = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      sessionId: this.sessionId,
      pageLoadTime: 0,
      domContentLoaded: 0,
      resourceLoadTime: 0,
      memoryUsage: this.getMemoryUsage()
    }
    
    // Monitor Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    this.observeTTFB()
    
    // Monitor page load metrics
    this.observePageLoad()
    
    // Monitor resource loading
    this.observeResourceTiming()
    
    // Send metrics when page is about to unload
    this.setupBeforeUnload()
  }
  
  private observeLCP() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
      })
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('LCP observation failed:', error)
    }
  }
  
  private observeFID() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-input') {
            this.metrics.fid = entry.processingStart - entry.startTime
          }
        })
      })
      
      observer.observe({ type: 'first-input', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FID observation failed:', error)
    }
  }
  
  private observeCLS() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
          }
        })
      })
      
      observer.observe({ type: 'layout-shift', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('CLS observation failed:', error)
    }
  }
  
  private observeFCP() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
          }
        })
      })
      
      observer.observe({ type: 'paint', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FCP observation failed:', error)
    }
  }
  
  private observeTTFB() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.requestStart
          }
        })
      })
      
      observer.observe({ type: 'navigation', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('TTFB observation failed:', error)
    }
  }
  
  private observePageLoad() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
    })
  }
  
  private observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        let totalResourceTime = 0
        
        entries.forEach((entry: any) => {
          totalResourceTime += entry.duration
        })
        
        this.metrics.resourceLoadTime = totalResourceTime
      })
      
      observer.observe({ type: 'resource', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Resource timing observation failed:', error)
    }
  }
  
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024 // MB
    }
    return 0
  }
  
  private setupBeforeUnload() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('beforeunload', () => {
      this.sendMetrics()
    })
    
    // Also send metrics periodically
    setInterval(() => {
      this.sendMetrics()
    }, 30000) // Every 30 seconds
  }
  
  private async sendMetrics() {
    try {
      // Update memory usage
      this.metrics.memoryUsage = this.getMemoryUsage()
      
      // Send to analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.metrics),
        keepalive: true
      })
    } catch (error) {
      console.warn('Failed to send performance metrics:', error)
    }
  }
  
  // Public methods
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }
  
  public trackCustomMetric(name: string, value: number) {
    (this.metrics as any)[name] = value
  }
  
  public setUserId(userId: string) {
    this.metrics.userId = userId
  }
  
  public disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitoringService | null = null

export function initializePerformanceMonitoring(): PerformanceMonitoringService {
  if (typeof window === 'undefined') {
    return null as any
  }
  
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitoringService()
  }
  
  return performanceMonitor
}

export function getPerformanceMonitor(): PerformanceMonitoringService | null {
  return performanceMonitor
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    const monitor = initializePerformanceMonitoring()
    
    return () => {
      monitor?.disconnect()
    }
  }, [])
  
  return {
    trackCustomMetric: (name: string, value: number) => {
      performanceMonitor?.trackCustomMetric(name, value)
    },
    getMetrics: () => {
      return performanceMonitor?.getMetrics() || {}
    }
  }
}

// Performance budget checker
export interface PerformanceBudget {
  lcp: number // ms
  fid: number // ms
  cls: number // score
  fcp: number // ms
  ttfb: number // ms
  pageLoadTime: number // ms
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2500, // 2.5s
  fid: 100, // 100ms
  cls: 0.1, // 0.1 score
  fcp: 1800, // 1.8s
  ttfb: 600, // 600ms
  pageLoadTime: 3000 // 3s
}

export function checkPerformanceBudget(
  metrics: Partial<PerformanceMetrics>,
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET
): { passed: boolean; violations: string[] } {
  const violations: string[] = []
  
  if (metrics.lcp && metrics.lcp > budget.lcp) {
    violations.push(`LCP exceeded: ${metrics.lcp}ms > ${budget.lcp}ms`)
  }
  
  if (metrics.fid && metrics.fid > budget.fid) {
    violations.push(`FID exceeded: ${metrics.fid}ms > ${budget.fid}ms`)
  }
  
  if (metrics.cls && metrics.cls > budget.cls) {
    violations.push(`CLS exceeded: ${metrics.cls} > ${budget.cls}`)
  }
  
  if (metrics.fcp && metrics.fcp > budget.fcp) {
    violations.push(`FCP exceeded: ${metrics.fcp}ms > ${budget.fcp}ms`)
  }
  
  if (metrics.ttfb && metrics.ttfb > budget.ttfb) {
    violations.push(`TTFB exceeded: ${metrics.ttfb}ms > ${budget.ttfb}ms`)
  }
  
  if (metrics.pageLoadTime && metrics.pageLoadTime > budget.pageLoadTime) {
    violations.push(`Page load time exceeded: ${metrics.pageLoadTime}ms > ${budget.pageLoadTime}ms`)
  }
  
  return {
    passed: violations.length === 0,
    violations
  }
}

// Performance analytics API endpoint handler
export async function handlePerformanceAnalytics(metrics: Partial<PerformanceMetrics>) {
  // In production, you would send this to your analytics service
  // Examples: Google Analytics, DataDog, New Relic, etc.
  
  console.log('Performance metrics received:', metrics)
  
  // Check performance budget
  const budgetCheck = checkPerformanceBudget(metrics)
  if (!budgetCheck.passed) {
    console.warn('Performance budget violations:', budgetCheck.violations)
  }
  
  // Store in database for analysis
  // await prisma.performanceMetric.create({ data: metrics })
  
  return { success: true }
}
