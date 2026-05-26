import React, { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';

const QUICK_QUESTIONS = [
  "What is the current price for Robusta Banana?",
  "Do you ship internationally?",
  "How can I place a bulk order?",
  "Can I request a sample?",
  "What is a Thar (bunch)?",
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = "918925011054";

  const handleSend = (text) => {
    const finalMsg = text || message;
    if (!finalMsg.trim()) return;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMsg)}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] bg-white border border-[#E8E0D0] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] fade-in">
          {/* Header */}
          <div className="bg-[#10B981] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold font-display text-sm">Alphovins Support</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-white text-sm leading-relaxed">
              👋 Hi! How can we help you today? Choose a question or type your own.
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 bg-[#F5F0E8] max-h-[220px] overflow-y-auto">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Common Questions</p>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-2.5 rounded-2xl bg-white border border-[#E8E0D0] text-sm text-[#374151] hover:border-[rgba(16,185,129,0.35)] hover:text-[#10B981] hover:bg-[#ECFDF5] transition-all duration-200 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#E8E0D0] bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-[#F5F0E8] border border-[#E8E0D0] rounded-2xl pl-4 pr-12 py-3 text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[rgba(16,185,129,0.15)] transition-all"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center hover:bg-[#059669] transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative">
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#10B981] animate-ping opacity-20" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-[#374151] rotate-90' : 'bg-[#10B981]'
          }`}
        >
          {isOpen ? <X className="text-white" size={22} /> : <MessageCircle className="text-white fill-white/20" size={24} />}
        </button>
      </div>
    </div>
  );
}
