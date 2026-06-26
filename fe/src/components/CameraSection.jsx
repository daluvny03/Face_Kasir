import Webcam from "react-webcam";
import useLiveness from "../hooks/useLiveness";

function CameraSection({ webcamRef, isScanning, sessionLocked, result, autoIdentify }) {
  const statusColor = isScanning ? "#F59E0B" : sessionLocked ? "#10B981" : "#6366F1";
  const statusBg    = isScanning ? "#FFFBEB" : sessionLocked ? "#ECFDF5" : "#EEF2FF";
  const statusLabel = isScanning ? "Memindai..." : sessionLocked ? "Sesi Aktif" : "Menunggu Pelanggan";
  
  // Custom hook untuk liveness detection (kedip mata)
  const { status } = useLiveness(webcamRef, sessionLocked, autoIdentify);

  return (
    <div style={{
      position: "relative",
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 2px 16px rgba(99,102,241,0.08)",
    }}>
      
      {/* Overlay Sesi Aktif / Transaction In Progress */}
      {sessionLocked && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.72)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          zIndex: 10,
          borderRadius: "24px",
        }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            fontSize: "24px",
            fontWeight: "bold"
          }}>
            ✓
          </div>
          <h2 style={{ margin: 0 }}>Transaction In Progress</h2>
          <p style={{ opacity: .8, marginTop: 8 }}>Face Recognition Paused</p>
        </div>
      )}

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

      {/* Camera Feed Container */}
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

        {/* Scanline Animation */}
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

        {/* Corner Brackets */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(pos => {
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

      {/* Dynamic Status / Result Section */}
      <div style={{
        marginTop: "18px",
        borderRadius: "16px",
        padding: "18px",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}>
        {/* State: Waiting Customer */}
        {!result && !isScanning && (
          <>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#334155" }}>Waiting Customer</div>
            <p style={{ marginTop: 8, color: "#64748B", margin: "8px 0 0 0" }}>
              Silakan berdiri di depan kamera untuk memulai transaksi.
            </p>
          </>
        )}

        {/* State: Scanning */}
        {isScanning && !result && (
          <>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#D97706" }}>Scanning Face...</div>
            <p style={{ marginTop: 8, color: "#92400E", margin: "8px 0 0 0" }}>
              Memverifikasi identitas pelanggan.
            </p>
          </>
        )}

        {/* State: Recognized Member */}
        {result?.status === "recognized" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#10B981", letterSpacing: "2px" }}>
                  MEMBER VERIFIED
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, marginTop: 6, color: "#1E293B" }}>
                  {result.name}
                </div>
                <div style={{ marginTop: 8, color: "#64748B" }}>
                  Gold Member
                </div>
              </div>
              <div style={{ fontSize: "52px" }}>🎉</div>
            </div>
            <div style={{
              marginTop: "18px", padding: "14px",
              background: "#DCFCE7", borderRadius: "12px",
              fontWeight: 700, color: "#166534"
            }}>
              ✓ Diskon Member 10% berhasil diterapkan.
            </div>
          </>
        )}

        {/* State: Guest / Unknown */}
        {result?.status === "unknown" && (
          <>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#DC2626" }}>Guest Customer</div>
            <p style={{ marginTop: 8, color: "#64748B", margin: "8px 0 0 0" }}>
              Member tidak ditemukan. Harga normal digunakan.
            </p>
          </>
        )}
      </div>

      {/* Liveness Detection Status Footer */}
      <div style={{
        marginTop: "14px",
        padding: "14px",
        background: "#F8FAFC",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        fontSize: "13px",
        color: "#475569"
      }}>
        {status === "waiting" && (
          <div>
            <b style={{ color: "#334155" }}>Waiting Customer</b>
            <div style={{ marginTop: 4, color: "#64748B" }}>Silakan berdiri di depan kamera.</div>
          </div>
        )}

        {status === "calibrating" && (
          <div>
            <b style={{ color: "#2563EB" }}>Preparing Camera...</b>
            <div style={{ marginTop: 4, color: "#64748B" }}>Mohon lihat ke arah kamera.</div>
          </div>
        )}

        {status === "blink" && (
          <div>
            <b style={{ color: "#D97706" }}>👁 Blink Detection</b>
            <div style={{ marginTop: 4, color: "#92400E" }}>Silakan berkedip satu kali.</div>
          </div>
        )}

        {status === "recognizing" && (
          <div>
            <b style={{ color: "#4F46E5" }}>Recognizing...</b>
            <div style={{ marginTop: 4, color: "#64748B" }}>Sedang melakukan Face Recognition.</div>
          </div>
        )}

        {status === "completed" && (
          <div>
            <b style={{ color: "#16A34A" }}>Verification Success</b>
            <div style={{ marginTop: 4, color: "#166534" }}>Face verified successfully.</div>
          </div>
        )}

        {status === "timeout" && (
          <div>
            <b style={{ color: "#DC2626" }}>Verification Failed</b>
            <div style={{ marginTop: 4, color: "#991B1B" }}>Silakan coba kembali.</div>
          </div>
        )}
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes scan-line { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}

export default CameraSection;