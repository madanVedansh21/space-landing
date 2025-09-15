"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SubmitPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [files, setFiles] = useState<File[]>([])
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

  if (!authChecked) {
    return (
      <main className="min-h-screen w-full bg-black/95 text-white p-24 pt-32">
        <div className="text-white/60">Verifying authentication...</div>
      </main>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (files.length < 2) {
      alert('Please select at least 2 CSV files')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`csv_${index}`, file)
      })

      // Use XMLHttpRequest for progress tracking
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

      alert("CSV files uploaded successfully!")
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <main className="min-h-screen w-full bg-black/95 text-white p-24 pt-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Submit Data</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-lg bg-gray-500 hover:bg-gray-400 px-4 py-2 text-white font-semibold"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-8 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-cyan-400 mb-4">📋 Instructions</h2>
        <div className="space-y-2 text-white/80">
          <p>• <strong>Minimum Requirement:</strong> Upload at least <span className="text-cyan-400 font-bold">2 CSV files</span></p>
          <p>• <strong>File Format:</strong> Only CSV files are accepted</p>
          <p>• <strong>Purpose:</strong> Our algorithm requires multiple datasets to find correlations between events</p>
          <p>• <strong>Processing:</strong> Files will be analyzed to identify potential correlations based on temporal and spatial proximity</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="csvFiles" className="block text-lg font-semibold mb-4">
              Select CSV Files <span className="text-red-400">*</span>
            </label>
            <input
              id="csvFiles"
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:text-sm file:font-semibold file:bg-cyan-500 file:text-white
                         hover:file:bg-cyan-400 file:cursor-pointer"
              disabled={uploading}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Selected Files ({files.length}):</h3>
              <ul className="space-y-1 text-sm text-white/70">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{file.name}</span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
              {files.length < 2 && (
                <p className="text-red-400 text-sm mt-2">
                  ⚠️ Please select at least 2 files
                </p>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || files.length < 2}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all
              ${files.length >= 2 && !uploading
                ? 'bg-cyan-500 hover:bg-cyan-400 cursor-pointer'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
          >
            {uploading ? 'Uploading...' : `Submit ${files.length} Files`}
          </button>
        </form>
      </div>
    </main>
  )
}