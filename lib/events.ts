export type EventItem = {
  id: string
  year: number
  type: "Gamma Burst" | "Neutrino" | "Gravitational Wave" | "Radio"
  confidence: number // 0..1
  lat: number // -90..90
  lng: number // -180..180
  description: string
  source: string
  event: string
  angular_distance_deg: number
  spatial_distance_mly: number
}

const TYPES: EventItem["type"][] = ["Gamma Burst", "Neutrino", "Gravitational Wave", "Radio"]

const EVENT_DESCRIPTIONS = {
  "Gamma Burst": [
    "High-energy electromagnetic radiation burst detected from distant galaxy merger",
    "Massive stellar collapse producing intense gamma-ray emission",
    "Short-duration gamma-ray burst indicating neutron star collision",
    "Long-duration GRB associated with hypernova explosion",
    "Ultra-luminous gamma-ray transient from black hole formation",
  ],
  Neutrino: [
    "High-energy neutrino detection confirming cosmic ray acceleration",
    "Atmospheric neutrino interaction in deep ice detector array",
    "Astrophysical neutrino from active galactic nucleus core",
    "Muon neutrino track indicating distant blazar activity",
    "Tau neutrino event suggesting exotic particle interactions",
  ],
  "Gravitational Wave": [
    "Binary black hole merger creating spacetime ripples",
    "Neutron star collision producing gravitational waves and kilonova",
    "Intermediate-mass black hole merger detected by LIGO/Virgo",
    "Asymmetric binary system inspiral with measurable chirp mass",
    "Multi-messenger event correlating with electromagnetic counterpart",
  ],
  Radio: [
    "Fast radio burst with millisecond-duration high-brightness pulse",
    "Repeating FRB source showing complex magnetic field environment",
    "Pulsar timing array detecting nanohertz gravitational waves",
    "Radio transient from stellar flare or coronal mass ejection",
    "Extragalactic radio source variability indicating active nucleus",
  ],
}

const EVENT_SOURCES = {
  "Gamma Burst": ["Fermi-LAT", "Swift-BAT", "HESS", "MAGIC", "CTA"],
  Neutrino: ["IceCube", "ANTARES", "KM3NeT", "Super-K", "Hyper-K"],
  "Gravitational Wave": ["LIGO", "Virgo", "KAGRA", "Einstein Telescope", "LISA"],
  Radio: ["CHIME", "ASKAP", "VLA", "LOFAR", "MeerKAT"],
}

const EVENT_TITLES = [
  "Multi-messenger Match",
  "Candidate Counterpart",
  "Localization Update",
  "Follow-up Signal",
  "Afterglow Confirmation",
  "Catalog Cross-Match",
]

// Deterministic pseudo-random generator for stable dummy data per year
function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateEventsPerYear(year: number, count: number): EventItem[] {
  const rnd = mulberry32(year)
  const events: EventItem[] = []
  for (let i = 0; i < count; i++) {
    const type = TYPES[Math.floor(rnd() * TYPES.length)]
    const confidence = Math.max(0.1, Math.min(0.98, rnd() * 1.05))
    const lat = -80 + rnd() * 160
    const lng = -180 + rnd() * 360
    const descriptions = EVENT_DESCRIPTIONS[type]
    const sources = EVENT_SOURCES[type]
    const description = descriptions[Math.floor(rnd() * descriptions.length)]
    const source = sources[Math.floor(rnd() * sources.length)]
    const event = EVENT_TITLES[Math.floor(rnd() * EVENT_TITLES.length)]
    const angular_distance_deg = Math.round((1.5 + rnd() * 9.5) * 10) / 10 // 1.5..11.0°
    const spatial_distance_mly = Math.round(50 + rnd() * 450) // 50..500 million light-years

    events.push({
      id: `${year}-${i}`,
      year,
      type,
      confidence,
      lat,
      lng,
      description,
      source,
      event,
      angular_distance_deg,
      spatial_distance_mly,
    })
  }
  return events
}

const YEAR_MIN = 2015
const YEAR_MAX = 2025

// Pre-generate a stable pool of events for each year
const EVENTS_BY_YEAR: Record<number, EventItem[]> = {}
for (let y = YEAR_MIN; y <= YEAR_MAX; y++) {
  const baseCount = 6 + ((y - YEAR_MIN) % 5) // vary count 6..10
  EVENTS_BY_YEAR[y] = generateEventsPerYear(y, baseCount)
}

export function getEventsForYear(year: number): EventItem[] {
  const clamped = Math.max(YEAR_MIN, Math.min(YEAR_MAX, year))
  return EVENTS_BY_YEAR[clamped]
}
