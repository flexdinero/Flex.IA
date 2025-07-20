"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  blurDataURL?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = '/images/placeholder.jpg',
  blurDataURL,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority) // Load immediately if priority
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

// Lazy loading wrapper for any component
interface LazyComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export function LazyComponent({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  className,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyComponentProps) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  )
}

// Progressive image loading with multiple sizes
interface ProgressiveImageProps {
  src: string
  lowQualitySrc?: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (lowQualitySrc && lowQualitySrc !== src) {
      // Load high quality image in background
      const img = new window.Image()
      img.onload = () => {
        setCurrentSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    } else {
      setIsLoaded(true)
    }
  }, [src, lowQualitySrc])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-all duration-500',
          !isLoaded && lowQualitySrc ? 'blur-sm scale-105' : 'blur-0 scale-100'
        )}
      />
    </div>
  )
}

// Lazy loading hook
export function useLazyLoading(threshold = 0.1, rootMargin = '50px') {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isInView }
}
