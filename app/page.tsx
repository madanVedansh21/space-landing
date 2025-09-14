import SpaceBackground from '@/components/space-background'
import LandingOverlay from '@/components/landing-overlay'

export default function Page() {
  return (
    <main className="relative min-h-dvh">
      <SpaceBackground />
      <LandingOverlay />
    </main>
  )
}
