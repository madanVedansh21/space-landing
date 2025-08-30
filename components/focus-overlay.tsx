"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"

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
        <motion.div
          key="focus-overlay"
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Event distance focus"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dim with stronger opacity so lines are clearly visible */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centered visualization container */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <FocusVizCentered selected={selected} />
          </div>

          {/* Compact info bar */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-10 w-[92%] max-w-2xl rounded-xl bg-black/55 backdrop-blur px-5 py-4 border border-white/10 text-white"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-300">{selected.year}</p>
                <h3 className="text-lg md:text-xl font-semibold">{selected.event}</h3>
              </div>
              <button
                className="pointer-events-auto rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/15 text-sm"
                onClick={onClose}
                aria-label="Close focus view"
                autoFocus
              >
                Close
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white/5 p-2">
                <div className="text-gray-300">Angular</div>
                <div className="font-medium">{selected.angular_distance_deg.toFixed(2)}°</div>
              </div>
              <div className="rounded-md bg-white/5 p-2">
                <div className="text-gray-300">Spatial</div>
                <div className="font-medium">{selected.spatial_distance_mly} Mly</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// New centered renderer: arcs always drawn in the middle of the screen
function FocusVizCentered({ selected }: { selected: EventItem }) {
  // viewBox 0..1000, place center at 500,500
  const cx = 500
  const cy = 500

  // Scale radii so they are always visible within the viewBox
  const rAngular = 80 + Math.min(150, selected.angular_distance_deg * 8) // deg -> px
  const rSpatial = rAngular + 60 + Math.min(180, selected.spatial_distance_mly * 0.5) // mly -> px

  const arc = (r: number) => {
    const sweep = 300
    const start = (-sweep / 2) * (Math.PI / 180)
    const end = (sweep / 2) * (Math.PI / 180)
    return `M ${cx + Math.cos(start) * r} ${cy + Math.sin(start) * r} A ${r} ${r} 0 0 1 ${cx + Math.cos(end) * r} ${
      cy + Math.sin(end) * r
    }`
  }

  return (
    <motion.svg
      className="w-[92vw] max-w-[1080px] h-auto"
      viewBox="0 0 1000 1000"
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
      </defs>

      {/* Pulsing core marker (center) */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={12}
        fill="#22d3ee"
        filter="url(#glow-strong)"
        animate={{ r: [12, 16, 12], opacity: [1, 0.7, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
      />

      {/* Angular arc */}
      <motion.path
        d={arc(rAngular)}
        stroke="url(#holo)"
        strokeWidth={3}
        strokeDasharray="6 10"
        filter="url(#glow-strong)"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      {/* Spatial arc */}
      <motion.path
        d={arc(rSpatial)}
        stroke="#facc15"
        strokeWidth={2}
        strokeDasharray="2 8"
        filter="url(#glow-strong)"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 1.0, ease: "easeInOut" }}
      />

      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <text
          x={cx + rAngular + 18}
          y={cy}
          dy="0.35em" // Vertically center text on the line
          textAnchor="start"
          fill="#e5e7eb"
          fontSize="18"
          filter="url(#glow-strong)"
        >
          {selected.angular_distance_deg.toFixed(1)}°
        </text>
        <text
          x={cx + rSpatial + 18}
          y={cy}
          dy="0.35em" // Vertically center text on the line
          textAnchor="start"
          fill="#facc15"
          fontSize="18"
          filter="url(#glow-strong)"
        >
          {selected.spatial_distance_mly} Mly
        </text>
      </motion.g>
    </motion.svg>
  )
}
