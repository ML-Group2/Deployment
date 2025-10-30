"use client"

import { useState, useCallback } from "react"
import { getPrediction, type PredictionRequest } from "@/lib/model-service"

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const predict = useCallback(async (request: PredictionRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPrediction(request)
      setResult(response)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Prediction failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { predict, loading, error, result, reset }
}
