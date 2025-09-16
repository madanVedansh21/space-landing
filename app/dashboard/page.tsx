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
  const [gwOpen, setGwOpen] = useState(true)
  const [grbOpen, setGrbOpen] = useState(true)
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
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-6 py-2 text-white font-semibold cursor-pointer"
          >
            Submit Your Data
          </button>
        </div>
      </div>

      <div className="mb-6 text-m text-white/80 max-w-6xl">
        This is the raw data of the two events whose correlation was initially shown on the landing page. If you submit new data, the correlation for that data will be updated on the landing page.
      </div>

      {/* GW Data Table Section */}
      <div className="grid gap-6 mb-10">
        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Raw GW Event Data</h2>
            <button
              aria-expanded={gwOpen}
              onClick={() => setGwOpen((s) => !s)}
              className="ml-2 rounded-md p-2 hover:bg-white/5 transition-colors cursor-pointer"
              title={gwOpen ? 'Collapse GW table' : 'Expand GW table'}
            >
              <svg className={`w-4 h-4 transform transition-transform ${gwOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {loading ? (
            <div className="text-white/60">Loading GW data...</div>
          ) : (
            gwOpen && <DataTable data={gwData} type="gw" />
          )}
        </div>
      </div>

      {/* GRB Data Table Section */}
      <div className="grid gap-6">
        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Raw GRB Event Data</h2>
            <button
              aria-expanded={grbOpen}
              onClick={() => setGrbOpen((s) => !s)}
              className="ml-2 rounded-md p-2 hover:bg-white/5 transition-colors cursor-pointer"
              title={grbOpen ? 'Collapse GRB table' : 'Expand GRB table'}
            >
              <svg className={`w-4 h-4 transform transition-transform ${grbOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {loading ? (
            <div className="text-white/60">Loading GRB data...</div>
          ) : (
            grbOpen && <DataTable data={grbData} type="grb" />
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
          className="rounded-lg bg-rose-500 hover:bg-rose-400 px-4 py-2 text-white font-semibold cursor-pointer"
        >
          Logout
        </button>
      </div>
    </main>
  )
}
