"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import EventFlashes from "@/components/event-flashes"
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
      <EventFlashes events={events} selected={selected} showDetailOverlay={!!selected} />

      {/* Main content grid - responsive layout */}
      <div className="relative z-10 grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        {/* Left side - Title and summary */}
        <section className="flex flex-col justify-center px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-lg text-center lg:text-left">
            <h1 className="text-pretty text-3xl font-semibold tracking-tight text-white md:text-5xl lg:text-4xl xl:text-5xl">
              Space Event Timeline
            </h1>
            <p className="mt-3 text-balance text-lg text-white/85 lg:text-xl">
              Live black hole backdrop with twinkling stars. Drag the dial to explore yearly detections.
            </p>

            {/* Event summary */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/85 backdrop-blur">
              {Object.entries(counts).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-white/70">{k}</span>
                  <span className="font-semibold text-amber-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right side - Event details */}
        <section className="flex flex-col px-4 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-lg lg:h-full lg:overflow-y-auto lg:py-8">
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
            />
          </div>
        </section>
      </div>

      {/* Bottom circular timeline - always visible */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40">
        <CircularTimeline
          years={years}
          value={year}
          onChange={(y) => {
            setYear(y)
          }}
        />
      </div>

      {focusOpen && (
        <FocusOverlay selected={lastSelectedRef.current} onClose={() => setFocusOpen(false)} />
      )}
    </div>
  )
}