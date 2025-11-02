# Backend Integration Guide

## Quick Start for Backend Engineers

This guide explains how to integrate your trained **Naive Bayes** and **Logistic Regression** models into the deployment platform. The process is straightforward and takes about 15-20 minutes.

## Overview

Your backend needs to:
1. Accept **sentence strings** (not feature arrays) as input
2. Process the sentences through your ML models
3. Return predictions with confidence scores
4. Support both single and batch predictions

---

## Step 1: Model Requirements

Your backend needs to expose these **4 endpoints**:

### 1. **GET /api/models**
Returns list of available models.

**Response:**
```json
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
```

### 2. **POST /api/predict**
Make a single prediction from a sentence.

**Request:**
```json
{
  "sentence": "This is a sample sentence for prediction",
  "model_id": "logistic-regression"  // Optional - if not provided, use best model
}
```

**Response:**
```json
{
  "prediction": 42.5,
  "confidence": 87.3,
  "model_id": "logistic-regression",
  "timestamp": "2024-01-20T15:30:00Z"
}
```

**Important:** The `sentence` field is a **string**, not a feature vector. Your backend should handle text preprocessing (tokenization, feature extraction, etc.) internally.

### 3. **POST /api/batch-predict**
Process batch predictions from CSV.

**Request:**
```json
{
  "file_url": "https://example.com/data.csv",
  "model_id": "logistic-regression"  // Optional
}
```

**CSV Format:**
Your CSV file should have a `sentence` column:
```csv
sentence
"This is the first sentence to analyze"
"This is another sentence for prediction"
"More text data to process"
```

**Response:**
```json
{
  "job_id": "job-1234567890",
  "status": "processing"
}
```

### 4. **GET /api/batch-status/{job_id}**
Check batch job status.

**Response:**
```json
{
  "job_id": "job-1234567890",
  "status": "completed",
  "results_url": "/results/job-1234567890.csv"
}
```

---

## Step 2: Environment Setup

### Frontend Configuration
Set these in your `.env.local` file (in the frontend directory):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Backend Configuration
Your backend should:
- Run on port 8000 (or update `NEXT_PUBLIC_API_BASE_URL` accordingly)
- Enable CORS for your frontend domain
- Accept JSON requests with `Content-Type: application/json`

---

## Step 3: Backend Implementation (Python/FastAPI Example)

### Model Loading

Load your `.pkl` files at startup:

```python
import pickle
from pathlib import Path

# Load models at startup
models = {}

def load_models():
    model_dir = Path("models")
    
    # Load Naive Bayes
    with open(model_dir / "naive_bayes_model.pkl", "rb") as f:
        models["naive-bayes"] = pickle.load(f)
    
    # Load Logistic Regression
    with open(model_dir / "logistic_regression_model.pkl", "rb") as f:
        models["logistic-regression"] = pickle.load(f)
    
    # Load preprocessing pipeline (vectorizer, scaler, etc.)
    with open(model_dir / "preprocessing_pipeline.pkl", "rb") as f:
        global preprocessing_pipeline
        preprocessing_pipeline = pickle.load(f)
```

### Single Prediction Endpoint

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class PredictionRequest(BaseModel):
    sentence: str
    model_id: str = None

class PredictionResponse(BaseModel):
    prediction: float
    confidence: float
    model_id: str
    timestamp: str

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    # Preprocess the sentence (tokenize, vectorize, etc.)
    sentence_processed = preprocessing_pipeline.transform([request.sentence])
    
    # Select model
    model_id = request.model_id or select_best_model()
    model = models[model_id]
    
    # Make prediction
    prediction = model.predict(sentence_processed)[0]
    confidence = model.predict_proba(sentence_processed)[0].max() * 100
    
    return PredictionResponse(
        prediction=float(prediction),
        confidence=float(confidence),
        model_id=model_id,
        timestamp=datetime.now().isoformat()
    )
```

### Batch Prediction Endpoint

```python
import pandas as pd
from fastapi import BackgroundTasks

