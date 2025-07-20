import { useState, useCallback } from 'react'

export interface ErrorState {
  message: string
  type?: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  context?: Record<string, any>
}

export interface UseErrorHandlerReturn {
  error: ErrorState | null
  isError: boolean
  clearError: () => void
  handleError: (error: unknown, context?: Record<string, any>) => void
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ) => Promise<T | null>
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<ErrorState | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const classifyError = useCallback((error: unknown): Partial<ErrorState> => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      
      // Network errors
      if (message.includes('fetch') || 
          message.includes('network') || 
          message.includes('timeout') ||
          message.includes('abort')) {
        return {
          type: 'network',
          severity: 'medium'
        }
      }
      
      // Authentication errors
      if (message.includes('unauthorized') || 
          message.includes('authentication') ||
          message.includes('login')) {
        return {
          type: 'authentication',
          severity: 'medium'
        }
      }
      
      // Authorization errors
      if (message.includes('forbidden') || 
          message.includes('permission') ||
          message.includes('access denied')) {
        return {
          type: 'authorization',
          severity: 'medium'
        }
      }
      
      // Validation errors
      if (message.includes('validation') || 
          message.includes('invalid') ||
          message.includes('required')) {
        return {
          type: 'validation',
          severity: 'low'
        }
      }
      
      // Server errors
      if (message.includes('server') || 
          message.includes('internal') ||
          message.includes('500')) {
        return {
          type: 'server',
          severity: 'high'
        }
      }
    }
    
    return {
      type: 'unknown',
      severity: 'medium'
    }
  }, [])

  const logError = useCallback(async (errorState: ErrorState) => {
    try {
      // Only log in browser environment
      if (typeof window === 'undefined') return

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'client_error',
          severity: errorState.severity,
          message: errorState.message,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: errorState.timestamp.toISOString(),
          context: errorState.context
        })
      })
    } catch (loggingError) {
      // Silent fail for error logging
      console.error('Failed to log error:', loggingError)
    }
  }, [])

  const handleError = useCallback((error: unknown, context?: Record<string, any>) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const classification = classifyError(error)
    
    const errorState: ErrorState = {
      message: errorMessage,
      timestamp: new Date(),
      context,
      ...classification
    }
    
    setError(errorState)
    
    // Log error asynchronously
    logError(errorState)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorState)
    }
  }, [classifyError, logError])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      clearError()
      return await asyncFn()
    } catch (error) {
      handleError(error, context)
      return null
    }
  }, [clearError, handleError])

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
    handleAsyncError
  }
}

// Utility function to create user-friendly error messages
export function getUserFriendlyMessage(error: ErrorState): string {
  const baseMessages = {
    network: 'Connection problem. Please check your internet and try again.',
    validation: 'Please check your input and try again.',
    authentication: 'Please log in to continue.',
    authorization: 'You do not have permission to perform this action.',
    server: 'Server error. Please try again later.',
    unknown: 'An unexpected error occurred. Please try again.'
  }

  const severityPrefixes = {
    low: '',
    medium: '',
    high: 'Important: ',
    critical: 'Critical: '
  }

  const prefix = severityPrefixes[error.severity || 'medium']
  const baseMessage = baseMessages[error.type || 'unknown']
  
  return `${prefix}${baseMessage}`
}

// Hook for handling API errors specifically
export function useApiErrorHandler() {
  const { handleError, ...rest } = useErrorHandler()

  const handleApiError = useCallback(async (response: Response) => {
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage
      }

      const error = new Error(errorMessage)
      handleError(error, {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })
      
      return false
    }
    
    return true
  }, [handleError])

  const fetchWithErrorHandling = useCallback(async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response | null> => {
    try {
      const response = await fetch(input, init)
      const isSuccess = await handleApiError(response)
      return isSuccess ? response : null
    } catch (error) {
      handleError(error, {
        url: typeof input === 'string' ? input : input.toString(),
        method: init?.method || 'GET'
      })
      return null
    }
  }, [handleApiError, handleError])

  return {
    ...rest,
    handleApiError,
    fetchWithErrorHandling
  }
}

// Hook for form error handling
export function useFormErrorHandler() {
  const { handleError, ...rest } = useErrorHandler()

  const handleValidationError = useCallback((
    fieldErrors: Record<string, string[]>
  ) => {
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      .join('; ')
    
    handleError(new Error(`Validation failed: ${errorMessages}`), {
      type: 'validation',
      fieldErrors
    })
  }, [handleError])

  const handleSubmissionError = useCallback((error: unknown) => {
    handleError(error, { type: 'form_submission' })
  }, [handleError])

  return {
    ...rest,
    handleValidationError,
    handleSubmissionError
  }
}
