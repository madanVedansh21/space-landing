"use client"

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
  const reduced = events.slice(0, maxVisible)

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-black/45 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-pretty text-white">Year {year} Detections</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          Showing {reduced.length} of {events.length} events. Click a card to focus and reveal holographic distances.
          <div className="mt-2 text-xs text-white/60">
            💡 <AccessibleTooltip term="Detection Confidence" showIcon={false}>
              <span className="underline decoration-dotted decoration-cyan-300/50 underline-offset-2">
                Hover over underlined terms
              </span>
            </AccessibleTooltip> for explanations
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 lg:max-h-96 lg:overflow-y-auto lg:pr-2">
        <AnimatePresence initial={false}>
          {reduced.map((ev) => {
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
                          <div className="font-medium text-white">{ev.event}</div>
                          <AccessibleTooltip term="Detection Confidence">
                            <div className="text-xs text-white/60 cursor-help">{pct}%</div>
                          </AccessibleTooltip>
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-white/80">{ev.description}</p>

                        {/* Simplified layout - just the key info */}
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <AccessibleTooltip term={ev.type}>
                            <span className="cursor-help text-white/70">
                              {ev.type}
                            </span>
                          </AccessibleTooltip>
                          <span className="text-white/50 text-xs">
                            {ev.lat.toFixed(1)}°, {ev.lng.toFixed(1)}°
                          </span>
                        </div>

                        <div className="mt-3">
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