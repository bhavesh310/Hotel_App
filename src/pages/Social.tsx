import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { friendsFeed } from '@/data/hotels';
import { Star, Heart, MessageCircle, TrendingUp } from 'lucide-react';

const tabs = ['All Activity', 'Hotels', 'Wishlists', 'Recommendations'];

const tripTypeColors: Record<string, string> = {
  Business: '#8B7FD4',
  Romantic: '#D47F8B',
  Vacation: '#52C5BD',
  Planning: '#D4A843',
  Family: '#7DC97A',
};

const topHotels = [
  { name: 'W Goa', friends: 4 },
  { name: 'Taj Lands End', friends: 3 },
  { name: 'RAAS Jodhpur', friends: 2 },
  { name: 'ITC Maratha', friends: 2 },
];

export default function Social() {
  const [activeTab, setActiveTab] = useState('All Activity');
  const [hoveredFriend, setHoveredFriend] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="section-label mb-4">Friend Activity</div>
        <h1 className="font-fraunces text-4xl text-aura-cream mb-8">Your Travel Network</h1>

        {/* Tabs */}
        <div className="flex border-b border-aura-cream/5 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-syne text-[9px] tracking-[2.5px] uppercase shrink-0 transition-all relative ${activeTab === tab ? 'text-aura-gold' : 'text-aura-cream/30 hover:text-aura-cream/60'}`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="social-tab" className="absolute bottom-0 left-0 right-0 h-px bg-aura-gold" />}
            </button>
          ))}
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Feed */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {friendsFeed.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="luxury-card p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 flex items-center justify-center font-fraunces text-sm shrink-0"
                        style={{ backgroundColor: item.color + '22', color: item.color, border: `1px solid ${item.color}33` }}
                        onMouseEnter={() => setHoveredFriend(item.id)}
                        onMouseLeave={() => setHoveredFriend(null)}
                      >
                        {item.initials}
                      </div>
                      {item.live && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-aura-green border-2 border-aura-surface rounded-full" />
                      )}

                      {/* Profile hover card */}
                      <AnimatePresence>
                        {hoveredFriend === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-12 left-0 z-50 surface-panel p-4 w-52 shadow-2xl"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 flex items-center justify-center font-fraunces text-xs" style={{ backgroundColor: item.color + '22', color: item.color }}>
                                {item.initials}
                              </div>
                              <div>
                                <p className="font-syne text-xs text-aura-cream/70">{item.name}</p>
                                <p className="font-syne text-[8px] text-aura-gold tracking-[1px]">Gold Member</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <p className="font-fraunces text-lg text-aura-cream">24</p>
                                <p className="font-syne text-[8px] text-aura-cream/25">Total Stays</p>
                              </div>
                              <div>
                                <p className="font-fraunces text-lg text-aura-gold">4.8★</p>
                                <p className="font-syne text-[8px] text-aura-cream/25">Avg Rating</p>
                              </div>
                            </div>
                            <button className="w-full font-syne text-[8px] tracking-[2px] uppercase border border-aura-gold/20 text-aura-gold py-2 hover:bg-aura-gold/5 transition-colors">
                              Message about this stay
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-syne text-xs text-aura-cream/70">
                          <span className="text-aura-cream/90 font-medium">{item.name}</span>
                          {' '}
                          <span className="text-aura-cream/40">{item.action}</span>
                          {' '}
                          <span className="inline-flex items-center border border-aura-gold/20 px-2 py-0.5 font-syne text-[9px] text-aura-gold bg-aura-gold/5 ml-1">
                            {item.hotel}
                          </span>
                        </p>
                        <span className="font-syne text-[9px] text-aura-cream/20 shrink-0">{item.time}</span>
                      </div>

                      {/* Rating */}
                      {item.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: item.rating }).map((_, j) => (
                            <Star key={j} size={9} className="fill-aura-gold text-aura-gold" />
                          ))}
                        </div>
                      )}

                      {/* Comment */}
                      {item.comment && (
                        <p className="font-syne text-xs text-aura-cream/40 italic mb-3">"{item.comment}"</p>
                      )}

                      <div className="flex items-center gap-3">
                        {/* Trip type */}
                        <span
                          className="font-syne text-[8px] tracking-[2px] uppercase px-2 py-0.5 border"
                          style={{ color: tripTypeColors[item.tripType] || '#D4A843', borderColor: (tripTypeColors[item.tripType] || '#D4A843') + '30', backgroundColor: (tripTypeColors[item.tripType] || '#D4A843') + '10' }}
                        >
                          {item.tripType}
                        </span>
                        {item.live && (
                          <span className="flex items-center gap-1 font-syne text-[8px] tracking-[2px] uppercase text-aura-green">
                            <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
                            Live Now
                          </span>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 ml-auto">
                          <button className="text-aura-cream/20 hover:text-aura-rose transition-colors"><Heart size={12} /></button>
                          <button className="text-aura-cream/20 hover:text-aura-gold transition-colors"><MessageCircle size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 shrink-0 space-y-5">
            <div className="surface-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={12} className="text-aura-gold" />
                <span className="section-label">Friends' Top Hotels This Month</span>
              </div>
              <div className="space-y-0">
                {topHotels.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-aura-cream/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-fraunces text-xl text-aura-gold/30">{i + 1}</span>
                      <span className="font-syne text-xs text-aura-cream/60">{h.name}</span>
                    </div>
                    <span className="font-syne text-[9px] text-aura-cream/30">{h.friends} friends</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-5">
              <div className="section-label mb-4">Trending in Your Network</div>
              {[
                { name: 'RAAS Jodhpur', city: 'Rajasthan', emoji: '🏰', gradient: 'from-orange-950 to-black' },
                { name: 'W Goa', city: 'Goa', emoji: '🌊', gradient: 'from-blue-950 to-black' },
                { name: 'Evolve Back', city: 'Coorg', emoji: '☕', gradient: 'from-stone-900 to-black' },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-aura-cream/5 last:border-0 group cursor-pointer">
                  <div className={`w-10 h-10 bg-gradient-to-br ${h.gradient} flex items-center justify-center text-lg shrink-0`}>
                    <span className="opacity-50">{h.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-syne text-xs text-aura-cream/60 group-hover:text-aura-gold transition-colors">{h.name}</p>
                    <p className="font-syne text-[9px] text-aura-cream/25">{h.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
