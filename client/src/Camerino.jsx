import { useState, useRef, useCallback } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const STYLE_PROMPT = (gender) => `You are Camerino, a world-class fashion stylist AI with deep knowledge of global fashion trends, color theory, and personal styling.

A user has uploaded a photo of a clothing item. They want ${gender === "male" ? "men's" : "women's"} outfit suggestions. Analyze it carefully and generate exactly 5 distinct outfit suggestions around it.

For each outfit, provide:
1. A short punchy name (e.g. "Lagos After Dark", "Sunday Soft Life", "Board Room Edge")
2. The occasion it suits
3. Exactly 3-4 specific pieces to pair with the item (be specific — mention colors, fabrics, and styles)
4. A 1-sentence vibe description
5. Exactly 3 colors in the outfit as hex codes

Also identify the garment type in 2-4 plain words a stock photo site would recognize (e.g. "short sleeve shirt", "denim jacket", "midi dress", "cargo pants") — no colors or styling detail, just the item category and silhouette.

Respond ONLY with valid JSON. No markdown, no preamble. Format:
{
  "item_description": "brief description of the uploaded clothing item",
  "garment_type": "2-4 word plain garment category",
  "outfits": [
    {
      "name": "outfit name",
      "occasion": "occasion",
      "pieces": ["piece 1", "piece 2", "piece 3"],
      "vibe": "one sentence vibe",
      "colors": ["#hexcode1", "#hexcode2", "#hexcode3"]
    }
  ]
}`;

const OCCASION_COLORS = ["#2D5A27", "#4A7C42", "#9B3A3A", "#C4956A", "#3A5A7C"];

const UNSPLASH_OUTFITS = [
  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
];

