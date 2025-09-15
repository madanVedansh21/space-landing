"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import type { EventItem } from "@/lib/events"
import { AccessibleTooltip } from "@/components/ui/accessible-tooltip"

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
  cardSize?: "sm" | "md"
  emphasizeTitle?: boolean
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

export function EventPanel({
  year,
  events,
  colors,
  onSelect,
  selectedId,
  maxVisible = 3,
  cardSize = "md",
  emphasizeTitle = false
}: Props) {
  const [showAll, setShowAll] = React.useState(false)
  const visible = showAll ? events : events.slice(0, maxVisible)

  // Card size classes
  const cardPadding = cardSize === "sm" ? "pt-2 pb-2 px-2" : "pt-3 pb-3"
  const cardText = cardSize === "sm" ? "text-xs md:text-sm" : "text-sm md:text-base"
  const cardGap = cardSize === "sm" ? "gap-2" : "gap-3"
  const cardRadius = cardSize === "sm" ? "rounded-lg" : "rounded-xl"
  const cardTitleText = emphasizeTitle
    ? "text-xl md:text-2xl text-amber-300 font-extrabold tracking-tight drop-shadow-lg"
    : "text-lg text-pretty text-white font-semibold tracking-tight"
  const cardTitleBg = emphasizeTitle

  return (
    <div className="space-y-3 pb-2">
      {/* Header Card */}
      <Card
        className={`relative overflow-hidden border border-white/10 ${cardRadius} shadow-lg
                    bg-transparent backdrop-blur-sm max-w-md mx-auto`}
      >
        <CardHeader className={`${cardTitleBg} py-4`}>
          <CardTitle className={`${cardTitleText} text-center`}>
            Year {year} Detections
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              Showing {visible.length} of {events.length} events. Click a card to focus.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="text-xs text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-white/60">
            💡{" "}
            <AccessibleTooltip term="Detection Confidence" showIcon={false}>
              <span className="underline decoration-dotted decoration-cyan-300/50 underline-offset-2">
                Hover over underlined terms
              </span>
            </AccessibleTooltip>{" "}
            for explanations
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div
        className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2
                   scrollbar-thin scrollbar-thumb-cyan-300/30 scrollbar-track-transparent
                   hover:scrollbar-thumb-cyan-300/50 transition-all duration-300"
      >
        <AnimatePresence initial={false}>
          {visible.map((ev, index) => {
            const c = typeColor(ev.type, colors)
            const pct = Math.round(ev.confidence * 100)
            const isSelected = ev.id === selectedId

            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "tween",
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect?.(ev)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && onSelect?.(ev)
                  }
                  className={`relative border border-white/10 bg-white/5 backdrop-blur-sm
                              transition-all duration-300 cursor-pointer
                              hover:bg-white/10 hover:shadow-lg
                              ${isSelected ? "ring-2 ring-amber-300/50" : ""}
                              ${cardRadius}`}
                >
                  <CardContent className={`${cardPadding}`}>
                    <div className={`flex items-start ${cardGap}`}>
                      {/* Type dot */}
                      <span
                        className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: c,
                          boxShadow: `0 0 8px ${c}`
                        }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className={`font-medium text-white ${cardText}`}>
                            {ev.event}
                          </div>
                          <AccessibleTooltip term="Detection Confidence">
                            <div
                              className={`text-xs md:text-sm text-white/70 cursor-help font-medium`}
                            >
                              {pct}%
                            </div>
                          </AccessibleTooltip>
                        </div>

                        <p
                          className={`mt-1.5 ${cardText} leading-relaxed text-white/80`}
                        >
                          {ev.description}
                        </p>

                        {/* Key Info */}
                        <div className="mt-3 flex items-center justify-between">
                          <AccessibleTooltip term={ev.type}>
                            <span className="cursor-help text-white/80 text-xs md:text-sm font-medium">
                              {ev.type}
                            </span>
                          </AccessibleTooltip>
                          <span className="text-white/60 text-xs md:text-sm font-mono tracking-tight">
                            {ev.lat.toFixed(1)}°, {ev.lng.toFixed(1)}°
                          </span>
                        </div>

                        {/* Confidence bar */}
                        <div className="mt-4">
                          <div className="h-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: c,
                                boxShadow: `0 0 8px ${c}`
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 24
                              }}
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
