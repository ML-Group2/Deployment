import pickle
import os
import sys
import joblib
import pandas as pd
import numpy as np

def load_logistic_model_and_vectorizer():
    # Get current backend directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Move up one level and go into models folder
    models_path = current_dir

    # os.path.normpath(os.path.join(current_dir, "..", "models")))

    # Define model paths
    model_path = os.path.join(models_path, "logistic_regression.pkl")
    # vectorizer_path = os.path.join(models_path, "tfidf_vectorizer.pkl")
    scaler_path = os.path.join(models_path, "feature_scaler.pkl")

    # Print the exact paths being used
    print(f"\n[DEBUG] Checking model path: {model_path}")
    # print(f"[DEBUG] Checking vectorizer path: {vectorizer_path}\n")
    print(f"[DEBUG] Checking scaler path: {scaler_path}\n")

    # Check if the files exist
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"[ERROR] Model file not found at: {model_path}")
    # if not os.path.exists(vectorizer_path):
    #     raise FileNotFoundError(f"[ERROR] Vectorizer file not found at: {vectorizer_path}")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"[ERROR] Scaler file not found at: {scaler_path}")

    # Load them
    with open(model_path, "rb") as model_file:
        logistic_model = joblib.load(model_file)

    # with open(vectorizer_path, "rb") as vec_file:
    #     tfidf_vectorizer = joblib.load(vec_file)

    with open(scaler_path, "rb") as scaler_file:
        feature_scaler = joblib.load(scaler_file)

    feature_cols = ['message_length', 'word_count', 'text_length',
                'avg_word_length', 'unique_words', 'word_diversity',
                'short_word_count', 'short_word_ratio', 'long_word_count',
                'long_word_ratio', 'spam_word_count', 'spam_word_ratio',
                'repeated_word_count', 'repetition_ratio', 'has_greeting',
                'action_word_count', 'action_word_ratio']

    return logistic_model, feature_scaler, feature_cols  # tfidf_vectorizer


def extract_features(message, feature_cols=None):
    """Extract the same 17 numerical features used during training"""

    # Basic features
    message_length = len(message)
    words = message.lower().split()
    word_count = len(words)
    text_length = len(message)

    # Word-based features
    avg_word_length = text_length / (word_count + 1)
    unique_words = len(set(words))
    word_diversity = unique_words / (word_count + 1)

    short_word_count = sum(1 for word in words if len(word) <= 2)
    short_word_ratio = short_word_count / (word_count + 1)

    long_word_count = sum(1 for word in words if len(word) >= 8)
    long_word_ratio = long_word_count / (word_count + 1)

    # Spam indicators
    spam_words = ['free', 'win', 'winner', 'cash', 'prize', 'claim',
                  'call', 'text', 'txt', 'reply', 'urgent', 'now',
                  'offer', 'deal', 'cheap', 'guarantee']
    spam_word_count = sum(1 for word in words if word in spam_words)
    spam_word_ratio = spam_word_count / (word_count + 1)

    # Repeated words
    word_counts = {}
    for word in words:
        word_counts[word] = word_counts.get(word, 0) + 1
    repeated_word_count = sum(1 for count in word_counts.values() if count > 1)
    repetition_ratio = repeated_word_count / (word_count + 1)

    # Greeting detection
    greetings = ['hi', 'hello', 'hey', 'dear', 'good', 'morning', 'afternoon', 'evening']
    has_greeting = 1 if any(message.lower().startswith(g) for g in greetings) else 0

    # Action words
    action_words = ['call', 'text', 'reply', 'click', 'visit', 'claim', 'get', 'buy', 'order']
    action_word_count = sum(1 for word in words if word in action_words)
    action_word_ratio = action_word_count / (word_count + 1)

    # Create feature dictionary
    features = {
        'message_length': message_length,
        'word_count': word_count,
        'text_length': text_length,
        'avg_word_length': avg_word_length,
        'unique_words': unique_words,
        'word_diversity': word_diversity,
        'short_word_count': short_word_count,
        'short_word_ratio': short_word_ratio,
        'long_word_count': long_word_count,
        'long_word_ratio': long_word_ratio,
        'spam_word_count': spam_word_count,
        'spam_word_ratio': spam_word_ratio,
        'repeated_word_count': repeated_word_count,
        'repetition_ratio': repetition_ratio,
        'has_greeting': has_greeting,
        'action_word_count': action_word_count,
        'action_word_ratio': action_word_ratio
    }

    # Return as DataFrame with correct column order
    if feature_cols:
        return pd.DataFrame([features])[feature_cols]
    return pd.DataFrame([features])


def classify_message(message):
    logistic_model, feature_scaler, feature_cols = load_logistic_model_and_vectorizer()

    features_df = extract_features(message, feature_cols)

    features_scaled = feature_scaler.transform(features_df)
    prediction = logistic_model.predict(features_scaled)[0]
    probability = logistic_model.predict_proba(features_scaled)[0]

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
