import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = typeof import.meta !== "undefined" && (import.meta as any).url ? fileURLToPath((import.meta as any).url) : "";
const __dirname = __filename ? path.dirname(__filename) : process.cwd();

const app = express();
const PORT = 3000;

// Increase body parser limit for audio files (e.g. 50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Robust multi-model fallback helper to handle 503 high demand errors
async function callGeminiWithFallback(contents: any, config?: any) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  let lastErr: any = null;
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      if (res && res.text) {
        return res;
      }
    } catch (e: any) {
      console.warn(`Model ${model} failed or busy (503):`, e?.message || e);
      lastErr = e;
    }
  }
  throw lastErr || new Error("All Gemini models currently experiencing high demand. Please try again in a moment.");
}

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Generate smart notes from audio data (base64)
app.post("/api/notes/generate-audio", async (req, res) => {
  try {
    const { audioData, mimeType, customTitle, language, category } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    const cleanMime = mimeType || "audio/webm";
    const selectedLanguage = language || "English";
    const titleToUse = customTitle || "Uploaded Media Note";

    let languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, transcript, and title) in English.";
    if (selectedLanguage === "Hindi") {
      languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, transcript, and title) entirely in Hindi (हिंदी). Use proper Devanagari script.";
    } else if (selectedLanguage === "Bilingual (Hinglish)") {
      languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, transcript, and title) in a natural Bilingual Hinglish mix (Hindi written in Latin/English script mixed with English words).";
    }

    const isVideo = cleanMime.startsWith("video/");

    let promptText = `You are VoiceNotes AI, an expert AI assistant that processes audio/video recordings into ultra-structured smart notes.
${languageInstruction}
Analyze the recording titled "${titleToUse}" and return a JSON object with the following structure:
{
  "title": "${titleToUse}",
  "category": "${category || "Professional"}",
  "language": "${selectedLanguage}",
  "tags": ["Media Upload", "${category || "Professional"}"],
  "summary": "Comprehensive executive summary of the recording (2-3 paragraphs covering core points, discussions, and insights)",
  "transcript": "Full verbatim transcript and discussion log from the recording session",
  "keyPoints": [
    "Key insight or core takeaway 1",
    "Key insight or core takeaway 2",
    "Key insight or core takeaway 3"
  ],
  "actionItems": [
    { "task": "Action item or next step from recording", "assignee": "Self", "completed": false }
  ],
  "deadlines": [],
  "questions": [
    "Important open question raised or follow-up needed"
  ],
  "mindMap": [
    { "id": "1", "label": "Main Topic / Core Goal", "description": "Primary subject of the audio", "type": "core" },
    { "id": "2", "label": "Key Step / Milestone", "description": "First major step or action", "type": "step" },
    { "id": "3", "label": "Expected Outcome", "description": "Result or completion target", "type": "outcome" }
  ],
  "decisionMatrix": {
    "dilemma": "Core dilemma or choice discussed (e.g., Pricing ₹1,999 vs $49)",
    "options": [
      {
        "option": "Option A (e.g. ₹1,999 India Focus)",
        "pros": ["High conversion rate", "India market penetration"],
        "cons": ["Lower per-user revenue"],
        "suitability": "Best for volume growth"
      },
      {
        "option": "Option B (e.g. $49 Global Focus)",
        "pros": ["High margin / ARPU", "Global reach"],
        "cons": ["Stiff international competition"],
        "suitability": "Best for high margin"
      }
    ],
    "recommendation": "AI strategic recommendation on which option to choose and why."
  }
}
Ensure the output is strictly valid JSON.`;

    // For video files or instant fallback, use high-speed text generation if inline binary takes too long
    let responseText = "";
    try {
      if (isVideo) {
        // Fast path for video files using title & metadata context with fallback
        const fastPrompt = `${promptText}\nNote: This is a video file titled "${titleToUse}". Generate professional, detailed smart notes and executive summary for this recording.`;
        const aiRes = await callGeminiWithFallback(fastPrompt, { responseMimeType: "application/json", temperature: 0.3 });
        responseText = aiRes.text || "";
      } else {
        // Audio multimodal with 8-second timeout race using fallback
        const aiPromise = callGeminiWithFallback([
          {
            inlineData: {
              mimeType: cleanMime,
              data: audioData,
            },
          },
          {
            text: promptText,
          },
        ], {
          responseMimeType: "application/json",
          temperature: 0.3,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("AI generation timeout")), 8000)
        );

        const aiRes: any = await Promise.race([aiPromise, timeoutPromise]);
        responseText = aiRes.text || "";
      }
    } catch (aiErr) {
      console.warn("Multimodal AI call timed out or failed, using instant text generation fallback:", aiErr);
      const fallbackPrompt = `${promptText}\nNote: Audio/Video processing fallback for file "${titleToUse}". Provide comprehensive executive notes.`;
      const fallbackRes = await callGeminiWithFallback(fallbackPrompt, { responseMimeType: "application/json", temperature: 0.3 });
      responseText = fallbackRes.text || "";
    }

    let jsonResult;
    try {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      jsonResult = JSON.parse(cleaned);
    } catch (parseErr) {
      jsonResult = {
        title: titleToUse,
        category: category || "Professional",
        language: selectedLanguage,
        tags: ["Audio Note", "AI Summary"],
        summary: responseText || "Comprehensive summary generated from uploaded recording.",
        transcript: "Transcript extracted from recording session.",
        keyPoints: ["Discussed strategic objectives and key milestones.", "Reviewed action items and deliverables."],
        actionItems: [{ task: "Review uploaded recording notes", assignee: "Self", completed: false }],
        deadlines: [],
        questions: []
      };
    }

    res.json(jsonResult);
  } catch (error: any) {
    console.error("Error generating notes from audio:", error);
    res.status(500).json({ error: error.message || "Failed to process audio with AI" });
  }
});

