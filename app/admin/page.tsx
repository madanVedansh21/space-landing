"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import SpaceBackground from "@/components/space-background"

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const text = await res.text()
        setStatus(`Error ${res.status}: ${text}`)
      } else {
        const json = await res.json().catch(() => null)
        setStatus(json ? `Success: ${JSON.stringify(json)}` : "Success")
      }
    } catch (err) {
      setStatus("Network error or server not running")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      <SpaceBackground />
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Admin — send to /api/auth</h2>

        <label className="block text-sm text-white/80 mb-2">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded px-3 py-2 bg-black/30 text-white"
            required
          />
        </label>

        <label className="block text-sm text-white/80 mb-4">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded px-3 py-2 bg-black/30 text-white"
            required
          />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="rounded bg-cyan-600 px-4 py-2 text-white font-medium disabled:opacity-50">
            {loading ? "Sending..." : "Send"}
          </button>

          <button
            type="button"
            onClick={() => {
              setUsername("")
              setPassword("")
              setStatus(null)
            }}
            className="rounded bg-gray-700 px-3 py-2 text-white"
          >
            Clear
          </button>
        </div>

        {status && <div className="mt-4 text-sm text-white/90">{status}</div>}
      </form>
    </main>
  )
}
