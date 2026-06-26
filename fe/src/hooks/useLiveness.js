import { useEffect, useRef, useState } from "react";
import {
  initializeFaceMesh,
  getEAR,
  calibrateEAR,
  detectBlink,
  isCalibrated,
  resetLiveness,
} from "../services/liveness";

export default function useLiveness(
  webcamRef,
  sessionLocked,
  autoIdentify
) {
  const faceMeshRef = useRef(null);
  const animationRef = useRef(null);
  const runningRef = useRef(false);

  const [status, setStatus] = useState("waiting");

  async function onResults(results) {
    if (sessionLocked) return;

    if (
      !results.multiFaceLandmarks ||
      results.multiFaceLandmarks.length === 0
    ) {
      resetLiveness();
      setStatus("waiting");
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const ear = getEAR(landmarks);

    if (!isCalibrated()) {
      setStatus("calibrating");

      const calibrated = calibrateEAR(ear);

      if (!calibrated) return;

      setStatus("blink");
      return;
    }

    const blink = detectBlink(ear);

    switch (blink) {
      case "waiting":
        setStatus("blink");
        break;

      case "timeout":
        setStatus("timeout");

        resetLiveness();

        setTimeout(() => {
          if (!sessionLocked) {
            setStatus("waiting");
          }
        }, 1500);

        break;

      case "success":
        runningRef.current = false;

        setStatus("recognizing");

        try {
          await autoIdentify();
        } finally {
          setStatus("completed");
        }

        break;

      default:
        break;
    }
  }

  async function processFrame() {
    if (!runningRef.current) return;

    if (sessionLocked) return;

    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      await faceMeshRef.current.send({
        image: webcamRef.current.video,
      });
    }

    animationRef.current =
      requestAnimationFrame(processFrame);
  }

  useEffect(() => {
    let mounted = true;

    async function start() {
      faceMeshRef.current =
        await initializeFaceMesh(onResults);

      if (!mounted) return;

      runningRef.current = true;

      processFrame();
    }

    if (!sessionLocked) {
      start();
    }

    return () => {
      mounted = false;

      runningRef.current = false;

      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      resetLiveness();
    };
  }, [sessionLocked]);

  useEffect(() => {
    if (!sessionLocked) {
      runningRef.current = true;

      processFrame();
    }
  }, [sessionLocked]);

  return {
    status,
  };
}