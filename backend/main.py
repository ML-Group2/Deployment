from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

# Importing the functions for both models (Naive Bayes and Logistic Regression)
from logistic_regression_model import classify_message
from naive_bayes_model import predict_message

app = FastAPI(title="ML Deployment Backend")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Root route for testing ---
@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}

@app.get("/api")
def default():
    return {"message": "API is Running!"}

@app.get("/api/models")
def models():
    return [
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

# --- GET /models ---
@app.get("/api/models")
def get_models():
    return [
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

# --- POST /predict ---
@app.post("/api/predict")
async def predict(features: dict, model_id: Optional[str] = None):
    # placeholder prediction

    if model_id == "naive-bayes":
        return predict_message(features["sentence"])
    elif model_id == "logistic-regression":
        return classify_message(features["sentence"])
    else:
        return {"message": "Invalid model_id"}


# --- POST /batch-predict ---
@app.post("/api/batch-predict")
def batch_predict(file_url: str, model_id: Optional[str] = None):
    job_id = "job-1234567890"
    return {
        "job_id": job_id,
        "status": "processing"
    }

# --- GET /batch-status/{job_id} ---
@app.get("/api/batch-status/{job_id}")
def batch_status(job_id: str):
    return {
        "job_id": job_id,
        "status": "completed",
        "results_url": f"/results/{job_id}.csv"
    }
