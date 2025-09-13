"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Info, PlusCircle } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
  className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-6xl rounded-3xl bg-white/6 backdrop-blur-md border border-white/8 shadow-2xl px-6 py-3"
      style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* <div className="rounded-full bg-gradient-to-br from-cyan-400 to-amber-300 p-1">
            <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="white"/></svg>
            </div>
          </div> */}
          <div>
            <div className="text-base md:text-lg font-semibold text-white">Space Event Timeline</div>
            <div className="text-xs md:text-sm text-white/60">2015 — 2025</div>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform transform-gpu ${pathname === '/admin' ? 'bg-black/55 ring-1 ring-cyan-300 scale-105' : 'bg-black/35 hover:bg-black/50 hover:-translate-y-1 hover:scale-105'}`}
          >
            <PlusCircle className="h-7 w-7 text-cyan-300" />
            <span className="text-base md:text-lg text-white/95 font-semibold">Admin</span>
          </Link>

          <Link
            href="/about"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform transform-gpu ${pathname === '/about' ? 'bg-black/55 ring-1 ring-amber-300 scale-105' : 'bg-black/35 hover:bg-black/50 hover:-translate-y-1 hover:scale-105'}`}
          >
            <Info className="h-7 w-7 text-amber-300" />
            <span className="text-base md:text-lg text-white/95 font-semibold">About</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
