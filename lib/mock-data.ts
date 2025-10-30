import type { ModelInfo, PredictionResponse } from "./api-client"

export const mockModels: ModelInfo[] = [
  {
    id: "naive-bayes",
    name: "Naive Bayes",
    version: "1.0.0",
    metrics: {
      accuracy: 0.87,
      precision: 0.85,
      recall: 0.89,
      f1_score: 0.87,
      training_time: 0.8,
      model_size: 2.1,
    },
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    version: "1.0.0",
    metrics: {
      accuracy: 0.91,
      precision: 0.9,
      recall: 0.92,
      f1_score: 0.91,
      training_time: 1.2,
      model_size: 0.5,
    },
    created_at: "2024-01-10T14:20:00Z",
  },
]

export function generateMockPrediction(features: Record<string, number>): PredictionResponse {
  const baseValue = Object.values(features).reduce((a, b) => a + b, 0) / Object.keys(features).length
  const selectedModel = mockModels[Math.floor(Math.random() * mockModels.length)]
  return {
    prediction: baseValue * (0.8 + Math.random() * 0.4),
    confidence: selectedModel.id === "logistic-regression" ? 80 + Math.random() * 15 : 75 + Math.random() * 20,
    model_id: selectedModel.id,
    timestamp: new Date().toISOString(),
  }
}

export function generateMockBatchResults(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    row_id: i + 1,
    prediction: Math.random() * 100,
    confidence: 70 + Math.random() * 25,
  }))
}
