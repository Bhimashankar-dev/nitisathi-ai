

const Chat = require("../models/Chat");

const generateAnswer = async (req, res) => {
  try {
    const { question, language } = req.body;
    const chatId = req.params.id;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing.",
      });
    }

    // Find chat belonging to the authenticated user or guest
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const selectedLanguage = language || "en-IN";

    const languageNames = {
      "en-IN": "English",
      "kn-IN": "Kannada",
      "hi-IN": "Hindi",
      "te-IN": "Telugu",
      "ta-IN": "Tamil",
      "mr-IN": "Marathi",
    };

    const languageName =
      languageNames[selectedLanguage] || "English";

    // Prepare conversation history
    const history = chat.messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    history.push({
      role: "user",
      parts: [{ text: question.trim() }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: history,
      config: {
        systemInstruction: `
You are NitiSathi AI, an Indian government information assistant.

Your job is to answer questions about Indian government schemes, laws, rights, scholarships, banking and public services.

IMPORTANT RESPONSE RULES:

1. Answer exactly what the user asks.
2. Keep answers short, clear and easy to understand.
3. Prefer 3 to 5 bullet points when useful.
4. Aim for 50 to 100 words.
5. Do not provide unrelated information or unnecessary background.
6. Do not repeat the user's question.
7. Give step-by-step instructions only when requested or necessary.
8. If the user asks a simple question, give a simple, direct answer.
9. Never invent government rules, eligibility criteria, deadlines or links.
10. If information is uncertain, clearly mention it.
11. Recommend official government sources for verification when relevant.
12. Never claim to be a government authority.

Respond in ${languageName}.
        `,
        maxOutputTokens: 350,
      },
    });

    const answer = response.text;

    if (!answer) {
      throw new Error("The AI did not generate a response.");
    }

    // Save user question and AI response
    chat.messages.push(
      {
        role: "user",
        content: question.trim(),
        language: selectedLanguage,
      },
      {
        role: "assistant",
        content: answer,
        language: selectedLanguage,
      }
    );

    // Set title from the first question
    if (chat.messages.length === 2 && chat.title === "New Chat") {
      chat.title = question.trim().slice(0, 50);
    }

    // Save without changing expiresAt
    await chat.save();

    res.status(200).json({
      success: true,
      answer,
      chat,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate an AI response. Please try again.",
    });
  }
};

module.exports = { generateAnswer };
