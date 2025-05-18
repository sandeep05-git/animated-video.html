require('dotenv').config();
console.log("API Key Loaded:", process.env.ELEVENLABS_API_KEY ? "Yes" : "No");
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const PORT = 3000;
const API_KEY = process.env.ELEVENLABS_API_KEY;

const voiceByLanguage = {
  en: "21m00Tcm4TlvDq8ikWAM",  // You can customize voice IDs here
  hi: "21m00Tcm4TlvDq8ikWAM",
  ta: "21m00Tcm4TlvDq8ikWAM",
  te: "21m00Tcm4TlvDq8ikWAM",
  mr: "21m00Tcm4TlvDq8ikWAM"
};

app.post('/generate-audio', async (req, res) => {
  const { script, language } = req.body;
  
  if (!script || !language || !voiceByLanguage[language]) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceByLanguage[language]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.message || "Audio generation failed" });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="script_audio.mp3"'
    });
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
