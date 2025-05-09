// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";

// const app = express();
// app.use(cors());

// app.get("/deezer", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://api.deezer.com/chart/0/tracks?limit=10`
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3000, () => console.log("Proxy server running on port 3000"));

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// Configure CORS for Cyclic
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD"],
    allowedHeaders: ["Range", "Content-Type"],
    exposedHeaders: ["Content-Length", "Content-Range"],
  })
);

// Proxy endpoint
app.get("/deezer/*", async (req, res) => {
  try {
    const path = req.params[0];
    const targetUrl = `https://cdnt-preview.dzcdn.net/${path}`;

    const response = await fetch(targetUrl, {
      headers: {
        Range: req.headers.range || "",
      },
    });

    // Forward headers
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.headers.get("content-length"),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000",
    });

    response.body.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error");
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