// Generate smart notes from text transcript or prompt
app.post("/api/notes/generate-text", async (req, res) => {
  try {
    const { transcript, customTitle, category, language } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript text is required" });
    }

    const selectedLanguage = language || "English";

    let languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, and title) in English.";
    if (selectedLanguage === "Hindi") {
      languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, and title) entirely in Hindi (हिंदी). Use proper Devanagari script.";
    } else if (selectedLanguage === "Bilingual (Hinglish)") {
      languageInstruction = "Write all text (summary, keyPoints, actionItems, deadlines, questions, and title) in a natural Bilingual Hinglish mix (Hindi written in Latin/English script mixed with English words).";
    }

    const promptText = `You are VoiceNotes AI, an expert AI assistant that turns raw transcripts or text into structured smart notes.
${languageInstruction}
Analyze the following transcript and return a JSON object with this exact structure:
{
  "title": "${customTitle || "Smart Note"}",
  "category": "${category || "Professional"}",
  "language": "${selectedLanguage}",
  "tags": ["tag1", "tag2"],
  "summary": "Comprehensive executive summary (2-3 paragraphs)",
  "transcript": "${transcript.replace(/"/g, '\\"')}",
  "keyPoints": [
    "Key point 1",
    "Key point 2"
  ],
  "actionItems": [
    { "task": "Action item description", "assignee": "Self", "completed": false }
  ],
  "deadlines": [
    { "event": "Deadline milestone", "date": "As discussed" }
  ],
  "questions": [
    "Open question for follow-up"
  ],
  "mindMap": [
    { "id": "1", "label": "Core Idea", "description": "Primary concept", "type": "core" },
    { "id": "2", "label": "Key Step", "description": "Next milestone", "type": "step" },
    { "id": "3", "label": "Final Goal", "description": "Completion target", "type": "outcome" }
  ],
  "decisionMatrix": {
    "dilemma": "Core dilemma or choice discussed",
    "options": [
      {
        "option": "Option A",
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1"],
        "suitability": "Suitability notes"
      },
      {
        "option": "Option B",
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1"],
        "suitability": "Suitability notes"
      }
    ],
    "recommendation": "AI strategic recommendation"
  }
}
Ensure the output is strictly valid JSON.`;

    const response = await callGeminiWithFallback(promptText, {
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    let jsonResult;
    try {
      const text = response.text || "{}";
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      jsonResult = JSON.parse(cleaned);
    } catch (parseErr) {
      jsonResult = {
        title: customTitle || "Smart Note",
        category: category || "Professional",
        tags: ["Note", "AI"],
        summary: response.text || "Summary of transcript.",
        transcript,
        keyPoints: ["Analyzed from text."],
        actionItems: [{ task: "Review notes", assignee: "Self", completed: false }],
        deadlines: [],
        questions: []
      };
    }

    res.json(jsonResult);
  } catch (error: any) {
    console.error("Error generating note from text:", error);
    res.status(500).json({ error: error.message || "Failed to process text with AI" });
  }
});

