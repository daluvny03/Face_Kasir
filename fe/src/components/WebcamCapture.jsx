import Webcam from "react-webcam";
import {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  identifyFace,
  registerFace
} from "../service/api";

function WebcamCapture() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const register = async () => {
    const imageSrc =
      webcamRef.current.getScreenshot();
    setImage(imageSrc);
    try {
      const response =
        await registerFace(
          name,
          imageSrc
        );
      setResult(response);
    } catch (error) {
      console.error(error);
    }
  };
  const autoIdentify = async () => {
  if (!webcamRef.current) return;
  const imageSrc =
    webcamRef.current.getScreenshot();
  if (!imageSrc) return;
  try {
    setLoading(true);
    const response =
      await identifyFace(imageSrc);
    setResult(response);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
    useEffect(() => {
  const interval = setInterval(() => {
    autoIdentify();
  }, 3000);
  return () => clearInterval(interval);
}, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={500}
      />
      {
        result?.status === "recognized" && (
            <div
            style={{
                backgroundColor: "green",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
            }}
            >
            <h2>
                Welcome,
                {result.name}
            </h2>

            <p>
                Distance:
                {result.distance}
            </p>
            </div>
        )
      }
      {
        result?.status === "unknown" && (
            <div
            style={{
                backgroundColor: "red",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
            }}
            >
            <h2>
                Unknown Face
            </h2>
            </div>
        )
      }
      {
        result?.status === "no_face" && (
            <div
            style={{
                backgroundColor: "gray",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
            }}
            >
            <h2>
                No Face Detected
            </h2>
            </div>
        )
      }

      <input
        type="text"
        placeholder="Input Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        style={{
          padding: "10px",
          width: "300px",
        }}
      />

      <button onClick={register}>
        Register Face
      </button>

      {
        image && (
          <img
            src={image}
            alt="capture"
            width={300}
          />
        )
      }
      {
        loading && (
            <p>Scanning Face...</p>
        )
      }

      {
        result && (
          <pre>
            {
              JSON.stringify(
                result,
                null,
                2
              )
            }
          </pre>
        )
      }

    </div>
  );
}

export default WebcamCapture;