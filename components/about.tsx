"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="min-h-[calc(100vh-64px)] px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">About ML Predictor</h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform for machine learning predictions, model comparison, and batch processing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>Everything you need for ML predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Frontend</p>
              <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div>
              <p className="font-medium">Backend</p>
              <p className="text-muted-foreground">FastAPI, Python, PostgreSQL</p>
            </div>
            <div>
              <p className="font-medium">ML</p>
              <p className="text-muted-foreground">scikit-learn, TensorFlow, XGBoost</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
