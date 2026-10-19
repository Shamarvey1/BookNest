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
  }, [messages, loading]);

  const handleSendMessage = async () => {
    const textToSend = input.trim();
    if (!textToSend || !currentText || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    const history = messages
      .slice(1)
      .filter((m) => m.content)
      .slice(-6)
      .map((m) => ({
        role: m.type === "ai" ? "assistant" : "user",
        content: m.content,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendAIQuestion({
        question: textToSend,
        context: currentText,
        bookTitle,
        bookAuthors,
        history,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: error?.message || "AI request failed.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
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
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-icon">✨</span>
          AI Assistant
        </div>
        {onClose && (
          <button
            type="button"
            className="ai-close-btn"
            onClick={onClose}
            aria-label="Close AI Assistant"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
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
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-section">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about the page..."
          className="ai-input"
          disabled={loading || !currentText}
        />
        <button
          type="button"
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
