import { NextRequest } from 'next/server'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: any
  userId?: string
  requestId?: string
  service?: string
  action?: string
  duration?: number
  error?: {
    name: string
    message: string
    stack?: string
  }
}

export interface LoggerConfig {
  level: LogLevel
  service: string
  enableConsole: boolean
  enableFile: boolean
  enableExternal: boolean
  externalEndpoint?: string
}

class Logger {
  private config: LoggerConfig
  private logBuffer: LogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.getLogLevelFromEnv(),
      service: process.env.SERVICE_NAME || 'flex-ia',
      enableConsole: process.env.NODE_ENV === 'development',
      enableFile: process.env.ENABLE_FILE_LOGGING === 'true',
      enableExternal: process.env.ENABLE_EXTERNAL_LOGGING === 'true',
      externalEndpoint: process.env.LOGGING_ENDPOINT,
      ...config
    }

    // Start periodic flush for external logging
    if (this.config.enableExternal) {
      this.flushInterval = setInterval(() => {
        this.flushLogs()
      }, 10000) // Flush every 10 seconds
    }
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase()
    switch (level) {
      case 'ERROR': return LogLevel.ERROR
      case 'WARN': return LogLevel.WARN
      case 'INFO': return LogLevel.INFO
      case 'DEBUG': return LogLevel.DEBUG
      case 'TRACE': return LogLevel.TRACE
      default: return LogLevel.INFO
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: any,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.config.service
    }

    if (context) {
      entry.context = context
      entry.userId = context.userId
      entry.requestId = context.requestId
      entry.action = context.action
      entry.duration = context.duration
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }

    return entry
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    const timestamp = entry.timestamp
    const prefix = `[${timestamp}] [${levelName}] [${entry.service}]`
    
    let message = `${prefix} ${entry.message}`
    
    if (entry.userId) {
      message += ` (user: ${entry.userId})`
    }
    
    if (entry.requestId) {
      message += ` (req: ${entry.requestId})`
    }
    
    if (entry.duration) {
      message += ` (${entry.duration}ms)`
    }

    return message
  }

  private writeToConsole(entry: LogEntry) {
    if (!this.config.enableConsole) return

    const message = this.formatConsoleMessage(entry)

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(message, entry.context, entry.error)
        break
      case LogLevel.WARN:
        console.warn(message, entry.context)
        break
      case LogLevel.INFO:
        console.info(message, entry.context)
        break
      case LogLevel.DEBUG:
      case LogLevel.TRACE:
        console.debug(message, entry.context)
        break
    }
  }

  private writeToFile(entry: LogEntry) {
    if (!this.config.enableFile) return
    
    // TODO: Implement file logging with rotation
    // This would typically use a library like winston or pino
    console.log('File logging not implemented yet:', entry)
  }

  private writeToExternal(entry: LogEntry) {
    if (!this.config.enableExternal) return

    // Buffer logs for batch sending
    this.logBuffer.push(entry)

    // If buffer is getting large, flush immediately
    if (this.logBuffer.length >= 100) {
      this.flushLogs()
    }
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0 || !this.config.externalEndpoint) return

    const logs = [...this.logBuffer]
    this.logBuffer = []

    try {
      await fetch(this.config.externalEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LOGGING_API_KEY}`
        },
        body: JSON.stringify({ logs })
      })
    } catch (error) {
      // If external logging fails, fall back to console
      console.error('Failed to send logs to external service:', error)
      logs.forEach(log => this.writeToConsole(log))
    }
  }

  private log(level: LogLevel, message: string, context?: any, error?: Error) {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context, error)

    this.writeToConsole(entry)
    this.writeToFile(entry)
    this.writeToExternal(entry)
  }

  error(message: string, context?: any, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context)
  }

  trace(message: string, context?: any) {
    this.log(LogLevel.TRACE, message, context)
  }

  // Specialized logging methods
  apiRequest(request: NextRequest, context?: any) {
    this.info('API Request', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ...context
    })
  }

  apiResponse(request: NextRequest, status: number, duration: number, context?: any) {
    this.info('API Response', {
      method: request.method,
      url: request.url,
      status,
      duration,
      ...context
    })
  }

  userAction(userId: string, action: string, context?: any) {
    this.info('User Action', {
      userId,
      action,
      ...context
    })
  }

  securityEvent(event: string, context?: any) {
    this.warn('Security Event', {
      event,
      ...context
    })
  }

  performanceMetric(metric: string, value: number, context?: any) {
    this.info('Performance Metric', {
      metric,
      value,
      ...context
    })
  }

  businessEvent(event: string, context?: any) {
    this.info('Business Event', {
      event,
      ...context
    })
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushLogs() // Final flush
  }
}

// Global logger instance
export const logger = new Logger()

// Request logging middleware
export function createRequestLogger() {
  return (request: NextRequest) => {
    const startTime = Date.now()
    const requestId = request.headers.get('x-request-id') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    logger.apiRequest(request, { requestId })

    return {
      requestId,
      logResponse: (status: number, context?: any) => {
        const duration = Date.now() - startTime
        logger.apiResponse(request, status, duration, { requestId, ...context })
      }
    }
  }
}

// Performance monitoring
export function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: any
): T | Promise<T> {
  const startTime = Date.now()

  const logCompletion = (result?: any, error?: Error) => {
    const duration = Date.now() - startTime
    
    if (error) {
      logger.error(`Operation failed: ${operation}`, { duration, ...context }, error)
    } else {
      logger.performanceMetric(operation, duration, context)
    }
  }

  try {
    const result = fn()

    if (result instanceof Promise) {
      return result
        .then(res => {
          logCompletion(res)
          return res
        })
        .catch(err => {
          logCompletion(undefined, err)
          throw err
        })
    } else {
      logCompletion(result)
      return result
    }
  } catch (error) {
    logCompletion(undefined, error as Error)
    throw error
  }
}

// Cleanup on process exit
process.on('exit', () => {
  logger.destroy()
})

process.on('SIGINT', () => {
  logger.destroy()
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.destroy()
  process.exit(0)
})

export default logger
