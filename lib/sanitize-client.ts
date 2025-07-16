"use client"

import DOMPurify from 'dompurify'

// Client-side HTML sanitization with DOMPurify
export function sanitizeHtmlClient(html: string, options?: {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  stripTags?: boolean
}): string {
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
    allowedAttributes = { a: ['href', 'title'] },
    stripTags = false
  } = options || {}

  if (stripTags) {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}

// Hook for client-side sanitization
export function useSanitize() {
  const sanitizeHtml = (html: string, options?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    stripTags?: boolean
  }) => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return html // Return unsanitized on server, will be sanitized on client
    }
    
    return sanitizeHtmlClient(html, options)
  }

  return { sanitizeHtml }
}

// Client-side content sanitization component
interface SanitizedContentProps {
  html: string
  options?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    stripTags?: boolean
  }
  className?: string
}

export function SanitizedContent({ html, options, className }: SanitizedContentProps) {
  const { sanitizeHtml } = useSanitize()
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(html, options) 
      }} 
    />
  )
}
