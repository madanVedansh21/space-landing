"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from "lucide-react"
import { AccessibleTooltip } from "@/components/ui/accessible-tooltip"

interface VisualLegendProps {
  colors: {
    primary: string
    neutralBg: string
    neutralText: string
    accentPurple: string
    accentYellow: string
  }
  className?: string
}

export function VisualLegend({ colors, className }: VisualLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const eventTypes = [
    {
      type: "Gamma Burst",
      color: colors.primary,
      description: "Most energetic explosions in the universe",
      icon: "💥"
    },
    {
      type: "Gravitational Wave", 
      color: colors.primary,
      description: "Ripples in spacetime from massive collisions",
      icon: "🌊"
    },
    {
      type: "Neutrino",
      color: colors.accentPurple,
      description: "Ghostly particles from extreme cosmic events",
      icon: "👻"
    },
    {
      type: "Radio",
      color: colors.accentYellow,
      description: "Electromagnetic signals from distant sources",
      icon: "📡"
    }
  ]

  const visualElements = [
    {
      name: "Event Flashes",
      description: "Points of light showing event locations in the sky",
      visual: (
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-300 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-4 h-4 rounded-full bg-purple-300 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )
    },
    {
      name: "Confidence Ring",
      description: "Golden ring around high-confidence events",
      visual: (
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-cyan-300" />
          <div className="absolute inset-0 w-4 h-4 rounded-full border-2 border-amber-300" />
        </div>
      )
    },
    {
      name: "Holographic Arcs",
      description: "Inner arc = angular size, outer arc = spatial distance",
      visual: (
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M 6 26 A 10 10 0 0 1 26 26"
              stroke="url(#holo)"
              strokeWidth="2"
              fill="none"
              className="opacity-60"
            />
            <path
              d="M 4 28 A 12 12 0 0 1 28 28"
              stroke="url(#holo)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )
    }
  ]

  return (
    <Card className={`border-white/10 bg-black/45 backdrop-blur ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <InfoIcon className="h-4 w-4 text-cyan-300" />
            Visual Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-4">
              {/* Event Types */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Event Types</h4>
                <div className="grid gap-2">
                  {eventTypes.map((event) => (
                    <AccessibleTooltip key={event.type} term={event.type}>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-help">
                        <span className="text-lg">{event.icon}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                          <span className="text-sm text-white/90">{event.type}</span>
                        </div>
                      </div>
                    </AccessibleTooltip>
                  ))}
                </div>
              </div>

              {/* Visual Elements */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Visual Elements</h4>
                <div className="space-y-3">
                  {visualElements.map((element) => (
                    <div key={element.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <div className="flex-shrink-0">
                        {element.visual}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{element.name}</div>
                        <div className="text-xs text-white/70">{element.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">💡 Quick Tips</h4>
                <ul className="text-xs text-white/80 space-y-1">
                  <li>• Hover over underlined terms for explanations</li>
                  <li>• Click events to see detailed holographic visualization</li>
                  <li>• Use the year dial to explore different time periods</li>
                  <li>• Press "Learn More" in the focus view for detailed explanations</li>
                </ul>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
