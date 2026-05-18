import Webcam from "react-webcam";
import { useRef, useCallback } from "react";

const WebcamView = () => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.log("Webcam belum siap");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.log("Gagal capture gambar");
      return;
    }

    console.log(imageSrc);
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
      />

      <button onClick={capture}>
        Capture
      </button>
    </div>
  );
};

export default WebcamView;