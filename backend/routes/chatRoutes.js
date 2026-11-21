const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.use(protect);

const { generateAnswer } = require("../controllers/aiController");

const {
  createChat,
  getChats,
  getChatById,
  addMessage,
  renameChat,
  deleteChat,
} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/", getChats);
router.get("/:id", getChatById);
router.post("/:id/messages", addMessage);
router.post("/:id/ask", generateAnswer);

// Rename and delete
router.patch("/:id", renameChat);
router.delete("/:id", deleteChat);

module.exports = router;


