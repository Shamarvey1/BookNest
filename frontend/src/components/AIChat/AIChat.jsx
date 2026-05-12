import React, { useState, useEffect, useRef } from "react";
import "./AIChat.css";
import { sendAIQuestion } from "../../services/aiService";

function AIChat({ currentText, bookTitle, bookAuthors, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hi! I'm your AI Reading Assistant. Ask me anything about the current page!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !currentText || loading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendAIQuestion({
        question: input,
        context: currentText,
        bookTitle,
        bookAuthors,
      });

      const aiMessage = {
        id: messages.length + 2,
        type: "ai",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: "ai",
        content: error?.message || "AI request failed.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-icon">✨</span>
          AI Assistant
        </div>
        {onClose && (
          <button
            className="ai-close-btn"
            onClick={onClose}
            aria-label="Close AI Assistant"
          >
            ✕
          </button>
        )}
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-message-wrapper ${msg.type}`}>
            <div className={`ai-message ${msg.type}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-message-wrapper ai">
            <div className="ai-message ai loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-section">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the page..."
          className="ai-input"
          rows="1"
          disabled={loading || !currentText}
        />
        <button
          onClick={handleSendMessage}
          className="ai-send-btn"
          disabled={!input.trim() || loading || !currentText}
          aria-label="Send message"
        >
          {loading ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}

export default AIChat;
