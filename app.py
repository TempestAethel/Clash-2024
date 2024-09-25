import numpy as np
import librosa
import pickle
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the trained model
with open('models/speaker_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Real-time audio processing route
@app.route('/process_audio', methods=['POST'])
def process_audio():
    audio_data = np.array(request.json['audio'])

    # Feature extraction using MFCC
    mfccs = librosa.feature.mfcc(y=audio_data, sr=16000, n_mfcc=13)
    mfccs = np.mean(mfccs.T, axis=0)  # Average the MFCC features

    # Predict the speaker based on the extracted features
    speaker = model.predict([mfccs])[0]

    return jsonify({'speaker': speaker})

if __name__ == '__main__':
    app.run(debug=True)
