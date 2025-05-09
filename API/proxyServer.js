import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/deezer", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.deezer.com/chart/0/tracks?limit=10`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
