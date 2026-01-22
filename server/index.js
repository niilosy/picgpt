import express from "express";
import fetch from "cross-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));

// Root route for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Analyze endpoint
app.post("/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Describe what’s in this photo. Give a guess where in the world you think it was taken ",
              },
              {
                type: "input_image",
                image_url: image,
              },
            ],
          },
        ],
      }),
    });

    const json = await response.json();

    const output =
      json.output?.[0]?.content?.find((c) => c.type === "output_text")?.text ||
      "No analysis returned.";

    res.json({ output });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

