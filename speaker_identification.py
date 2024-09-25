import os
import librosa
import numpy as np
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import pickle

# Initialize Flask app
app = Flask(__name__)

# Path to the voices directory
VOICE_PATH = 'voices/'

# Function to extract features from audio file
def extract_features(audio_file):
    y, sr = librosa.load(audio_file, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    return np.mean(mfcc.T, axis=0)

# Train the speaker identification model
def train_model():
    data = []
    labels = []

    for speaker in os.listdir(VOICE_PATH):
        speaker_folder = os.path.join(VOICE_PATH, speaker)
        if os.path.isdir(speaker_folder):
            for audio_file in os.listdir(speaker_folder):
                audio_path = os.path.join(speaker_folder, audio_file)
                features = extract_features(audio_path)
                data.append(features)
                labels.append(speaker)

    # Convert to numpy arrays
    data = np.array(data)
    labels = np.array(labels)

    # Split data for training and testing
    X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)

    # Train an SVM model
    model = SVC(kernel='linear', probability=True)
    model.fit(X_train, y_train)

    # Save the trained model
    with open('speaker_model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print(f"Model trained with accuracy: {model.score(X_test, y_test) * 100:.2f}%")

# Load the trained model
def load_model():
    with open('speaker_model.pkl', 'rb') as f:
        model = pickle.load(f)
    return model

# API route to handle speaker identification
@app.route('/identify', methods=['POST'])
def identify_speaker():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files
