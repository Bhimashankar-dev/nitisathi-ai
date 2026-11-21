
const Chat = require("../models/Chat");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { title, category } = req.body;

    const chat = await Chat.create({
  userId: req.userId,
  title: title || "New Chat",
  category: category || "General",
  messages: [],

  // Guest chats expire after 12 hours
  expiresAt:
    req.userRole === "guest"
      ? new Date(Date.now() + 12 * 60 * 60 * 1000)
      : null,
});

    res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create chat.",
    });
  }
};

// Get only the logged-in user's chats
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.userId,
    })
      .select("-messages")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load chats.",
    });
  }
};

// Get one chat belonging to the logged-in user
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load conversation.",
    });
  }
};

// Add a message to the user's own chat
const addMessage = async (req, res) => {
  try {
    const { role, content, language } = req.body;

    if (!["user", "assistant"].includes(role) || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid role and message content are required.",
      });
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    chat.messages.push({
      role,
      content: content.trim(),
      language: language || "en-IN",
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: "Message saved successfully.",
      chat,
    });
  } catch (error) {
    console.error("Add Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to save message.",
    });
  }
};

// Rename only the user's own chat
const renameChat = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Chat title cannot be empty.",
      });
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      message: "Chat renamed successfully.",
      chat,
    });
  } catch (error) {
    console.error("Rename Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to rename chat.",
    });
  }
};

// Delete only the user's own chat
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete chat.",
    });
  }
};

module.exports = {
  createChat,
  getChats,
  getChatById,
  addMessage,
  renameChat,
  deleteChat,
};


