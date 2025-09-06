const axios = require("axios");

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = "https://openrouter.ai/api/v1";
  }

  // Generate AI response using OpenRouter
  async generateResponse(userMessage, chatHistory = []) {
    try {
      if (!this.apiKey) {
        console.log("No API key found, using fallback response");
        return "Hello! I'm your AI assistant. To enable AI responses, please add your OpenRouter API key to the .env file.";
      }

      // Simple message preparation
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful customer support assistant. Be friendly and helpful.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      // Use a simple, reliable model
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "google/gemini-flash-1.5",
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Support Chat",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(
        "AI Error:",
        error.response?.data?.error?.message || error.message
      );

      // Simple fallback responses
      const fallbackResponses = [
        "I'm here to help! How can I assist you today?",
        "Thanks for your message! I'm working on getting back to you.",
        "Hello! I'm your AI assistant. What can I help you with?",
        "I'm ready to help! What would you like to know?",
      ];

      return fallbackResponses[
        Math.floor(Math.random() * fallbackResponses.length)
      ];
    }
  }
}

module.exports = new AIService();
