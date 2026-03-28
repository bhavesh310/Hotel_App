import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

interface HotelCardProps {
  hotel: {
    id: number;
    name: string;
    city: string;
    area: string;
    stars: number;
    price: number;
    vibe: string[];
    aiPick: boolean;
    friendCount: number;
    friendRating: number;
    emoji: string;
    gradient: string;
    image?: string;
  };
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link to={`/hotel/${hotel.id}`}>
      <motion.div
        className="luxury-card group cursor-pointer overflow-hidden"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Image area */}
        <div className="relative h-52 overflow-hidden">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${hotel.gradient} flex items-center justify-center`}>
              <span className="text-5xl opacity-30">{hotel.emoji}</span>
            </div>
          )}

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* AI Pick badge */}
          {hotel.aiPick && (
            <div className="absolute top-3 left-3 gold-chip flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-aura-gold animate-pulse-gold" />
              AI Pick
            </div>
          )}

          {/* Vibe tags */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {hotel.vibe.slice(0, 1).map((v) => (
              <span key={v} className="font-syne text-[8px] tracking-[2px] uppercase bg-black/50 text-aura-cream/80 px-2 py-1 backdrop-blur-sm border border-white/10">
                {v}
              </span>
            ))}
          </div>

          {/* View details overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-12 bg-aura-gold/90 flex items-center justify-center"
            initial={{ y: '100%' }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="font-syne text-[9px] tracking-[3px] uppercase text-aura-black font-semibold">
              View Details →
            </span>
          </motion.div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-fraunces text-lg font-light text-aura-cream">{hotel.name}</h3>
              <p className="font-syne text-[10px] tracking-[2px] text-aura-cream/40 uppercase mt-0.5">
                {hotel.area}, {hotel.city}
              </p>
            </div>
            <div className="text-right">
              <p className="font-fraunces text-xl text-aura-gold">₹{hotel.price.toLocaleString()}</p>
              <p className="font-syne text-[9px] text-aura-cream/30">per night</p>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} size={10} className="fill-aura-gold text-aura-gold" />
            ))}
          </div>

          {/* Friend trust score */}
          {hotel.friendCount > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-aura-cream/5">
              <Users size={10} className="text-aura-teal" />
              <span className="font-syne text-[9px] text-aura-cream/40">
                <span className="text-aura-teal">{hotel.friendCount} friends</span> stayed here ★{hotel.friendRating}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
