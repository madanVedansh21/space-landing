"use client"

import { useState, useEffect } from "react"
import { EventPanel } from "./event-panel"
import { getEventsForYear } from "@/lib/events"
import type { EventItem } from "@/lib/events"
import { SelectedEventCoords } from "./selected-event-coords"

const COLORS = {
  primary: "#22d3ee",
  neutralBg: "#0b1020",
  neutralText: "#ffffff",
  accentPurple: "#a78bfa",
  accentYellow: "#facc15",
} as const

export default function HomeClient() {
  const [year, setYear] = useState<number>(2021)
  const [events, setEvents] = useState<EventItem[]>([])

  // Load events for the selected year
  useEffect(() => {
    let mounted = true
    getEventsForYear(year).then((res) => {
      if (mounted) setEvents(res)
    })
    return () => { mounted = false }
  }, [year])

  return (
    <div
      className="relative flex min-h-dvh flex-col"
      style={{ backgroundColor: "transparent", color: COLORS.neutralText }}
    >
      <header
        className="w-full border-b bg-transparent px-6 py-6 md:px-10"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1
              className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl"
              style={{ color: COLORS.primary }}
            >
              Multi‑Messenger Event Explorer
            </h1>
            <p className="text-sm md:text-base text-white/75">
              Your black hole image is the stage. Live stars float subtly—no orbiting planet. Pick a year to update
              details.
            </p>
          </div>
          <div className="hidden items-center gap-3 md:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.accentPurple }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.accentYellow }} />
          </div>
        </div>
      </header>

      <div className="w-full flex-1">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-3 md:gap-8 md:px-10 md:py-8">
          <section
            className="relative overflow-hidden rounded-lg border md:col-span-2"
            style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(11,16,32,0.35)" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
            <div className="relative z-10 flex h-[280px] items-center justify-center md:h-[420px]">
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-white/60">Live Space Backdrop</div>
                <h2 className="text-balance mt-2 text-2xl font-semibold md:text-4xl">Immersive Black Hole Scene</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
                  Subtle parallax stars add depth while your black hole image fills the stage.
                </p>
              </div>
            </div>
          </section>

          <aside className="md:col-span-1">
            <EventPanel year={year} events={events} colors={COLORS} />
          </aside>
        </div>
      </div>

      <SelectedEventCoords selected={undefined} />
    </div>
  )
}
