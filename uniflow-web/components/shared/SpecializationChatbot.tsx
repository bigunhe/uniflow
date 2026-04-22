'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

type Option = {
  label: string;
  action: () => void;
};

export function SpecializationChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi! I am the uniflow assistant. What is your specialization?',
    },
  ]);
  const [options, setOptions] = useState<Option[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, options, isOpen]);

  // Initial options
  useEffect(() => {
    if (messages.length === 1) {
      setOptions([
        { label: 'Software Engineering', action: () => handleSpecSelection('Software Engineering') },
        { label: 'Data Science', action: () => handleSpecSelection('Data Science') },
        { label: 'Cyber Security', action: () => handleSpecSelection('Cyber Security') },
        { label: 'Other', action: () => handleSpecSelection('Other') },
      ]);
    }
  }, [messages]);

  const addMessage = (sender: 'bot' | 'user', text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender, text }]);
  };

  const handleSpecSelection = (spec: string) => {
    setOptions([]);
    addMessage('user', spec);
    
    setTimeout(() => {
      addMessage('bot', `Awesome! ${spec} is a fantastic field. Before you connect with a mentor, do you have any quick questions?`);
      setOptions([
        { label: 'How do I find a mentor?', action: () => handleGeneralQuestion('How do I find a mentor?', 'You can browse our "Mentors" tab to find experts in your field. Once you select a mentor, you can send them a direct message!') },
        { label: 'What skills should I learn?', action: () => handleGeneralQuestion('What skills should I learn?', 'It depends on your goals! Mentors can provide personalized roadmaps, or you can check our resources section.') },
        { label: 'How does messaging work?', action: () => handleGeneralQuestion('How does messaging work?', 'Once you connect with a mentor, you will unlock a dedicated chat room to ask questions, share code, and schedule calls.') },
      ]);
    }, 600);
  };

  const handleGeneralQuestion = (question: string, answer: string) => {
    setOptions([]);
    addMessage('user', question);
    
    setTimeout(() => {
      addMessage('bot', answer);
      
      setTimeout(() => {
        setOptions([
          { label: 'How do I find a mentor?', action: () => handleGeneralQuestion('How do I find a mentor?', 'You can browse our "Mentors" tab to find experts in your field. Once you select a mentor, you can send them a direct message!') },
          { label: 'What skills should I learn?', action: () => handleGeneralQuestion('What skills should I learn?', 'It depends on your goals! Mentors can provide personalized roadmaps, or you can check our resources section.') },
          { label: 'I am ready to explore!', action: () => {
            setOptions([]);
            addMessage('user', 'I am ready to explore!');
            setTimeout(() => addMessage('bot', 'Great! Feel free to choose a specialization on this page and connect with a mentor when you are ready.'), 500);
          }},
        ]);
      }, 500);
    }, 600);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">uniflow Assistant</h3>
            <p className="text-[10px] text-indigo-100">Always here to help</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 bg-slate-50 overflow-y-auto max-h-[400px] min-h-[300px] flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] flex gap-2",
              msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.sender === 'user' ? "bg-indigo-100 text-indigo-600" : "bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
            )}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
              msg.sender === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-sm" 
                : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Options */}
        {options.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 self-end items-end w-full pl-10">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={opt.action}
                className="text-right px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded-full border border-indigo-200 transition-colors shadow-sm max-w-fit"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Disabled since it's button driven for now) */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          placeholder="Select an option above..."
          disabled
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none cursor-not-allowed"
        />
        <button disabled className="h-10 w-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center cursor-not-allowed">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
