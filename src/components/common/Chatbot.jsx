import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Chatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: t('bot_greeting')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const suggestedQuestions = [
    "How does REVastra work?",
    "What is Prohibited Waste?",
    "How are Green Coins calculated?",
    "How do I redeem grocery rewards?",
    "How to buy materials on B2B Marketplace?",
    "How does Food Rescue work for NGOs?"
  ];

  const knowledgeBase = [
    {
      keywords: ['how', 'works', 'work', 'overview', 'ecosystem', 'working'],
      response: "REVASTRA connects Waste Givers, Collectors, Resource Recovery Centres, B2B Buyers, and NGOs into a circular ecosystem. Waste is identified via QR code → Collected → Segregated & Quality Graded (Grade A/B/C) → Published as Digital Inventory on B2B Marketplace → Verified Green Coins awarded to Waste Givers for grocery redemption."
    },
    {
      keywords: ['prohibited', 'medical', 'hazardous', 'chemical', 'explosive', 'radioactive', 'biohazard', 'not accepted'],
      response: "Prohibited Waste materials NOT accepted on REVASTRA include: Medical/biomedical waste, Explosives/fireworks, Highly hazardous chemicals/acids, Industrial toxic sludge, Radioactive materials, and Human/animal biological waste. Follow authorized municipal disposal procedures for hazardous waste."
    },
    {
      keywords: ['coin', 'coins', 'green coin', 'calculation', 'rate', 'rupee', 'value'],
      response: "Green Coins Rule: 100 Green Coins = ₹1 INR value! Waste Givers earn up to 50 Base Coins per day + fixed material bonuses (E-Waste +50, Coconut +30, Metal +25, Plastic +20, PET +15, Cardboard +15, Paper +10, etc.) + Regular streak bonuses every 3 days. All coins are verified by backend business logic after RRC weighing."
    },
    {
      keywords: ['grocery', 'redeem', 'redemption', 'rewards', 'rice', 'sugar', 'atta', 'oil'],
      response: "You can manually redeem Green Coins for essential groceries like Rice, Sugar, Wheat Atta, Dal, Oil, Salt, Rava, Poha, Pulses, Tea, and Biscuits. Select item & quantity → Confirm redemption → Coins are deducted → Unique RRC pickup code is generated!"
    },
    {
      keywords: ['qr', 'code', 'identity', 'sticker'],
      response: "Every registered waste generator receives a unique QR Identity Code (e.g. QR-WG-1001). Print/display your QR tag for the collector to scan during pickup to verify source location."
    },
    {
      keywords: ['marketplace', 'buy', 'buyer', 'recycler', 'b2b', 'inventory', 'purchase'],
      response: "B2B Marketplace allows recyclers and manufacturers to purchase Admin-verified quality-graded materials (Grade A/B/C). Recyclers place purchase orders, and inventory updates automatically!"
    },
    {
      keywords: ['food', 'ngo', 'rescue', 'surplus', 'meals', 'restaurant'],
      response: "Restaurants, hostels, and cafeterias can list safe surplus food with safe-until timestamps. Verified NGOs receive real-time alerts, accept food donations, and schedule pickups to feed communities!"
    },
    {
      keywords: ['role', 'roles', 'account', 'login', 'signup', 'collector', 'admin'],
      response: "REVastra features 5 separate roles: 1. Waste Giver, 2. Collector, 3. Recovery Centre, 4. B2B Buyer, 5. NGO, plus Admin operations. Use the 'Switch Role' button in top navigation for instant demo role switching!"
    }
  ];

  const getBotResponse = (query) => {
    const qLower = query.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some((k) => qLower.includes(k))) {
        return item.response;
      }
    }
    return "I am the REVASTRA Assistant. You can ask me about Waste Submission, Prohibited Materials, Green Coins (100 coins = ₹1), Grocery Redemption, QR Codes, B2B Marketplace, Food Rescue, or Role Workflows!";
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    setTimeout(() => {
      const replyText = getBotResponse(text);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: replyText };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-2xl hover:scale-105 transition-all duration-300 border border-emerald-400/40 flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline text-xs font-extrabold tracking-wide">REVASTRA Assistant</span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 glass-panel bg-slate-900/95 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">REVASTRA Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online • Eco AI Support
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-md font-medium'
                      : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[10px] font-medium text-slate-300 whitespace-nowrap border border-slate-800 transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about Green Coins, Prohibited Waste, Rewards..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
