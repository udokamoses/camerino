import { useState, useRef, useCallback } from "react";

const STYLE_PROMPT = `You are Camerino, a world-class fashion stylist AI with deep knowledge of global fashion trends, color theory, and personal styling.

A user has uploaded a photo of a clothing item. Analyze it carefully and generate exactly 5 distinct outfit suggestions around it.

For each outfit, provide:
1. A short punchy name (e.g. "Lagos After Dark", "Sunday Soft Life", "Board Room Edge")
2. The occasion it suits
3. Exactly 3-4 specific pieces to pair with the item (be specific — mention colors, fabrics, and styles)
4. A 1-sentence vibe description

Respond ONLY with valid JSON. No markdown, no preamble. Format:
{
  "item_description": "brief description of the uploaded clothing item",
  "outfits": [
    {
      "name": "outfit name",
      "occasion": "occasion",
      "pieces": ["piece 1", "piece 2", "piece 3"],
      "vibe": "one sentence vibe"
    }
  ]
}`;

const occasions = ["👟 Casual", "💼 Work", "🌙 Night Out", "🎉 Event", "✈️ Travel"];
const occasionColors = ["#C8A96E", "#6E8FA6", "#9B6EA6", "#6EA67A", "#6E8A9B"];

export default function Camerino() {
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

  const handleFileChange = (e) => processFile(e.target.files[0]);

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
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
              },
              { type: "text", text: STYLE_PROMPT }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setOutfits(parsed.outfits);
      setItemDesc(parsed.item_description);
      setSelected(0);
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
    <div style={styles.root}>
      <div style={styles.grain} />
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoC}>C</span>
          <span style={styles.logoText}>amerino</span>
        </div>
        <p style={styles.tagline}>Your AI personal stylist</p>
        {saved.length > 0 && (
          <div style={styles.savedBadge}>{saved.length} saved</div>
        )}
      </header>
      <main style={styles.main}>
        {!image ? (
          <div
            style={{ ...styles.uploadZone, ...(dragOver ? styles.uploadZoneDrag : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            <div style={styles.uploadIcon}>👗</div>
            <p style={styles.uploadTitle}>Drop your clothing item here</p>
            <p style={styles.uploadSub}>or tap to choose a photo</p>
            <div style={styles.uploadHint}>Works with tops, bottoms, dresses, shoes, accessories</div>
          </div>
        ) : (
          <div style={styles.workspace}>
            <div style={styles.leftPanel}>
              <div style={styles.imageWrapper}>
                <img src={image} alt="uploaded" style={styles.uploadedImg} />
                <button style={styles.resetBtn} onClick={reset}>✕</button>
              </div>
              {itemDesc && (
                <div style={styles.itemDesc}>
                  <span style={styles.itemDescLabel}>ITEM</span>
                  <span style={styles.itemDescText}>{itemDesc}</span>
                </div>
              )}
              {!outfits && !loading && (
                <button style={styles.generateBtn} onClick={generateOutfits}>
                  ✦ Style This
                </button>
              )}
              {loading && (
                <div style={styles.loadingBox}>
                  <div style={styles.loadingDots}>
                    <span style={{ ...styles.dot, animationDelay: "0s" }} />
                    <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                    <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
                  </div>
                  <p style={styles.loadingText}>Crafting your looks…</p>
                </div>
              )}
              {error && <p style={styles.errorText}>{error}</p>}
              {saved.length > 0 && (
                <div style={styles.savedSection}>
                  <p style={styles.savedTitle}>SAVED LOOKS</p>
                  <div style={styles.savedGrid}>
                    {saved.map((s, i) => (
                      <div key={i} style={styles.savedItem}>
                        <img src={s.image} alt="" style={styles.savedImg} />
                        <span style={styles.savedName}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {outfits && (
              <div style={styles.rightPanel}>
                <p style={styles.resultsHeader}>5 WAYS TO WEAR IT</p>
                <div style={styles.tabs}>
                  {outfits.map((o, i) => (
                    <button
                      key={i}
                      style={{
                        ...styles.tab,
                        ...(selected === i ? { ...styles.tabActive, borderColor: occasionColors[i] } : {})
                      }}
                      onClick={() => setSelected(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                {outfits[selected] && (
                  <div style={{ ...styles.outfitCard, borderColor: occasionColors[selected] + "44" }}>
                    <div style={styles.outfitTop}>
                      <div>
                        <h2 style={{ ...styles.outfitName, color: occasionColors[selected] }}>
                          {outfits[selected].name}
                        </h2>
                        <span style={styles.occasionTag}>{outfits[selected].occasion}</span>
                      </div>
                      <button
                        style={styles.saveBtn}
                        onClick={() => saveOutfit(outfits[selected])}
                        title="Save this look"
                      >
                        {saved.find(s => s.name === outfits[selected].name) ? "♥" : "♡"}
                      </button>
                    </div>
                    <p style={styles.vibeText}>"{outfits[selected].vibe}"</p>
                    <div style={styles.piecesLabel}>PAIR WITH</div>
                    <ul style={styles.piecesList}>
                      {outfits[selected].pieces.map((p, j) => (
                        <li key={j} style={styles.pieceItem}>
                          <span style={{ ...styles.pieceDot, background: occasionColors[selected] }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={styles.miniList}>
                  {outfits.map((o, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.miniCard,
                        ...(selected === i ? styles.miniCardActive : {}),
                        borderLeftColor: occasionColors[i]
                      }}
                      onClick={() => setSelected(i)}
                    >
                      <span style={{ ...styles.miniName, color: selected === i ? occasionColors[i] : "#555" }}>
                        {o.name}
                      </span>
                      <span style={styles.miniOccasion}>{o.occasion}</span>
                    </div>
                  ))}
                </div>
                <button style={styles.newPhotoBtn} onClick={reset}>
                  Style another item →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0c0a; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          30% { transform: translate(3%, 2%); }
          50% { transform: translate(-1%, 3%); }
          70% { transform: translate(2%, -2%); }
          90% { transform: translate(-3%, 1%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0d0c0a",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e8e2d9",
    position: "relative",
    overflow: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    opacity: 0.4,
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "48px 24px 24px",
    borderBottom: "1px solid #ffffff08",
  },
  logo: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "2px",
    marginBottom: "6px",
  },
  logoC: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "52px",
    fontStyle: "italic",
    color: "#C8A96E",
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px",
    color: "#e8e2d9",
    letterSpacing: "0.02em",
  },
  tagline: {
    fontSize: "13px",
    color: "#666",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 300,
  },
  savedBadge: {
    position: "absolute",
    top: "48px",
    right: "24px",
    background: "#C8A96E22",
    border: "1px solid #C8A96E44",
    color: "#C8A96E",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 60px",
  },
  uploadZone: {
    border: "1px dashed #333",
    borderRadius: "16px",
    padding: "80px 40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "#ffffff03",
    maxWidth: "520px",
    margin: "0 auto",
    animation: "fadeUp 0.6s ease forwards",
  },
  uploadZoneDrag: {
    border: "1px dashed #C8A96E",
    background: "#C8A96E08",
  },
  uploadIcon: {
    fontSize: "56px",
    marginBottom: "20px",
    display: "block",
  },
  uploadTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    color: "#e8e2d9",
    marginBottom: "8px",
  },
  uploadSub: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "24px",
  },
  uploadHint: {
    fontSize: "12px",
    color: "#3a3a3a",
    letterSpacing: "0.05em",
    background: "#ffffff05",
    padding: "8px 16px",
    borderRadius: "20px",
    display: "inline-block",
  },
  workspace: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    animation: "fadeUp 0.5s ease forwards",
  },
  leftPanel: {
    flex: "0 0 280px",
    minWidth: "240px",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "16px",
    border: "1px solid #ffffff10",
  },
  uploadedImg: {
    width: "100%",
    display: "block",
    maxHeight: "360px",
    objectFit: "cover",
  },
  resetBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#00000088",
    border: "none",
    color: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemDesc: {
    background: "#ffffff05",
    border: "1px solid #ffffff0a",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "16px",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
  itemDescLabel: {
    fontSize: "10px",
    color: "#C8A96E",
    letterSpacing: "0.1em",
    fontWeight: 500,
    marginTop: "2px",
    flexShrink: 0,
  },
  itemDescText: {
    fontSize: "13px",
    color: "#aaa",
    lineHeight: 1.5,
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #C8A96E, #a8895e)",
    border: "none",
    borderRadius: "10px",
    color: "#0d0c0a",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.05em",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.2s",
  },
  loadingBox: {
    textAlign: "center",
    padding: "24px 0",
  },
  loadingDots: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "12px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#C8A96E",
    display: "inline-block",
    animation: "bounce 1.2s ease-in-out infinite",
  },
  loadingText: {
    fontSize: "13px",
    color: "#555",
    letterSpacing: "0.1em",
  },
  errorText: {
    color: "#e07070",
    fontSize: "13px",
    textAlign: "center",
    padding: "12px",
  },
  savedSection: {
    marginTop: "28px",
  },
  savedTitle: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    color: "#444",
    marginBottom: "12px",
  },
  savedGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  savedItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  savedImg: {
    width: "52px",
    height: "52px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #C8A96E44",
  },
  savedName: {
    fontSize: "10px",
    color: "#555",
    maxWidth: "60px",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rightPanel: {
    flex: 1,
    minWidth: "300px",
    animation: "fadeUp 0.6s ease forwards",
  },
  resultsHeader: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    color: "#444",
    marginBottom: "20px",
    fontWeight: 500,
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  tab: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #2a2a2a",
    background: "transparent",
    color: "#555",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'Playfair Display', serif",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#e8e2d9",
    background: "#ffffff08",
  },
  outfitCard: {
    background: "#ffffff04",
    border: "1px solid",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  outfitTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  outfitName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px",
    fontStyle: "italic",
    marginBottom: "6px",
    lineHeight: 1.1,
  },
  occasionTag: {
    fontSize: "11px",
    color: "#555",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  saveBtn: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#C8A96E",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  vibeText: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
    lineHeight: 1.6,
  },
  piecesLabel: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    color: "#444",
    marginBottom: "12px",
    fontWeight: 500,
  },
  piecesList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  pieceItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#b0a89e",
    lineHeight: 1.4,
  },
  pieceDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  miniList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "28px",
  },
  miniCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "8px",
    borderLeft: "2px solid",
    background: "#ffffff03",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  miniCardActive: {
    background: "#ffffff07",
  },
  miniName: {
    fontSize: "13px",
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    transition: "color 0.2s",
  },
  miniOccasion: {
    fontSize: "11px",
    color: "#3a3a3a",
  },
  newPhotoBtn: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#666",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.03em",
    transition: "all 0.2s",
  },
};