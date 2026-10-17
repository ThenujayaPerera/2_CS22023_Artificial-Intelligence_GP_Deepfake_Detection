
# DeepGuard AI — Deepfake Detection Application

DeepGuard AI is an AI-powered image classification application designed to identify potentially manipulated human face images.

The project uses TensorFlow/Keras for deep learning, MediaPipe for face detection, and Flask for the web application. Users can upload an image through the web interface and receive a prediction indicating whether the detected face is classified as **Real** or **Fake**.

This directory contains the application source code, model development notebooks, experiment results, evaluation resources, and Docker configuration.

> **Deployment status:** The application has been successfully built and tested locally using Docker and Gunicorn. Public cloud deployment has not been completed.

---

## 1. Features

- Responsive web interface built using HTML, CSS, and JavaScript.
- Image upload and preview functionality.
- Supports JPG, JPEG, PNG, and WEBP images.
- Face detection and preprocessing using MediaPipe.
- Deepfake classification using a trained CNN model.
- Displays the predicted classification and confidence.
- Displays additional prediction information, including fake probability and face detection details.
- Provides an error message when no suitable human face is detected.
- Supports local execution through Python or Docker.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Programming language | Python |
| Deep learning | TensorFlow / Keras |
| Selected model | E8 CNN |
| Face detection | MediaPipe |
| Image processing | OpenCV and Pillow |
| Backend | Flask |
| Frontend | HTML, CSS, JavaScript |
| Production web server | Gunicorn |
| Containerization | Docker |

---

## 3. Project Structure

```text
DeepFake_Detection/
│
├── Dockerfile
├── requirements.txt
├── requirements-docker.txt
├── README.md
│
├── web/
│   ├── app.py
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── style.css
│       └── script.js
│
├── src/
│   ├── inference.py
│   ├── preprocessing.py
│   └── mediapipe_e08_best.keras
│
├── notebooks/          # Training and evaluation notebooks
├── experiments/        # Experiment configurations and outputs
├── evaluation/         # Evaluation resources
├── graphs/             # Generated visualizations
├── history/            # Training histories
├── results/            # Consolidated results
├── checkpoints/        # Training checkpoints
├── models/             # Exported models
├── model-wise/         # E1–E10 model comparison resources
├── data/               # Local dataset files
└── archive/            # Previous project snapshots
```

Some generated artifacts and local datasets may not be included in Git.

---

## 4. Selected AI Model

The application uses the selected **E8 model**, a deeper CNN trained on 128 × 128 face images with Batch Normalization.

The model file used by the application is:

```text
src/mediapipe_e08_best.keras
```

### Prediction workflow

1. The user uploads an image.
2. The Flask backend validates the uploaded file.
3. MediaPipe attempts to detect human faces.
4. If multiple faces are detected, the preprocessing code selects the clearest candidate using face size, detection confidence, and image sharpness.
5. The selected face is cropped with a small margin and resized to 128 × 128.
6. The prepared image is passed to the CNN model.
7. The application returns the prediction to the web interface.

If a suitable face cannot be detected, the application reports the issue instead of performing classification.

### Output interpretation

The model uses the following class mapping:

- Real = 1
- Fake = 0

Its sigmoid output represents the probability of the Real class.

Therefore:

```text
Fake probability = 1 - Model output
```

The application uses its configured decision threshold to determine the displayed classification.

**Important:** The output is a model prediction, not definitive proof that an image is authentic or manipulated.

---

## 5. Run the Application Using Docker

Docker is the recommended method for reproducing the tested application environment.

### Prerequisites

- Docker Desktop installed.
- Docker Desktop's Linux engine running.
- The trained model file available at its expected project location.

Open a terminal inside the `DeepFake_Detection` directory.

### Step 1 — Build the Docker image

```powershell
docker build -t deepguard-production .
```

### Step 2 — Start the application

```powershell
docker run --rm --name deepguard-demo -p 5000:5000 deepguard-production
```

### Step 3 — Open the website

Visit:

http://localhost:5000

Upload a supported image and select the detection option to evaluate it.

### Stop the application

Press `Ctrl + C` in the terminal running the container.

The Docker configuration uses Gunicorn with one worker to avoid unnecessarily loading multiple copies of the AI model.

The trained model is copied into the Docker image at:

```text
/models/model.keras
```

The container uses the `MODEL_PATH` environment variable to locate it.

### Alternative: Docker Compose

If Docker Compose is configured in your working copy, you can use:

```powershell
docker compose up --build
```

---

## 6. Run Locally Using Python

The application can also run without Docker.

Python 3.11 is recommended for consistency with the tested Docker environment.

