function MemberNotification({ result }) {
  if (result?.status !== "recognized") return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
      border: "1px solid #6EE7B7",
      borderRadius: "20px",
      padding: "24px",
      animation: "slide-up 0.4s ease forwards, member-glow 2.5s ease-in-out infinite",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Shimmer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "50px", height: "50px", borderRadius: "14px",
            background: "linear-gradient(135deg, #10B981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(16,185,129,0.4)", flexShrink: 0,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#059669", marginBottom: "2px" }}>
              Member Terdeteksi
            </div>
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#064E3B", letterSpacing: "-0.3px" }}>
              {result.name}
            </div>
          </div>
        </div>

        {/* Gold badge */}
        <div style={{
          padding: "6px 14px", borderRadius: "20px",
          background: "linear-gradient(135deg, #D97706, #F59E0B)",
          fontSize: "12px", fontWeight: 800, color: "#FFF",
          letterSpacing: "1px", textTransform: "uppercase",
          boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
          whiteSpace: "nowrap",
        }}>
          ★ Gold Member
        </div>
      </div>

      {/* Discount card */}
      <div style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid #A7F3D0",
        borderRadius: "14px", padding: "16px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative",
      }}>
        <div>
          <div style={{ fontSize: "13px", color: "#059669", fontWeight: 500, marginBottom: "4px" }}>
            Keuntungan Member Gold
          </div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "#064E3B" }}>
            Diskon 10% Diterapkan
          </div>
        </div>
        <div style={{
          fontSize: "40px", fontWeight: 900, color: "#10B981",
          fontFamily: "'JetBrains Mono', monospace", opacity: 0.5,
        }}>
          10%
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes member-glow {
          0%, 100% { box-shadow: 0 4px 24px rgba(16,185,129,0.2); }
          50% { box-shadow: 0 4px 40px rgba(16,185,129,0.45); }
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}

export default MemberNotification;