"use client"
import { ArrowRight, Zap, BarChart3, Cpu, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface HeroProps {
  setCurrentPage: (page: string) => void
}

export default function Hero({ setCurrentPage }: HeroProps) {
  const [metrics, setMetrics] = useState({ predictions: 0, accuracy: 0, models: 0 })

  useEffect(() => {
    const intervals = [
      setInterval(() => setMetrics((p) => ({ ...p, predictions: Math.min(p.predictions + 50, 2847) })), 30),
      setInterval(() => setMetrics((p) => ({ ...p, accuracy: Math.min(p.accuracy + 1, 94) })), 40),
      setInterval(() => setMetrics((p) => ({ ...p, models: Math.min(p.models + 1, 2) })), 100),
    ]
    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <section className="min-h-[calc(100vh-64px)] relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-center px-4 py-20 min-h-[calc(100vh-64px)]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-chart-3">Intelligent Classification at Scale</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-balance leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Advanced ML
              </span>
              <br />
              <span className="text-chart-3">Prediction Platform</span>
            </h1>

            <p className="text-xl text-balance max-w-2xl mx-auto leading-relaxed text-foreground">
              Harness the power of machine learning to make accurate predictions. Compare models, analyze data, and
              deploy predictions at scale with our cutting-edge platform.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <button
              onClick={() => setCurrentPage("predict")}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Start Predicting <ArrowRight size={20} />
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Learn More
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="text-3xl font-bold text-blue-400 animate-count-up">
                {metrics.predictions.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400 mt-1">Predictions Made</p>
            </div>
            <div className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="text-3xl font-bold text-cyan-400 animate-count-up">{metrics.accuracy}%</div>
              <p className="text-sm text-gray-400 mt-1">Average Accuracy</p>
            </div>
            <div className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="text-3xl font-bold text-purple-400 animate-count-up">{metrics.models}</div>
              <p className="text-sm text-gray-400 mt-1">Models Compared</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="glass rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/40 transition-colors">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Predictions</h3>
              <p className="text-sm text-gray-400">Get predictions in milliseconds with optimized models</p>
            </div>
            <div className="glass rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/40 transition-colors">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Model Comparison</h3>
              <p className="text-sm text-gray-400">Compare multiple models side-by-side to find the best fit</p>
            </div>
            <div className="glass rounded-2xl p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/40 transition-colors">
                <Cpu className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Batch Processing</h3>
              <p className="text-sm text-gray-400">Process large datasets efficiently with batch predictions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
