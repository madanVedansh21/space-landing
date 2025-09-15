"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DataTable from '@/components/data-table'

interface CorrelatedEvent {
  _id: string
  rank: number
  gw_event_id: string
  grb_event_id: string
  confidence_score: number
  time_diff_sec: number
  time_diff_hours: number
  angular_sep_deg: number
  within_error_circle: boolean
  temporal_score: number
  spatial_score: number
  significance_score: number
  gw_time: string
  grb_time: string
  gw_ra: number
  gw_dec: number
  grb_ra: number
  grb_dec: number
  gw_snr: number
  grb_flux: number
  gw_pos_error: number
  grb_pos_error: number
  combined_error_deg: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<CorrelatedEvent[]>([])
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

  // Fetch data function
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/correlated')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
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

      {/* Data Table Section */}
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Raw Event Data</h2>
          {loading ? (
            <div className="text-white/60">Loading data...</div>
          ) : (
            <DataTable data={data} />
          )}
          {/* <div className="mt-6">
            <button
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-6 py-2 text-white font-semibold"
              onClick={() => setShowModal(true)}
            >
              Submit Data
            </button>
          </div> */}
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
