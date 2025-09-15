"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { getAngularAnalogy } from "@/lib/accessibility-helpers"

export function FocusOverlay({
  selected,
  onClose,
}: {
  selected?: EventItem
  onClose: () => void
}) {
  const [highlightedArc, setHighlightedArc] = useState<'angular' | 'time' | null>(null)
  const [mounted, setMounted] = useState(false)

  const safeNum = (v: unknown, fallback = 0) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback

  const angularDeg = safeNum((selected as any)?.angular_distance_deg, 0)
  const timeDiffHoursRaw = (selected as any)?.time_diff_hours
  const timeDiffHours =
    typeof timeDiffHoursRaw === "number" && Number.isFinite(timeDiffHoursRaw)
      ? timeDiffHoursRaw
      : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

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
          />

          <FocusVizCentered
            selected={selected}
            highlightedArc={highlightedArc}
            onArcHover={setHighlightedArc}
          />

          {/* Close button */}
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

          {/* Left panel - Angular Distance */}
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
                  <h4 className="font-semibold text-amber-300 text-lg">
                    Inner Arc - Angular Distance
                  </h4>
                  <p className="text-base text-white/90 mt-2">
                    How large the event appears in our sky:{" "}
                    <strong>
                      {Number.isFinite(angularDeg) ? angularDeg.toFixed(2) : "N/A"}°
                    </strong>
                  </p>
                  <p className="text-sm text-amber-300/90 mt-2">
                    {Number.isFinite(angularDeg)
                      ? getAngularAnalogy(angularDeg)
                      : "Angular size not available"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right panel - Time Difference */}
          <motion.div
            className="absolute right-[15%] top-1/2 -translate-y-1/2 z-[110] max-w-[320px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="relative rounded-lg">
              <div className="absolute inset-0 rounded-lg bg-black/70 backdrop-blur border border-white/10" />
              <div className="flex items-start gap-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4 relative">
                <div className="w-3 h-3 rounded-full bg-cyan-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-cyan-300 text-lg">
                    Outer Arc - Time Difference
                  </h4>
                  <p className="text-base text-white/90 mt-2">
                    Time gap between the two events:{" "}
                    <strong>
                      {timeDiffHours !== null
                        ? `${timeDiffHours.toFixed(2)} hours`
                        : "N/A"}
                    </strong>
                  </p>
                  <p className="text-sm text-cyan-300/90 mt-2">
                    {timeDiffHours !== null
                      ? `That’s about ${(timeDiffHours / 24).toFixed(
                          2
                        )} days apart.`
                      : "Time gap not available"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom analogy */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[110] max-w-[600px] w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3 rounded-3xl bg-black/40 border border-white/10 p-6">
                <p className="text-base text-white/90">
                  <strong>💡 Think of it like a race:</strong> The inner arc shows
                  how big the event looks in the sky, while the outer arc shows how
                  far apart in time the signals arrived. Even if two cosmic messengers
                  look linked, a big time gap may mean they aren’t connected.
                </p>
              </div>
            </CardContent>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Visualization in the center
function FocusVizCentered({
  selected,
  highlightedArc,
  onArcHover,
}: {
  selected: EventItem
  highlightedArc: "angular" | "time" | null
  onArcHover: (arc: "angular" | "time" | null) => void
}) {
  const cx = 500
  const cy = 500
  const safeNum = (v: unknown, fallback = 0) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback

  const confidence = safeNum(selected.confidence, 0.5)
  const angularDeg = safeNum((selected as any).angular_distance_deg, 0)
  const timeDiffHoursRaw = (selected as any).time_diff_hours
  const timeDiffHours =
    typeof timeDiffHoursRaw === "number" && Number.isFinite(timeDiffHoursRaw)
      ? timeDiffHoursRaw
      : null

  const scaleFactor = 0.9 - confidence * 0.15

  const rAngularBase = 80 + angularDeg * 8
  const rAngular = Math.min(180, Math.max(40, rAngularBase * scaleFactor))
  const rTime =
    timeDiffHours !== null
      ? Math.min(380, Math.max(120, (rAngular + 60 + timeDiffHours * 0.4) * scaleFactor))
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
        <path id="angularPath" d={arc(rAngular)} fill="none" />
        <path id="timePath" d={arc(rTime)} fill="none" />
      </defs>

      {/* Angular arc */}
      <motion.path
        d={arc(rAngular)}
        stroke={highlightedArc === "angular" ? "#facc15" : "url(#holo)"}
        strokeWidth={highlightedArc === "angular" ? 4 : 2}
        fill="none"
        filter="url(#glow-strong)"
        onMouseEnter={() => onArcHover("angular")}
        onMouseLeave={() => onArcHover(null)}
        style={{ cursor: "pointer" }}
      />

      {/* Time arc */}
      <motion.path
        d={arc(rTime)}
        stroke={highlightedArc === "time" ? "#22d3ee" : "url(#holo)"}
        strokeWidth={highlightedArc === "time" ? 4 : 2}
        fill="none"
        filter="url(#glow-strong)"
        onMouseEnter={() => onArcHover("time")}
        onMouseLeave={() => onArcHover(null)}
        style={{ cursor: "pointer" }}
      />

      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Angular label */}
        <text dy={-8} fill="#facc15" fontSize="12" className="uppercase tracking-wider font-semibold">
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            Angular Size
          </textPath>
        </text>
        <motion.text dy={16} fill="#facc15" fontSize="20" filter="url(#glow-strong)">
          <textPath href="#angularPath" startOffset="50%" textAnchor="middle">
            {Number.isFinite(angularDeg) ? angularDeg.toFixed(2) : "N/A"}°
          </textPath>
        </motion.text>

        {/* Time difference label */}
        <text dy={-8} fill="#22d3ee" fontSize="12" className="uppercase tracking-wider font-semibold">
          <textPath href="#timePath" startOffset="50%" textAnchor="middle">
            Time Difference
          </textPath>
        </text>
        <motion.text dy={16} fill="#22d3ee" fontSize="20" filter="url(#glow-strong)">
          <textPath href="#timePath" startOffset="50%" textAnchor="middle">
            {timeDiffHours !== null ? `${timeDiffHours.toFixed(1)}h` : "N/A"}
          </textPath>
        </motion.text>
      </motion.g>

      {/* Center pulsing point */}
      <motion.circle
        cx={cx}
        cy={cy}
        r="8"
        fill="url(#holo)"
        filter="url(#glow-strong)"
        animate={{ r: [8, 12, 8], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
        {String((selected as any).event || "Unknown Event")}
      </text>
      <text
        x={cx}
        y="195"
        fill="#cfcfee"
        fontSize="16"
        textAnchor="middle"
        className="uppercase tracking-wider opacity-70"
      >
        RA {safeNum((selected as any).lng, 0).toFixed(2)}° / DEC{" "}
        {safeNum((selected as any).lat, 0).toFixed(2)}°
      </text>
    </motion.svg>
  )
}
