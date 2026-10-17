
# DeepGuard AI - Production Docker Configuration

FROM python:3.11-slim

# Python environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    MODEL_PATH=/models/model.keras \
    PORT=5000

# Application directory
WORKDIR /app

# Install system dependencies and Python packages
COPY requirements-docker.txt .

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libglib2.0-0 \
       libgl1 \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install -r requirements-docker.txt

# Copy application source code
COPY src ./src
COPY web ./web

# Copy the trained CNN model
COPY src/mediapipe_e08_best.keras /models/model.keras

# Document the default application port
EXPOSE 5000

# Start Flask through Gunicorn.
# One worker avoids loading multiple copies of the AI model.
# The shell allows Render's PORT environment variable to be used.
CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --threads 2 --timeout 180 web.app:app"]
