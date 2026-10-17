# DeepGuard AI — Deepfake Face Detection

**DeepGuard AI** is a student-developed deepfake detection web application that analyses uploaded facial images using a trained convolutional neural network (CNN). It combines a Flask backend, face preprocessing with MediaPipe, and a responsive HTML/CSS/JavaScript interface.

> **Important:** Predictions are model-generated assessments, not definitive proof that an image is authentic or manipulated.

## Website features

- Home, About, How It Works, and Detection sections
- Image upload through file selection or drag and drop (JPG, JPEG, PNG, WEBP)
- Face detection and preprocessing before classification
- REAL/FAKE prediction, confidence, fake probability, and processed-face preview
- Responsive dark-themed interface

## Technology stack

| Component | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Web backend | Python, Flask |
| Classification | TensorFlow / Keras CNN |
| Face preprocessing | MediaPipe, OpenCV, Pillow |
| Containerization | Docker / Docker Compose |

## Repository structure

```text
.
├── README.md                        # Repository overview (this file)
├── Documents/                       # Project documentation
└── DeepFake_Detection/
    ├── README.md                    # Detailed technical documentation
    ├── Dockerfile
    ├── docker-compose.yml
    ├── requirements.txt             # Research/training dependencies
    ├── requirements-docker.txt      # Web runtime dependencies
    ├── src/                         # Inference and preprocessing code, selected model
    ├── web/
    │   ├── app.py                   # Flask routes and prediction API
    │   ├── templates/index.html     # Website page
    │   └── static/                  # CSS and JavaScript
    └── model-wise/                  # Model experiments and comparisons
```

## Run locally using Docker (recommended)

Install and start Docker Desktop. From the repository root, run:

```powershell
cd DeepFake_Detection
docker build -t deepfake-detection .
docker run --rm --name deepfake-detection-runtime -p 5000:5000 deepfake-detection
```

Open **http://127.0.0.1:5000/** in your browser. Press `Ctrl+C` in the terminal to stop the foreground container.

Alternatively, from `DeepFake_Detection/`:

```powershell
docker compose up --build
```

The selected model, `src/mediapipe_e08_best.keras`, is included in the repository and copied into the Docker image automatically. You do not need to download it separately for the included setup.

## Run locally using Python

Use a compatible Python 3.11 environment. From `DeepFake_Detection/`:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-docker.txt
.\.venv\Scripts\python.exe -m web.app
```

Open **http://127.0.0.1:5000/**. For training and research dependencies, see `DeepFake_Detection/requirements.txt` and the [technical README](DeepFake_Detection/README.md).

## How detection works

1. The user uploads a supported facial image.
2. The backend prepares a detected face using MediaPipe-based preprocessing. If no face is detected, the application returns an error rather than evaluating the image.
3. The selected E8 CNN model evaluates the prepared face.
4. The website displays the model's predicted class, confidence, fake probability, and processed input.

The application uses the model's sigmoid output as the **REAL** class probability (`REAL = 1`, `FAKE = 0`), and calculates fake probability as `1 - model output`. The configured decision threshold is displayed in the interface.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Serves the website |
| POST | `/api/predict` | Accepts a multipart form image under the key `image` and returns the model assessment |

## Model experiments and documentation

The repository contains the research workflow and E1–E10 model comparison. See [the technical README](DeepFake_Detection/README.md) and [the model index](DeepFake_Detection/model-wise/MODEL_INDEX.md) for notebook order, experiment mapping, and recorded results. The selected application model is E8, a deeper 128×128 CNN with Batch Normalization.

## Deployment status

The application currently has a working local Docker configuration. **A public production URL has not yet been added to this README.** Before publishing, verify live image predictions, deployment resource limits, upload limits, and the public deployment configuration. Do not use GitHub Pages alone to host this Flask/TensorFlow application; it requires a Python application runtime.

## Academic context

Developed for the Essentials of Artificial Intelligence group project at General Sir John Kotelawala Defence University (KDU).
