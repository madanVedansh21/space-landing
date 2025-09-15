"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  years: number[]
  value: number
  onChange: (year: number) => void
  colors?: {
    primary?: string
    accent?: string
    glow?: string
  }
}

export default function CircularTimeline({ years, value, onChange, colors = {} }: Props) {
  const { 
    primary = "#22d3ee", 
    accent = "#facc15", 
    glow = "#a78bfa" 
  } = colors

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  
  const defaultIndex = useMemo(() => 
    Math.max(0, years.indexOf(value)), [years, value])
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)

  // Update parent when index changes
  useEffect(() => {
    onChange(years[currentIndex])
  }, [currentIndex, years, onChange])

  // Handle drag interactions
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let startAngle = 0
    let initialIndex = 0

    const getAngleFromEvent = (e: MouseEvent | TouchEvent): number => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      
      const dx = clientX - centerX
      const dy = clientY - centerY
      // Normalize angle to start from top
      return (Math.atan2(dy, dx) + Math.PI * 2.5) % (Math.PI * 2)
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      setIsDragging(true)
      startAngle = getAngleFromEvent(e)
      initialIndex = currentIndex
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      
      const currentAngle = getAngleFromEvent(e)
      const angleDelta = currentAngle - startAngle
      
      // Calculate new index continuously (smooth movement)
      let normalizedAngle = angleDelta / (Math.PI * 2);
      let indexChange = normalizedAngle * years.length;
      let newIndex = initialIndex + indexChange;
      
      // Normalize index
      while (newIndex < 0) newIndex += years.length;
      while (newIndex >= years.length) newIndex -= years.length;
      
      requestAnimationFrame(() => {
        setCurrentIndex(Math.round(newIndex))
      })
    }

    const onPointerUp = () => {
      setIsDragging(false)

      // Snap to nearest year
      setCurrentIndex(prev => {
        let newIndex = Math.round(prev)
        if (newIndex < 0) newIndex = 0
        if (newIndex >= years.length) newIndex = years.length - 1
        return newIndex
      })
    }

    // Add event listeners
    container.addEventListener('mousedown', onPointerDown)
    container.addEventListener('touchstart', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)

    return () => {
      container.removeEventListener('mousedown', onPointerDown)
      container.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [isDragging, years.length, currentIndex])

  // Scroll wheel navigation (1 year per gesture)
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    let deltaYAccumulator = 0
    const SCROLL_THRESHOLD = 30

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      deltaYAccumulator += e.deltaY

      if (deltaYAccumulator > SCROLL_THRESHOLD) {
        setCurrentIndex(prev => (prev + 1) % years.length)
        deltaYAccumulator = 0
      } else if (deltaYAccumulator < -SCROLL_THRESHOLD) {
        setCurrentIndex(prev => (prev - 1 + years.length) % years.length)
        deltaYAccumulator = 0
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [years.length])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setCurrentIndex(prev => (prev - 1 + years.length) % years.length)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setCurrentIndex(prev => (prev + 1) % years.length)
    }
  }

  // Calculate positions for each year marker
  const getMarkerPosition = (index: number, radius: number) => {
    const angle = (index / years.length) * Math.PI * 2 - Math.PI / 2
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    }
  }

  // Get current progress for the outer ring
  const circumference = 2 * Math.PI * 40
  const progress = (currentIndex / years.length) * circumference

  const handleMarkerClick = (index: number) => {
    setIsDragging(false)
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-64 mx-auto select-none">
      <motion.div
        ref={containerRef}
        className="relative w-full aspect-square rounded-full bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-white/10 shadow-lg cursor-grab active:cursor-grabbing"
        style={{
          boxShadow: `
            0 0 30px rgba(59, 130, 246, 0.1),
            inset 0 0 50px rgba(255, 255, 255, 0.03)
          `,
          opacity: 0.7
        }}
        whileHover={{ scale: 1.0 }}
        whileTap={{ scale: 1.00 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={years[0]}
        aria-valuemax={years[years.length - 1]}
        aria-valuenow={years[currentIndex]}
        aria-label="Timeline year selector"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
          animate={{ 
            opacity: isDragging ? 0.6 : 0.3,
            scale: isDragging ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle, ${glow}33 0%, transparent 70%)`,
            filter: "blur(20px)"
          }}
        />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>

            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="center-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="50" cy="50" r="48" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#track-gradient)"
            strokeWidth="2"
            strokeDasharray={`${progress},${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            filter="url(#soft-glow)"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 14, 
              mass: 0.6
            }}
          />

          {years.map((year, index) => {
            const position = getMarkerPosition(index, 35)
            const isActive = index === currentIndex
            const isHovered = year === hoveredYear
            
            return (
              <g key={year} transform={`translate(${position.x}, ${position.y})`}>
                <line
                  x1={0}
                  y1={0}
                  x2={-position.x + 50}
                  y2={-position.y + 50}
                  stroke={isActive ? accent : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 1.5 : 0.5}
                  opacity={isActive ? 0.6 : 0.3}
                />

                <motion.circle
                  r={isActive ? 3.5 : isHovered ? 3 : 2}
                  fill={isActive ? accent : "rgba(255,255,255,0.6)"}
                  filter={isActive ? "url(#glow-strong)" : "none"}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 1 : 0.8
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400,
                    damping: 20,
                    mass: 0.8
                  }}
                  whileHover={{ 
                    scale: 1.5, 
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    } 
                  }}
                  onHoverStart={() => setHoveredYear(year)}
                  onHoverEnd={() => setHoveredYear(null)}
                  onClick={() => handleMarkerClick(index)}
                  style={{ cursor: "pointer" }}
                />

                {(isActive || isHovered) && (
                  <motion.text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isActive ? accent : "white"}
                    fontSize="3"
                    fontWeight="bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    filter="url(#soft-glow)"
                  >
                    {year}
                  </motion.text>
                )}
              </g>
            )
          })}

          <motion.circle
            cx="50"
            cy="50"
            r="15"
            fill="rgba(0,0,0,0.5)"
            stroke="url(#track-gradient)"
            strokeWidth="1"
            filter="url(#soft-glow)"
            animate={{ 
              scale: isDragging ? [1, 1.1, 1] : 1,
              rotate: isDragging ? 180 : 0
            }}
            transition={{ duration: 0.5 }}
          />

          <circle cx="50" cy="50" r="8" fill="url(#center-glow)" opacity="0.7" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {/* Static label */}
          <div className="text-xs uppercase tracking-widest text-white/100 mb-1">
            Year
          </div>

          {/* Animated year number */}
          <AnimatePresence mode="wait">
            <motion.div
              key={years[currentIndex]}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent"
            >
              {years[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
