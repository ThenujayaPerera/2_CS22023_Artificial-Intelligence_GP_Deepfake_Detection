
/* DEEPGUARD AI — WEBSITE FUNCTIONALITY */

const form = document.querySelector("#upload-form");
const input = document.querySelector("#image-input");
const dropZone = document.querySelector("#drop-zone");

const previewArea = document.querySelector("#preview-area");
const uploadedPreview = document.querySelector("#uploaded-preview");
const fileName = document.querySelector("#file-name");

const analyzeButton = document.querySelector("#analyze-button");
const statusMessage = document.querySelector("#status");
const result = document.querySelector("#result");

let selectedFile = null;
let previewURL = null;
let isAnalyzing = false;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const allowedExtensions = /\.(jpe?g|png|webp)$/i;

/* STATUS MESSAGES */

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError
    ? "var(--fake)"
    : "var(--primary)";
}

/* RESET PREVIOUS RESULTS */

function resetResult() {
  result.classList.add("hidden");

  const resultCard = document.querySelector("#result-card");
  resultCard.classList.remove("real", "fake");

  document.querySelector("#confidence-bar").style.width = "0%";
}

/* IMAGE SELECTION */

function setFile(file) {
  if (isAnalyzing || !file) return;

  if (
    !allowedTypes.includes(file.type) ||
    !allowedExtensions.test(file.name)
  ) {
    selectedFile = null;
    input.value = "";

    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      previewURL = null;
    }

    uploadedPreview.removeAttribute("src");
    previewArea.classList.add("hidden");
    analyzeButton.disabled = true;
    resetResult();

    showStatus(
      "Unsupported format. Please select a JPG, PNG or WEBP image.",
      true
    );
    return;
  }

  if (previewURL) {
    URL.revokeObjectURL(previewURL);
  }

  selectedFile = file;
  previewURL = URL.createObjectURL(file);

  uploadedPreview.src = previewURL;
  fileName.textContent = file.name;

  previewArea.classList.remove("hidden");
  analyzeButton.disabled = false;

  resetResult();
  showStatus("");
}

/* FILE BROWSER */

input.addEventListener("change", () => {
  setFile(input.files[0]);
});

/* DRAG AND DROP */

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();

    if (!isAnalyzing) {
      dropZone.classList.add("dragging");
    }
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  if (isAnalyzing) return;

  const file = event.dataTransfer.files[0];
  setFile(file);
});

["dragover", "drop"].forEach((eventName) => {
  window.addEventListener(eventName, (event) => {
    event.preventDefault();
  });
});

/* DISPLAY ACTUAL CNN RESULT */

function displayResult(data) {
  const processedImage = document.querySelector("#processed-image");
  const faceInfo = document.querySelector("#face-info");

  const predictionLabel = document.querySelector("#prediction-label");
  const confidence = document.querySelector("#confidence");
  const fakeProbability = document.querySelector("#fake-probability");
  const resultModel = document.querySelector("#result-model");

  const confidenceBar = document.querySelector("#confidence-bar");
  const resultCard = document.querySelector("#result-card");

  processedImage.src = data.processed_image;

  faceInfo.textContent =
    `${data.detector} selected the clearest of ` +
    `${data.face_count} detected face(s).`;

  predictionLabel.textContent = data.label;

  const confidencePercent = data.confidence * 100;
  const fakePercent = data.fake_probability * 100;

  confidence.textContent = `${confidencePercent.toFixed(2)}%`;
  fakeProbability.textContent = `${fakePercent.toFixed(2)}%`;
  resultModel.textContent = data.model_name;

  resultCard.classList.remove("real", "fake");

  if (data.label === "FAKE") {
    resultCard.classList.add("fake");
    confidenceBar.style.background = "var(--fake)";
  } else {
    resultCard.classList.add("real");
    confidenceBar.style.background = "var(--real)";
  }

  result.classList.remove("hidden");

  requestAnimationFrame(() => {
    confidenceBar.style.width = `${confidencePercent}%`;
  });

  result.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start"
  });
}

/* SEND IMAGE TO FLASK */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedFile || isAnalyzing) return;

  isAnalyzing = true;
  analyzeButton.disabled = true;
  analyzeButton.innerHTML = "Analysing image...";

  resetResult();
  showStatus("Processing your image. Please wait...");

  try {
    const body = new FormData();

    // Works for both file browsing and drag-and-drop.
    body.append("image", selectedFile);

    const response = await fetch("/api/predict", {
      method: "POST",
      body: body
    });

    const data = await response.json();

    if (!response.ok || !data.evaluated) {
      throw new Error(
        data.error || "Image analysis failed. Please try again."
      );
    }

    displayResult(data);
    showStatus("");

  } catch (error) {
    showStatus(
      error.message || "An unexpected error occurred.",
      true
    );

  } finally {
    isAnalyzing = false;
    analyzeButton.disabled = !selectedFile;

    analyzeButton.innerHTML =
      'Analyse Image <span class="button-arrow">→</span>';
  }
});
