import { useEffect, useRef, useState, useCallback } from "react";
import { identifyFace } from "../services/api";
import CameraSection from "../components/CameraSection";
import CartSection from "../components/CartSection";

function CashierPage() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [sessionLocked, setSessionLocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

const autoIdentify = useCallback(async () => {

    if(sessionLocked) return;

    if(!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if(!imageSrc) return;

    setIsScanning(true);

    try{

        const response =
            await identifyFace(imageSrc);

        setResult(response);

        if(
            response.status==="recognized" ||
            response.status==="unknown"
        ){

            setSessionLocked(true);

        }

    }catch(err){

        console.error(err);

    }finally{

        setIsScanning(false);

    }

},[
    sessionLocked
]);

const finishPayment = () => {

    resetLiveness();

    setResult(null);

    setSessionLocked(false);

};


  const formatTime = (d) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (d) =>
    d.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const statusColor = isScanning ? "#F59E0B" : sessionLocked ? "#10B981" : "#6366F1";
  const statusLabel = isScanning ? "Memindai..." : sessionLocked ? "Sesi Aktif" : "Menunggu Pelanggan";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Outfit', sans-serif" }}>

      {/* HEADER */}
      <header style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 12px rgba(99,102,241,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "13px",
              background: "linear-gradient(135deg, #6366F1, #818CF8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#1E293B", letterSpacing: "-0.3px" }}>
                Smart Self-Service
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#6366F1" }}>
                Face Recognition Cashier
              </div>
            </div>
          </div>

          {/* Right: status + clock */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px", borderRadius: "20px",
              background: `${statusColor}15`,
              border: `1px solid ${statusColor}30`,
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: statusColor,
                boxShadow: `0 0 6px ${statusColor}`,
                animation: "pulse-dot 2s infinite",
              }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: statusColor }}>{statusLabel}</span>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "22px", fontWeight: 700, color: "#1E293B",
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px",
              }}>
                {formatTime(currentTime)}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "28px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        alignItems: "start",
      }} className="cashier-grid">

        {/* LEFT: Cart + Finish */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CartSection isMember={result} />

          {sessionLocked && (
            <button
              onClick={finishPayment}
              style={{
                width: "100%", padding: "18px", borderRadius: "16px", border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                color: "#FFFFFF", fontFamily: "'Outfit', sans-serif",
                fontWeight: 700, fontSize: "17px", letterSpacing: "0.3px",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.4)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Selesaikan Pembayaran
            </button>
          )}
        </div>

        {/* RIGHT: Camera + Notification */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CameraSection webcamRef={webcamRef} isScanning={isScanning} sessionLocked={sessionLocked} result={result} autoIdentify={autoIdentify}/>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .cashier-grid { grid-template-columns: 1fr !important; padding: 16px !important; }
        }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default CashierPage;