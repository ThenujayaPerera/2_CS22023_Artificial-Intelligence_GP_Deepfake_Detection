# DeepFake Detection

DeepFake Detection is a TensorFlow/Keras image-classification project for
classifying images as **real** or **fake**. The repository contains the
training notebooks, reusable Python source code, experiment outputs, and
saved model checkpoints.

## Project layout

```text
DeepFake_Detection/
├── notebooks/       # Ordered Google Colab notebooks used for training/evaluation
├── src/             # Reusable training, model, evaluation, and inference code
├── experiments/     # Per-experiment configs, histories, metrics, and reports
├── evaluation/      # Baseline evaluation outputs
├── graphs/          # Generated plots
├── history/         # Training histories
├── results/         # Consolidated result tables
├── checkpoints/     # Training checkpoints
├── models/          # Exported Keras models
├── model-wise/      # E1-E10 model mapping and comparison
├── data/            # Local dataset files (not committed to Git)
└── archive/         # Previous project snapshots and legacy notebook placeholders
```

## Notebook workflow

Run the notebooks in this order:

1. `01_dataset_setup.ipynb` - download and inspect the dataset.
2. `02_cnn_baseline_and_extended.ipynb` - inspect baseline/extended CNN results.
3. `03_cnn128_checkpoint_recovery.ipynb` - recover and evaluate the CNN-128 run.
4. `04_efficientnet_training.ipynb` - train and evaluate the EfficientNetB0 model.
5. `05_final_model_evaluation.ipynb` - evaluate the selected final model and
   generate metrics and plots.

The notebooks were originally written for Google Colab and expect the project
at:

```text
/content/drive/MyDrive/DeepFake_Detection
```

Update `BASE_DRIVE` in a notebook when using a different Google Drive path.

## Setup

Create a Python 3.10+ environment and install the dependencies:

```bash
pip install -r requirements.txt
```

The dataset is downloaded by the first notebook using KaggleHub. A Kaggle
account/API configuration may be required. The dataset, generated images,
checkpoints, and model files are intentionally excluded from new Git commits
when they are regenerated; the existing local artifacts remain available in
this working copy.

## Inference

The reusable inference code is in `src/inference.py`, and the web application
is in `web/`. It uses a Flask backend with an HTML/CSS/JavaScript frontend.
The app uses the MediaPipe-trained E8 model, detects the clearest face, adds a
small margin, and resizes the crop to 128x128. If MediaPipe cannot detect a
human face, the app reports that result and does not call the model.

Run the web application locally from this directory:

```powershell
pip install -r requirements.txt
python -m web.app
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000).

`requirements.txt` contains the full training/notebook environment.
`requirements-docker.txt` contains only the runtime packages needed by the
Flask, TensorFlow, OpenCV, and MediaPipe inference application.

If the model is stored elsewhere, set `MODEL_PATH` to its `.keras` path. The
default path is `src/mediapipe_e08_best.keras`.
The UI displays the active model filename. The model cache is keyed by the
configured path, file size, and modification time, so replacing a `.keras`
file reloads the model when the backend restarts or the model file changes.
Face preparation uses MediaPipe Face Detection. When multiple faces are
present, the app scores each detection using face size, detector confidence,
and image sharpness, then sends the clearest face to the classifier.
The model's sigmoid output represents the `Real` class probability (`Real = 1`,
`Fake = 0`), so the application reports fake probability as `1 - model output`.

### Docker

The production Keras model is included in the repository and copied into the
Docker image at `/models/model.keras`. Therefore, a person who clones this
repository does not need to copy or mount a separate model file.

```powershell
docker build -t deepfake-detection .
docker run --rm -p 5000:5000 deepfake-detection
```

Open `http://localhost:5000` after the container starts.

Or use Docker Compose:

```powershell
docker compose up --build
```

If you use a different model, mount it at `/models/model.keras` and set
`MODEL_PATH=/models/model.keras`.

## Reproducing results

Run the notebooks on a GPU runtime, in order, and keep each experiment's
outputs in its existing `experiments/<experiment-name>/` directory. Evaluation
reports and plots should remain separate from source code so that experiment
comparisons are easy to review.

## Model-wise results

See [model-wise/MODEL_INDEX.md](model-wise/MODEL_INDEX.md) for the E1-E10
mapping between each model, its complete notebook, its output directory, and
the recorded metrics. Separate extracted notebooks for E1-E10 (including the
E4-Ext extended run) are in [model-wise/notebooks](model-wise/notebooks).
The selected final model is E8, the deeper 128x128 CNN with BatchNorm.
