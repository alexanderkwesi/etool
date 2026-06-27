import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import "./AIHelper.css";

const AIHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: `
            You are a helpful documentation assistant for DocRevisor. 
            DocRevisor is an Engineering File Management tool.
            Key Features: File conversion (CAD, STEP, DWP), File Viewing, File Comparison (Premium only), Encryption (using Date of Birth).
            Plans: Basic (Begin), Standard, Premium.
            The UI is color-coded: Basic (Grey), Standard (Blue), Premium (Orange).
            Provide concise, professional answers based on this documentation context.
          `,
          temperature: 0.7,
        },
      });

      const aiMessage = {
        role: "assistant",
        content: response.text || "I'm sorry, I couldn't process that request.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-helper-container">
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="ai-toggle-button">
        {isOpen ? (
          <svg
            className="ai-toggle-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="ai-toggle-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-status-indicator"></div>
            DocRevisor Assistant
          </div>

          {/* Messages Container */}
          <div className="ai-messages-container">
            {messages.length === 0 && (
              <p className="ai-empty-state">
                Ask me anything about DocRevisor's features or plans!
              </p>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message-container ${msg.role}`}>
                <div className={`ai-message-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="ai-loading-container">
                <div className="ai-loading-bubble">
                  <div className="ai-loading-dot"></div>
                  <div className="ai-loading-dot"></div>
                  <div className="ai-loading-dot"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="ai-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="ai-input"
            />
            <button
              onClick={handleSend}
              className="ai-send-button"
              disabled={isLoading}
            >
              <svg
                className="ai-send-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHelper;
