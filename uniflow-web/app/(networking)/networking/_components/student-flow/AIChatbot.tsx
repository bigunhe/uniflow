"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

const SUGGESTIONS = [
  "What skills are needed for Data Science?",
  "Best career path in AI?",
  "How to prepare for a Cyber Security interview?",
  "What is the difference between IT and Computer Science?"
];

const MOCK_RESPONSES: Record<string, string> = {
  "What skills are needed for Data Science?": "Key skills for Data Science include Python, R, SQL, machine learning algorithms, data visualization (Tableau, PowerBI), and strong statistical knowledge.",
  "Best career path in AI?": "A common AI path: Software Engineer -> Machine Learning Engineer -> AI Researcher or Lead AI Engineer. Focus on deep learning frameworks like PyTorch or TensorFlow.",
  "How to prepare for a Cyber Security interview?": "Review OWASP Top 10, understand network protocols (TCP/IP), practice CTF challenges, and be ready to explain how you'd secure a multi-tier application.",
  "What is the difference between IT and Computer Science?": "Computer Science focuses on the logic and design of software/algorithms, while IT focuses on installing, maintaining, and improving computer systems and networks."
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "bot", text: "Hi! I'm your Career AI Assistant. Ask me about skills, roles, or career paths!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock response delay
    setTimeout(() => {
      const responseText = MOCK_RESPONSES[text] || "That's a great question! While I'm just a demo AI right now, a mentor in this field could give you a fantastic answer.";
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: "bot", text: responseText };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-xl ring-2 ring-white/10 transition-transform hover:scale-110 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f141f] shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(99,102,241,0.2)] text-[#818cf8]">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4fb]">Career AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[rgba(168,184,208,0.7)] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#6366f1] text-white rounded-br-none' 
                    : 'bg-[rgba(255,255,255,0.08)] text-[#d4dde8] rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 space-y-2">
              <p className="text-xs text-[rgba(168,184,208,0.6)]">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.05)] px-3 py-1.5 text-[11px] text-[#818cf8] transition hover:bg-[rgba(99,102,241,0.15)] text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 p-3 bg-[rgba(255,255,255,0.02)]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask anything..."
                className="flex-1 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm text-[#f0f4fb] outline-none placeholder:text-[rgba(168,184,208,0.5)] focus:ring-1 focus:ring-[#6366f1]"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366f1] text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
