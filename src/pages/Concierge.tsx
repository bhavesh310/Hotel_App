import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const suggestedPrompts = [
  "Find me a romantic hotel in Udaipur under ₹15,000",
  "Book room service — I want breakfast at 8am",
  "What's the checkout time? Can I extend?",
  "Show me things to do near the hotel today",
];

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: "Good morning, Arjun. Welcome back to Roamio. I'm here to make your stay extraordinary. How can I assist you today?",
    chips: ["Book a table", "Extend checkout", "Local experiences", "Room service"],
  },
];

export default function Concierge() {
  const [messages, setMessages] = useState(initialMessages as any[]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const responses: Record<string, string> = {
        "book a table": "I've checked availability at Drift Restaurant. They have a table for 2 at 8:00 PM and 9:00 PM tonight. Shall I confirm the 8 PM reservation?",
        "extend checkout": "Your current checkout is March 25 at 12:00 PM. I can extend it to 2:00 PM complimentary, or 4:00 PM for ₹1,500. Which would you prefer?",
        "room service": "Our room service menu is available 24/7. Breakfast highlights: Eggs Benedict ₹650, Continental Spread ₹850, South Indian Thali ₹550. What would you like?",
        "local experiences": "Based on your profile, I'd suggest: Sunset cruise (₹2,500/person), Spice plantation tour (₹800/person), or Old Goa heritage walk (free, 9am daily).",
      };
      const key = text.toLowerCase();
      const reply = Object.keys(responses).find(k => key.includes(k));
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: reply ? responses[reply] : `I'm processing your request: "${text}". Let me check the best options for you right away.`,
        chips: ["Book a table", "Extend checkout", "Local experiences"],
      }]);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-aura-black pt-16 flex flex-col">
      {/* Header */}
      <div className="border-b border-aura-cream/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-fraunces text-xl text-aura-cream">AI Concierge</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
              <span className="font-syne text-[9px] text-aura-cream/30 tracking-[2px] uppercase">Online · Instant Response</span>
            </div>
          </div>
          <div className="w-9 h-9 bg-aura-gold/10 border border-aura-gold/20 flex items-center justify-center">
            <Sparkles size={14} className="text-aura-gold" />
          </div>
        </div>
      </div>

      {/* Suggested prompts (shown initially) */}
      {messages.length === 1 && (
        <div className="max-w-3xl mx-auto w-full px-6 pt-6">
          <p className="section-label mb-4">Suggested</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedPrompts.map((p, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => sendMessage(p)}
                className="p-4 border border-aura-cream/8 text-left hover:border-aura-gold/25 hover:bg-aura-gold/3 transition-all group"
              >
                <p className="font-syne text-xs text-aura-cream/50 group-hover:text-aura-cream/80 leading-relaxed">{p}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.role === 'ai' ? 'w-full' : ''}`}>
                  {msg.role === 'ai' && (
                    <p className="section-label mb-2 ml-1">✦ AURA AI</p>
                  )}
                  <div className={`px-5 py-4 ${
                    msg.role === 'ai'
                      ? 'bg-aura-surface border border-aura-gold/15 text-aura-cream/70'
                      : 'bg-aura-lift border border-aura-cream/8 text-aura-cream/80 text-right'
                  }`}>
                    <p className="font-syne text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.chips && (
                    <div className="flex gap-2 flex-wrap mt-3">
                      {msg.chips.map((chip: string) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="font-syne text-[9px] tracking-[2px] uppercase px-3 py-1.5 border border-aura-gold/15 text-aura-gold/70 hover:border-aura-gold/40 hover:text-aura-gold transition-colors bg-aura-gold/4"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="bg-aura-surface border border-aura-gold/15 px-5 py-4">
                  <p className="section-label mb-2">✦ AURA AI</p>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full bg-aura-gold typing-dot`} style={{ animationDelay: `${i * 0.2}s`, animation: 'dot-bounce 1.2s infinite' }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-aura-cream/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about your stay..."
            className="flex-1 bg-aura-lift border border-aura-cream/8 px-5 py-3.5 font-syne text-sm text-aura-cream/70 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30 transition-colors"
          />
          <button onClick={() => sendMessage(input)} className="btn-gold px-5 flex items-center justify-center">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
