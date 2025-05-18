const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ELEVENLABS_API_KEY;

const voiceByLanguage = {
  en: "21m00Tcm4TlvDq8ikWAM",
  hi: "21m00Tcm4TlvDq8ikWAM",
  ta: "21m00Tcm4TlvDq8ikWAM",
  te: "21m00Tcm4TlvDq8ikWAM",
  mr: "21m00Tcm4TlvDq8ikWAM"
};

app.post('/generate-audio', async (req, res) => {
  try {
    const { script, language } = req.body;
    if (!script) return res.status(400).json({ error: "Script is required" });

    const voiceId = voiceByLanguage[language] || voiceByLanguage['en'];

    let stability = 0.5;
    let similarity_boost = 0.75;
    const lowerScript = script.toLowerCase();
    if (lowerScript.includes("happy")) {
      stability = 0.3; similarity_boost = 0.85;
    } else if (lowerScript.includes("angry")) {
      stability = 0.2; similarity_boost = 0.6;
    } else if (lowerScript.includes("sad")) {
      stability = 0.7; similarity_boost = 0.4;
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v1",
        voice_settings: { stability, similarity_boost }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: errData.detail || 'Audio generation failed' });
    }

    const audioBuffer = await response.arrayBuffer();

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="script_audio.mp3"',
    });

    res.send(Buffer.from(audioBuffer));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
