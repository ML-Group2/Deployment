import pickle
import os
import sys
import joblib

import numpy as np

def load_logistic_model_and_vectorizer():
    # Get current backend directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Move up one level and go into models folder
    models_path = current_dir

    # os.path.normpath(os.path.join(current_dir, "..", "models")))

    # Define model paths
    model_path = os.path.join(models_path, "logistic_regression.pkl")
    vectorizer_path = os.path.join(models_path, "tfidf_vectorizer.pkl")

    # Print the exact paths being used
    print(f"\n[DEBUG] Checking model path: {model_path}")
    print(f"[DEBUG] Checking vectorizer path: {vectorizer_path}\n")

    # Check if the files exist
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"[ERROR] Model file not found at: {model_path}")
    if not os.path.exists(vectorizer_path):
        raise FileNotFoundError(f"[ERROR] Vectorizer file not found at: {vectorizer_path}")

    # Load them
    with open(model_path, "rb") as model_file:
        logistic_model = joblib.load(model_file)

    with open(vectorizer_path, "rb") as vec_file:
        tfidf_vectorizer = joblib.load(vec_file)

    return logistic_model, tfidf_vectorizer

def classify_message(message):
    logistic_model, tfidf_vectorizer = load_logistic_model_and_vectorizer()
    transformed_message = tfidf_vectorizer.transform([message])
    prediction = logistic_model.predict(transformed_message)[0]
    probability = logistic_model.predict_proba(transformed_message)[0]

    return {
        "input": message,
        "prediction": "Spam" if prediction == 1 else "Ham",
        "confidence": round(np.max(probability) * 100, 2)
    }


#if __name__ == "__main__":
 #   test_message = "Congratulations! You have won a free ticket."
  #  result = classify_message(test_message)

   # print("Classification Result:")
    #print(f"Message: {result['input']}")
    #print(f"Predicted Class: {result['prediction']}")
    #print(f"Confidence: {result['confidence']}%")
