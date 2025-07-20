import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import React from 'react'

export interface ErrorResponse {
  error: string
  message?: string
  details?: any
  code?: string
  timestamp: string
  requestId?: string
}

export class AppError extends Error {
  public statusCode: number
  public code?: string
  public details?: any

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service error', service?: string) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', { service })
    this.name = 'ExternalServiceError'
  }
}

// Error logging service
class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(error: Error, context?: any) {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }

    if (this.isDevelopment) {
      console.error('Error:', errorInfo)
    } else {
      // In production, send to logging service (e.g., Sentry, LogRocket, etc.)
      this.sendToLoggingService(errorInfo)
    }
  }

  private sendToLoggingService(errorInfo: any) {
    // TODO: Implement integration with external logging service
    console.error('Production Error:', errorInfo)
  }
}

const errorLogger = new ErrorLogger()

// Main error handler function
export function handleError(
  error: unknown,
  request?: NextRequest,
  context?: any
): NextResponse {
  const requestId = request?.headers.get('x-request-id') || generateRequestId()
  
  // Log the error
  errorLogger.log(error as Error, {
    ...context,
    requestId,
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers.get('user-agent')
  })

  let statusCode = 500
  let errorMessage = 'Internal server error'
  let errorCode = 'INTERNAL_ERROR'
  let details: any = undefined

  if (error instanceof AppError) {
    statusCode = error.statusCode
    errorMessage = error.message
    errorCode = error.code || 'APP_ERROR'
    details = error.details
  } else if (error instanceof ZodError) {
    statusCode = 400
    errorMessage = 'Validation error'
    errorCode = 'VALIDATION_ERROR'
    details = error.errors
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { statusCode: code, message, details: prismaDetails } = handlePrismaError(error)
    statusCode = code
    errorMessage = message
    errorCode = 'DATABASE_ERROR'
    details = prismaDetails
  } else if (error instanceof Error) {
    errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
  }

  const errorResponse: ErrorResponse = {
    error: errorMessage,
    code: errorCode,
    timestamp: new Date().toISOString(),
    requestId
  }

  if (details) {
    errorResponse.details = details
  }

  return NextResponse.json(errorResponse, { status: statusCode })
}

// Handle Prisma-specific errors
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'A record with this information already exists',
        details: { field: error.meta?.target }
      }
    case 'P2025':
      return {
        statusCode: 404,
        message: 'Record not found',
        details: { cause: error.meta?.cause }
      }
    case 'P2003':
      return {
        statusCode: 400,
        message: 'Foreign key constraint failed',
        details: { field: error.meta?.field_name }
      }
    case 'P2014':
      return {
        statusCode: 400,
        message: 'Invalid ID provided',
        details: { relation: error.meta?.relation_name }
      }
    default:
      return {
        statusCode: 500,
        message: 'Database error occurred',
        details: { code: error.code }
      }
  }
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Async error wrapper for API routes
export function asyncHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleError(error, request, context)
    }
  }
}

// Error boundary for React components (to be used in error.tsx files)
// Note: This should be implemented in a .tsx file for JSX support
export function createErrorBoundary(fallback?: React.ComponentType<{ error: Error }>) {
  // This is a placeholder - actual implementation should be in a .tsx file
  console.warn('Error boundary should be implemented in a .tsx file')
  return React.Component
}

// Validation helpers
export function validateRequired(value: any, fieldName: string) {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long')
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  }
}

export { errorLogger }
