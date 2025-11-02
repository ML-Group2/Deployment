import { predict, batchPredict, getModels, type PredictionRequest, type BatchPredictionRequest } from "./api-client"
import { generateMockPrediction, mockModels } from "./mock-data"

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false"

export async function getPrediction(request: PredictionRequest) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockPrediction(request.sentence)
  }

  return predict(request)
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