Open a terminal inside the `DeepFake_Detection` directory.

### Step 1 — Create a virtual environment

```powershell
py -3.11 -m venv .venv
```

### Step 2 — Activate it

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 3 — Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### Step 4 — Start the Flask application

```powershell
python -m web.app
```

Open:

http://127.0.0.1:5000

`requirements.txt` contains the broader development and notebook dependencies.

`requirements-docker.txt` contains the runtime dependencies used to build the containerized application, including Gunicorn.

---

## 7. Web Application and API

The backend is implemented in:

```text
web/app.py
```

The main application endpoints are:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Displays the web interface |
| POST | `/api/predict` | Accepts an image and returns a prediction |

The prediction endpoint accepts an uploaded image using the form field:

```text
image
```

Supported file extensions:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

The JSON response can include the predicted label, confidence, fake probability, detected face count, detector information, active model name, and processed image.

---

## 8. Model Configuration

The application supports configuring a different Keras model through the `MODEL_PATH` environment variable.

When running locally, the default model is:

```text
src/mediapipe_e08_best.keras
```

When running inside the provided Docker image, the model is copied to:

```text
/models/model.keras
```

The backend caches the loaded model and checks its configured path, file size, and modification time to determine when it needs reloading.

A replacement model must be compatible with the application's preprocessing and inference implementation.

---

## 9. Notebook Workflow

The research and model-development notebooks were originally designed for Google Colab.

Run the main notebooks in the following order:

1. `01_dataset_setup.ipynb` — Download and inspect the dataset.
2. `02_cnn_baseline_and_extended.ipynb` — Inspect baseline and extended CNN results.
3. `03_cnn128_checkpoint_recovery.ipynb` — Recover and evaluate the CNN-128 run.
4. `04_efficientnet_training.ipynb` — Train and evaluate EfficientNetB0.
5. `05_final_model_evaluation.ipynb` — Evaluate the selected final model and generate metrics and plots.

The original Google Drive project location is:

```text
/content/drive/MyDrive/DeepFake_Detection
```

Update `BASE_DRIVE` in the relevant notebook if using another directory.

The first notebook uses KaggleHub for dataset retrieval. Kaggle account or API configuration may be required.

---

## 10. Reproducing Experimental Results

Use a GPU-enabled environment where appropriate and execute the relevant notebooks in their documented order.

Keep generated experiment outputs within their corresponding experiment directories.

The project includes resources for comparing model architectures, training histories, evaluation metrics, and visualizations.

For the E1–E10 model mapping and comparison, see:

[Model Index](model-wise/MODEL_INDEX.md)

Additional model-specific notebooks are available in:

[Model-wise Notebooks](model-wise/notebooks)

The selected application model is E8.

---

## 11. Known Limitations

- Predictions depend on the quality and characteristics of the training dataset.
- Side-facing or unusually angled faces may produce less reliable predictions.
- Low-resolution, blurred, or heavily obstructed faces may affect preprocessing and classification.
- Images without a detectable human face cannot be evaluated through the normal prediction workflow.
- When multiple faces are present, the application selects one face rather than independently classifying every person.
- Classification confidence should not be interpreted as a guarantee of authenticity.
- TensorFlow and MediaPipe can require substantial memory, particularly when running in a container.

The application is intended as an academic AI project and demonstration tool.

---

## 12. Deployment Status

The following stages have been completed:

- Flask backend integration.
- Frontend integration.
- Trained model integration.
- Local Python execution.
- Docker image creation.
- Gunicorn production-server configuration.
- Successful local testing of the website and image prediction.

The Docker configuration supports future hosting on a suitable container platform.

**A publicly accessible cloud deployment has not yet been completed.**

For the current project demonstration, DeepGuard AI can be launched locally using Docker and accessed through:

http://localhost:5000

---

## 13. Troubleshooting

### Docker engine connection error

Ensure Docker Desktop is open and its Linux engine has finished starting.

Verify the connection using:

```powershell
docker info
```

### Port 5000 is already in use

Stop the existing application or use another host port:

```powershell
docker run --rm -p 5001:5000 deepguard-production
```

Then visit:

http://localhost:5001

### Model file not found

Verify that the trained `.keras` file exists at the configured `MODEL_PATH`.

### No face detected

Try another image with a clearer, sufficiently large, front-facing human face.

### Docker build takes a long time

The initial build downloads and installs large dependencies, including TensorFlow, MediaPipe, and OpenCV. Subsequent builds may reuse cached layers.

---

## 14. Project Information

DeepGuard AI was developed as an academic Artificial Intelligence group project.

For the overall project introduction, objectives, team information, and repository overview, refer to the main `README.md` in the repository root.
