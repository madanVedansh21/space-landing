"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Info, PlusCircle } from "lucide-react"
import AdminLoginDialog from "./admin-login-dialog"

export default function Navbar() {
  const pathname = usePathname()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const isAdmin = typeof document !== 'undefined' && document.cookie.includes('admin_auth=true')
    if (isAdmin) {
      router.push('/dashboard')
    } else {
      setShowLoginDialog(true)
    }
  }
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
  className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-6xl rounded-3xl bg-white/6 backdrop-blur-md border border-white/8 shadow-2xl px-6 py-3"
      style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* <div className="rounded-full bg-gradient-to-br from-cyan-400 to-amber-300 p-1">
            <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="white"/></svg>
            </div>
          </div> */}
          <div>
            <div className="text-sm md:text-base font-semibold text-white">Space Event Timeline</div>
            <div className="text-[11px] md:text-xs text-white/60">2015 — 2025</div>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button
            onClick={handleAdminClick}
            className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-transform transform-gpu ${pathname === '/dashboard' ? 'bg-black/55 ring-1 ring-cyan-300 scale-105' : 'bg-black/35 hover:bg-black/50 hover:-translate-y-1 hover:scale-105'}`}
          >
            <PlusCircle className="h-5 w-5 text-cyan-300" />
            <span className="text-sm md:text-base text-white/95 font-semibold">Admin</span>
          </button>

          <AdminLoginDialog 
            isOpen={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
          />

          <Link
            href="/about"
            className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-transform transform-gpu ${pathname === '/about' ? 'bg-black/55 ring-1 ring-amber-300 scale-105' : 'bg-black/35 hover:bg-black/50 hover:-translate-y-1 hover:scale-105'}`}
          >
            <Info className="h-5 w-5 text-amber-300" />
            <span className="text-sm md:text-base text-white/95 font-semibold">About</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
