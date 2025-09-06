const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// health endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "AI support server is running!" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
    console.log("Please check your MONGODB_URI in the .env file");
    process.exit(1);
  }
}

startServer();
