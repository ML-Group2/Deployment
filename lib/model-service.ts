import { predict, batchPredict, getModels, type PredictionRequest, type BatchPredictionRequest, type PredictionResponse } from "./api-client"
import { generateMockPrediction, mockModels } from "./mock-data"

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false"

export async function getPrediction(request: PredictionRequest) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockPrediction(request.sentence)
  }

  console.log("[getPrediction] request:", request)
  const apiResponse: any = await predict(request)
  console.log("[getPrediction] raw API response:", apiResponse)

  // Normalize varying backend shapes to the UI's expected PredictionResponse
  const pickNumber = (...values: any[]): number | undefined => {
    for (const v of values) {
      if (typeof v === "number" && !Number.isNaN(v)) return v
      if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v)
    }
    return undefined
  }

  // Try multiple field names commonly used by different backends
  let confidence = pickNumber(
    apiResponse?.confidence,
    apiResponse?.probability,
    apiResponse?.prob,
    apiResponse?.score,
    apiResponse?.confidence_score,
    apiResponse?.prediction_score
  )

  // Scale to 0-100 if backend returns 0-1
  if (typeof confidence === "number" && confidence <= 1) confidence = confidence * 100

  // Pick label directly from backend (e.g., "Ham" | "Spam")
  const labelString: string | undefined =
    typeof apiResponse?.prediction === "string"
      ? apiResponse.prediction
      : (typeof apiResponse?.label === "string" ? apiResponse.label : undefined)

  const normalized: PredictionResponse = {
    // Prediction is the label string (Ham/Spam) per backend contract
    prediction: labelString || "Unknown",
    confidence: typeof confidence === "number" ? confidence : 0,
    model_id: request.model_id || apiResponse?.model_id || "default",
    timestamp: apiResponse?.timestamp || new Date().toISOString(),
  }

  console.log("[getPrediction] normalized result:", normalized)
  return normalized
}

export async function submitBatchPrediction(request: BatchPredictionRequest) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      job_id: `job-${Date.now()}`,
      status: "processing" as const,
    }
  }

  return batchPredict(request)
}

export async function getBatchStatus(jobId: string) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      job_id: jobId,
      status: "completed" as const,
      results_url: `/results/${jobId}.csv`,
    }
  }

  // In real implementation, call actual API
  return {
    job_id: jobId,
    status: "completed" as const,
    results_url: `/results/${jobId}.csv`,
  }
}

export async function fetchAvailableModels() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockModels
  }

  return getModels()
}

export async function getModelComparison() {
  const models = await fetchAvailableModels()
  return models.map((model) => ({
    name: model.name,
    accuracy: Math.round(model.metrics.accuracy * 100),
    precision: Math.round(model.metrics.precision * 100),
    recall: Math.round(model.metrics.recall * 100),
    f1_score: Math.round(model.metrics.f1_score * 100),
    training_time: model.metrics.training_time,
    model_size: model.metrics.model_size,
  }))
}
