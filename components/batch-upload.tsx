"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { submitBatchPrediction } from "@/lib/model-service"
import { useModels } from "@/hooks/use-models"

export default function BatchUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<string>("pending")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const { models } = useModels()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setCompleted(false)
        setError(null)
      } else {
        setError("Please select a valid CSV file")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const mockFileUrl = `file://${file.name}`

      const response = await submitBatchPrediction({
        file_url: mockFileUrl,
        model_id: selectedModel || undefined,
      })

      setJobId(response.job_id)
      setJobStatus(response.status)
      setCompleted(true)

      // Simulate status polling
      setTimeout(() => {
        setJobStatus("completed")
      }, 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setCompleted(false)
    setJobId(null)
    setError(null)
    setJobStatus("pending")
  }

  const getStatusIcon = () => {
    switch (jobStatus) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
      case "processing":
        return <Loader2 className="w-6 h-6 text-blue-400 flex-shrink-0 animate-spin" />
      default:
        return <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
    }
  }

  const getStatusText = () => {
    switch (jobStatus) {
      case "completed":
        return "Batch processing completed!"
      case "processing":
        return "Processing your batch..."
      default:
        return "Batch processing started"
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="animate-slide-up text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Batch Predictions
          </h1>
          <p className="text-black/80 text-lg">Upload a CSV file to get predictions for multiple sentences</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass rounded-2xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-black mb-2">Upload CSV File</h2>
                <p className="text-sm text-black/70">
                  CSV must have a 'sentence' column with text data (max 10MB)
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black uppercase tracking-wide">Select Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-blue-400/40 text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all font-medium hover:bg-gray-100"
                >
                  <option value="" className="bg-white">Auto-select best model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id} className="bg-white">
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-blue-400/40 rounded-lg p-8 text-center hover:border-blue-400/60 hover:bg-white/5 transition-all cursor-pointer bg-white/5 hover:shadow-lg hover:shadow-blue-500/10">
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <Upload className="w-14 h-14 mx-auto mb-3 text-blue-400" />
                  <p className="font-semibold mb-1 text-black text-lg">{file ? file.name : "Click to upload or drag and drop"}</p>
                  <p className="text-sm text-black/60">CSV files up to 10MB</p>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Processing..." : "Process Batch"}
                </button>
                {file && (
                  <button onClick={handleReset} className="btn-secondary font-bold">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {completed && jobId && (
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-6">
                {getStatusIcon()}
                <div>
                  <h3 className="text-xl font-bold text-black">{getStatusText()}</h3>
                  <p className="text-sm text-black/60">Job ID: {jobId}</p>
                </div>
              </div>

              {/* Status Details */}
              <div className="p-4 rounded-lg bg-gray-50 border border-blue-400/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-black/70 font-medium">File:</span>
                  <span className="font-bold text-black">{file?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70 font-medium">Status:</span>
                  <span className="font-bold text-blue-400 capitalize">{jobStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70 font-medium">Submitted:</span>
                  <span className="font-bold text-cyan-400">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {jobStatus === "completed" && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  Results are ready for download. You can access them from your dashboard.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
