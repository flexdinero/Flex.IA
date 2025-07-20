import DOMPurify from 'isomorphic-dompurify'

interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: { [key: string]: string[] }
  allowedSchemes?: string[]
  allowedClasses?: { [key: string]: string[] }
  transformTags?: { [key: string]: string | ((tagName: string, attribs: any) => any) }
}

const defaultOptions: SanitizeOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'span', 'div'
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'div': ['class'],
    'span': ['class'],
    'p': ['class'],
    'h1': ['class'],
    'h2': ['class'],
    'h3': ['class'],
    'h4': ['class'],
    'h5': ['class'],
    'h6': ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedClasses: {
    'div': ['highlight', 'code-block', 'quote'],
    'span': ['highlight', 'emphasis'],
    'p': ['lead', 'caption']
  }
}

export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  const mergedOptions = { ...defaultOptions, ...options }
  
  // Configure DOMPurify
  const config = {
    ALLOWED_TAGS: mergedOptions.allowedTags,
    ALLOWED_ATTR: Object.keys(mergedOptions.allowedAttributes || {}).reduce((acc, tag) => {
      const attrs = mergedOptions.allowedAttributes![tag]
      return [...acc, ...attrs]
    }, [] as string[]),
    ALLOWED_URI_REGEXP: new RegExp(
      `^(?:(?:${(mergedOptions.allowedSchemes || []).join('|')}):)`,
      'i'
    )
  }

  return DOMPurify.sanitize(html, config)
}

export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

export function sanitizeAndTruncate(html: string, maxLength: number = 200): string {
  const sanitized = sanitizeHtml(html)
  const stripped = stripHtml(sanitized)
  
  if (stripped.length <= maxLength) {
    return sanitized
  }
  
  return stripped.substring(0, maxLength) + '...'
}

interface SanitizedHtmlProps {
  html: string
  options?: SanitizeOptions
  className?: string
}

export function SanitizedHtml({ html, options = {}, className }: SanitizedHtmlProps) {
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(html, options) 
      }} 
    />
  )
}
