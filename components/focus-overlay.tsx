"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"

export function FocusOverlay({
  selected,
  onClose,
}: {
  selected?: EventItem
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {selected && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <FocusVizCentered selected={selected} />
          
          {/* Black card removed as requested */}
        </div>
      )}
    </AnimatePresence>
  )
}

// New centered renderer: arcs always drawn in the middle of the screen
function FocusVizCentered({ selected }: { selected: EventItem }) {
  // viewBox 0..1000, place center at 500,500
  const cx = 500
  const cy = 500

  // Adjust the visualization to be slightly more compact to prevent overlap
  // Scale factor based on confidence - more confident events get larger visualizations
  const scaleFactor = 0.9 - (selected.confidence * 0.15)
  
  // Clamp radii to prevent them from becoming too large and going off-screen
  // Reduced maximum values to prevent overlaps
  const rAngular = Math.min(180, (80 + selected.angular_distance_deg * 8) * scaleFactor)
  const rSpatial = Math.min(380, (rAngular + 60 + selected.spatial_distance_mly * 0.4) * scaleFactor)

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
      className="absolute inset-0 z-50 h-full w-full"
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

      {/* Render visible arcs */}
      <motion.path
        d={arc(rAngular)}
        stroke="url(#holo)"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        filter="url(#glow-strong)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />
      <motion.path
        d={arc(rSpatial)}
        stroke="url(#holo)"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        filter="url(#glow-strong)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, duration: 1.0, ease: "easeInOut" }}
      />

      {/* Labels attached directly to arc paths */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {/* Angular Label */}
        <text dy={-8} fill="#e5e7eb" fontSize="11" className="uppercase tracking-wider opacity-70">
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            Angular Separation
          </textPath>
        </text>
        <text dy={16} fill="#e5e7eb" fontSize="18" filter="url(#glow-strong)">
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            {selected.angular_distance_deg.toFixed(2)}°
          </textPath>
        </text>

        {/* Spatial Label */}
        <text dy={-8} fill="#facc15" fontSize="11" className="uppercase tracking-wider opacity-70">
          <textPath href="#spatialPath" startOffset="50%" textAnchor="middle">
            Spatial Distance
          </textPath>
        </text>
        <text dy={16} fill="#facc15" fontSize="18" filter="url(#glow-strong)">
          <textPath href="#spatialPath" startOffset="50%" textAnchor="middle">
            {selected.spatial_distance_mly} Mly
          </textPath>
        </text>
        
        {/* Coordinates moved to left top corner to never overlap with arcs */}
        <text 
          x={140} 
          y={100} 
          fill="#cfcfee" 
          fontSize="12" 
          textAnchor="start" 
          className="uppercase tracking-wider opacity-70" 
        >
          SOURCE COORDINATES
        </text>
        <text 
          x={140} 
          y={125} 
          fill="#cfcfee" 
          fontSize="18" 
          textAnchor="start" 
          className="font-mono" 
          filter="url(#glow-strong)"
        >
          RA {selected.lng.toFixed(2)}° / DEC {selected.lat.toFixed(2)}°
        </text>
        
        {/* Event info completely removed as requested */}
      </motion.g>
    </motion.svg>
  )
}
