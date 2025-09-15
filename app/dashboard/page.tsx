"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DataTable from '@/components/data-table'


interface GWEvent {
  _id: string
  event_id: string
  time: string
  ra: number
  dec: number
  snr: number
  pos_error: number
}

interface GRBEvent {
  _id: string
  event_id: string
  time: string
  ra: number
  dec: number
  flux: number
  pos_error: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [gwData, setGwData] = useState<GWEvent[]>([])
  const [grbData, setGrbData] = useState<GRBEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const isAdmin = document.cookie.includes('admin_auth=true')
    if (!isAdmin) {
      router.replace('/')
    } else {
      setAuthChecked(true)
    }
  }, [router])



  // Fetch GW and GRB data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [gwRes, grbRes] = await Promise.all([
        fetch('/api/getalldatagw'),
        fetch('/api/getalldatagrb'),
      ])
      const gwJson = await gwRes.json()
      const grbJson = await grbRes.json()
      if (gwJson.success) {
        setGwData(gwJson.data)
      }
      if (grbJson.success) {
        setGrbData(grbJson.data)
      }
    } catch (error) {
      console.error('Failed to fetch GW/GRB data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data only after auth is confirmed
  useEffect(() => {
    if (authChecked) {
      fetchData()
    }
  }, [authChecked])

  if (!authChecked) {
    return (
      <main className="min-h-screen w-full bg-black/95 text-white p-24 pt-32">
        <div className="text-white/60">Verifying authentication...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-black/95 text-white p-24 pt-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div>
          <button
            onClick={() => router.push('/submit')}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-6 py-2 text-white font-semibold"
          >
            Submit Data
          </button>
        </div>
      </div>

      {/* GW Data Table Section */}
      <div className="grid gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Raw GW Event Data</h2>
          {loading ? (
            <div className="text-white/60">Loading GW data...</div>
          ) : (
            <DataTable data={gwData} type="gw" />
          )}
        </div>
      </div>

      {/* GRB Data Table Section */}
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Raw GRB Event Data</h2>
          {loading ? (
            <div className="text-white/60">Loading GRB data...</div>
          ) : (
            <DataTable data={grbData} type="grb" />
          )}
        </div>
      </div>

      {/* Logout Button at Bottom */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => {
            document.cookie = 'admin_auth=; Max-Age=0; path=/'
            router.replace('/')
          }}
          className="rounded-lg bg-rose-500 hover:bg-rose-400 px-4 py-2 text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </main>
  )
}
