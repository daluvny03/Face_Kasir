import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  identifyFace
} from "../services/api";
import CameraSection
from "../components/CameraSection";
import CartSection
from "../components/CartSection";
import MemberNotification
from "../components/MemberNotification";

function CashierPage() {
  const webcamRef =
    useRef(null);
  const [result, setResult] =
    useState(null);
  const autoIdentify =
    async () => {
      if (
        !webcamRef.current
      ) return;
      const imageSrc =
        webcamRef.current
          .getScreenshot();
      if (!imageSrc) return;
      try {
        const response =
          await identifyFace(
            imageSrc
          );
        setResult(response);
      } catch (error) {
        console.error(error);
      }
    };
  useEffect(() => {
    const interval =
      setInterval(() => {
        autoIdentify();
      }, 3000);
    return () =>
      clearInterval(interval);
  }, []);
  return (
    <div className="
      min-h-screen
      bg-slate-100
      p-6
    ">
      <div className="
        max-w-7xl
        mx-auto
      ">
        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">
          <div>
            <h1 className="
              text-4xl
              font-bold
            ">
              Smart Self-Service
            </h1>
            <p className="
              text-slate-500
              mt-2
            ">
              Face Recognition Cashier
            </p>
          </div>
        </div>
        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        ">
          {/* LEFT */}
          <div className="
            flex
            flex-col
            gap-6
          ">
            <CartSection
              isMember={
                result?.status ===
                "recognized"
              }
            />
          </div>
          {/* RIGHT */}
          <div className="
            flex
            flex-col
            gap-6
          ">
            <CameraSection
              webcamRef={
                webcamRef
              }
            />
            <MemberNotification
              result={result}
            />
            {
              result?.status ===
              "unknown" && (
                <div className="
                  bg-red-500
                  text-white
                  rounded-3xl
                  p-6
                  shadow-2xl
                ">
                  <h2 className="
                    text-3xl
                    font-bold
                  ">
                    Guest User
                  </h2>
                  <p className="
                    mt-3
                  ">
                    No Member Benefit
                  </p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default CashierPage;