FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

ENV MODEL_PATH=/models/model.keras

COPY requirements-docker.txt .
RUN apt-get update \
    && apt-get install -y --no-install-recommends libglib2.0-0 libgl1 \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install -r requirements-docker.txt

COPY src ./src
COPY web ./web
COPY src/mediapipe_e08_best.keras /models/model.keras

EXPOSE 5000

CMD ["python", "-m", "web.app"]
