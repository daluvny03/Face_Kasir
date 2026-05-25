import Webcam from "react-webcam";

function CameraSection({ webcamRef, isScanning, sessionLocked }) {
  const statusColor = isScanning ? "#F59E0B" : sessionLocked ? "#10B981" : "#6366F1";
  const statusBg    = isScanning ? "#FFFBEB" : sessionLocked ? "#ECFDF5" : "#EEF2FF";
  const statusLabel = isScanning ? "Memindai..." : sessionLocked ? "Sesi Aktif" : "Menunggu Pelanggan";

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 2px 16px rgba(99,102,241,0.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "#6366F1",
            marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z"
                stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Kamera
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#1E293B" }}>Face Recognition</div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "8px 14px", borderRadius: "20px",
          background: statusBg, border: `1px solid ${statusColor}40`,
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: statusColor,
            animation: "pulse-dot 2s infinite",
          }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: statusColor }}>{statusLabel}</span>
        </div>
      </div>

      {/* Camera feed */}
      <div style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        border: `2px solid ${statusColor}50`,
        boxShadow: `0 4px 20px ${statusColor}20`,
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          style={{ width: "100%", display: "block" }}
        />

        {/* Scanline animation */}
        {isScanning && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: "2px",
              background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
              boxShadow: "0 0 8px #F59E0B",
              animation: "scan-line 1.5s linear infinite",
            }} />
          </div>
        )}

        {/* Corner brackets */}
        {["top-left","top-right","bottom-left","bottom-right"].map(pos => {
          const isTop = pos.includes("top"), isLeft = pos.includes("left");
          return (
            <div key={pos} style={{
              position: "absolute",
              top: isTop ? "10px" : "auto", bottom: !isTop ? "10px" : "auto",
              left: isLeft ? "10px" : "auto", right: !isLeft ? "10px" : "auto",
              width: "20px", height: "20px",
              borderTop: isTop ? `2.5px solid ${statusColor}` : "none",
              borderBottom: !isTop ? `2.5px solid ${statusColor}` : "none",
              borderLeft: isLeft ? `2.5px solid ${statusColor}` : "none",
              borderRight: !isLeft ? `2.5px solid ${statusColor}` : "none",
              pointerEvents: "none",
            }} />
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "14px", padding: "10px 14px",
        background: "#F8FAFF", borderRadius: "10px",
        border: "1px solid #E0E7FF",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>
          Wajah diproses secara lokal. Pemindaian otomatis setiap 3 detik.
        </span>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes scan-line { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}

export default CameraSection;