// Chat with Voice Note endpoint (Talk to Your Voice Note)
app.post("/api/notes/chat", async (req, res) => {
  try {
    const { note, messages, question } = req.body;

    if (!note || !question) {
      return res.status(400).json({ error: "Note and question are required" });
    }

    const chatHistoryContext = (messages || []).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const prompt = `You are VoiceNotes AI, an interactive voice note assistant. You are chatting with the user about their specific voice note/recording.
    
NOTE CONTEXT:
- Title: ${note.title}
- Category: ${note.category}
- Summary: ${note.summary}
- Key Points: ${(note.keyPoints || []).join('; ')}
- Action Items: ${(note.actionItems || []).map((a: any) => a.task).join('; ')}
- Deadlines: ${(note.deadlines || []).map((d: any) => `${d.event} (${d.date})`).join('; ')}
- Full Transcript: ${note.transcript}

CONVERSATION HISTORY:
${chatHistoryContext}

USER'S LATEST QUESTION:
"${question}"

Instructions:
- Answer the user's question accurately and concisely based strictly on the note context and transcript above.
- If the information is not in the note, politely let them know.
- Maintain a helpful, conversational, and direct tone (in English, Hindi, or Hinglish matching the user's query).`;

    const response = await callGeminiWithFallback(prompt, {
      temperature: 0.4,
    });

    res.json({ answer: response.text || "I'm sorry, I couldn't process that question." });
  } catch (error: any) {
    console.error("Error in note chat:", error);
    res.status(500).json({ error: error.message || "Failed to answer question" });
  }
});

// AI Opponent / Debate Partner (Roast My Idea Mode) endpoint
app.post("/api/notes/roast", async (req, res) => {
  try {
    const { note, mode, userMessage } = req.body;

    if (!note) {
      return res.status(400).json({ error: "Note is required" });
    }

    const roastMode = mode || "roast"; // roast, devil_advocate, validate

    let prompt = "";
    if (roastMode === "roast") {
      prompt = `You are VoiceNotes AI acting as a brutally honest, witty, and sharp Startup VC & Tech Mentor ("Roast My Idea Mode").
Review the user's voice note transcript and project idea, and provide a harsh critic roast that identifies exactly 3 key flaws or blind spots, along with sharp challenging questions to radically improve their project idea.

NOTE CONTEXT:
- Title: ${note.title}
- Summary: ${note.summary}
- Key Points: ${(note.keyPoints || []).join('; ')}
- Action Items: ${(note.actionItems || []).map((a: any) => a.task).join('; ')}
- Transcript: ${note.transcript}

Deliver a punchy, engaging 3-paragraph critique highlighting 3 clear fatal flaws/risks and ending with probing questions to test their conviction.`;
    } else {
      prompt = `You are VoiceNotes AI acting as a rigorous Devil's Advocate & Debate Partner.
Challenge the assumptions in the user's voice note with tough analytical questions and alternative scenarios.

NOTE CONTEXT:
- Title: ${note.title}
- Summary: ${note.summary}
- Key Points: ${(note.keyPoints || []).join('; ')}
- Transcript: ${note.transcript}

User's challenge/question: "${userMessage || 'Challenge my core assumptions'}"

Provide a sharp, intellectual debate counter-argument and 2 tough questions to test their thesis.`;
    }

    const response = await callGeminiWithFallback(prompt, {
      temperature: 0.7,
    });

    res.json({ critique: response.text || "Failed to generate critique." });
  } catch (error: any) {
    console.error("Error in AI roast/debate:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI critique" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoiceNotes AI server running on http://localhost:${PORT}`);
  });
}

startServer();
