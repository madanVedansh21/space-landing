"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AccessibleTooltip } from "@/components/ui/accessible-tooltip"
import { getDistanceAnalogy, getAngularAnalogy, getConfidenceDescription, formatAccessibleText } from "@/lib/accessibility-helpers"
import type { EventItem } from "@/lib/events"

interface ExpandableEventDetailsProps {
  event: EventItem
  colors: {
    primary: string
    neutralBg: string
    neutralText: string
    accentPurple: string
    accentYellow: string
  }
  isSelected?: boolean
  onSelect?: (event: EventItem) => void
}

export function ExpandableEventDetails({ 
  event, 
  colors, 
  isSelected = false, 
  onSelect 
}: ExpandableEventDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const typeColor = (type: EventItem["type"]) => {
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

  const confidence = Math.round(event.confidence * 100)
  const c = typeColor(event.type)

  const exportEventData = () => {
    const data = {
      event: event.event,
      type: event.type,
      description: event.description,
      confidence: `${confidence}%`,
      confidenceDescription: getConfidenceDescription(event.confidence),
      coordinates: {
        latitude: `${event.lat.toFixed(2)}°`,
        longitude: `${event.lng.toFixed(2)}°`
      },
      distances: {
        angular: {
          value: `${event.angular_distance_deg.toFixed(2)}°`,
          analogy: getAngularAnalogy(event.angular_distance_deg)
        },
        spatial: {
          value: `${event.spatial_distance_mly.toLocaleString()} million light-years`,
          analogy: getDistanceAnalogy(event.spatial_distance_mly)
        }
      },
      source: event.source,
      year: event.year,
      accessibleDescription: formatAccessibleText(event)
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `space-event-${event.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(event)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(event)}
      className={`border-white/10 bg-black/45 backdrop-blur transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-amber-300/60" : "hover:bg-black/55"
      }`}
      aria-label={`Event: ${event.event}. ${event.description}. Click to view detailed visualization.`}
    >
      <CardContent className="pt-4">
        {/* Basic Info - Always Visible */}
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">{event.event}</div>
              <AccessibleTooltip term="Detection Confidence">
                <div className="text-xs text-white/60 cursor-help">{confidence}%</div>
              </AccessibleTooltip>
            </div>

            <p className="mt-1 text-sm leading-relaxed text-white/80">{event.description}</p>

            {/* Quick Summary */}
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-white/80">
              <div className="rounded-md bg-white/5 px-2 py-1">
                <AccessibleTooltip term="Angular Distance">
                  <span className="cursor-help">
                    ⌀ {event.angular_distance_deg.toFixed(1)}°
                  </span>
                </AccessibleTooltip>
              </div>
              <div className="rounded-md bg-white/5 px-2 py-1">
                <AccessibleTooltip term="Spatial Distance">
                  <span className="cursor-help">
                    ↗ {event.spatial_distance_mly.toLocaleString()} Mly
                  </span>
                </AccessibleTooltip>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <div className="mt-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-auto"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                {isExpanded ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
                <span className="ml-1 text-xs">
                  {isExpanded ? "Less" : "More"}
                </span>
              </Button>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    exportEventData()
                  }}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-auto"
                  aria-label="Export event data"
                >
                  <DownloadIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                {/* Event Type and Source */}
                <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
                  <AccessibleTooltip term={event.type}>
                    <span className="cursor-help">Type: {event.type}</span>
                  </AccessibleTooltip>
                  <span>Source: {event.source}</span>
                </div>

                {/* Detailed Distance Information */}
                <div className="space-y-3">
                  <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                    <AccessibleTooltip term="Angular Distance">
                      <h4 className="text-sm font-semibold text-amber-300 cursor-help">
                        Angular Size: {event.angular_distance_deg.toFixed(2)}°
                      </h4>
                    </AccessibleTooltip>
                    <p className="text-xs text-amber-300/80 mt-1">
                      {getAngularAnalogy(event.angular_distance_deg)}
                    </p>
                  </div>

                  <div className="rounded-md bg-cyan-500/10 border border-cyan-500/20 p-3">
                    <AccessibleTooltip term="Spatial Distance">
                      <h4 className="text-sm font-semibold text-cyan-300 cursor-help">
                        Spatial Distance: {event.spatial_distance_mly.toLocaleString()} Mly
                      </h4>
                    </AccessibleTooltip>
                    <p className="text-xs text-cyan-300/80 mt-1">
                      {getDistanceAnalogy(event.spatial_distance_mly)}
                    </p>
                  </div>
                </div>

                {/* Confidence Details */}
                <div className="rounded-md bg-white/5 p-3">
                  <AccessibleTooltip term="Detection Confidence">
                    <h4 className="text-sm font-semibold text-white cursor-help">
                      Detection Confidence: {confidence}%
                    </h4>
                  </AccessibleTooltip>
                  <p className="text-xs text-white/70 mt-1">
                    {getConfidenceDescription(event.confidence)}
                  </p>
                </div>

                {/* Technical Details Toggle */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTechnicalDetails(!showTechnicalDetails)
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ExternalLinkIcon className="h-3 w-3 mr-1" />
                    {showTechnicalDetails ? "Hide" : "Show"} Technical Details
                  </Button>

                  <AnimatePresence>
                    {showTechnicalDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <div className="rounded-md bg-white/5 p-3 text-xs text-white/70 font-mono">
                          <div>ID: {event.id}</div>
                          <div>Coordinates: {event.lat.toFixed(6)}°, {event.lng.toFixed(6)}°</div>
                          <div>Year: {event.year}</div>
                          <div>Raw Confidence: {event.confidence.toFixed(4)}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ type: "spring", stiffness: 180, damping: 24 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
