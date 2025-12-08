require("dotenv").config();
const express = require("express");
const fetch = require("cross-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/analyze", async (req, res) => {
  const { image } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_image", image_url: image },
            { type: "input_text", text: "Describe what’s in this photo. Give a guess where in the world you think it was taken" }
          ]
        }
      ]
    })
  });

  const json = await response.json();
  const output =
    json.output?.[0]?.content?.find(c => c.type === "output_text")?.text;

  res.json({ output });
});

app.listen(3000, () => console.log("Server running on port 3000"));