export default function Camerino({ gender, user, onChangeGender }) {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const [itemDesc, setItemDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState([]);
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setOutfits(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const generateOutfits = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    setOutfits(null);
    try {
      const response = await fetch("https://camerino.onrender.com/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
              { type: "text", text: STYLE_PROMPT(gender) }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setItemDesc(parsed.item_description);
      setSelected(0);

      // Fetch a matching hero image per outfit from Pexels
      const withImages = await Promise.all(
        parsed.outfits.map(async (o, i) => {
          try {
            const genderWord = gender === "male" ? "man male" : "woman female";
            const garment = parsed.garment_type || "";
            const q = `${genderWord} ${garment} ${o.occasion}`.slice(0, 100);
            const imgRes = await fetch(
              `https://camerino.onrender.com/api/outfit-image?query=${encodeURIComponent(q)}&page=${i + 1}`
            );
            const imgData = await imgRes.json();
            return { ...o, heroImage: imgData.imageUrl || null };
          } catch {
            return { ...o, heroImage: null };
          }
        })
      );
      setOutfits(withImages);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const saveOutfit = (outfit) => {
    if (!saved.find(s => s.name === outfit.name)) {
      setSaved([...saved, { ...outfit, image }]);
    }
  };

  const reset = () => {
    setImage(null);
    setImageBase64(null);
    setOutfits(null);
    setItemDesc("");
    setError(null);
  };

  return (
    <div style={s.root} className="camerino-app-root">
      {/* Nav */}
      <nav style={s.nav} className="camerino-app-nav">
        <div style={s.navLogo}>
          <LogoMark size={34} />
          <span style={s.logoWord}>Camerino</span>
        </div>
        <div style={s.navCenter} className="camerino-nav-center">
          <span style={s.genderTag} className="camerino-gender-tag" onClick={onChangeGender}>
            {gender === "male" ? "👔 Men's" : "👗 Women's"} styles
            <span style={s.changeTag}>Change</span>
          </span>
        </div>
        <div style={s.navRight}>
          {saved.length > 0 && <div style={s.savedBadge}>♥ {saved.length} saved</div>}
          <span style={s.userName} className="camerino-user-name">{user?.displayName?.split(" ")[0] || user?.email?.split("@")[0]}</span>
          <button style={s.signOutBtn} onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </nav>

      <main style={s.main} className="camerino-app-main">
        {!image ? (
          /* Upload Zone */
          <div style={s.uploadSection}>
            <h1 style={s.uploadH1} className="camerino-upload-h1">What are we styling <em style={{ fontStyle: "italic", color: "#4A7C42" }}>today?</em></h1>
            <p style={s.uploadSub} className="camerino-upload-sub">Upload any clothing item and get 5 complete outfit ideas instantly</p>
            <div
              style={{ ...s.uploadZone, ...(dragOver ? s.uploadZoneDrag : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => processFile(e.target.files[0])} style={{ display: "none" }} />
              <div style={s.uploadIcon}>📸</div>
              <p style={s.uploadTitle}>Drop your clothing item here</p>
              <p style={s.uploadHint}>or tap to choose a photo</p>
              <div style={s.uploadTypes}>Works with tops · bottoms · dresses · shoes · accessories</div>
            </div>

            {/* Sample outfit grid preview */}
            <div style={s.previewSection}>
              <p style={s.previewLabel}>Recent looks</p>
              <div style={s.previewGrid} className="camerino-preview-grid">
                {UNSPLASH_OUTFITS.slice(0, 4).map((url, i) => (
                  <div key={i} style={s.previewCard}>
                    <img src={url} alt="outfit" style={s.previewImg} onError={e => e.target.style.display='none'} />
                    <div style={s.previewOverlay}>
                      <span style={{ ...s.previewOcc, color: OCCASION_COLORS[i] }}>
                        {["Night Out", "Casual", "Work", "Event"][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Workspace */
          <div style={s.workspace}>
            {/* Left — uploaded image */}
            <div style={s.leftPanel}>
              <div style={s.imgWrap}>
                <img src={image} alt="uploaded" style={s.uploadedImg} />
                <button style={s.resetBtn} onClick={reset}>✕</button>
              </div>

              {itemDesc && (
                <div style={s.itemDescBox}>
                  <span style={s.itemDescLabel}>ITEM</span>
                  <span style={s.itemDescText}>{itemDesc}</span>
                </div>
              )}

              {!outfits && !loading && (
                <button style={s.styleBtn} onClick={generateOutfits}>✦ Style This</button>
              )}

              {loading && (
                <div style={s.loadingBox}>
                  <div style={s.dots}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} style={{ ...s.dot, animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <p style={s.loadingText}>Crafting your looks…</p>
                </div>
              )}

              {error && <p style={s.errorText}>{error}</p>}

              {/* Saved looks */}
              {saved.length > 0 && (
                <div style={s.savedSection}>
                  <p style={s.savedLabel}>SAVED LOOKS</p>
                  <div style={s.savedGrid}>
                    {saved.map((sv, i) => (
                      <div key={i} style={s.savedItem}>
                        <img src={sv.image} alt="" style={s.savedImg} />
                        <span style={s.savedName}>{sv.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — outfit results */}
            {outfits && (
              <div style={s.rightPanel}>
                <p style={s.resultsHeader}>5 WAYS TO WEAR IT</p>

                {/* Tabs */}
                <div style={s.tabs}>
                  {outfits.map((o, i) => (
                    <button
                      key={i}
                      style={{ ...s.tab, ...(selected === i ? { ...s.tabActive, borderColor: OCCASION_COLORS[i], color: OCCASION_COLORS[i] } : {}) }}
                      onClick={() => setSelected(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Active outfit card */}
                {outfits[selected] && (
                  <div style={{ ...s.outfitCard, borderColor: OCCASION_COLORS[selected] + "33" }}>
                    {/* Model photo */}
                    <div style={s.outfitPhotoWrap}>
                      <img
                        src={outfits[selected].heroImage || UNSPLASH_OUTFITS[selected]}
                        alt="outfit inspiration"
                        style={s.outfitPhoto}
                        onError={e => e.target.style.display='none'}
                      />
                      <div style={{ ...s.outfitPhotoBadge, background: OCCASION_COLORS[selected] }}>
                        {outfits[selected].occasion}
                      </div>
                    </div>

                    <div style={s.outfitCardBody}>
                      <div style={s.outfitTop}>
                        <div>
                          <h2 style={{ ...s.outfitName, color: OCCASION_COLORS[selected] }}>
                            {outfits[selected].name}
                          </h2>
                          <span style={s.occasionTag}>{outfits[selected].occasion}</span>
                        </div>
                        <button
                          style={s.heartBtn}
                          onClick={() => saveOutfit(outfits[selected])}
                        >
                          {saved.find(sv => sv.name === outfits[selected].name) ? "♥" : "♡"}
                        </button>
                      </div>

                      <p style={s.vibeText}>"{outfits[selected].vibe}"</p>

                      {/* Color palette */}
                      {outfits[selected].colors && (
                        <div style={s.paletteRow}>
                          <span style={s.paletteLabel}>PALETTE</span>
                          <div style={s.colorDots}>
                            {outfits[selected].colors.map((c, i) => (
                              <div key={i} style={{ ...s.colorDot, background: c }} title={c} />
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={s.pairLabel}>PAIR WITH</div>
                      <ul style={s.piecesList}>
                        {outfits[selected].pieces.map((p, j) => (
                          <li key={j} style={s.pieceItem}>
                            <span style={{ ...s.pieceDot, background: OCCASION_COLORS[selected] }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Mini list */}
                <div style={s.miniList}>
                  {outfits.map((o, i) => (
                    <div
                      key={i}
                      style={{ ...s.miniCard, ...(selected === i ? s.miniCardActive : {}), borderLeftColor: OCCASION_COLORS[i] }}
                      onClick={() => setSelected(i)}
                    >
                      <span style={{ ...s.miniName, color: selected === i ? OCCASION_COLORS[i] : "#7A8A78" }}>
                        {o.name}
                      </span>
                      <span style={s.miniOcc}>{o.occasion}</span>
                    </div>
                  ))}
                </div>

                <button style={s.newPhotoBtn} onClick={reset}>Style another item →</button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

        @media (max-width: 860px) {
          .camerino-app-nav { padding: 0 16px !important; }
          .camerino-preview-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .camerino-app-main { padding: 24px 16px !important; }
          .camerino-upload-h1 { font-size: 32px !important; }
          .camerino-upload-sub { font-size: 14px !important; margin-bottom: 28px !important; }
        }
        @media (max-width: 640px) {
          .camerino-app-nav {
            flex-wrap: wrap;
            height: auto !important;
            padding: 10px 12px !important;
            gap: 8px;
            row-gap: 6px;
          }
          .camerino-nav-center {
            position: static !important;
            transform: none !important;
            order: 3;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .camerino-gender-tag { font-size: 11px !important; padding: 5px 12px !important; }
          .camerino-user-name { display: none !important; }
        }
        @media (max-width: 420px) {
          .camerino-upload-h1 { font-size: 26px !important; }
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
  root: { minHeight: "100vh", background: "#FAF7EE", fontFamily: "Inter, sans-serif", color: "#1A1F18" },

  nav: { position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 68, background: "rgba(250,247,238,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid #D8E8D4" },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoWord: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 400, color: "#1A1F18" },
  navCenter: { position: "absolute", left: "50%", transform: "translateX(-50%)" },
  genderTag: { display: "flex", alignItems: "center", gap: 8, background: "rgba(45,90,39,0.08)", border: "1px solid rgba(45,90,39,0.2)", borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 500, color: "#2D5A27", cursor: "pointer" },
  changeTag: { fontSize: 11, color: "#C4956A", fontWeight: 600 },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  savedBadge: { background: "rgba(45,90,39,0.1)", border: "1px solid rgba(45,90,39,0.2)", color: "#2D5A27", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  userName: { fontSize: 13, color: "#7A8A78", fontWeight: 300 },
  signOutBtn: { background: "transparent", border: "1px solid #D8E8D4", borderRadius: 50, padding: "6px 16px", color: "#7A8A78", fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif" },

  main: { maxWidth: 1200, margin: "0 auto", padding: "48px 40px" },

  // Upload section
  uploadSection: { display: "flex", flexDirection: "column", alignItems: "center" },
  uploadH1: { fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 300, color: "#1A1F18", marginBottom: 12, textAlign: "center" },
  uploadSub: { fontSize: 16, color: "#7A8A78", marginBottom: 40, fontWeight: 300 },
  uploadZone: { border: "2px dashed #D8E8D4", borderRadius: 20, padding: "64px 48px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", background: "#fff", maxWidth: 520, width: "100%", marginBottom: 60 },
  uploadZoneDrag: { border: "2px dashed #2D5A27", background: "rgba(45,90,39,0.04)" },
  uploadIcon: { fontSize: 48, marginBottom: 16, display: "block" },
  uploadTitle: { fontFamily: "Georgia, serif", fontSize: 22, color: "#1A1F18", marginBottom: 8 },
  uploadHint: { fontSize: 14, color: "#7A8A78", marginBottom: 20 },
  uploadTypes: { fontSize: 12, color: "#A8B8A8", background: "rgba(45,90,39,0.05)", padding: "8px 16px", borderRadius: 20, display: "inline-block" },

  previewSection: { width: "100%", maxWidth: 900 },
  previewLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#A8B8A8", textTransform: "uppercase", marginBottom: 20 },
  previewGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  previewCard: { borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "3/4", background: "#E8EDE8" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  previewOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 14px 14px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))" },
  previewOcc: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" },

  // Workspace
  workspace: { display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" },
  leftPanel: { flex: "0 0 280px", minWidth: 240 },
  imgWrap: { position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 16, border: "1px solid #D8E8D4" },
  uploadedImg: { width: "100%", display: "block", maxHeight: 380, objectFit: "cover" },
  resetBtn: { position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 13 },
  itemDescBox: { background: "rgba(45,90,39,0.06)", border: "1px solid #D8E8D4", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 10 },
  itemDescLabel: { fontSize: 10, color: "#2D5A27", letterSpacing: "0.1em", fontWeight: 600, marginTop: 2, flexShrink: 0 },
  itemDescText: { fontSize: 13, color: "#3A4A38", lineHeight: 1.5 },
  styleBtn: { width: "100%", padding: 15, background: "#2D5A27", border: "none", borderRadius: 12, color: "#F5F0E0", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.03em", fontFamily: "Inter, sans-serif" },
  loadingBox: { textAlign: "center", padding: "24px 0" },
  dots: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#2D5A27", display: "inline-block", animation: "bounce 1.2s ease-in-out infinite" },
  loadingText: { fontSize: 13, color: "#7A8A78", letterSpacing: "0.1em" },
  errorText: { color: "#9B3A3A", fontSize: 13, textAlign: "center", padding: 12 },
  savedSection: { marginTop: 28 },
  savedLabel: { fontSize: 10, letterSpacing: "0.15em", color: "#A8B8A8", marginBottom: 12 },
  savedGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  savedItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  savedImg: { width: 52, height: 52, borderRadius: 8, objectFit: "cover", border: "1px solid #D8E8D4" },
  savedName: { fontSize: 10, color: "#7A8A78", maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  // Right panel
  rightPanel: { flex: 1, minWidth: 320 },
  resultsHeader: { fontSize: 11, letterSpacing: "0.2em", color: "#A8B8A8", marginBottom: 20, fontWeight: 500 },
  tabs: { display: "flex", gap: 8, marginBottom: 24 },
  tab: { width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #D8E8D4", background: "transparent", color: "#A8B8A8", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", transition: "all 0.2s" },
  tabActive: { background: "rgba(45,90,39,0.06)" },
  outfitCard: { background: "#fff", border: "1px solid", borderRadius: 20, overflow: "hidden", marginBottom: 20, boxShadow: "0 4px 20px rgba(45,90,39,0.06)" },
  outfitPhotoWrap: { position: "relative", height: 420, overflow: "hidden", background: "linear-gradient(160deg,#3d6b38,#1a3818)" },
  outfitPhoto: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" },
  outfitPhotoBadge: { position: "absolute", top: 16, left: 16, borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" },
  outfitCardBody: { padding: 24 },
  outfitTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  outfitName: { fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic", marginBottom: 4, lineHeight: 1.1 },
  occasionTag: { fontSize: 11, color: "#A8B8A8", letterSpacing: "0.1em", textTransform: "uppercase" },
  heartBtn: { background: "transparent", border: "1.5px solid #D8E8D4", color: "#C4956A", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  vibeText: { fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#7A8A78", marginBottom: 18, lineHeight: 1.6 },
  paletteRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 },
  paletteLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", color: "#A8B8A8" },
  colorDots: { display: "flex", gap: 6 },
  colorDot: { width: 24, height: 24, borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" },
  pairLabel: { fontSize: 10, letterSpacing: "0.15em", color: "#A8B8A8", marginBottom: 12, fontWeight: 600 },
  piecesList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10 },
  pieceItem: { display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#3A4A38", lineHeight: 1.4 },
  pieceDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  miniList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 },
  miniCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, borderLeft: "2px solid", background: "#fff", cursor: "pointer", border: "1px solid #D8E8D4", borderLeft: "3px solid" },
  miniCardActive: { background: "rgba(45,90,39,0.04)" },
  miniName: { fontSize: 13, fontFamily: "Georgia, serif", fontStyle: "italic", transition: "color 0.2s" },
  miniOcc: { fontSize: 11, color: "#A8B8A8" },
  newPhotoBtn: { background: "transparent", border: "1.5px solid #D8E8D4", color: "#7A8A78", padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "Inter, sans-serif", transition: "all 0.2s" },
};