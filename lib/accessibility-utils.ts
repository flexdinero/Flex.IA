/**
 * Accessibility Utilities for Flex.IA
 * 
 * Comprehensive utilities for ensuring WCAG 2.1 AA compliance
 * across all components and interactions.
 */

// ARIA role definitions
export const ARIA_ROLES = {
  // Navigation roles
  navigation: 'navigation',
  banner: 'banner',
  main: 'main',
  contentinfo: 'contentinfo',
  search: 'search',
  
  // Interactive roles
  button: 'button',
  link: 'link',
  menuitem: 'menuitem',
  tab: 'tab',
  tabpanel: 'tabpanel',
  dialog: 'dialog',
  alertdialog: 'alertdialog',
  
  // Content roles
  article: 'article',
  region: 'region',
  complementary: 'complementary',
  form: 'form',
  table: 'table',
  grid: 'grid',
  
  // Status roles
  alert: 'alert',
  status: 'status',
  progressbar: 'progressbar',
  log: 'log'
} as const

// ARIA properties and states
export const ARIA_PROPS = {
  // Labels and descriptions
  label: 'aria-label',
  labelledby: 'aria-labelledby',
  describedby: 'aria-describedby',
  
  // States
  expanded: 'aria-expanded',
  selected: 'aria-selected',
  checked: 'aria-checked',
  disabled: 'aria-disabled',
  hidden: 'aria-hidden',
  pressed: 'aria-pressed',
  
  // Properties
  haspopup: 'aria-haspopup',
  controls: 'aria-controls',
  owns: 'aria-owns',
  live: 'aria-live',
  atomic: 'aria-atomic',
  relevant: 'aria-relevant',
  
  // Values
  valuemin: 'aria-valuemin',
  valuemax: 'aria-valuemax',
  valuenow: 'aria-valuenow',
  valuetext: 'aria-valuetext'
} as const

// Keyboard navigation constants
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const

// Focus management utilities
export const focusUtils = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')
    
    return Array.from(container.querySelectorAll(focusableSelectors))
  },
  
  // Trap focus within a container (for modals, dropdowns)
  trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
    const focusableElements = focusUtils.getFocusableElements(container)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.key === KEYBOARD_KEYS.TAB) {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
  },
  
  // Set focus to first focusable element
  focusFirst: (container: HTMLElement) => {
    const focusableElements = focusUtils.getFocusableElements(container)
    focusableElements[0]?.focus()
  },
  
  // Restore focus to previously focused element
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus()
    }
  }
}

// Screen reader utilities
export const screenReaderUtils = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  // Create visually hidden text for screen readers
  createScreenReaderText: (text: string): HTMLSpanElement => {
    const span = document.createElement('span')
    span.className = 'sr-only'
    span.textContent = text
    return span
  }
}

// Color contrast utilities
export const colorContrastUtils = {
  // Calculate relative luminance
  getRelativeLuminance: (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    // Apply gamma correction
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    // Calculate relative luminance
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  },
  
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const l1 = colorContrastUtils.getRelativeLuminance(color1)
    const l2 = colorContrastUtils.getRelativeLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  },
  
  // Check if contrast ratio meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrastUtils.getContrastRatio(color1, color2)
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7
  }
}

// Accessibility validation utilities
export const a11yValidation = {
  // Validate form accessibility
  validateForm: (form: HTMLFormElement): string[] => {
    const issues: string[] = []
    
    // Check for labels
    const inputs = form.querySelectorAll('input, select, textarea')
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      form.querySelector(`label[for="${input.id}"]`)
      
      if (!hasLabel) {
        issues.push(`Input ${index + 1} missing label`)
      }
    })
    
    // Check for fieldsets in complex forms
    const radioGroups = form.querySelectorAll('input[type="radio"]')
    if (radioGroups.length > 1) {
      const hasFieldset = form.querySelector('fieldset')
      if (!hasFieldset) {
        issues.push('Radio button groups should be wrapped in fieldset')
      }
    }
    
    return issues
  },
  
  // Validate button accessibility
  validateButton: (button: HTMLButtonElement): string[] => {
    const issues: string[] = []
    
    // Check for accessible name
    const hasAccessibleName = button.textContent?.trim() ||
                             button.getAttribute('aria-label') ||
                             button.getAttribute('aria-labelledby')
    
    if (!hasAccessibleName) {
      issues.push('Button missing accessible name')
    }
    
    // Check for proper role if not a button element
    if (button.tagName !== 'BUTTON' && !button.getAttribute('role')) {
      issues.push('Interactive element should have button role')
    }
    
    return issues
  },
  
  // Validate heading structure
  validateHeadings: (container: HTMLElement): string[] => {
    const issues: string[] = []
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    let previousLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      
      if (index === 0 && level !== 1) {
        issues.push('First heading should be h1')
      }
      
      if (level > previousLevel + 1) {
        issues.push(`Heading level skipped: ${heading.tagName} after h${previousLevel}`)
      }
      
      previousLevel = level
    })
    
    return issues
  }
}

// Common accessibility patterns
export const a11yPatterns = {
  // Modal dialog pattern
  modal: {
    open: (modal: HTMLElement, trigger: HTMLElement) => {
      modal.setAttribute('role', 'dialog')
      modal.setAttribute('aria-modal', 'true')
      modal.setAttribute('aria-labelledby', modal.querySelector('h1, h2, h3')?.id || '')
      
      // Store previous focus
      modal.dataset.previousFocus = trigger.id || ''
      
      // Focus first element in modal
      focusUtils.focusFirst(modal)
      
      // Add escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
          a11yPatterns.modal.close(modal)
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      modal.dataset.escapeHandler = 'true'
    },
    
    close: (modal: HTMLElement) => {
      // Restore focus
      const previousFocusId = modal.dataset.previousFocus
      if (previousFocusId) {
        const previousElement = document.getElementById(previousFocusId)
        focusUtils.restoreFocus(previousElement)
      }
      
      // Remove escape handler
      if (modal.dataset.escapeHandler) {
        document.removeEventListener('keydown', () => {})
        delete modal.dataset.escapeHandler
      }
    }
  },
  
  // Dropdown/combobox pattern
  dropdown: {
    setup: (trigger: HTMLElement, menu: HTMLElement) => {
      trigger.setAttribute('aria-haspopup', 'true')
      trigger.setAttribute('aria-expanded', 'false')
      trigger.setAttribute('aria-controls', menu.id)
      
      menu.setAttribute('role', 'menu')
      menu.querySelectorAll('[role="menuitem"]').forEach((item, index) => {
        item.setAttribute('tabindex', index === 0 ? '0' : '-1')
      })
    },
    
    open: (trigger: HTMLElement, menu: HTMLElement) => {
      trigger.setAttribute('aria-expanded', 'true')
      focusUtils.focusFirst(menu)
    },
    
    close: (trigger: HTMLElement, menu: HTMLElement) => {
      trigger.setAttribute('aria-expanded', 'false')
      trigger.focus()
    }
  }
}

// Export CSS classes for screen reader only content
export const SR_ONLY_CLASSES = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'
