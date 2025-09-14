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
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setStatus("Invalid username or password");
      } else {
        // On success, redirect to home
        window.location.href = "/";
      }
    } catch (err) {
      setStatus("Network error or server not running");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      <SpaceBackground />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gradient-to-br from-black/80 to-cyan-900/80 shadow-2xl backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-8 flex flex-col gap-6 animate-fade-in"
        style={{ boxShadow: '0 8px 32px 0 rgba(0, 255, 255, 0.15)' }}
      >
        <h2 className="text-2xl font-bold text-cyan-300 mb-2 tracking-tight text-center drop-shadow-lg">Admin Login</h2>
        <p className="text-sm text-white/70 mb-4 text-center">Enter your credentials to access the Space Event Timeline admin panel.</p>

        <div className="flex flex-col gap-2">
          <label className="text-white/80 font-medium" htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg px-4 py-2 bg-black/40 text-white border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 outline-none transition-all"
            required
            autoFocus
            autoComplete="username"
            placeholder="Enter username"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/80 font-medium" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg px-4 py-2 bg-black/40 text-white border border-cyan-400/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 outline-none transition-all"
            required
            autoComplete="current-password"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 px-6 py-2 text-white font-semibold text-lg shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => {
            setUsername("");
            setPassword("");
            setStatus(null);
          }}
          className="rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 text-white font-medium transition-all"
        >
          Clear
        </button>

        {status && <div className="mt-2 text-sm text-red-400 text-center font-medium animate-shake">{status}</div>}
      </form>
    </main>
  );
}
