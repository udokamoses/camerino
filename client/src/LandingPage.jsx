import { useState, useEffect } from "react";

const HERO_PHOTOS = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=560&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=320&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=320&fit=crop",
];

const WALLPAPER = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1475180429745-7d6e773ae476?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop",
];

function PhotoWall({ cols = 6, rows = 2, opacity = 0.12, tint = "transparent" }) {
  const count = cols * rows;
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      pointerEvents: "none", zIndex: 0,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src={WALLPAPER[i % WALLPAPER.length]}
          alt=""
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            opacity,
            filter: "grayscale(10%)",
          }}
          onError={e => e.target.style.display = "none"}
        />
      ))}
      <div style={{ position: "absolute", inset: 0, background: tint, zIndex: 1 }} />
    </div>
  );
}

export default function LandingPage({ onGetStarted }) {
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setWardrobeOpen(true), 600);
    const t2 = setTimeout(() => setShowContent(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF7EE; }
        button { cursor: pointer; transition: all 0.22s ease; }
        button:hover { opacity: 0.88; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .lp-wardrobe-wrap { width: 320px !important; height: 260px !important; }
          .lp-wardrobe-name { font-size: 36px !important; }
          .lp-nav { padding: 0 20px !important; }
          .lp-nav-right .lp-btn-ghost { display: none !important; }
          .lp-hero { grid-template-columns: 1fr !important; }
          .lp-hero-left { padding: 100px 24px 56px !important; }
          .lp-hero-h1 { font-size: 44px !important; }
          .lp-hero-p { max-width: 100% !important; }
          .lp-hero-stats { gap: 28px !important; }
          .lp-stat-num { font-size: 30px !important; }
          .lp-hero-right { min-height: 480px; }
          .lp-how-inner { padding: 64px 24px !important; }
          .lp-section-h2 { font-size: 34px !important; margin-bottom: 40px !important; }
          .lp-steps-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .lp-cta-inner { padding: 64px 24px !important; }
          .lp-cta-h2 { font-size: 36px !important; }
          .lp-footer { flex-direction: column !important; gap: 16px !important; padding: 32px 24px !important; text-align: center; }
        }
        @media (max-width: 480px) {
          .lp-hero-h1 { font-size: 36px !important; }
          .lp-hero-eyebrow { font-size: 9px !important; }
          .lp-section-h2 { font-size: 28px !important; }
          .lp-cta-h2 { font-size: 28px !important; }
          .lp-btn-forest, .lp-btn-cream, .lp-btn-cream-outline { padding: 12px 22px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* ── WARDROBE INTRO ── */}
      <div style={{
        ...s.wardrobeIntro,
        opacity: showContent ? 0 : 1,
        pointerEvents: showContent ? "none" : "all",
        transition: "opacity 0.9s ease",
      }}>
        <div style={s.wardrobeWrap} className="lp-wardrobe-wrap">
          <div style={s.wardrobeInterior}>
            <PhotoWall cols={4} rows={2} opacity={0.1} tint="rgba(15,26,14,0.6)" />
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <div style={s.railWrap}>
                <div style={s.rail} />
                <div style={s.hangers}>
                  {["👗","👔","🧥","👕","👖"].map((e, i) => (
                    <span key={i} style={{ fontSize: 18, opacity: 0.5 }}>{e}</span>
                  ))}
                </div>
              </div>
              <div style={s.wardrobeLogoWrap}>
                <CamerinoLogo size={60} />
                <div style={s.wardrobeName} className="lp-wardrobe-name">Camerino</div>
                <div style={s.wardrobeTagline}>Your AI Personal Stylist</div>
              </div>
            </div>
          </div>
          <div style={{
            ...s.doorLeft,
            transform: wardrobeOpen ? "perspective(1200px) rotateY(-115deg)" : "perspective(1200px) rotateY(0deg)",
            transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)"
          }}>
            <div style={s.doorPanel} /><div style={s.handleLeft} />
          </div>
          <div style={{
            ...s.doorRight,
            transform: wardrobeOpen ? "perspective(1200px) rotateY(115deg)" : "perspective(1200px) rotateY(0deg)",
            transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)"
          }}>
            <div style={s.doorPanel} /><div style={s.handleRight} />
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={s.nav} className="lp-nav">
        <div style={s.navLogo}>
          <CamerinoLogo size={42} />
          <span style={s.logoWord}>Camerino</span>
        </div>
        <div style={s.navRight} className="lp-nav-right">
          <button style={s.btnGhost} className="lp-btn-ghost" onClick={onGetStarted}>Log in</button>
          <button style={s.btnForest} className="lp-btn-forest" onClick={onGetStarted}>Open your wardrobe →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero} className="lp-hero">

        {/* Left */}
        <div style={s.heroLeft} className="lp-hero-left">
          <PhotoWall cols={3} rows={3} opacity={0.22} tint="rgba(15,26,14,0.0)" />
          <div style={s.heroGradientOverlay} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={s.heroEyebrow} className="lp-hero-eyebrow">AI-Powered Personal Styling</p>
            <h1 style={s.heroH1} className="lp-hero-h1">
              Style what<br />
              you <em style={{ fontStyle: "italic", color: "#C4956A" }}>own.</em><br />
              Beautifully.
            </h1>
            <p style={s.heroP} className="lp-hero-p">
              Upload any clothing item and Camerino instantly
              creates 5 complete outfit looks for every occasion.
            </p>
            <div style={s.heroBtns}>
              <button style={s.btnCream} className="lp-btn-cream" onClick={onGetStarted}>Open your wardrobe →</button>
              <button style={s.btnCreamOutline} className="lp-btn-cream-outline">See examples</button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={s.heroRight} className="lp-hero-right">
          <PhotoWall cols={4} rows={2} opacity={0.18} tint="rgba(238,232,216,0.65)" />
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 14, alignContent: "center", height: "100%", padding: "40px 32px" }}>

            <div style={{ ...s.photoCard, gridRow: "span 2" }}>
              <div style={{ ...s.photoPlaceholder, height: 340, background: "linear-gradient(160deg,#1a3818,#2D5A27,#4a7c42)" }}>
                <img src={HERO_PHOTOS[0]} alt="model" style={s.modelImg} onError={e => e.target.style.display = "none"} />
                <div style={s.photoBadge}><div style={s.badgeDot} />5 looks generated</div>
              </div>
              <div style={s.pcBody}>
                <p style={s.pcOcc}>Night Out</p>
                <p style={s.pcName}>Lagos After Dark</p>
                <div style={s.pcChips}>
                  {["#1a1a1a","#f5f5f5","#c0a875"].map(c => <div key={c} style={{ ...s.chip, background: c }} />)}
                </div>
              </div>
            </div>

            <div style={s.photoCard}>
              <div style={{ ...s.photoPlaceholder, height: 148, background: "linear-gradient(160deg,#8a6a42,#c4956a)" }}>
                <img src={HERO_PHOTOS[1]} alt="model" style={s.modelImg} onError={e => e.target.style.display = "none"} />
                <div style={{ ...s.photoBadge, fontSize: 10, padding: "3px 10px" }}><div style={s.badgeDot} />Casual</div>
              </div>
              <div style={s.pcBody}>
                <p style={s.pcOcc}>Casual</p>
                <p style={{ ...s.pcName, fontSize: 15 }}>Sunday Soft Life</p>
              </div>
            </div>

            <div style={s.photoCard}>
              <div style={{ ...s.photoPlaceholder, height: 148, background: "linear-gradient(160deg,#2d5a27,#6b9e3f)" }}>
                <img src={HERO_PHOTOS[2]} alt="model" style={s.modelImg} onError={e => e.target.style.display = "none"} />
                <div style={{ ...s.photoBadge, fontSize: 10, padding: "3px 10px" }}><div style={s.badgeDot} />Work</div>
              </div>
              <div style={s.pcBody}>
                <p style={s.pcOcc}>Work</p>
                <p style={{ ...s.pcName, fontSize: 15 }}>Board Room Edge</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.howSection}>
        <PhotoWall cols={6} rows={2} opacity={0.18} tint="rgba(250,247,238,0.78)" />
        <div style={s.howInner} className="lp-how-inner">
          <div style={s.pill}>How it works</div>
          <h2 style={s.sectionH2} className="lp-section-h2">
            From one photo to{" "}
            <em style={{ fontStyle: "italic", color: "#2D5A27" }}>five perfect looks</em>
          </h2>
          <div style={s.stepsGrid} className="lp-steps-grid">
            {[
              ["1", "Choose your style", "Select men's or women's styling before each session. Camerino tailors every suggestion to match your world."],
              ["2", "Upload your piece", "Photograph any item — tops, trousers, shoes, dresses, accessories. Camerino reads the color, fabric, and style."],
              ["3", "Get 5 looks instantly", "Five complete outfit directions — each with a color palette, specific pieces to pair, and a vibe description."],
            ].map(([n, h, p]) => (
              <div key={n} style={s.step}>
                <div style={s.stepNum}>{n}</div>
                <h3 style={s.stepH3}>{h}</h3>
                <p style={s.stepP}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <PhotoWall cols={6} rows={2} opacity={0.16} tint="rgba(245,240,224,0.82)" />
        <div style={s.ctaInner} className="lp-cta-inner">
          <h2 style={s.ctaH2} className="lp-cta-h2">
            Ready to wear<br />
            what you{" "}
            <em style={{ fontStyle: "italic", color: "#2D5A27" }}>already own?</em>
          </h2>
          <p style={s.ctaP}>Born in Lagos. Built for Milan, London, New York and everywhere in between.</p>
          <button style={s.btnBigForest} onClick={onGetStarted}>Open your wardrobe — it's free →</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer} className="lp-footer">
        <div style={s.footerLogo}>
          <CamerinoLogo size={32} />
          <span style={s.footerLogoText}>Camerino</span>
        </div>
        <div style={s.footerRight}>© 2026 Camerino · Born in Lagos 🇳🇬 · Made for the world 🌍</div>
      </footer>
    </div>
  );
}

function CamerinoLogo({ size = 40 }) {
  const stroke = "#C8A96E";
  const sw = Math.max(1.4, size * 0.038);
  const cx = size / 2;
  const cy = size / 2 + size * 0.04;
  const r = size * 0.33;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={sw} />
      <line x1={cx - r * 1.32} y1={cy + r * 0.16} x2={cx + r * 1.32} y2={cy + r * 0.16} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <polyline points={`${cx - r * 0.72},${cy + r * 0.16} ${cx},${cy - r * 0.28} ${cx + r * 0.72},${cy + r * 0.16}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${cx},${cy - r * 0.28} L${cx},${cy - r * 0.56} Q${cx},${cy - r * 0.76} ${cx + r * 0.15},${cy - r * 0.76} Q${cx + r * 0.3},${cy - r * 0.76} ${cx + r * 0.3},${cy - r * 0.58}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </svg>
  );
}

const H = "'Cormorant Garamond', Georgia, serif";
const B = "'Jost', sans-serif";

const s = {
  root: { fontFamily: B, background: "#FAF7EE", color: "#1A1F18", overflowX: "hidden" },

  wardrobeIntro: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "#0c140b" },
  wardrobeWrap: { position: "relative", width: 480, height: 360 },
  wardrobeInterior: { position: "absolute", inset: 0, background: "linear-gradient(180deg,#0f1a0e 0%,#1a3818 40%,#2D5A27 75%,#4a7c42 100%)", borderRadius: 12, overflow: "hidden" },
  railWrap: { position: "relative", width: "68%" },
  rail: { width: "100%", height: 2, background: "#C8A96E", opacity: 0.5 },
  hangers: { position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 22 },
  wardrobeLogoWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  wardrobeName: { fontFamily: H, fontSize: 52, fontWeight: 300, color: "#F5F0E0", letterSpacing: "0.08em" },
  wardrobeTagline: { fontFamily: B, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(196,149,106,0.75)", fontWeight: 300 },
  doorLeft: { position: "absolute", left: 0, top: 0, width: "50%", height: "100%", background: "linear-gradient(135deg,#1c2a1a,#0c140b)", borderRadius: "10px 0 0 10px", border: "1px solid rgba(200,169,110,0.15)", transformOrigin: "left center" },
  doorRight: { position: "absolute", right: 0, top: 0, width: "50%", height: "100%", background: "linear-gradient(225deg,#1c2a1a,#0c140b)", borderRadius: "0 10px 10px 0", border: "1px solid rgba(200,169,110,0.15)", transformOrigin: "right center" },
  doorPanel: { position: "absolute", inset: 14, border: "1px solid rgba(200,169,110,0.1)", borderRadius: 5 },
  handleLeft: { position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 6, height: 38, background: "#C8A96E", borderRadius: 3, opacity: 0.55 },
  handleRight: { position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 6, height: 38, background: "#C8A96E", borderRadius: 3, opacity: 0.55 },

  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", height: 72, background: "rgba(250,247,238,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #D8E8D4" },
  navLogo: { display: "flex", alignItems: "center", gap: 12 },
  logoWord: { fontFamily: H, fontSize: 26, fontWeight: 400, color: "#1A1F18", letterSpacing: "0.04em" },
  navRight: { display: "flex", gap: 10, alignItems: "center" },
  btnGhost: { padding: "10px 24px", border: "1.5px solid #D8E8D4", borderRadius: 50, background: "transparent", fontFamily: B, fontSize: 13, fontWeight: 400, color: "#3A4A38" },
  btnForest: { padding: "10px 26px", border: "none", borderRadius: 50, background: "linear-gradient(135deg,#0f1a0e,#1a3818,#2D5A27)", fontFamily: B, fontSize: 13, fontWeight: 500, color: "#F5F0E0", boxShadow: "0 4px 18px rgba(15,26,14,0.35)" },

  hero: { paddingTop: 72, display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100vh" },

  heroLeft: { position: "relative", overflow: "hidden", padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center" },
  heroGradientOverlay: { position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(15,26,14,0.95) 0%, rgba(26,56,24,0.91) 28%, rgba(45,90,39,0.86) 60%, rgba(74,124,66,0.83) 100%)" },

  heroEyebrow: { fontFamily: B, fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C4956A", marginBottom: 22 },
  heroH1: { fontFamily: H, fontSize: 82, fontWeight: 300, lineHeight: 0.95, color: "#F5F0E0", marginBottom: 30, letterSpacing: "-0.01em" },
  heroP: { fontFamily: B, fontSize: 15, fontWeight: 300, color: "rgba(245,240,224,0.68)", lineHeight: 1.82, marginBottom: 44, maxWidth: 390 },
  heroBtns: { display: "flex", gap: 14, flexWrap: "wrap" },
  btnCream: { padding: "15px 38px", border: "none", borderRadius: 50, background: "#F5F0E0", fontFamily: B, fontSize: 14, fontWeight: 500, color: "#1a3818", boxShadow: "0 6px 28px rgba(0,0,0,0.24)" },
  btnCreamOutline: { padding: "15px 38px", border: "1.5px solid rgba(245,240,224,0.3)", borderRadius: 50, background: "transparent", fontFamily: B, fontSize: 14, fontWeight: 300, color: "#F5F0E0" },
  heroStats: { display: "flex", gap: 52, marginTop: 60, paddingTop: 30, borderTop: "1px solid rgba(245,240,224,0.1)" },
  statNum: { fontFamily: H, fontSize: 44, fontWeight: 400, color: "#C4956A", lineHeight: 1 },

  heroRight: { position: "relative", overflow: "hidden" },
  photoCard: { background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(45,90,39,0.1)" },
  photoPlaceholder: { width: "100%", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" },
  modelImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  photoBadge: { position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: "5px 13px", fontSize: 11, fontWeight: 500, color: "#1A1F18", display: "flex", alignItems: "center", gap: 6, zIndex: 1, fontFamily: B },
  badgeDot: { width: 7, height: 7, borderRadius: "50%", background: "#2D5A27" },
  pcBody: { padding: "12px 14px 16px" },
  pcOcc: { fontFamily: B, fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2D5A27", marginBottom: 4 },
  pcName: { fontFamily: H, fontSize: 18, fontStyle: "italic", color: "#1A1F18", marginBottom: 10 },
  pcChips: { display: "flex", gap: 5 },
  chip: { width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" },

  howSection: { position: "relative", overflow: "hidden", background: "#FAF7EE" },
  howInner: { position: "relative", zIndex: 1, padding: "100px 80px", maxWidth: 1200, margin: "0 auto" },
  pill: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,90,39,0.08)", border: "1px solid rgba(45,90,39,0.15)", borderRadius: 50, padding: "6px 18px", fontFamily: B, fontSize: 10, fontWeight: 600, color: "#2D5A27", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 },
  sectionH2: { fontFamily: H, fontSize: 52, fontWeight: 300, color: "#1A1F18", lineHeight: 1.1, marginBottom: 64, maxWidth: 520, letterSpacing: "0.01em" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 52 },
  step: { display: "flex", flexDirection: "column", gap: 20 },
  stepNum: { width: 52, height: 52, background: "linear-gradient(135deg,#0f1a0e,#2D5A27)", borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: H, fontSize: 24, fontWeight: 500, color: "#F5F0E0", boxShadow: "0 4px 16px rgba(15,26,14,0.25)" },
  stepH3: { fontFamily: H, fontSize: 28, fontWeight: 400, color: "#1A1F18", letterSpacing: "0.01em" },
  stepP: { fontFamily: B, fontSize: 14, color: "#7A8A78", lineHeight: 1.85, fontWeight: 300 },

  ctaSection: { position: "relative", overflow: "hidden", background: "#F5F0E0" },
  ctaInner: { position: "relative", zIndex: 1, padding: "120px 80px", textAlign: "center", maxWidth: 800, margin: "0 auto" },
  ctaH2: { fontFamily: H, fontSize: 64, fontWeight: 300, lineHeight: 1.08, color: "#1A1F18", marginBottom: 20, letterSpacing: "0.01em" },
  ctaP: { fontFamily: B, fontSize: 15, color: "#7A8A78", lineHeight: 1.82, fontWeight: 300, marginBottom: 48 },
  btnBigForest: { padding: "18px 54px", border: "none", borderRadius: 50, background: "linear-gradient(135deg,#0f1a0e,#1a3818,#2D5A27)", fontFamily: B, fontSize: 15, fontWeight: 500, color: "#F5F0E0", boxShadow: "0 8px 36px rgba(15,26,14,0.35)", letterSpacing: "0.03em" },

  footer: { background: "linear-gradient(135deg,#0c140b,#0f1a0e)", padding: "48px 80px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerLogo: { display: "flex", alignItems: "center", gap: 12 },
  footerLogoText: { fontFamily: H, fontSize: 22, color: "#F5F0E0", fontWeight: 300, letterSpacing: "0.05em" },
  footerRight: { fontFamily: B, fontSize: 12, color: "rgba(245,240,224,0.3)", fontWeight: 300 },
};