import { useState } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const MALE_PHOTO = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=380&fit=crop&crop=face";
const FEMALE_PHOTO = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=380&fit=crop&crop=face";

export default function GenderSelect({ onSelect, user }) {
  const [selected, setSelected] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div style={s.root}>
      {/* Top bar */}
      <div style={s.topBar} className="gs-topbar">
        <div style={s.topLogo}>
          <LogoMark size={32} />
          <span style={s.topLogoText}>Camerino</span>
        </div>
        <div style={s.topRight} className="gs-topright">
          <span style={s.greeting} className="gs-greeting">Hi, {user?.displayName?.split(" ")[0] || user?.email?.split("@")[0]} 👋</span>
          <button style={s.signOutBtn} onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main} className="gs-main">
        <div style={s.badge} className="gs-badge">Step 1 of 2 — Before we style</div>
        <h1 style={s.h1} className="gs-h1">
          Who are we<br /><em style={{ fontStyle: "italic", color: "#C4956A" }}>dressing today?</em>
        </h1>
        <p style={s.sub}>This shapes every outfit suggestion Camerino creates for you</p>

        <div style={s.cards} className="gs-cards">
          {/* Male */}
          <div
            style={{
              ...s.card,
              ...(selected === "male" ? s.cardActive : {}),
              ...(hoveredCard === "male" && selected !== "male" ? s.cardHover : {}),
            }}
            className="gs-card"
            onClick={() => setSelected("male")}
            onMouseEnter={() => setHoveredCard("male")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={s.photoWrap}>
              <img
                src={MALE_PHOTO}
                alt="Male style"
                style={s.photo}
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div style={{ ...s.photoFallback, background: "linear-gradient(160deg,#4a7c42,#2d5a27)", display: "none" }}>
                <span style={{ fontSize: 64, opacity: 0.3 }}>🧔</span>
              </div>
              {selected === "male" && <div style={s.selectedBadge}>✓ Selected</div>}
            </div>
            <div style={s.cardBody}>
              <h3 style={s.cardLabel}>Men's styles</h3>
              <p style={s.cardSub}>Streetwear, tailoring,<br />smart casual & more</p>
            </div>
          </div>

          {/* Female */}
          <div
            style={{
              ...s.card,
              ...(selected === "female" ? s.cardActive : {}),
              ...(hoveredCard === "female" && selected !== "female" ? s.cardHover : {}),
            }}
            className="gs-card"
            onClick={() => setSelected("female")}
            onMouseEnter={() => setHoveredCard("female")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={s.photoWrap}>
              <img
                src={FEMALE_PHOTO}
                alt="Female style"
                style={s.photo}
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div style={{ ...s.photoFallback, background: "linear-gradient(160deg,#c4956a,#8a6a42)", display: "none" }}>
                <span style={{ fontSize: 64, opacity: 0.3 }}>👩</span>
              </div>
              {selected === "female" && <div style={s.selectedBadge}>✓ Selected</div>}
            </div>
            <div style={s.cardBody}>
              <h3 style={s.cardLabel}>Women's styles</h3>
              <p style={s.cardSub}>Feminine, power dressing,<br />boho & editorial</p>
            </div>
          </div>
        </div>

        <button
          style={{ ...s.continueBtn, ...(selected ? {} : s.continueBtnDisabled) }}
          className="gs-continue-btn"
          onClick={handleContinue}
          disabled={!selected}
        >
          {selected ? `Continue with ${selected === "male" ? "men's" : "women's"} styles →` : "Select a style to continue"}
        </button>

        <p style={s.note}>You can change this anytime before each styling session</p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .gs-topbar { padding: 14px 20px !important; }
          .gs-topright { gap: 8px !important; }
          .gs-greeting { display: none !important; }
          .gs-main { padding: 40px 20px !important; }
          .gs-h1 { font-size: 36px !important; }
          .gs-badge { font-size: 10px !important; padding: 5px 14px !important; }
          .gs-cards { gap: 16px !important; }
          .gs-card { width: 100% !important; max-width: 320px !important; }
          .gs-continue-btn { width: 100% !important; padding: 16px 24px !important; }
        }
        @media (max-width: 420px) {
          .gs-h1 { font-size: 30px !important; }
        }
      `}</style>
    </div>
  );
}

function LogoMark({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, background: "#1A1F18", borderRadius: size * 0.27, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="21" r="12" stroke="#C8A96E" strokeWidth="1.5" fill="none" />
        <path d="M18 9 C18 9 20.5 6 23 9" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M11 21 L18 15.5 L25 21" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#2D5A27", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" },

  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(245,240,224,0.1)" },
  topLogo: { display: "flex", alignItems: "center", gap: 10 },
  topLogoText: { fontFamily: "Georgia, serif", fontSize: 20, color: "#F5F0E0", fontWeight: 300 },
  topRight: { display: "flex", alignItems: "center", gap: 16 },
  greeting: { fontSize: 14, color: "rgba(245,240,224,0.7)", fontWeight: 300 },
  signOutBtn: { background: "transparent", border: "1px solid rgba(245,240,224,0.2)", borderRadius: 50, padding: "6px 16px", color: "rgba(245,240,224,0.6)", fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif" },

  main: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px", textAlign: "center" },

  badge: { display: "inline-block", background: "rgba(196,149,106,0.2)", border: "1px solid rgba(196,149,106,0.35)", borderRadius: 50, padding: "6px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C4956A", marginBottom: 24 },

  h1: { fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 300, color: "#F5F0E0", marginBottom: 12, lineHeight: 1.1 },
  sub: { fontSize: 15, color: "rgba(245,240,224,0.65)", marginBottom: 56, fontWeight: 300 },

  cards: { display: "flex", gap: 24, marginBottom: 48, flexWrap: "wrap", justifyContent: "center" },

  card: { background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)", borderRadius: 24, overflow: "hidden", cursor: "pointer", transition: "all 0.25s", width: 260 },
  cardActive: { background: "rgba(255,255,255,0.18)", borderColor: "#C4956A", transform: "translateY(-6px)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" },
  cardHover: { background: "rgba(255,255,255,0.13)", borderColor: "rgba(255,255,255,0.35)", transform: "translateY(-3px)" },

  photoWrap: { position: "relative", width: "100%", height: 300, overflow: "hidden" },
  photo: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  photoFallback: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  selectedBadge: { position: "absolute", top: 12, right: 12, background: "#C4956A", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#fff" },

  cardBody: { padding: "20px 24px 24px" },
  cardLabel: { fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", color: "#F5F0E0", marginBottom: 8 },
  cardSub: { fontSize: 13, color: "rgba(245,240,224,0.55)", fontWeight: 300, lineHeight: 1.6 },

  continueBtn: { padding: "16px 48px", border: "none", borderRadius: 50, background: "#F5F0E0", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#2D5A27", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", transition: "all 0.2s" },
  continueBtnDisabled: { background: "rgba(245,240,224,0.2)", color: "rgba(245,240,224,0.4)", cursor: "not-allowed", boxShadow: "none" },

  note: { fontSize: 12, color: "rgba(245,240,224,0.4)", marginTop: 20, fontWeight: 300 },
};