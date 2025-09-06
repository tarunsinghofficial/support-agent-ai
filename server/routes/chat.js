const express = require("express");
const Chat = require("../models/Chat");
const { authenticateToken } = require("../middleware/auth");
const aiService = require("../services/aiService");

const router = express.Router();

// Send message and get AI response
router.post("/send", authenticateToken, async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat;

    // If chatId is provided, find existing chat, otherwise create new one
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      // Create new chat
      chat = new Chat({
        user: req.user._id,
        messages: [],
        title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
      });
    }

    // Add user message to chat
    chat.messages.push({
      role: "user",
      content: message.trim(),
    });

    // Get chat history for AI context (last 10 messages)
    const chatHistory = chat.messages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await aiService.generateResponse(message, chatHistory);

    // Add AI response to chat
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    // Save chat
    await chat.save();

    res.json({
      message: "Message sent successfully",
      chatId: chat._id,
      userMessage: {
        role: "user",
        content: message.trim(),
        timestamp: chat.messages[chat.messages.length - 2].timestamp,
      },
      aiResponse: {
        role: "assistant",
        content: aiResponse,
        timestamp: chat.messages[chat.messages.length - 1].timestamp,
      },
    });
  } catch (error) {
    console.error("Chat send error:", error);
    res.status(500).json({ message: "Server error while sending message" });
  }
});

// Get chat history for a specific chat
router.get("/history/:chatId", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error("Chat history error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching chat history" });
  }
});

// Get all chats for the user
router.get("/chats", authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("_id title messages createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50);

    // Format chats for response
    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      title: chat.title,
      lastMessage:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null,
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    res.json({
      chats: formattedChats,
    });
  } catch (error) {
    console.error("Chats list error:", error);
    res.status(500).json({ message: "Server error while fetching chats" });
  }
});

// Delete a chat
router.delete("/chats/:chatId", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Chat delete error:", error);
    res.status(500).json({ message: "Server error while deleting chat" });
  }
});

module.exports = router;
