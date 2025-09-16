"use client"

import { usePathname } from 'next/navigation'
import HomeLayout from './home-layout'

export default function ConditionalHomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  
  if (isHome) {
    return <HomeLayout>{children}</HomeLayout>
  }
  
  return <>{children}</>
}