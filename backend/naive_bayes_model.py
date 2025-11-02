import os
import pickle
import numpy as np


def get_model_paths() -> tuple[str, str]:
    
    # Locate and return absolute paths for the Naive Bayes model and its vectorizer artifacts

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(os.path.dirname(backend_dir), "models")

    model_file = os.path.join(models_dir, "naive_bayes_spam_model.pkl")
    vectorizer_file = os.path.join(models_dir, "naive_bayes_spam_artifacts.pkl")

    if not os.path.exists(model_file):
        raise FileNotFoundError(f"Naive Bayes model not found at: {model_file}")
    if not os.path.exists(vectorizer_file):
        raise FileNotFoundError(f"Vectorizer file not found at: {vectorizer_file}")

    return model_file, vectorizer_file


def load_naive_bayes_components():
  
    # Load the trained Naive Bayes model and its TF-IDF vectorizer
    # Returns the model and vectorizer

    model_path, vectorizer_path = get_model_paths()

    with open(model_path, "rb") as m_file:
        nb_model = pickle.load(m_file)
    with open(vectorizer_path, "rb") as v_file:
        vectorizer = pickle.load(v_file)

    return nb_model, vectorizer


# ------------------------------
# Main Prediction Function
# ------------------------------

def predict_message(text: str) -> dict:
    
    # Classify input text as 'Spam' or 'Ham' using the Naive Bayes model
    # Return a structured dictionary of results
    
    model, vectorizer = load_naive_bayes_components()
    text_vector = vectorizer.transform([text])

    pred_class = model.predict(text_vector)[0]
    probabilities = model.predict_proba(text_vector)[0]
    confidence_score = float(np.max(probabilities) * 100)

    output = {
        "input": text,
        "prediction": "Spam" if pred_class == 1 else "Ham",
        "confidence": round(confidence_score, 2)
    }

    return output


# ------------------------------
# Optional Debug/Test Block
# ------------------------------

# if __name__ == "__main__":
#     sample_text = "Surprise! You've been selected for a free gift card."
#     result = predict_message(sample_text)

#     print("\n🔍 Naive Bayes Classification Result:")
#     print(f"Message: {result['input']}")
#     print(f"Prediction: {result['prediction']}")
#     print(f"Confidence: {result['confidence']}%\n")
