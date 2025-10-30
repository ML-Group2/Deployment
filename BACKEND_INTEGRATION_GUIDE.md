# Backend Integration Guide

## Quick Start for Backend Engineers

This guide explains how to integrate your trained Naive Bayes and Logistic Regression models into the deployment platform.

### Model Requirements

Your backend needs to expose these endpoints:

#### 1. **GET /models**
Returns list of available models.

**Response:**
\`\`\`json
[
  {
    "id": "naive-bayes",
    "name": "Naive Bayes",
    "version": "1.0.0",
    "metrics": {
      "accuracy": 0.87,
      "precision": 0.85,
      "recall": 0.89,
      "f1_score": 0.87,
      "training_time": 0.8,
      "model_size": 2.1
    },
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "logistic-regression",
    "name": "Logistic Regression",
    "version": "1.0.0",
    "metrics": {
      "accuracy": 0.91,
      "precision": 0.90,
      "recall": 0.92,
      "f1_score": 0.91,
      "training_time": 1.2,
      "model_size": 0.5
    },
    "created_at": "2024-01-10T14:20:00Z"
  }
]
\`\`\`

#### 2. **POST /predict**
Make a single prediction.

**Request:**
\`\`\`json
{
  "features": {
    "feature1": 5.2,
    "feature2": 3.1,
    "feature3": 1.8
  },
  "model_id": "logistic-regression"  // Optional - if not provided, use best model
}
\`\`\`

**Response:**
\`\`\`json
{
  "prediction": 42.5,
  "confidence": 87.3,
  "model_id": "logistic-regression",
  "timestamp": "2024-01-20T15:30:00Z"
}
\`\`\`

#### 3. **POST /batch-predict**
Process batch predictions from CSV.

**Request:**
\`\`\`json
{
  "file_url": "https://example.com/data.csv",
  "model_id": "logistic-regression"  // Optional
}
\`\`\`

**Response:**
\`\`\`json
{
  "job_id": "job-1234567890",
  "status": "processing"
}
\`\`\`

#### 4. **GET /batch-status/{job_id}**
Check batch job status.

**Response:**
\`\`\`json
{
  "job_id": "job-1234567890",
  "status": "completed",
  "results_url": "/results/job-1234567890.csv"
}
\`\`\`

### Environment Variables

Set these in your `.env` file:

\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_MOCK_DATA=false
\`\`\`

### Testing

1. Start with mock data enabled (`NEXT_PUBLIC_USE_MOCK_DATA=true`)
2. Implement your backend endpoints
3. Switch to real API (`NEXT_PUBLIC_USE_MOCK_DATA=false`)
4. Test each endpoint individually

### Model Loading

Load your `.pkl` files at startup:

\`\`\`python
import pickle

# Load models
with open('naive_bayes_model.pkl', 'rb') as f:
    naive_bayes = pickle.load(f)

with open('logistic_regression_model.pkl', 'rb') as f:
    logistic_regression = pickle.load(f)
\`\`\`

### Feature Preprocessing

Ensure features are preprocessed the same way as training:

\`\`\`python
# Apply same preprocessing pipeline
features_processed = preprocessing_pipeline.transform(features)
prediction = model.predict(features_processed)
confidence = model.predict_proba(features_processed).max() * 100
\`\`\`

That's it! The frontend will handle the rest.
