"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'cards' | 'table' | 'form' | 'navigation'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: "space-y-4",
  cards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  table: "overflow-x-auto",
  form: "space-y-6 max-w-2xl",
  navigation: "flex flex-col sm:flex-row items-start sm:items-center gap-4"
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  '2xl': "max-w-2xl",
  full: "w-full"
}

const paddingClasses = {
  none: "",
  sm: "p-2 sm:p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8"
}

const gapClasses = {
  none: "",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6"
}

export function ResponsiveContainer({
  children,
  className,
  variant = 'default',
  maxWidth = 'full',
  padding = 'none',
  gap = 'none'
}: ResponsiveContainerProps) {
  return (
    <div className={cn(
      variantClasses[variant],
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gridCols = cn(
    `grid`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    gapClasses[gap]
  )

  return (
    <div className={cn(gridCols, className)}>
      {children}
    </div>
  )
}

// Responsive Stack Component
interface ResponsiveStackProps {
  children: ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal' | 'responsive'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: 'none' | 'sm' | 'md' | 'lg'
  wrap?: boolean
}

export function ResponsiveStack({
  children,
  className,
  direction = 'responsive',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    responsive: 'flex flex-col sm:flex-row'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  return (
    <div className={cn(
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-First Breakpoint Hook
export function useBreakpoint() {
  if (typeof window === 'undefined') return 'lg' // SSR fallback
  
  const width = window.innerWidth
  if (width < 640) return 'sm'
  if (width < 768) return 'md'
  if (width < 1024) return 'lg'
  if (width < 1280) return 'xl'
  return '2xl'
}

// Touch-Friendly Button Wrapper
interface TouchButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'large'
}

export function TouchButton({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'default'
}: TouchButtonProps) {
  const sizeClasses = {
    default: 'min-h-[44px] min-w-[44px]', // iOS/Android minimum touch target
    large: 'min-h-[56px] min-w-[56px]'
  }

  return (
    <button
      className={cn(
        sizeClasses[variant],
        'touch-manipulation', // Improves touch responsiveness
        'select-none', // Prevents text selection on touch
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: ReactNode
  className?: string
  size?: {
    default?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  }
  truncate?: boolean | 'mobile' | 'desktop'
}

export function ResponsiveText({
  children,
  className,
  size = { default: 'base' },
  truncate = false
}: ResponsiveTextProps) {
  const sizeClasses = cn(
    size.default && `text-${size.default}`,
    size.sm && `sm:text-${size.sm}`,
    size.md && `md:text-${size.md}`,
    size.lg && `lg:text-${size.lg}`,
    truncate === true && 'truncate',
    truncate === 'mobile' && 'truncate sm:text-clip',
    truncate === 'desktop' && 'sm:truncate'
  )

  return (
    <span className={cn(sizeClasses, className)}>
      {children}
    </span>
  )
}
