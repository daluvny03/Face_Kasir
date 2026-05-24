import Webcam from "react-webcam";
function CameraSection({
  webcamRef
}) {
  return (
    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      shadow-2xl
    ">
      <h2 className="
        text-white
        text-3xl
        font-bold
        mb-6
      ">
        Face Recognition
      </h2>
      <div className="
        overflow-hidden
        rounded-2xl
      ">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full"
        />
      </div>
    </div>
  );
}
export default CameraSection;