"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { getModelComparison } from "@/lib/model-service"
import { Loader2 } from "lucide-react"

export default function ModelComparison() {
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [modelDetails, setModelDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadComparison = async () => {
      try {
        const data = await getModelComparison()
        setComparisonData(data)
        setModelDetails(data)
      } catch (error) {
        console.error("Failed to load comparison:", error)
      } finally {
        setLoading(false)
      }
    }

    loadComparison()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Model Comparison
          </h1>
          <p className="text-chart-3">Compare performance metrics across Naive Bayes and Logistic Regression</p>
        </div>

        {/* Performance Metrics Chart */}
        <div className="glass rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Legend />
              <Bar dataKey="accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="precision" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="recall" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="f1_score" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency Metrics */}
        <div className="glass rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Efficiency Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="training_time" stroke="#3B82F6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="model_size" stroke="#06B6D4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Model Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {modelDetails.map((model, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl p-8 border hover:border-blue-400/50 transition-colors border-foreground"
            >
              <h3 className="text-2xl font-bold mb-6 text-chart-3">{model.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Accuracy</p>
                  <p className="text-3xl font-bold text-blue-400">{model.accuracy}%</p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">F1-Score</p>
                  <p className="text-3xl font-bold text-cyan-400">{model.f1_score}%</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Training</p>
                  <p className="text-3xl font-bold text-purple-400">{model.training_time}s</p>
                </div>
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-400/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Size</p>
                  <p className="text-3xl font-bold text-pink-400">{model.model_size}MB</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Precision</span>
                  <span className="font-bold text-blue-400">{model.precision}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Recall</span>
                  <span className="font-bold text-cyan-400">{model.recall}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
