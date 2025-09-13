"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"
import { AccessibleTooltip } from "@/components/ui/accessible-tooltip"
import { getDistanceAnalogy, getAngularAnalogy, getConfidenceDescription } from "@/lib/accessibility-helpers"

type Props = {
  year: number
  events: EventItem[]
  colors: {
    primary: string
    neutralBg: string
    neutralText: string
    accentPurple: string
    accentYellow: string
  }
  onSelect?: (ev: EventItem) => void
  selectedId?: string
  maxVisible?: number
}

function typeColor(type: EventItem["type"], colors: Props["colors"]) {
  switch (type) {
    case "Gamma Burst":
      return colors.primary
    case "Neutrino":
      return colors.accentPurple
    case "Gravitational Wave":
      return colors.primary
    case "Radio":
      return colors.accentYellow
    default:
      return colors.primary
  }
}

export function EventPanel({ year, events, colors, onSelect, selectedId, maxVisible = 3 }: Props) {
  const [showAll, setShowAll] = React.useState(false)
  const visible = showAll ? events : events.slice(0, maxVisible)

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-black/45 backdrop-blur border-b-cyan-300/30">
        <CardHeader className="bg-gradient-to-b from-black/60 to-transparent">
          <CardTitle className="text-xl text-pretty text-white font-semibold tracking-tight">
            Year {year} Detections
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base text-white/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              Showing {visible.length} of {events.length} events. Click a card to focus and reveal holographic distances.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="text-sm text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-white/60">
            💡 <AccessibleTooltip term="Detection Confidence" showIcon={false}>
              <span className="underline decoration-dotted decoration-cyan-300/50 underline-offset-2">
                Hover over underlined terms
              </span>
            </AccessibleTooltip> for explanations
          </div>
        </CardContent>
      </Card>

      {/* make the list a flexible container so tooltips can escape and not get clipped */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:bg-black/20 
        [&::-webkit-scrollbar-thumb]:bg-cyan-300/20 
        [&::-webkit-scrollbar-thumb:hover]:bg-cyan-300/40
        hover:[&::-webkit-scrollbar-thumb]:bg-cyan-300/30"
      >
        <AnimatePresence initial={false}>
          {visible.map((ev) => {
            const c = typeColor(ev.type, colors)
            const pct = Math.round(ev.confidence * 100)
            const isSelected = ev.id === selectedId
            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect?.(ev)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(ev)}
                  className={`border-white/10 bg-black/45 backdrop-blur transition-all ${
                    isSelected ? "ring-2 ring-amber-300/60" : "hover:bg-black/55"
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-white text-base">{ev.event}</div>
                          <AccessibleTooltip term="Detection Confidence">
                            <div className="text-sm text-white/70 cursor-help font-medium">{pct}%</div>
                          </AccessibleTooltip>
                        </div>

                        <p className="mt-2 text-base leading-relaxed text-white/80">{ev.description}</p>

                        {/* Simplified layout - just the key info */}
                        <div className="mt-4 flex items-center justify-between">
                          <AccessibleTooltip term={ev.type}>
                            <span className="cursor-help text-white/80 text-sm font-medium">
                              {ev.type}
                            </span>
                          </AccessibleTooltip>
                          <span className="text-white/60 text-sm font-mono tracking-tight">
                            {ev.lat.toFixed(1)}°, {ev.lng.toFixed(1)}°
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ type: "spring", stiffness: 180, damping: 24 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}