"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import CircularTimeline from "@/components/circular-timeline"
import { EventPanel } from "@/components/event-panel"
import { getEventsForYear, type EventItem } from "@/lib/events"
import { FocusOverlay } from "@/components/focus-overlay"
// Removed visual legend import since it was deleted

export default function LandingOverlay() {
  const years = useMemo(() => Array.from({ length: 11 }, (_, i) => 2015 + i), [])
  const [year, setYear] = useState<number>(2020)
  const [events, setEvents] = useState<EventItem[]>([])
  const [selected, setSelected] = useState<EventItem | undefined>(undefined)
  const [focusOpen, setFocusOpen] = useState(false)
  const lastSelectedRef = useRef<EventItem | undefined>(undefined)

  // No admin redirects here—landing must always load

  useEffect(() => {
    async function fetchEvents() {
      const fetchedEvents = await getEventsForYear(year);
      setEvents(fetchedEvents);
    }

    fetchEvents();
  }, [year]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of events) map[e.type] = (map[e.type] || 0) + 1
    return map
  }, [events])

  const colors = {
    primary: "#22d3ee",
    neutralBg: "#0b1020",
    neutralText: "#ffffff",
    accentPurple: "#a78bfa",
    accentYellow: "#facc15",
  }

  return (
    <div className="relative min-h-dvh">
      {/* Main content grid - responsive layout */}
      <div className="relative z-10 grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        {/* Left side - Title, summary, and timeline */}
        <section className="flex flex-col justify-center px-4 pt-16 pb-8 lg:px-8">
          <div className="mx-auto max-w-lg text-center lg:text-left">
            <h1 className="text-pretty text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-4xl xl:text-5xl">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-amber-300">Sambandha</span>
              <span className="block mt-1 text-base font-medium text-white/75 md:text-lg lg:text-base">A multi-messenger event correlator</span>
            </h1>
            <p className="mt-3 text-balance text-lg text-white/70 lg:text-xl">
              Drag or scroll the dial to explore yearly detections.
            </p>

            {/* Event summary */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/85 backdrop-blur">
              {Object.keys(counts).length > 0 ? (
                Object.entries(counts).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-white/70">{k}</span>
                    <span className="font-semibold text-amber-300">{v}</span>
                  </div>
                ))
              ) : (
                // Placeholder items to maintain consistent size while loading
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Loading...</span>
                    <span className="font-semibold text-amber-300">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Please wait</span>
                    <span className="font-semibold text-amber-300">-</span>
                  </div>
                </>
              )}
            </div>

            {/* Circular timeline moved here, slightly smaller */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <div style={{ width: '13rem', maxWidth: '100%' }}>
                <CircularTimeline
                  years={years}
                  value={year}
                  onChange={(y) => {
                    setYear(y)
                  }}
                  colors={{ primary: colors.primary, accent: colors.accentYellow, glow: colors.accentPurple }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right side - Event details, shifted down */}
        <section className="flex flex-col px-4 pt-20 pb-8 lg:px-8">
          <div className="mx-auto w-full max-w-lg lg:h-full lg:overflow-y-auto lg:py-2">
            <EventPanel
              year={year}
              events={events}
              colors={colors}
              onSelect={(ev) => {
                setSelected(ev)
                lastSelectedRef.current = ev
                setFocusOpen(true)
              }}
              selectedId={selected?.id}
              maxVisible={10}
              cardSize="sm"
              emphasizeTitle
            />
          </div>
        </section>
      </div>

      {/* Focus overlay remains unchanged */}
      {focusOpen && (
        <FocusOverlay selected={lastSelectedRef.current} onClose={() => setFocusOpen(false)} />
      )}
    </div>
  )
}