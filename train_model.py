import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# Path to voice data
DATA_DIR = 'voices/'

# Extract features from all speakers' audio samples
def extract_features():
    labels, features = [], []
    
    for speaker in os.listdir(DATA_DIR):
        speaker_dir = os.path.join(DATA_DIR, speaker)
        
        for file in os.listdir(speaker_dir):
            file_path = os.path.join(speaker_dir, file)
            
            # Load audio file and extract features
            y, sr = librosa.load(file_path, sr=16000)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfccs_mean = np.mean(mfccs.T, axis=0)
            
            features.append(mfccs_mean)
            labels.append(speaker)
    
    return np.array(features), np.array(labels)

# Extract features and labels
X, y = extract_features()

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model (use SVM or RandomForest)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

# Save the model
with open('models/speaker_model.pkl', 'wb') as f:
    pickle.dump(model, f)
