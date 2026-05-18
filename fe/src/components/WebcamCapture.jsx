import Webcam from "react-webcam";
import { useRef, useState } from "react";

function WebcamCapture() {

  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);

  const capture = () => {

    const imageSrc =
      webcamRef.current.getScreenshot();

    setImage(imageSrc);
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={500}
      />

      <button onClick={capture}>
        Capture
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
    </div>
  );
}

export default WebcamCapture;