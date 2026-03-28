import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="border-t border-transparent pt-0">
    <div className="gold-divider" />
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <Link to="/" className="font-fraunces text-lg font-light tracking-widest">
        AURA <span className="text-aura-gold">STAY</span>
      </Link>
      <p className="font-syne text-[10px] tracking-[3px] uppercase text-aura-cream/30">
        The Future of Luxury Travel
      </p>
      <div className="flex flex-col md:flex-row items-center gap-3 text-aura-cream/20">
        <p className="font-syne text-[10px] tracking-[2px]">
          © 2026 <span className="text-aura-cream/40">Roamio</span>. All rights reserved.
        </p>
        <span className="hidden md:block text-aura-gold/30">✦</span>
        <p className="font-syne text-[10px] tracking-[2px]">
          Crafted by{' '}
          <span className="font-fraunces italic text-aura-gold/70 text-[11px] tracking-wider">
            Bhavesh
          </span>
        </p>
      </div>
    </div>
  </footer>
);