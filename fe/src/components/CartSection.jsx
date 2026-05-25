function CartSection({ isMember }) {
  const items = [
    { name: "Milk", qty: 1, price: 10000 },
    { name: "Bread", qty: 2, price: 15000 },
    { name: "Coffee", qty: 1, price: 20000 },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = isMember ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: "0 2px 16px rgba(99,102,241,0.08)",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "#6366F1",
          marginBottom: "6px", display: "flex", alignItems: "center", gap: "7px",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
              stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Keranjang Belanja
        </div>
        <div style={{ fontSize: "30px", fontWeight: 900, color: "#1E293B", letterSpacing: "-0.5px" }}>
          {items.length} Item
        </div>
      </div>

      <div style={{ height: "1px", background: "#F1F5F9", marginBottom: "18px" }} />

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 56px 110px",
        gap: "8px", padding: "0 10px", marginBottom: "10px",
      }}>
        {["Produk", "Qty", "Harga"].map((h, i) => (
          <span key={h} style={{
            fontSize: "11px", color: "#94A3B8", fontWeight: 700,
            letterSpacing: "1px", textTransform: "uppercase",
            textAlign: i > 0 ? "center" : "left",
          }}>{h}</span>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "22px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "grid", gridTemplateColumns: "1fr 56px 110px",
              gap: "8px", alignItems: "center",
              padding: "13px 10px", borderRadius: "12px",
              background: "#F8FAFF",
              border: "1px solid #EEF2FF",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#EEF2FF"}
            onMouseLeave={e => e.currentTarget.style.background = "#F8FAFF"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#EEF2FF", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="#6366F1" strokeWidth="2"/>
                  <path d="M8 21h8M12 17v4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#1E293B" }}>{item.name}</span>
            </div>
            <div style={{
              textAlign: "center", padding: "4px 0",
              fontSize: "14px", fontWeight: 700, color: "#6366F1",
              background: "#EEF2FF", borderRadius: "8px",
            }}>
              {item.qty}
            </div>
            <div style={{
              textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#1E293B",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Rp{(item.price * item.qty).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        background: "linear-gradient(135deg, #F8FAFF 0%, #EEF2FF 100%)",
        border: "1px solid #E0E7FF",
        borderRadius: "16px", padding: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>Subtotal</span>
          <span style={{ fontSize: "14px", color: "#475569", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            Rp{subtotal.toLocaleString("id-ID")}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", color: isMember ? "#10B981" : "#94A3B8", fontWeight: 500 }}>Diskon Member</span>
            {isMember && (
              <span style={{
                fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                background: "#D1FAE5", color: "#065F46", border: "1px solid #A7F3D0",
              }}>10%</span>
            )}
          </div>
          <span style={{
            fontSize: "14px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            color: isMember ? "#10B981" : "#CBD5E1",
          }}>
            {isMember ? `- Rp${discount.toLocaleString("id-ID")}` : "Rp0"}
          </span>
        </div>

        <div style={{ height: "1px", background: "#C7D2FE", marginBottom: "16px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#1E293B" }}>Total</span>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "28px", fontWeight: 900, color: "#1E293B",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.5px",
            }}>
              Rp{total.toLocaleString("id-ID")}
            </div>
            {isMember && (
              <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, marginTop: "2px" }}>
                Hemat Rp{discount.toLocaleString("id-ID")}!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSection;