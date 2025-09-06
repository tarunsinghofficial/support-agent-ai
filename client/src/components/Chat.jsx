import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showChatList, setShowChatList] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's chats on component mount
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      console.log("Loading chats...", {
        user,
        token: localStorage.getItem("token"),
      });
      const response = await axios.get(`${API_BASE_URL}/api/chat/chats`);
      setChats(response.data.chats);
    } catch (error) {
      console.error("Error loading chats:", error);
      console.error("Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        headers: error.config?.headers,
      });
    }
  };

  const loadChatHistory = async (chatId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/chat/history/${chatId}`
      );
      setMessages(response.data.chat.messages);
      setCurrentChatId(chatId);
      setShowChatList(false);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowChatList(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    // Add user message to UI immediately
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat/send`, {
        message: userMessage,
        chatId: currentChatId,
      });

      // Add AI response to messages
      setMessages((prev) => [...prev, response.data.aiResponse]);

      // Update current chat ID if it's a new chat
      if (!currentChatId) {
        setCurrentChatId(response.data.chatId);
      }

      // Reload chats to show the new/updated chat
      loadChats();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the user message if sending failed
      setMessages((prev) => prev.slice(0, -1));
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          showChatList ? "w-80" : "w-0"
        } transition-all duration-300 bg-white shadow-lg overflow-hidden`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              onClick={startNewChat}
              className="bg-primary-600 hover:bg-primary-700 px-3 py-1 text-sm text-white rounded"
            >
              New Chat
            </button>
          </div>
        </div>
        <div className="h-full pb-20 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChatHistory(chat.id)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                currentChatId === chat.id
                  ? "bg-primary-50 border-primary-200"
                  : ""
              }`}
            >
              <div className="text-sm font-medium truncate">{chat.title}</div>
              <div className="mt-1 text-xs text-gray-500">
                {chat.messageCount} messages • {formatTime(chat.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowChatList(!showChatList)}
                className="hover:bg-gray-100 p-2 rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold">AI Customer Support</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="hover:bg-red-700 px-3 py-1 text-sm text-white bg-red-600 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mt-20 text-center text-gray-500">
              <div className="mb-4 text-6xl">🤖</div>
              <h3 className="mb-2 text-xl font-medium">
                Welcome to AI Support!
              </h3>
              <p>Start a conversation by typing your message below.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-800 shadow-sm border"
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-primary-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 text-gray-800 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin border-primary-600 w-4 h-4 border-b-2 rounded-full"></div>
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-white rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
