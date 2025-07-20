/**
 * Mobile Responsiveness Audit and Fixes
 * 
 * This file contains utilities and configurations for ensuring
 * perfect mobile responsiveness across all viewport sizes.
 */

// Viewport breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  xs: 320,   // Smallest mobile devices
  sm: 640,   // Small mobile devices
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Large laptops
  '2xl': 1536 // Large desktops
} as const

// Touch target minimum sizes (iOS/Android guidelines)
export const TOUCH_TARGETS = {
  minimum: 44,  // 44px minimum for iOS/Android
  recommended: 48, // 48px recommended
  comfortable: 56  // 56px for comfortable interaction
} as const

// Common responsive patterns
export const RESPONSIVE_PATTERNS = {
  // Grid patterns that work well across all screen sizes
  cardGrid: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4'
  },
  
  // Navigation patterns
  navigation: {
    mobile: 'flex-col space-y-2',
    desktop: 'sm:flex-row sm:space-y-0 sm:space-x-4'
  },
  
  // Form layouts
  form: {
    mobile: 'space-y-4',
    tablet: 'sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0'
  },
  
  // Stats/metrics cards
  stats: {
    mobile: 'grid-cols-2 gap-2',
    tablet: 'sm:grid-cols-4 sm:gap-4'
  }
} as const

// Mobile-specific CSS classes
export const MOBILE_CLASSES = {
  // Ensure no horizontal scrolling
  container: 'w-full max-w-full overflow-x-hidden',
  
  // Touch-friendly buttons
  touchButton: 'min-h-[44px] min-w-[44px] touch-manipulation',
  
  // Mobile-friendly text sizes
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl'
  },
  
  // Mobile-friendly spacing
  spacing: {
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  },
  
  // Mobile-friendly gaps
  gap: {
    xs: 'gap-1 sm:gap-2',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6'
  }
} as const

// Critical mobile fixes
export const CRITICAL_MOBILE_FIXES = {
  // Prevent horizontal scrolling
  preventHorizontalScroll: [
    'overflow-x-hidden',
    'max-w-full',
    'w-full'
  ],
  
  // Ensure touch targets are large enough
  touchTargets: [
    'min-h-[44px]',
    'min-w-[44px]',
    'touch-manipulation'
  ],
  
  // Mobile-first responsive design
  mobileFirst: [
    'flex-col sm:flex-row',
    'space-y-2 sm:space-y-0 sm:space-x-4',
    'text-sm sm:text-base'
  ],
  
  // Prevent text from being too small
  readableText: [
    'text-sm sm:text-base',
    'leading-relaxed'
  ]
} as const

// Utility functions for responsive design
export const responsiveUtils = {
  // Get appropriate grid columns for different screen sizes
  getGridCols: (itemCount: number) => {
    if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2'
    if (itemCount <= 4) return 'grid-cols-2 sm:grid-cols-4'
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  },
  
  // Get appropriate text size for different content types
  getTextSize: (type: 'label' | 'body' | 'heading' | 'caption') => {
    switch (type) {
      case 'label': return 'text-xs sm:text-sm font-medium'
      case 'body': return 'text-sm sm:text-base'
      case 'heading': return 'text-lg sm:text-xl font-semibold'
      case 'caption': return 'text-xs text-muted-foreground'
      default: return 'text-sm sm:text-base'
    }
  },
  
  // Get appropriate spacing for different contexts
  getSpacing: (context: 'tight' | 'normal' | 'loose') => {
    switch (context) {
      case 'tight': return 'p-2 sm:p-3'
      case 'normal': return 'p-4 sm:p-6'
      case 'loose': return 'p-6 sm:p-8'
      default: return 'p-4 sm:p-6'
    }
  },
  
  // Check if current viewport is mobile
  isMobile: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < BREAKPOINTS.sm
  },
  
  // Check if current viewport is tablet
  isTablet: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= BREAKPOINTS.sm && window.innerWidth < BREAKPOINTS.lg
  },
  
  // Check if current viewport is desktop
  isDesktop: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= BREAKPOINTS.lg
  }
} as const

// Mobile responsiveness checklist
export const MOBILE_CHECKLIST = [
  'All touch targets are at least 44px',
  'No horizontal scrolling on any screen size',
  'Text is readable without zooming',
  'Navigation works on touch devices',
  'Forms are easy to fill on mobile',
  'Tables are responsive or scrollable',
  'Images scale properly',
  'Buttons are touch-friendly',
  'Content reflows properly',
  'Performance is good on mobile'
] as const

// Common mobile issues and their fixes
export const MOBILE_ISSUE_FIXES = {
  horizontalScroll: {
    issue: 'Content causes horizontal scrolling',
    fix: 'Add overflow-x-hidden, max-w-full, and ensure all content fits within viewport'
  },
  
  smallTouchTargets: {
    issue: 'Buttons/links are too small to tap easily',
    fix: 'Ensure minimum 44px height/width for all interactive elements'
  },
  
  unreadableText: {
    issue: 'Text is too small to read comfortably',
    fix: 'Use minimum 16px font size, increase line height'
  },
  
  poorNavigation: {
    issue: 'Navigation is difficult to use on mobile',
    fix: 'Use hamburger menu, ensure touch-friendly spacing'
  },
  
  slowPerformance: {
    issue: 'Page loads slowly on mobile',
    fix: 'Optimize images, lazy load content, minimize JavaScript'
  }
} as const

// Export utility function to apply mobile fixes
export function applyMobileFixes(element: HTMLElement) {
  // Add mobile-friendly classes
  element.classList.add(...CRITICAL_MOBILE_FIXES.preventHorizontalScroll)
  
  // Find and fix touch targets
  const interactiveElements = element.querySelectorAll('button, a, input, select, textarea')
  interactiveElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add(...CRITICAL_MOBILE_FIXES.touchTargets)
    }
  })
  
  // Fix text readability
  const textElements = element.querySelectorAll('p, span, div')
  textElements.forEach(el => {
    if (el instanceof HTMLElement && el.textContent) {
      el.classList.add(...CRITICAL_MOBILE_FIXES.readableText)
    }
  })
}

// Viewport detection hook
export function useViewport() {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768, isMobile: false, isTablet: false, isDesktop: true }
  }
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.sm,
    isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg
  }
}
