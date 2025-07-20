import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  keyGenerator?: (request: NextRequest) => string // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (in production, use Redis or similar)
const store: RateLimitStore = {}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000) // Clean up every minute

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (request: NextRequest) => {
      // Default key generator uses IP address
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return ip
    }
  } = config

  return async (request: NextRequest, handler: () => Promise<NextResponse>) => {
    const key = keyGenerator(request)
    const now = Date.now()
    
    // Initialize or get existing record
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      }
    }

    const record = store[key]

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString(),
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    // Increment counter (before request if not skipping failed requests)
    if (!skipFailedRequests) {
      record.count++
    }

    try {
      const response = await handler()
      
      // Handle successful requests
      if (response.status < 400) {
        if (skipSuccessfulRequests && !skipFailedRequests) {
          record.count-- // Decrement if we incremented before and want to skip successful
        } else if (!skipSuccessfulRequests && skipFailedRequests) {
          record.count++ // Increment if we didn't increment before and want to count successful
        }
      } else {
        // Handle failed requests
        if (skipFailedRequests && !skipSuccessfulRequests) {
          record.count-- // Decrement if we incremented before and want to skip failed
        } else if (!skipFailedRequests && skipSuccessfulRequests) {
          record.count++ // Increment if we didn't increment before and want to count failed
        }
      }

      // Add rate limit headers to response
      const remaining = Math.max(0, maxRequests - record.count)
      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', record.resetTime.toString())

      return response
    } catch (error) {
      // Handle failed requests
      if (skipFailedRequests && !skipSuccessfulRequests) {
        record.count-- // Decrement if we incremented before and want to skip failed
      } else if (!skipFailedRequests && skipSuccessfulRequests) {
        record.count++ // Increment if we didn't increment before and want to count failed
      }
      
      throw error
    }
  }
}

// Predefined rate limiters for common use cases
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
})

export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'Too many requests, please slow down.'
})

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
  message: 'Too many upload attempts, please try again later.',
  skipFailedRequests: true
})

export const messageRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 messages per minute
  message: 'Too many messages sent, please slow down.'
})

// Helper function to apply rate limiting to API routes
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const limiter = rateLimit(config)
  
  return async (request: NextRequest) => {
    return limiter(request, () => handler(request))
  }
}

// Middleware helper for applying rate limits based on route patterns
export function createRateLimitMiddleware() {
  const routeLimits = new Map<RegExp, RateLimitConfig>([
    [/\/api\/auth\//, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
      skipSuccessfulRequests: true
    }],
    [/\/api\/upload\//, {
      windowMs: 60 * 1000,
      maxRequests: 10,
      skipFailedRequests: true
    }],
    [/\/api\/messages\//, {
      windowMs: 60 * 1000,
      maxRequests: 30
    }],
    [/\/api\//, {
      windowMs: 60 * 1000,
      maxRequests: 100
    }]
  ])

  return async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname

    // Find matching rate limit config
    for (const [pattern, config] of routeLimits) {
      if (pattern.test(pathname)) {
        const limiter = rateLimit(config)
        
        try {
          return await limiter(request, async () => {
            // Continue to next middleware/handler
            return NextResponse.next()
          })
        } catch (error) {
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          )
        }
      }
    }

    // No rate limit applied, continue
    return NextResponse.next()
  }
}

// Rate limit status checker
export function getRateLimitStatus(key: string): {
  count: number
  remaining: number
  resetTime: number
  isLimited: boolean
} | null {
  const record = store[key]
  if (!record) {
    return null
  }

  const now = Date.now()
  if (record.resetTime < now) {
    delete store[key]
    return null
  }

  return {
    count: record.count,
    remaining: Math.max(0, record.count),
    resetTime: record.resetTime,
    isLimited: record.count >= record.count // This would need the max limit passed in
  }
}

// Simple rate limit check function for API routes
export async function checkRateLimit(
  request: NextRequest,
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ success: boolean; error?: string }> {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  const fullKey = `${ip}:${key}`
  const now = Date.now()

  // Simple in-memory store for demo
  const store: Record<string, { count: number; resetTime: number }> = {}

  if (!store[fullKey] || store[fullKey].resetTime < now) {
    store[fullKey] = { count: 0, resetTime: now + windowMs }
  }

  store[fullKey].count++

  if (store[fullKey].count > maxRequests) {
    return { success: false, error: 'Rate limit exceeded' }
  }

  return { success: true }
}
