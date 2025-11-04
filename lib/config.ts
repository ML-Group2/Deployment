export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://ml-group-work-deployment.onrender.com/api",
    timeout: 30000,
    retries: 3,
  },

  // Feature Flags
  features: {
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false",
    enableBatchUpload: process.env.NEXT_PUBLIC_ENABLE_BATCH_UPLOAD !== "false",
    enableModelComparison: process.env.NEXT_PUBLIC_ENABLE_MODEL_COMPARISON !== "false",
  },

  // Analytics
  analytics: {
    enabled: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },

  // App Metadata
  app: {
    name: "ML Prediction Platform",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
}

// Validation
if (!config.api.baseUrl && !config.features.useMockData) {
  console.warn("Warning: API URL not configured and mock data is disabled")
}
