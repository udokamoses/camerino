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
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.left}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <div style={s.leftContent}>
          <LogoMark size={52} />
          <h2 style={s.leftH2}>
            Your wardrobe,<br /><em style={{ fontStyle: "italic", color: "#4A7C42" }}>elevated.</em>
          </h2>
          <p style={s.leftP}>
            Stop standing in front of your wardrobe wondering what to wear. Camerino turns every item you own into a complete look.
          </p>
          <div style={s.features}>
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
      <div style={s.right}>
        <div style={s.card}>
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
            <div style={s.orLine} />
            <span style={s.orText}>or {isLogin ? "sign in" : "sign up"} with email</span>
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
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
    </svg>
  );
}

const s = {
  root: { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: "Inter, sans-serif" },

  // Left
  left: { background: "#2D5A27", padding: "48px 64px", display: "flex", flexDirection: "column", position: "relative" },
  backBtn: { background: "transparent", border: "1px solid rgba(245,240,224,0.3)", borderRadius: 50, padding: "8px 20px", color: "rgba(245,240,224,0.7)", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 60, fontFamily: "Inter, sans-serif" },
  leftContent: { display: "flex", flexDirection: "column", gap: 24, flex: 1, justifyContent: "center" },
  leftH2: { fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 300, color: "#F5F0E0", lineHeight: 1.1 },
  leftP: { fontSize: 15, color: "rgba(245,240,224,0.65)", lineHeight: 1.8, fontWeight: 300, maxWidth: 400 },
  features: { display: "flex", flexDirection: "column", gap: 14 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  check: { width: 24, height: 24, background: "#4A7C42", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, flexShrink: 0 },
  featureText: { fontSize: 14, color: "rgba(245,240,224,0.85)" },

  // Right
  right: { background: "#FAF7EE", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 },
  card: { background: "#fff", borderRadius: 28, padding: 48, border: "1px solid #D8E8D4", boxShadow: "0 12px 60px rgba(45,90,39,0.1)", width: "100%", maxWidth: 440 },
  cardTop: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 },
  cardLogoText: { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, color: "#1A1F18" },
  cardTitle: { fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", color: "#1A1F18", marginBottom: 6 },
  cardSub: { fontSize: 13, color: "#7A8A78", textAlign: "center", marginBottom: 32, fontWeight: 300 },

  googleBtn: { width: "100%", padding: 14, border: "1.5px solid #D8E8D4", borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: "#1A1F18", cursor: "pointer", marginBottom: 20 },

  orRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine: { flex: 1, height: 1, background: "#D8E8D4" },
  orText: { fontSize: 12, color: "#7A8A78" },

  input: { width: "100%", padding: "13px 16px", border: "1.5px solid #D8E8D4", borderRadius: 14, fontFamily: "Inter, sans-serif", fontSize: 14, color: "#1A1F18", background: "#FAF7EE", marginBottom: 12, outline: "none", display: "block" },

  error: { fontSize: 13, color: "#9B3A3A", marginBottom: 8, textAlign: "center" },

  submitBtn: { width: "100%", padding: 15, border: "none", borderRadius: 14, background: "#2D5A27", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: "#F5F0E0", cursor: "pointer", marginTop: 8, letterSpacing: "0.02em" },

  switchText: { fontSize: 13, color: "#7A8A78", textAlign: "center", marginTop: 20 },
  switchLink: { color: "#2D5A27", fontWeight: 600, cursor: "pointer", textDecoration: "underline" },
};