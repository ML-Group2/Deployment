"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        return <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
      case "processing":
        return <Loader2 className="w-6 h-6 text-primary flex-shrink-0 animate-spin" />
      default:
        return <Clock className="w-6 h-6 text-muted-foreground flex-shrink-0" />
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Batch Predictions</h1>
          <p className="text-muted-foreground">Upload a CSV file to get predictions for multiple records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>Supported format: CSV with feature columns (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Model (Optional)</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              >
                <option value="">Auto-select best model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} (v{model.version})
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-input" />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium mb-1">{file ? file.name : "Click to upload or drag and drop"}</p>
                <p className="text-sm text-muted-foreground">CSV files up to 10MB</p>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={!file || loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : "Process Batch"}
              </Button>
              {file && (
                <Button onClick={handleReset} variant="outline">
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {completed && jobId && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium">{getStatusText()}</p>
                  <p className="text-sm text-muted-foreground">Job ID: {jobId}</p>
                </div>
              </div>

              {/* Status Details */}
              <div className="p-3 rounded-lg bg-background/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File:</span>
                  <span className="font-medium">{file?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{jobStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {jobStatus === "completed" && (
                <div className="p-3 rounded-lg bg-primary/10 text-primary text-sm">
                  Results are ready for download. You can access them from your dashboard.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
