import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Users, SlidersHorizontal, Star } from 'lucide-react';
import { HotelCard } from '@/components/HotelCard';
import { hotels } from '@/data/hotels';
import { useAppStore } from '@/store/useStore';

const vibes = [
  { id: 'romantic', label: 'Romantic', emoji: '💑' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
];

export default function Explore() {
  const { selectedVibe, setVibe, searchQuery, setSearchQuery, guestCount, setGuestCount } = useAppStore();
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      const matchVibe = !selectedVibe || h.vibe.includes(selectedVibe);
      const matchSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBudget = !budgetFilter || h.price <= budgetFilter;
      return matchVibe && matchSearch && matchBudget;
    });
  }, [selectedVibe, searchQuery, budgetFilter]);

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      {/* Header */}
      <div className="bg-aura-dark border-b border-aura-cream/5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Search + filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-cream/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="City or hotel name..."
                className="w-full bg-aura-lift border border-aura-cream/8 pl-9 pr-4 py-2.5 font-syne text-xs text-aura-cream/80 placeholder:text-aura-cream/25 focus:outline-none focus:border-aura-gold/30 transition-colors"
              />
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 bg-aura-lift border border-aura-cream/8 px-4 py-2.5">
              <Users size={12} className="text-aura-cream/30" />
              <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="text-aura-cream/40 hover:text-aura-gold w-4 text-center">−</button>
              <span className="font-syne text-xs text-aura-cream/60 w-6 text-center">{guestCount}</span>
              <button onClick={() => setGuestCount(Math.min(10, guestCount + 1))} className="text-aura-cream/40 hover:text-aura-gold w-4 text-center">+</button>
              <span className="font-syne text-[9px] text-aura-cream/30 tracking-wider">GUESTS</span>
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border transition-colors font-syne text-[9px] tracking-[2px] uppercase ${showFilters ? 'border-aura-gold/40 text-aura-gold bg-aura-gold/5' : 'border-aura-cream/8 text-aura-cream/40 hover:border-aura-gold/30 hover:text-aura-gold'}`}
            >
              <SlidersHorizontal size={11} />
              Filters
            </button>
          </div>

          {/* Budget filter (expandable) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex items-center gap-4 flex-wrap">
                  <span className="section-label">Budget/night</span>
                  {[10000, 15000, 20000, 30000].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudgetFilter(budgetFilter === b ? null : b)}
                      className={`font-syne text-[9px] tracking-[2px] uppercase px-3 py-1.5 border transition-colors ${budgetFilter === b ? 'border-aura-gold/50 text-aura-gold bg-aura-gold/8' : 'border-aura-cream/10 text-aura-cream/40 hover:border-aura-gold/30'}`}
                    >
                      Under ₹{b.toLocaleString()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mood/Vibe bar */}
        <div className="border-t border-aura-cream/5 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="section-label shrink-0 mr-2">Vibe</span>
            <button
              onClick={() => setVibe(null)}
              className={`flex items-center gap-1.5 px-4 py-2 shrink-0 font-syne text-[9px] tracking-[2px] uppercase transition-colors border ${!selectedVibe ? 'border-aura-gold/50 text-aura-gold bg-aura-gold/8' : 'border-aura-cream/8 text-aura-cream/30 hover:border-aura-gold/30'}`}
            >
              All
            </button>
            {vibes.map((v) => (
              <button
                key={v.id}
                onClick={() => setVibe(selectedVibe === v.id ? null : v.id)}
                className={`flex items-center gap-1.5 px-4 py-2 shrink-0 font-syne text-[9px] tracking-[2px] uppercase transition-colors border ${selectedVibe === v.id ? 'border-aura-gold/50 text-aura-gold bg-aura-gold/8' : 'border-aura-cream/8 text-aura-cream/30 hover:border-aura-gold/30'}`}
              >
                <span>{v.emoji}</span>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-fraunces text-3xl text-aura-cream">
              {selectedVibe ? vibes.find(v => v.id === selectedVibe)?.label + ' Escapes' : 'All Hotels'}
            </h1>
            <p className="font-syne text-[10px] text-aura-cream/30 tracking-[2px] mt-1">{filtered.length} properties found</p>
          </div>
          <div className="flex items-center gap-2 text-aura-cream/30">
            <MapPin size={12} />
            <span className="font-syne text-[10px] tracking-wider">India</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedVibe || 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <HotelCard hotel={hotel} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🏜️</p>
            <h3 className="font-fraunces text-2xl text-aura-cream/40 mb-2">No hotels found</h3>
            <p className="font-syne text-xs text-aura-cream/20">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
