"use client"

import { usePathname } from 'next/navigation'
import SpaceBackground from './space-background'
import LandingOverlay from './landing-overlay'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSpaceBackground = ['/', '/about'].includes(pathname)

  if (!showSpaceBackground) {
    return <>{children}</>
  }

  return (
    <main className="relative min-h-dvh">
      <SpaceBackground />
      <LandingOverlay />
    </main>
  )
}