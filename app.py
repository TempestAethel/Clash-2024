from flask import Flask, request, jsonify
import os
import librosa
import numpy as np

app = Flask(__name__)

VOICE_FOLDER = "voices"  # Folder where stored audio files are kept

# Function to extract features (MFCC) from audio
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfccs.T, axis=0)

# Function to compare two audio features
def compare_audio_features(features1, features2):
    return np.linalg.norm(features1 - features2)

# API to recognize the speaker
@app.route('/recognize', methods=['POST'])
def recognize():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file found"}), 400

    audio_file = request.files['audio']
    audio_path = os.path.join("temp", "audio.wav")
    audio_file.save(audio_path)

    # Extract features from the uploaded audio
    uploaded_features = extract_features(audio_path)

    # Compare with all stored voices
    best_match = None
    smallest_distance = float('inf')

    for file_name in os.listdir(VOICE_FOLDER):
        if file_name.endswith(".wav"):
            stored_audio_path = os.path.join(VOICE_FOLDER, file_name)
            stored_features = extract_features(stored_audio_path)

            distance = compare_audio_features(uploaded_features, stored_features)
            if distance < smallest_distance:
                smallest_distance = distance
                best_match = file_name.split('.')[0]  # Get speaker name from file name

    os.remove(audio_path)  # Clean up temporary file

    if best_match:
        return jsonify({"speaker": best_match})
    else:
        return jsonify({"speaker": "Unknown"})

if __name__ == '__main__':
    if not os.path.exists("temp"):
        os.makedirs("temp")
    app.run(debug=True)
