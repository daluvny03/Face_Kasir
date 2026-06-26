import { FaceMesh } from "@mediapipe/face_mesh";

let faceMesh = null;

const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

const CALIBRATION_TIME = 1000;
const BLINK_TIMEOUT = 10000;

let calibrationStart = null;
let calibrationValues = [];

let calibratedEAR = null;
let blinkThreshold = null;

let eyeClosed = false;
let completed = false;
let blinkStart = null;

// Menginisialisasi modul FaceMesh MediaPipe
export async function initializeFaceMesh(onResults) {
  if (faceMesh) {
    faceMesh.onResults(onResults);
    return faceMesh;
  }

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);
  return faceMesh;
}

// Menghitung jarak Euclidean antara dua titik koordinat
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Menghitung nilai Eye Aspect Ratio (EAR) untuk satu bagian mata
function calculateEAR(points) {
  const A = distance(points[1], points[5]);
  const B = distance(points[2], points[4]);
  const C = distance(points[0], points[3]);
  if (C === 0) {
    return 0;
}

return (A + B) / (2 * C);
}

// Mendapatkan nilai rata-rata EAR dari kedua mata (Kiri dan Kanan)
export function getEAR(landmarks) {
  const left = LEFT_EYE.map(i => landmarks[i]);
  const right = RIGHT_EYE.map(i => landmarks[i]);
  return (calculateEAR(left) + calculateEAR(right)) / 2;
}

// Mengatur ulang seluruh variabel status ke kondisi awal
export function resetLiveness() {
  calibrationStart = null;
  calibrationValues = [];
  calibratedEAR = null;
  blinkThreshold = null;
  eyeClosed = false;
  completed = false;
  blinkStart = null;
}

// Memeriksa apakah kamera/EAR telah dikalibrasi
export function isCalibrated() {
  return calibratedEAR !== null;
}

// Proses kalibrasi nilai normal EAR pengguna selama waktu tertentu
export function calibrateEAR(ear) {
  if (calibratedEAR !== null) {
    return true;
}

  if (!calibrationStart) {
    calibrationStart = Date.now();
  }

  calibrationValues.push(ear);

  const elapsed = Date.now() - calibrationStart;
  if (elapsed < CALIBRATION_TIME) {
    return false;
  }

  // Cari nilai rata-rata EAR dasar
  calibratedEAR = calibrationValues.reduce((a, b) => a + b, 0) / calibrationValues.length;
  blinkThreshold = calibratedEAR * 0.72; // Threshold batas mata berkedip (72% dari EAR normal)
  blinkStart = Date.now();

  return true;
}

// Mendeteksi kedipan mata pengguna berdasarkan ambang batas EAR kalibrasi
export function detectBlink(ear) {
    if (blinkThreshold === null) {
    return "waiting";
}
  if (completed) {
    return "completed";
  }

  if (
    blinkStart &&
    Date.now() - blinkStart > BLINK_TIMEOUT
) {
    resetLiveness();
    return "timeout";
}

  if (ear < blinkThreshold) {
    eyeClosed = true;
  }

  if (eyeClosed && ear >= blinkThreshold) {
    eyeClosed = false;
    completed = true;
    return "success";
  }

  return "waiting";
}

export function getBlinkThreshold() {
    return blinkThreshold;
}

export function getCalibratedEAR() {
    return calibratedEAR;
}