import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage({ onBack }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Google sign in error:", e);
      setError("Google sign in failed. Please try again.");
    }
    setLoading(false);
  };

  const handleEmail = async () => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(e.message.replace("Firebase: ", "").replace(/\(auth.*\)/, ""));
    }
    setLoading(false);
  };

  return (
    <div style={s.root} className="camerino-auth-root">
      {/* Left panel */}
      <div style={s.left} className="camerino-auth-left">
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.leftContent}>
          <LogoMark size={52} />
          <h2 style={s.leftH2} className="camerino-auth-h2">
            Your wardrobe,<br /><em style={{ fontStyle: "italic", color: "#4A7C42" }}>elevated.</em>
          </h2>
          <p style={s.leftP}>
            Stop standing in front of your wardrobe wondering what to wear. Camerino turns every item you own into a complete look.
          </p>
          <div style={s.features} className="camerino-auth-features">
            {[
              "5 complete outfit ideas from every photo",
              "Color palettes + specific pieces to pair",
              "Save and revisit your favorite looks",
              "Men's and women's styling",
              "Free to start — no credit card needed",
            ].map((f) => (
              <div key={f} style={s.featureItem}>
                <div style={s.check}>✓</div>
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth card */}
      <div style={s.right} className="camerino-auth-right">
        <div style={s.card} className="camerino-auth-card">
          <div style={s.cardTop}>
            <LogoMark size={36} />
            <span style={s.cardLogoText}>Camerino</span>
          </div>
          <h2 style={s.cardTitle}>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p style={s.cardSub}>{isLogin ? "Sign in to open your wardrobe" : "Free to start. No credit card needed."}</p>

          {/* Google */}
          <button style={s.googleBtn} onClick={handleGoogle} disabled={loading}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div style={s.orRow}>
            <div style={s.orLine} /> <span style={s.orText}>or {isLogin ? "sign in" : "sign up"} with email</span>
            <div style={s.orLine} />
          </div>

          {!isLogin && (
            <input
              style={s.input}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={s.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={s.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={s.error}>{error}</p>}

          <button style={s.submitBtn} onClick={handleEmail} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign in →" : "Open my wardrobe →"}
          </button>

          <p style={s.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={s.switchLink} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Sign up free" : "Log in"}
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .camerino-auth-root {
            display: flex !important;
            flex-direction: column !important;
            min-height: auto !important;
          }
          .camerino-auth-left {
            padding: 32px 24px !important;
            min-height: auto !important;
          }
          .camerino-auth-h2 {
            font-size: 30px !important;
          }
          .camerino-auth-features {
            display: none !important;
          }
          .camerino-auth-right {
            padding: 24px 16px 48px !important;
          }
          .camerino-auth-card {
            padding: 28px 20px !important;
            border-radius: 20px !important;
          }
        }
        @media (max-width: 420px) {
          .camerino-auth-h2 {
            font-size: 26px !important;
          }
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.23-5.8c0-.42-.03-.83-.1-1.25z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.8 4.8 0 0 1 4.48-3.3z" />
    </svg>
  );
}

const s = {
  root: { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: "Inter, sans-serif" },
  // Left
  left: { background: "#2D5A27", padding: "48px 64px", display: "flex", flexDirection: "column" },
  backBtn: { background: "transparent", border: "1px solid rgba(245,240,224,0.3)", borderRadius: 50, padding: "8px 18px", color: "#F5F0E0", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 24, fontFamily: "Inter, sans-serif" },
  leftContent: { display: "flex", flexDirection: "column", gap: 24, flex: 1, justifyContent: "center" },
  leftH2: { fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 300, color: "#F5F0E0", lineHeight: 1.15 },
  leftP: { fontSize: 15, color: "rgba(245,240,224,0.65)", lineHeight: 1.8, fontWeight: 300, maxWidth: 420 },
  features: { display: "flex", flexDirection: "column", gap: 14 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  check: { width: 24, height: 24, background: "#4A7C42", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, flexShrink: 0 },
  featureText: { fontSize: 14, color: "rgba(245,240,224,0.85)" },
  // Right
  right: { background: "#FAF7EE", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 },
  card: { background: "#fff", borderRadius: 28, padding: 48, border: "1px solid #D8E8D4", boxShadow: "0 20px 60px rgba(45,90,39,0.08)", width: "100%", maxWidth: 440 },
  cardTop: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 24 },
  cardLogoText: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, color: "#1A1F18" },
  cardTitle: { fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 8 },
  cardSub: { fontSize: 13, color: "#7A8A78", textAlign: "center", marginBottom: 32, fontWeight: 300 },
  googleBtn: { width: "100%", padding: 14, border: "1.5px solid #D8E8D4", borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 20, fontFamily: "Inter, sans-serif" },
  orRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine: { flex: 1, height: 1, background: "#D8E8D4" },
  orText: { fontSize: 12, color: "#7A8A78" },
  input: { width: "100%", padding: "13px 16px", border: "1.5px solid #D8E8D4", borderRadius: 12, marginBottom: 14, fontSize: 14, fontFamily: "Inter, sans-serif", boxSizing: "border-box" },
  error: { fontSize: 13, color: "#9B3A3A", marginBottom: 8, textAlign: "center" },
  submitBtn: { width: "100%", padding: 15, border: "none", borderRadius: 14, background: "#2D5A27", color: "#F5F0E0", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" },
  switchText: { fontSize: 13, color: "#7A8A78", textAlign: "center", marginTop: 20 },
  switchLink: { color: "#2D5A27", fontWeight: 600, cursor: "pointer", textDecoration: "underline" },
};