import { NextRequest, NextResponse } from 'next/server'

interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}

interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  tags?: string[] // Cache tags for invalidation
  key?: string // Custom cache key
  revalidate?: boolean // Whether to revalidate in background
}

// In-memory cache store (in production, use Redis or similar)
class MemoryCache {
  private store = new Map<string, CacheEntry>()
  private timers = new Map<string, NodeJS.Timeout>()

  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const { ttl = 300000, tags = [] } = config // Default 5 minutes
    const timestamp = Date.now()

    // Clear existing timer
    const existingTimer = this.timers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set cache entry
    this.store.set(key, {
      data,
      timestamp,
      ttl,
      tags
    })

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)
    this.timers.set(key, timer)
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): boolean {
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }
    return this.store.delete(key)
  }

  clear(): void {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.timers.clear()
    this.store.clear()
  }

  invalidateByTag(tag: string): number {
    let count = 0
    for (const [key, entry] of this.store.entries()) {
      if (entry.tags?.includes(tag)) {
        this.delete(key)
        count++
      }
    }
    return count
  }

  size(): number {
    return this.store.size
  }

  keys(): string[] {
    return Array.from(this.store.keys())
  }

  getStats(): {
    size: number
    entries: Array<{ key: string; timestamp: number; ttl: number; tags?: string[] }>
  } {
    return {
      size: this.store.size,
      entries: Array.from(this.store.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        tags: entry.tags
      }))
    }
  }
}

// Global cache instance
const cache = new MemoryCache()

// Cache wrapper function
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  cache.set(key, data, config)
  
  return data
}

// Memoization decorator
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: CacheConfig & { keyGenerator?: (...args: Parameters<T>) => string } = {}
): T {
  const { keyGenerator = (...args) => JSON.stringify(args), ...cacheConfig } = config

  return (async (...args: Parameters<T>) => {
    const key = `memoized:${fn.name}:${keyGenerator(...args)}`
    return withCache(key, () => fn(...args), cacheConfig)
  }) as T
}

// HTTP response caching
export function cacheResponse(
  response: NextResponse,
  config: {
    maxAge?: number // Cache-Control max-age in seconds
    sMaxAge?: number // Cache-Control s-maxage in seconds
    staleWhileRevalidate?: number // stale-while-revalidate in seconds
    mustRevalidate?: boolean
    noCache?: boolean
    private?: boolean
  } = {}
): NextResponse {
  const {
    maxAge = 300, // 5 minutes default
    sMaxAge,
    staleWhileRevalidate,
    mustRevalidate = false,
    noCache = false,
    private: isPrivate = false
  } = config

  if (noCache) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  const cacheDirectives = []
  
  if (isPrivate) {
    cacheDirectives.push('private')
  } else {
    cacheDirectives.push('public')
  }
  
  cacheDirectives.push(`max-age=${maxAge}`)
  
  if (sMaxAge) {
    cacheDirectives.push(`s-maxage=${sMaxAge}`)
  }
  
  if (staleWhileRevalidate) {
    cacheDirectives.push(`stale-while-revalidate=${staleWhileRevalidate}`)
  }
  
  if (mustRevalidate) {
    cacheDirectives.push('must-revalidate')
  }

  response.headers.set('Cache-Control', cacheDirectives.join(', '))
  
  // Add ETag for conditional requests
  const etag = `"${Date.now()}"`
  response.headers.set('ETag', etag)
  
  return response
}

// Request-based caching middleware
export function createCacheMiddleware(defaultConfig: CacheConfig = {}) {
  return async (
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const method = request.method
    const url = request.url
    
    // Only cache GET requests
    if (method !== 'GET') {
      return handler()
    }

    // Generate cache key
    const cacheKey = `http:${url}`
    
    // Check for cached response
    const cached = cache.get<{
      status: number
      headers: Record<string, string>
      body: string
    }>(cacheKey)
    
    if (cached) {
      const response = new NextResponse(cached.body, {
        status: cached.status,
        headers: cached.headers
      })
      response.headers.set('X-Cache', 'HIT')
      return response
    }

    // Execute handler
    const response = await handler()
    
    // Cache successful responses
    if (response.status === 200) {
      const body = await response.text()
      const headers: Record<string, string> = {}
      
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      
      cache.set(cacheKey, {
        status: response.status,
        headers,
        body
      }, defaultConfig)
      
      // Create new response with cached body
      const newResponse = new NextResponse(body, {
        status: response.status,
        headers: response.headers
      })
      newResponse.headers.set('X-Cache', 'MISS')
      return newResponse
    }

    return response
  }
}

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate by key
  invalidate: (key: string) => cache.delete(key),
  
  // Invalidate by tag
  invalidateTag: (tag: string) => cache.invalidateByTag(tag),
  
  // Invalidate by pattern
  invalidatePattern: (pattern: RegExp) => {
    const keys = cache.keys().filter(key => pattern.test(key))
    keys.forEach(key => cache.delete(key))
    return keys.length
  },
  
  // Clear all cache
  clear: () => cache.clear(),
  
  // Get cache stats
  stats: () => cache.getStats()
}

// Predefined cache configurations
export const cacheConfigs = {
  // Short-term cache (1 minute)
  short: { ttl: 60 * 1000 },
  
  // Medium-term cache (5 minutes)
  medium: { ttl: 5 * 60 * 1000 },
  
  // Long-term cache (1 hour)
  long: { ttl: 60 * 60 * 1000 },
  
  // User-specific cache
  user: (userId: string) => ({
    ttl: 5 * 60 * 1000,
    tags: [`user:${userId}`]
  }),
  
  // Claims cache
  claims: {
    ttl: 2 * 60 * 1000, // 2 minutes
    tags: ['claims']
  },
  
  // Firms cache
  firms: {
    ttl: 10 * 60 * 1000, // 10 minutes
    tags: ['firms']
  },
  
  // Analytics cache
  analytics: {
    ttl: 15 * 60 * 1000, // 15 minutes
    tags: ['analytics']
  }
}

// Export cache instance for direct access
export { cache }

// Utility functions
export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(':')
}

export function isCacheHit(response: Response): boolean {
  return response.headers.get('X-Cache') === 'HIT'
}
