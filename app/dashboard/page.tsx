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

  // Fetch data only after auth is confirmed
  useEffect(() => {
    if (!authChecked) return;
    async function fetchData() {
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
    fetchData()
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
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Raw Event Data</h2>
          {loading ? (
            <div className="text-white/60">Loading data...</div>
          ) : (
            <DataTable data={data} />
          )}
          <div className="mt-6">
            <button
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-6 py-2 text-white font-semibold"
              onClick={() => console.log('Submit Data clicked')}
            >
              Submit Data
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}