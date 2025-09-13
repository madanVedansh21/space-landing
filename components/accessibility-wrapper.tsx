"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface AccessibilityWrapperProps {
  children: React.ReactNode
  role?: string
  ariaLabel?: string
  ariaDescription?: string
  announceChanges?: boolean
  className?: string
}

export function AccessibilityWrapper({
  children,
  role,
  ariaLabel,
  ariaDescription,
  announceChanges = false,
  className
}: AccessibilityWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (announceChanges && ref.current) {
      // Create a live region for screen reader announcements
      const liveRegion = document.createElement('div')
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)

      return () => {
        document.body.removeChild(liveRegion)
      }
    }
  }, [announceChanges])

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescription}
      className={className}
    >
      {children}
    </div>
  )
}

interface ScreenReaderOnlyProps {
  children: React.ReactNode
}

export function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
}

export function LiveRegion({ message, priority = 'polite' }: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Hook for managing focus and announcements
export function useAccessibilityAnnouncements() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message
    document.body.appendChild(liveRegion)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }

  const announceEventSelection = (eventName: string, eventType: string) => {
    announce(`Selected ${eventName}, a ${eventType} event. Press Escape to close the detailed view.`)
  }

  const announceYearChange = (year: number, eventCount: number) => {
    announce(`Changed to year ${year}. Found ${eventCount} cosmic events.`)
  }

  const announceFocusChange = (elementDescription: string) => {
    announce(`Focused on ${elementDescription}`)
  }

  return {
    announce,
    announceEventSelection,
    announceYearChange,
    announceFocusChange
  }
}
