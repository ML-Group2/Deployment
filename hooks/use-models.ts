"use client"

import { useEffect, useState } from "react"
import { fetchAvailableModels } from "@/lib/model-service"
import type { ModelInfo } from "@/lib/api-client"

export function useModels() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchAvailableModels()
        setModels(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load models"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  return { models, loading, error }
}
