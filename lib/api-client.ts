import { config } from "./config"

const API_BASE_URL = config.api.baseUrl

export interface PredictionRequest {
  sentence: string
  model_id?: string
}

export interface PredictionResponse {
  prediction: number
  confidence: number
  model_id: string
  timestamp: string
}

export interface BatchPredictionRequest {
  file_url: string
  model_id?: string
}

export interface BatchPredictionResponse {
  job_id: string
  status: "pending" | "processing" | "completed" | "failed"
  results_url?: string
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  training_time: number
  model_size: number
}

export interface ModelInfo {
  id: string
  name: string
  version: string
  metrics: ModelMetrics
  created_at: string
}

// Single prediction
export async function predict(request: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error("Prediction error:", error)
    throw error
  }
}

// Batch prediction
export async function batchPredict(request: BatchPredictionRequest): Promise<BatchPredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/batch-predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error("Batch prediction error:", error)
    throw error
  }
}

// Get batch job status
export async function getBatchStatus(jobId: string): Promise<BatchPredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/batch-status/${jobId}`)

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error("Batch status error:", error)
    throw error
  }
}

// Get available models
export async function getModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/models`)

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error("Models fetch error:", error)
    throw error
  }
}

// Get model details
export async function getModelDetails(modelId: string): Promise<ModelInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/models/${modelId}`)

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error("Model details error:", error)
    throw error
  }
}
