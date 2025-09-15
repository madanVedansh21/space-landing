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

  // Modal / Upload states
  const [showModal, setShowModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("csv", file)

      // Use fetch with progress via XMLHttpRequest for progress bar
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/submit", true)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percentComplete)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }

        xhr.onerror = () => reject(new Error("Upload failed"))

        xhr.send(formData)
      })

      alert("CSV uploaded successfully!")
      setShowModal(false)
      setFile(null)
      setUploadProgress(0)

      // Refresh data table automatically
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-black/95 text-white p-24 pt-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div>
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

      {/* Upload Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black p-6 rounded-lg w-[400px] max-w-full">
            <h3 className="text-xl font-bold text-white mb-4">Upload CSV</h3>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mb-4 w-full text-white"
            />
            {uploading && (
              <div className="h-2 w-full bg-white/20 rounded mb-4 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-400 text-white"
                onClick={() => setShowModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-white ${
                  uploading || !file ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={uploading || !file}
                onClick={handleUpload}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </main>
  )
}
