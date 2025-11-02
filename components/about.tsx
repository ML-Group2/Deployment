"use client"

import { CheckCircle } from "lucide-react"

export default function About() {
  const features = [
    "Real-time predictions with multiple ML models",
    "Comprehensive model comparison and analytics",
    "Batch processing for large datasets",
    "High-performance inference engine",
    "RESTful API for integration",
    "Detailed prediction explanations",
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="animate-slide-up text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            About Group 2 ML Predictor
          </h1>
          <p className="text-lg text-black/80">
            A comprehensive platform for machine learning predictions, model comparison, and batch processing.
          </p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/10">
            <h2 className="text-3xl font-bold text-black mb-6">Platform Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-black/80 group-hover:text-black font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/10">
            <h2 className="text-3xl font-bold text-black mb-6">Technology Stack</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gray-50 border border-blue-400/40 hover:border-blue-400/60 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
                <p className="font-bold text-blue-400 mb-2 text-lg group-hover:text-blue-300 transition-colors">Frontend</p>
                <p className="text-black/80 group-hover:text-black transition-colors">React, Next.js, TypeScript, Tailwind CSS</p>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-cyan-400/40 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
                <p className="font-bold text-cyan-400 mb-2 text-lg group-hover:text-cyan-300 transition-colors">Backend</p>
                <p className="text-black/80 group-hover:text-black transition-colors">FastAPI, Python, PostgreSQL</p>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-purple-400/40 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
                <p className="font-bold text-purple-400 mb-2 text-lg group-hover:text-purple-300 transition-colors">ML Framework</p>
                <p className="text-black/80 group-hover:text-black transition-colors">scikit-learn, TensorFlow, XGBoost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
