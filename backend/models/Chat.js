
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  language: {
    type: String,
    default: "en-IN",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    category: {
      type: String,
      default: "General",
    },

    messages: [messageSchema],

    // Guest conversations expire automatically
    expiresAt: {
      type: Date,
      default: null,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);

