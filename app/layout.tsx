import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Navbar from '@/components/navbar'
import ConditionalHomeLayout from '@/components/conditional-home-layout'

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
  // Using ConditionalHomeLayout client component to handle routing differences
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navbar />
        <ConditionalHomeLayout>
          {children}
        </ConditionalHomeLayout>
        <Analytics />
      </body>
    </html>
  )
}
