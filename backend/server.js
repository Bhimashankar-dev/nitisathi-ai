
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/chats", chatRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NitiSathi AI backend is running!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NitiSathi AI backend running on port ${PORT}`);
});