@app.post("/api/batch-predict")
async def batch_predict(request: BatchPredictionRequest, background_tasks: BackgroundTasks):
    # Download CSV file
    df = pd.read_csv(request.file_url)
    
    # Validate CSV has 'sentence' column
    if 'sentence' not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must have 'sentence' column")
    
    # Create job
    job_id = f"job-{int(time.time())}"
    
    # Process in background
    background_tasks.add_task(process_batch, job_id, df, request.model_id)
    
    return {"job_id": job_id, "status": "processing"}

def process_batch(job_id: str, df: pd.DataFrame, model_id: str = None):
    # Process each sentence
    results = []
    model = models[model_id or select_best_model()]
    
    for sentence in df['sentence']:
        processed = preprocessing_pipeline.transform([sentence])
        prediction = model.predict(processed)[0]
        confidence = model.predict_proba(processed)[0].max() * 100
        results.append({
            "sentence": sentence,
            "prediction": float(prediction),
            "confidence": float(confidence)
        })
    
    # Save results
    results_df = pd.DataFrame(results)
    results_df.to_csv(f"results/{job_id}.csv", index=False)
```

---

## Step 4: Testing Your Integration

### Step-by-Step Testing

1. **Start with mock data** (frontend):
   ```bash
   # In .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```
   Verify the frontend works correctly with mock data.

2. **Test your backend independently**:
   ```bash
   # Test single prediction
   curl -X POST http://localhost:8000/api/predict \
     -H "Content-Type: application/json" \
     -d '{"sentence": "This is a test sentence"}'
   
   # Test models endpoint
   curl http://localhost:8000/api/models
   ```

3. **Connect frontend to backend**:
   ```bash
   # In .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. **Test each feature**:
   - Single prediction with different models
   - Batch upload with CSV file
   - Model comparison page

---

## Step 5: Adding Your Two Models

### Quick Setup Checklist

1. ✅ Save your trained models as `.pkl` files:
   - `naive_bayes_model.pkl`
   - `logistic_regression_model.pkl`

2. ✅ Save your preprocessing pipeline:
   - `preprocessing_pipeline.pkl` (includes vectorizer, scaler, etc.)

3. ✅ Implement the 4 endpoints above

4. ✅ Load models at startup (see Step 3)

5. ✅ Handle sentence preprocessing:
   - Tokenization
   - Feature extraction (TF-IDF, word embeddings, etc.)
   - Any normalization/cleaning

6. ✅ Return predictions in the format specified

### Model Selection Logic

If no `model_id` is provided, your backend should select the best model. You can implement this based on:
- Highest accuracy
- Best F1-score
- Specific business logic

Example:
```python
def select_best_model():
    # Return model with highest accuracy
    return "logistic-regression"  # Based on metrics above
```

---

## Important Notes

### Sentence Preprocessing
Your backend must handle:
- **Text cleaning** (remove special chars, normalize whitespace)
- **Tokenization** (split into words/tokens)
- **Feature extraction** (TF-IDF, Count Vectorizer, Word Embeddings, etc.)
- **Same preprocessing** as used during training

### Error Handling
Your endpoints should handle:
- Invalid sentence format (empty strings, too long, etc.)
- Model not found errors
- Processing failures

Example:
```python
@app.post("/api/predict")
async def predict(request: PredictionRequest):
    if not request.sentence or not request.sentence.strip():
        raise HTTPException(status_code=400, detail="Sentence cannot be empty")
    
    if len(request.sentence) > 10000:  # Example limit
        raise HTTPException(status_code=400, detail="Sentence too long")
    
    # ... rest of prediction logic
```

---

## Troubleshooting

### Common Issues

**Frontend shows "API error"**
- Check CORS is enabled on your backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check backend logs for errors

**Predictions seem wrong**
- Ensure preprocessing matches training preprocessing
- Verify model files are loaded correctly
- Check that sentence is being processed before prediction

**Batch processing fails**
- Ensure CSV has 'sentence' column (case-sensitive)
- Check file size limits
- Verify background job processing is working

---

## Next Steps

1. Deploy your backend (see `DEPLOYMENT.md` for options)
2. Update `NEXT_PUBLIC_API_BASE_URL` to your production URL
3. Test end-to-end with real data
4. Monitor performance and optimize as needed

---

That's it! The frontend will handle all UI, visualization, and user interactions. You just need to implement these 4 endpoints with sentence input support.
