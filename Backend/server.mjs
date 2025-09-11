import express from "express";
import cors from "cors";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json()); // built-in body parser
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    res.json({ text });
  } catch (err) {
    console.error("Error in /api/generate:", err);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

