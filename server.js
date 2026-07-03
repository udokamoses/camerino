const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.post("/api/style", async (req, res) => {
  try {
    const { default: fetch } = await import("node-fetch");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/outfit-image", async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: "Missing query" });

    const { default: fetch } = await import("node-fetch");
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page || 1}&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    const data = await response.json();
    const photo = data.photos?.[0];
    res.json({ imageUrl: photo?.src?.large || null });
  } catch (err) {
    res.status(500).json({ error: "Image fetch failed" });
  }
});

app.listen(3001, () => console.log("✅ Server running on port 3001"));