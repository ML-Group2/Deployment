"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react"
import { usePrediction } from "@/hooks/use-prediction"
import { useModels } from "@/hooks/use-models"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function PredictionInterface() {
  const [inputs, setInputs] = useState<Record<string, string>>({
    feature1: "",
    feature2: "",
    feature3: "",
  })
  const [selectedModel, setSelectedModel] = useState<string>("")
  const { predict, loading, error, result, reset } = usePrediction()
  const { models } = useModels()
  const [history, setHistory] = useState<any[]>([])

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handlePredict = async () => {
    const features = Object.entries(inputs).reduce(
      (acc, [key, value]) => {
        acc[key] = Number.parseFloat(value) || 0
        return acc
      },
      {} as Record<string, number>,
    )

    try {
      const response = await predict({
        features,
        model_id: selectedModel || undefined,
      })
      setHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          prediction: response.prediction,
          confidence: response.confidence,
          model: response.model_id,
        },
      ])
    } catch (err) {
      console.error("Prediction failed:", err)
    }
  }

  const handleReset = () => {
    setInputs({ feature1: "", feature2: "", feature3: "" })
    reset()
  }

  const exportResults = () => {
    if (history.length === 0) return

    const csv = [
      ["Timestamp", "Prediction", "Confidence", "Model"].join(","),
      ...history.map((h) => [h.timestamp, h.prediction.toFixed(2), h.confidence.toFixed(1), h.model].join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `predictions-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="animate-slide-up text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Make a Prediction
          </h1>
          <p className="text-gray-400">Enter your data and get instant predictions from our ML models</p>
        </div>

        <div className="flex justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-full max-w-md glass rounded-2xl p-8 border border-cyan-500/30">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">Input Features</h2>
                <p className="text-sm text-gray-400">Provide values for each feature</p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-200 uppercase tracking-wide">Select Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-400/30 text-white focus:border-blue-400 focus:outline-none transition-colors font-medium"
                >
                  <option value="">Auto-select best model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feature Inputs */}
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold text-gray-200 uppercase tracking-wide">
                    {key.replace(/([0-9]+)/, " $1")}
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="bg-white/5 border-blue-400/30 text-white placeholder:text-gray-500 focus:border-blue-400 font-medium"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handlePredict}
                  disabled={loading || Object.values(inputs).some((v) => !v)}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Predicting..." : "Get Prediction"}
                </button>
                <button onClick={handleReset} className="btn-secondary font-bold">
                  Reset
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-blue-500/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Prediction Result
                  </h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">Success</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-black/40 border border-blue-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Prediction</p>
                  <p className="text-4xl font-bold text-blue-400">{result.prediction.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-black/40 border border-cyan-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Confidence</p>
                  <p className="text-4xl font-bold text-cyan-400">{result.confidence.toFixed(1)}%</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-bold">Confidence Level</p>
                <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden border border-blue-400/20">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                <p className="text-sm">
                  <span className="text-gray-400 font-medium">Model: </span>
                  <span className="font-bold text-white">{result.model_id}</span>
                </p>
                <p className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Importance */}
        {result && (
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Feature Importance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: "Feature 1", value: 45 },
                    { name: "Feature 2", value: 32 },
                    { name: "Feature 3", value: 23 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Prediction History */}
        {history.length > 0 && (
          <div
            className="glass rounded-2xl p-8 border border-blue-500/20 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex flex-row items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Prediction History</h3>
                <p className="text-sm text-gray-400">Your recent predictions and their confidence scores</p>
              </div>
              <button onClick={exportResults} className="btn-secondary flex items-center gap-2 font-bold">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="space-y-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="prediction"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="confidence"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-bold text-gray-300">Time</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-300">Prediction</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-300">Confidence</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-300">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-gray-400">{h.timestamp}</td>
                        <td className="py-3 px-4 font-bold text-blue-400">{h.prediction.toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-cyan-400">{h.confidence.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-gray-500 text-xs font-medium">{h.model}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
