import Webcam from "react-webcam";
import {
  useRef,
  useState
} from "react";
import {
  registerFace
} from "../services/api";

function WebcamCapture() {
  const webcamRef = useRef(null);
  const [name, setName] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [result, setResult] =
    useState(null);
  const register = async () => {
    if (!webcamRef.current) return;
    if (!name) {
      alert("Input member name");
      return;
    }
    const imageSrc =
      webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setLoading(true);
    try {
      const response =
        await registerFace(
          name,
          imageSrc
        );
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
      p-6
    ">
      <div className="
        w-full
        max-w-5xl
        bg-slate-800
        rounded-3xl
        shadow-2xl
        overflow-hidden
        grid
        grid-cols-1
        lg:grid-cols-2
      ">
        {/* LEFT */}
        <div className="
          p-8
          flex
          flex-col
          justify-center
          text-white
        ">
          <p className="
            text-emerald-400
            font-semibold
            mb-2
          ">
            MEMBER REGISTRATION
          </p>
          <h1 className="
            text-5xl
            font-bold
            leading-tight
          ">
            Register
            Your Face
          </h1>
          <p className="
            text-slate-400
            mt-6
            leading-relaxed
          ">
            Register your face
            to activate member
            benefits and automatic
            discount at self-service
            cashier.
          </p>
          <div className="
            mt-10
          ">
            <input
              type="text"
              placeholder="Input Member Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full
                px-5
                py-4
                rounded-2xl
                bg-slate-700
                text-white
                outline-none
              "
            />
            <button
              onClick={register}
              disabled={loading}
              className="
                w-full
                mt-5
                py-4
                rounded-2xl
                bg-emerald-500
                hover:bg-emerald-600
                transition
                font-bold
                text-lg
              "
            >
              {
                loading
                  ? "Registering..."
                  : "Register Member"
              }

            </button>
          </div>
          {
            result?.status ===
            "success" && (
              <div className="
                mt-8
                bg-emerald-500/20
                border
                border-emerald-400
                rounded-2xl
                p-5
              ">
                <p className="
                  text-emerald-400
                  font-semibold
                ">
                  REGISTRATION SUCCESS
                </p>
                <h2 className="
                  text-3xl
                  font-bold
                  mt-2
                ">
                  {result.name}
                </h2>
                <p className="
                  mt-3
                  text-slate-300
                ">
                  Member face registered
                  successfully.
                </p>
                <p className="
                  mt-2
                  text-slate-400
                  text-sm
                ">
                  Total Embeddings:
                  {" "}
                  {
                    result.total_embeddings
                  }
                </p>
              </div>
            )
          }
          {
            result?.status ===
            "no_face" && (
              <div className="
                mt-8
                bg-red-500/20
                border
                border-red-400
                rounded-2xl
                p-5
              ">
                <p className="
                  text-red-400
                  font-semibold
                ">
                  FACE NOT DETECTED
                </p>
                <p className="
                  mt-2
                  text-slate-300
                ">
                  Please position your
                  face clearly in front
                  of the camera.
                </p>
              </div>
            )
          }
        </div>
        {/* RIGHT */}
        <div className="
          bg-slate-900
          flex
          items-center
          justify-center
          p-6
        ">
          <div className="
            overflow-hidden
            rounded-3xl
            border-4
            border-slate-700
            shadow-2xl
          ">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="
                w-full
                max-w-[500px]
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default WebcamCapture;