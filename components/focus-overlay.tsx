"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XIcon, InfoIcon, ArrowLeftIcon } from "lucide-react"
import { AccessibleTooltip } from "@/components/ui/accessible-tooltip"
import { getDistanceAnalogy, getAngularAnalogy } from "@/lib/accessibility-helpers"

export function FocusOverlay({
  selected,
  onClose,
}: {
  selected?: EventItem
  onClose: () => void
}) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [highlightedArc, setHighlightedArc] = useState<'angular' | 'spatial' | null>(null)
  const [mounted, setMounted] = useState(false)
  const safeNum = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)
  const angularDeg = safeNum((selected as any)?.angular_distance_deg, 0)
  const spatialMlyRaw = (selected as any)?.spatial_distance_mly
  const spatialMly = typeof spatialMlyRaw === 'number' && Number.isFinite(spatialMlyRaw) ? spatialMlyRaw : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Avoid closing immediately from the original click that opened the overlay
  useEffect(() => {
    if (selected) {
      const id = requestAnimationFrame(() => setMounted(true))
      return () => {
        cancelAnimationFrame(id)
        setMounted(false)
      }
    } else {
      setMounted(false)
    }
  }, [selected])

  return (
    <AnimatePresence>
      {selected && (
        <div className="fixed inset-0 z-[100] pointer-events-auto">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // No backdrop click to close; use X button or Escape key
          />

          <FocusVizCentered 
            selected={selected} 
            highlightedArc={highlightedArc}
            onArcHover={setHighlightedArc}
          />
          
          {/* Close button - now bigger and top right */}
          <div className="absolute top-6 right-12 z-[120]">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/100 hover:text-white hover:bg-white/10 transition-colors w-14 h-14 cursor-pointer"
              aria-label="Close detailed view"
            >
              <XIcon className="h-32 w-32" />
            </Button>
          </div>

          {/* Left panel - Inner Arc */}
          <motion.div 
            className="absolute left-[15%] top-1/2 -translate-y-1/2 z-[110] max-w-[320px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-black/70 backdrop-blur border border-white/10" />
              <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 relative">
                <div className="w-3 h-3 rounded-full bg-amber-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-300 text-lg">Inner Arc - Angular Distance</h4>
                  <p className="text-base text-white/90 mt-2">
                    How large the event appears in our sky: <strong>{Number.isFinite(angularDeg) ? angularDeg.toFixed(2) : 'N/A'}°</strong>
                  </p>
                  <p className="text-sm text-amber-300/90 mt-2">
                    {Number.isFinite(angularDeg) ? getAngularAnalogy(angularDeg) : 'Angular size not available'}
                  </p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right panel - Outer Arc */}
          <motion.div 
            className="absolute right-[15%] top-1/2 -translate-y-1/2 z-[110] max-w-[320px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
              <div className="relative rounded-lg">
                {/* Black background layer */}
                <div className="absolute inset-0 rounded-lg bg-black/70 backdrop-blur border border-white/10" />

                {/* Cyan card layer */}
                <div className="flex items-start gap-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4 relative">
                  <div className="w-3 h-3 rounded-full bg-cyan-300 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-cyan-300 text-lg">Outer Arc - Spatial Distance</h4>
                    <p className="text-base text-white/90 mt-2">
                      How far away the event actually is: <strong>
                        {spatialMly !== null
                          ? `${spatialMly.toLocaleString()} million light-years`
                          : 'N/A million light-years'}
                      </strong>
                    </p>
                    <p className="text-sm text-cyan-300/90 mt-2">
                      {spatialMly !== null
                        ? getDistanceAnalogy(spatialMly)
                        : 'In the distant universe'}
                    </p>
                  </div>
                </div>
              </div>

          </motion.div>

          {/* Lighthouse analogy at bottom */}
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[110] max-w-[600px] w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            
              <CardContent className="p-6">
                <div className="flex items-start gap-3 rounded-3xl bg-black/40 border border-white/10 p-6">
                  <p className="text-base text-white/90">
                    <strong>💡 Think of it like a lighthouse:</strong> The inner arc shows how bright it appears to you, 
                    while the outer arc shows how far away it actually is. A nearby dim lighthouse might appear 
                    as bright as a distant powerful one!
                  </p>
                </div>
              </CardContent>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// New centered renderer: arcs always drawn in the middle of the screen
function FocusVizCentered({ 
  selected, 
  highlightedArc, 
  onArcHover 
}: { 
  selected: EventItem
  highlightedArc: 'angular' | 'spatial' | null
  onArcHover: (arc: 'angular' | 'spatial' | null) => void
}) {
  // viewBox 0..1000, place center at 500,500
  const cx = 500
  const cy = 500

  // Adjust the visualization to be slightly more compact to prevent overlap
  // Scale factor based on confidence - more confident events get larger visualizations
  const safeNum = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)
  const confidence = safeNum(selected.confidence, 0.5)
  const angularDeg = safeNum((selected as any).angular_distance_deg, 0)
  const spatialMlyRaw = (selected as any).spatial_distance_mly
  const spatialMly = typeof spatialMlyRaw === 'number' && Number.isFinite(spatialMlyRaw) ? spatialMlyRaw : null

  const scaleFactor = 0.9 - (confidence * 0.15)
  
  // Clamp radii to prevent them from becoming too large and going off-screen
  // Reduced maximum values to prevent overlaps
  const rAngularBase = 80 + angularDeg * 8
  const rAngular = Math.min(180, Math.max(40, rAngularBase * scaleFactor))
  const rSpatial = spatialMly !== null
    ? Math.min(380, Math.max(120, (rAngular + 60 + spatialMly * 0.4) * scaleFactor))
    : Math.min(380, Math.max(120, (rAngular + 60) * scaleFactor))

  const arc = (r: number) => {
    const sweep = 300
    const startAngle = (-sweep / 2) * (Math.PI / 180)
    const endAngle = (sweep / 2) * (Math.PI / 180)
    const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) }
    const end = { x: cx + r * Math.cos(endAngle), y: cy + r * Math.sin(endAngle) }
    return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`
  }

  return (
    <motion.svg
      viewBox="0 0 1000 1000"
      className="absolute inset-0 z-[105] h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <defs>
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        {/* Add IDs to the arc paths so text can reference them */}
        <path id="angularPath" d={arc(rAngular)} fill="none" />
        <path id="spatialPath" d={arc(rSpatial)} fill="none" />
        <path id="coordPath" d={`M ${cx-150} ${cy+80} L ${cx+150} ${cy+80}`} fill="none" />
      </defs>

      {/* Render visible arcs with interactive hover */}
      <motion.path
        d={arc(rAngular)}
        stroke={highlightedArc === 'angular' ? "#facc15" : "url(#holo)"}
        strokeWidth={highlightedArc === 'angular' ? 4 : 2}
        strokeLinecap="round"
        fill="none"
        filter={highlightedArc === 'angular' ? "url(#glow-strong)" : "url(#glow-strong)"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        onMouseEnter={() => onArcHover('angular')}
        onMouseLeave={() => onArcHover(null)}
        style={{ cursor: 'pointer' }}
      />
      <motion.path
        d={arc(rSpatial)}
        stroke={highlightedArc === 'spatial' ? "#22d3ee" : "url(#holo)"}
        strokeWidth={highlightedArc === 'spatial' ? 4 : 2}
        strokeLinecap="round"
        fill="none"
        filter={highlightedArc === 'spatial' ? "url(#glow-strong)" : "url(#glow-strong)"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, duration: 1.0, ease: "easeInOut" }}
        onMouseEnter={() => onArcHover('spatial')}
        onMouseLeave={() => onArcHover(null)}
        style={{ cursor: 'pointer' }}
      />

      {/* Labels attached directly to arc paths */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {/* Angular Label */}
        <text 
          dy={-8} 
          fill={highlightedArc === 'angular' ? "#facc15" : "#e5e7eb"} 
          fontSize="12" 
          className="uppercase tracking-wider font-semibold"
        >
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            Angular Size
          </textPath>
        </text>
        <motion.text 
          dy={16} 
          fill={highlightedArc === 'angular' ? "#facc15" : "#e5e7eb"} 
          fontSize="20" 
          filter="url(#glow-strong)"
          animate={{ 
            scale: highlightedArc === 'angular' ? 1.1 : 1,
            opacity: highlightedArc === 'angular' ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            {Number.isFinite(angularDeg) ? angularDeg.toFixed(2) : 'N/A'}°
          </textPath>
        </motion.text>

        {/* Spatial Label */}
        <text 
          dy={-8} 
          fill={highlightedArc === 'spatial' ? "#22d3ee" : "#facc15"} 
          fontSize="12" 
          className="uppercase tracking-wider font-semibold"
        >
          <textPath href="#spatialPath" startOffset="50%" textAnchor="middle">
            Spatial Distance
          </textPath>
        </text>
        <motion.text 
          dy={16} 
          fill={highlightedArc === 'spatial' ? "#22d3ee" : "#facc15"} 
          fontSize="20" 
          filter="url(#glow-strong)"
          animate={{ 
            scale: highlightedArc === 'spatial' ? 1.1 : 1,
            opacity: highlightedArc === 'spatial' ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <textPath href="#spatialPath" startOffset="50%" textAnchor="middle">
            {spatialMly !== null ? `${spatialMly} Mly` : 'N/A Mly'}
          </textPath>
        </motion.text>
        
        {/* Center point with pulsing animation */}
        <motion.circle
          cx={cx}
          cy={cy}
          r="8"
          fill="url(#holo)"
          filter="url(#glow-strong)"
          animate={{ 
            r: [8, 12, 8],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Event title and coordinates in one group near top */}
        <filter id="title-bg">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.8 0"/>
        </filter>
        
        {/* Background for both title and coordinates */}
        <rect
          x={cx - 250}
          y="120"
          width="500"
          height="100"
          fill="black"
          filter="url(#title-bg)"
          opacity="0.8"
        />
        
        {/* Event title */}
        <text 
          x={cx} 
          y="160" 
          fill="#ffffff" 
          fontSize="32" 
          textAnchor="middle" 
          className="font-semibold" 
          filter="url(#glow-strong)"
        >
          {String((selected as any).event || 'Unknown Event')}
        </text>
        
        {/* Coordinates right below title */}
        <text 
          x={cx} 
          y="195" 
          fill="#cfcfee" 
          fontSize="16" 
          textAnchor="middle" 
          className="uppercase tracking-wider opacity-70" 
        >
          RA {safeNum((selected as any).lng, 0).toFixed(2)}° / DEC {safeNum((selected as any).lat, 0).toFixed(2)}°
        </text>
      </motion.g>

    </motion.svg>
  )
}
