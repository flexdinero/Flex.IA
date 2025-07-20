/**
 * Comprehensive Error Handling System for Flex.IA
 * 
 * Centralized error handling, logging, and user-friendly error messages
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Error types for classification
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  FILE_UPLOAD = 'FILE_UPLOAD',
  PAYMENT = 'PAYMENT',
  INTERNAL = 'INTERNAL'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly severity: ErrorSeverity
  public readonly statusCode: number
  public readonly userMessage: string
  public readonly context?: Record<string, any>
  public readonly timestamp: Date

  constructor(
    message: string,
    type: ErrorType,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode: number = 500,
    userMessage?: string,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.severity = severity
    this.statusCode = statusCode
    this.userMessage = userMessage || this.getDefaultUserMessage(type)
    this.context = context
    this.timestamp = new Date()

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages = {
      [ErrorType.VALIDATION]: 'Please check your input and try again.',
      [ErrorType.AUTHENTICATION]: 'Please log in to continue.',
      [ErrorType.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorType.CONFLICT]: 'This action conflicts with existing data.',
      [ErrorType.RATE_LIMIT]: 'Too many requests. Please try again later.',
      [ErrorType.EXTERNAL_SERVICE]: 'External service is temporarily unavailable.',
      [ErrorType.DATABASE]: 'Database operation failed. Please try again.',
      [ErrorType.FILE_UPLOAD]: 'File upload failed. Please try again.',
      [ErrorType.PAYMENT]: 'Payment processing failed. Please try again.',
      [ErrorType.INTERNAL]: 'An unexpected error occurred. Please try again.'
    }
    return messages[type]
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      statusCode: this.statusCode,
      userMessage: this.userMessage,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

// Error factory functions
export const createValidationError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.VALIDATION, ErrorSeverity.LOW, 400, undefined, context)

export const createAuthenticationError = (message: string = 'Authentication required') =>
  new AppError(message, ErrorType.AUTHENTICATION, ErrorSeverity.MEDIUM, 401)

export const createAuthorizationError = (message: string = 'Insufficient permissions') =>
  new AppError(message, ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, 403)

export const createNotFoundError = (resource: string) =>
  new AppError(`${resource} not found`, ErrorType.NOT_FOUND, ErrorSeverity.LOW, 404)

export const createConflictError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.CONFLICT, ErrorSeverity.MEDIUM, 409, undefined, context)

export const createRateLimitError = (message: string = 'Rate limit exceeded') =>
  new AppError(message, ErrorType.RATE_LIMIT, ErrorSeverity.MEDIUM, 429)

export const createExternalServiceError = (service: string, originalError?: Error) =>
  new AppError(
    `${service} service error: ${originalError?.message || 'Unknown error'}`,
    ErrorType.EXTERNAL_SERVICE,
    ErrorSeverity.HIGH,
    503,
    undefined,
    { service, originalError: originalError?.message }
  )

export const createDatabaseError = (operation: string, originalError?: Error) =>
  new AppError(
    `Database ${operation} failed: ${originalError?.message || 'Unknown error'}`,
    ErrorType.DATABASE,
    ErrorSeverity.HIGH,
    500,
    undefined,
    { operation, originalError: originalError?.message }
  )

export const createFileUploadError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.FILE_UPLOAD, ErrorSeverity.MEDIUM, 400, undefined, context)

export const createPaymentError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.PAYMENT, ErrorSeverity.HIGH, 400, undefined, context)

export const createInternalError = (message: string, originalError?: Error) =>
  new AppError(
    message,
    ErrorType.INTERNAL,
    ErrorSeverity.CRITICAL,
    500,
    undefined,
    { originalError: originalError?.message, stack: originalError?.stack }
  )

// Error classification function
export function classifyError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    return createValidationError(`Validation failed: ${details}`, { zodErrors: error.errors })
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return createConflictError('Unique constraint violation', { field: error.meta?.target })
      case 'P2025':
        return createNotFoundError('Record')
      case 'P2003':
        return createConflictError('Foreign key constraint violation')
      default:
        return createDatabaseError('operation', error)
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return createDatabaseError('unknown operation', error)
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return createValidationError('Database validation error', { prismaError: error.message })
  }

  // Standard JavaScript errors
  if (error instanceof Error) {
    // Network/fetch errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return createExternalServiceError('Network', error)
    }

    // File system errors
    if (error.message.includes('ENOENT') || error.message.includes('file')) {
      return createFileUploadError('File operation failed', { originalError: error.message })
    }

    // Generic error
    return createInternalError(error.message, error)
  }

  // Unknown error type
  return createInternalError('Unknown error occurred', new Error(String(error)))
}

// Error logging interface
export interface ErrorLogger {
  log(error: AppError, context?: Record<string, any>): Promise<void>
}

// Console error logger (development)
export class ConsoleErrorLogger implements ErrorLogger {
  async log(error: AppError, context?: Record<string, any>): Promise<void> {
    const logData = {
      ...error.toJSON(),
      context
    }

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', logData)
        break
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH SEVERITY ERROR:', logData)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️  MEDIUM SEVERITY ERROR:', logData)
        break
      case ErrorSeverity.LOW:
        console.info('ℹ️  LOW SEVERITY ERROR:', logData)
        break
    }
  }
}

// Production error logger (would integrate with Sentry, DataDog, etc.)
export class ProductionErrorLogger implements ErrorLogger {
  async log(error: AppError, context?: Record<string, any>): Promise<void> {
    try {
      // TODO: Integrate with production error monitoring service
      // Example: Sentry, DataDog, LogRocket, etc.
      
      const errorData = {
        ...error.toJSON(),
        context,
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version
      }

      // For now, log to console in production
      console.error('Production Error:', JSON.stringify(errorData, null, 2))

      // In a real implementation, you would send to your error monitoring service:
      // await sentryClient.captureException(error, { extra: context })
      // await datadogLogger.error(errorData)
      
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }
}

// Error logger singleton
const errorLogger: ErrorLogger = process.env.NODE_ENV === 'production' 
  ? new ProductionErrorLogger()
  : new ConsoleErrorLogger()

// Main error handling function
export async function handleError(
  error: unknown,
  context?: Record<string, any>
): Promise<{ error: AppError; response: NextResponse }> {
  const appError = classifyError(error)
  
  // Log the error
  await errorLogger.log(appError, context)

  // Create response
  const response = NextResponse.json(
    {
      error: appError.userMessage,
      type: appError.type,
      ...(process.env.NODE_ENV === 'development' && {
        details: appError.message,
        stack: appError.stack
      })
    },
    { status: appError.statusCode }
  )

  return { error: appError, response }
}

// Async wrapper for error handling
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const { error: appError } = await handleError(error, { 
        function: fn.name,
        arguments: args 
      })
      throw appError
    }
  }
}

// API route error handler
export function apiErrorHandler(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      const { response } = await handleError(error, {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries())
      })
      return response
    }
  }
}
