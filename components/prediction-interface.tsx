"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react"
import { usePrediction } from "@/hooks/use-prediction"
import { useModels } from "@/hooks/use-models"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function PredictionInterface() {
  const [sentence, setSentence] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const { predict, loading, error, result, reset } = usePrediction()
  const { models } = useModels()
  const [history, setHistory] = useState<any[]>([])

  const handlePredict = async () => {
    if (!sentence.trim()) return

    try {
      const response = await predict({
        sentence: sentence.trim(),
        model_id: selectedModel || undefined,
      })
      console.log("[PredictionInterface] predict() response:", response)
      setHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          prediction: response.prediction,
          confidence: response.confidence,
          model: response.model_id,
          label: response.prediction,
          sentence: sentence.trim().substring(0, 50) + (sentence.length > 50 ? "..." : ""),
        },
      ])
    } catch (err) {
      console.error("Prediction failed:", err)
    }
  }

  const handleReset = () => {
    setSentence("")
    reset()
  }

  const exportResults = () => {
    if (history.length === 0) return

    const csv = [
      ["Timestamp", "Sentence", "Label", "Prediction", "Confidence", "Model"].join(","),
      ...history.map((h) => [
        h.timestamp,
        `"${(h.sentence || "").replace(/"/g, '""')}"`,
        h.label || "",
        h.prediction,
        h.confidence.toFixed(1),
        h.model,
      ].join(",")),
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
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Make a Prediction
          </h1>
          <p className="text-black/80 text-lg">Enter your sentence and get instant predictions from our ML models</p>
        </div>

        <div className="flex justify-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-full max-w-2xl glass rounded-2xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-black mb-2">Input Sentence</h2>
                <p className="text-sm text-black/70">Enter a sentence or text to analyze</p>
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

              {/* Sentence Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black uppercase tracking-wide">
                  Sentence / Text Input
                </label>
                <Textarea
                  placeholder="Enter your sentence here... (e.g., 'This is a sample sentence for prediction')"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  rows={5}
                  className="bg-gray-50 border-blue-400/40 text-black placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 font-medium resize-none transition-all hover:bg-gray-100"
                />
                <p className="text-xs text-black/60 font-medium">
                  {sentence.length} character{sentence.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handlePredict}
                  disabled={loading || !sentence.trim()}
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
            <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-black flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Prediction Result
                  </h3>
                  {result.prediction && (
                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-500 font-bold uppercase tracking-wide">
                      {result.prediction}
                    </span>
                  )}
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">Success</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50 border border-blue-400/30">
                  <p className="text-xs text-black/70 uppercase tracking-wide font-bold mb-2">Prediction</p>
                  <p className="text-4xl font-bold text-blue-400">{result.prediction}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-cyan-400/30">
                  <p className="text-xs text-black/70 uppercase tracking-wide font-bold mb-2">Confidence</p>
                  <p className="text-4xl font-bold text-cyan-400">{result.confidence.toFixed(1)}%</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <p className="text-xs text-black/70 font-bold">Confidence Level</p>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden border border-blue-400/20">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                <p className="text-sm">
                  <span className="text-black/70 font-medium">Model: </span>
                  <span className="font-bold text-black">{result.model_id}</span>
                </p>
                <p className="text-xs text-black/60">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Preview */}
        {result && (
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/10">
              <h3 className="text-xl font-bold text-black mb-4">Input Analysis</h3>
              <div className="p-4 rounded-lg bg-gray-50 border border-blue-400/30">
                <p className="text-xs text-black/70 uppercase tracking-wide font-bold mb-2">Input Sentence</p>
                <p className="text-black break-words">{sentence || "N/A"}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-black/70 font-bold mb-1">Character Count</p>
                    <p className="text-lg font-bold text-blue-400">{sentence.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/70 font-bold mb-1">Word Count</p>
                    <p className="text-lg font-bold text-cyan-400">{sentence.trim() ? sentence.trim().split(/\s+/).length : 0}</p>
                  </div>
                </div>
              </div>
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
                <h3 className="text-xl font-bold text-black">Prediction History</h3>
                <p className="text-sm text-black/70">Your recent predictions and their confidence scores</p>
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
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-black">Time</th>
                      <th className="text-left py-3 px-4 font-bold text-black">Sentence</th>
                      <th className="text-left py-3 px-4 font-bold text-black">Label</th>
                      <th className="text-left py-3 px-4 font-bold text-black">Prediction</th>
                      <th className="text-left py-3 px-4 font-bold text-black">Confidence</th>
                      <th className="text-left py-3 px-4 font-bold text-black">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-black/70 text-sm">{h.timestamp}</td>
                        <td className="py-3 px-4 text-black max-w-xs truncate" title={h.sentence}>{h.sentence || "N/A"}</td>
                        <td className="py-3 px-4 text-black/80 text-xs font-bold uppercase">{h.prediction || ""}</td>
                        <td className="py-3 px-4 font-bold text-blue-400">{h.confidence.toFixed(1)}%</td>
                        <td className="py-3 px-4 font-bold text-cyan-400">{h.confidence.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-black/60 text-xs font-medium">{h.model}</td>
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
