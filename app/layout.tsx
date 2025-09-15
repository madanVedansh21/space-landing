import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Navbar from '@/components/navbar'
import HomeLayout from '@/components/home-layout'

export const metadata: Metadata = {
  title: 'Team BlueBerry',
  description: 'Created by Team BlueBerry',
  generator: 'Team BlueBerry',
  icons: {
    icon: '/blueberry.png',
    apple: '/blueberry.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Only wrap the home page ('/') with HomeLayout
  // For other routes, render children directly
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isHome = pathname === '/';
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navbar />
        {typeof window !== 'undefined' && isHome ? (
          <HomeLayout>
            {children}
          </HomeLayout>
        ) : (
          children
        )}
        <Analytics />
      </body>
    </html>
  )
}
