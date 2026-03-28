import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, Sparkles, User, Settings, LogOut, CreditCard } from 'lucide-react';

const navLinks = [
  { label: 'Explore', href: '/explore' },
  { label: 'My Stay', href: '/stay' },
  { label: 'Concierge', href: '/concierge' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Social', href: '/social' },
];

const notifications = [
  { id: 1, title: 'Booking Confirmed', desc: 'Your stay at Aura Maldives is confirmed.', time: '2m ago', unread: true },
  { id: 2, title: 'Concierge Reply', desc: 'Your dinner reservation has been arranged.', time: '1h ago', unread: true },
  { id: 3, title: 'Rewards Update', desc: 'You earned 500 Aura Points from your last stay.', time: '1d ago', unread: false },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const bellRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setAvatarOpen(false);
    navigate('/');
  };

  const handleSettings = () => {
    setAvatarOpen(false);
    navigate('/settings');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-aura-gold/7">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-fraunces text-xl font-light tracking-widest text-aura-cream">
              AURA <span className="text-aura-gold">STAY</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-syne text-[10px] tracking-[3px] uppercase transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-aura-gold'
                    : 'text-aura-cream/50 hover:text-aura-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">

            {/* Bell Button */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => { setBellOpen(!bellOpen); setAvatarOpen(false); }}
                className="relative p-2 text-aura-cream/40 hover:text-aura-gold transition-colors"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-aura-gold" />
              </button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-aura-gold/20 bg-aura-black shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-aura-gold/10 flex items-center justify-between">
                      <span className="font-syne text-[10px] tracking-[3px] uppercase text-aura-gold">Notifications</span>
                      <span className="text-[10px] text-aura-cream/30 cursor-pointer hover:text-aura-gold transition-colors">Mark all read</span>
                    </div>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-aura-gold/5 hover:bg-aura-gold/5 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-aura-gold/5' : ''}`}
                      >
                        {n.unread
                          ? <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-aura-gold flex-shrink-0" />
                          : <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0" />
                        }
                        <div>
                          <p className="font-syne text-xs text-aura-cream">{n.title}</p>
                          <p className="text-[11px] text-aura-cream/40 mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-aura-gold/50 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-3 text-center">
                      <span className="font-syne text-[10px] tracking-[2px] uppercase text-aura-cream/30 hover:text-aura-gold transition-colors cursor-pointer">
                        View All
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar Button */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => { setAvatarOpen(!avatarOpen); setBellOpen(false); }}
                className="w-8 h-8 rounded-full bg-aura-lift border border-aura-gold/20 flex items-center justify-center font-fraunces text-xs text-aura-gold hover:border-aura-gold/60 transition-colors"
              >
                A
              </button>

              <AnimatePresence>
                {avatarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-aura-gold/20 bg-aura-black shadow-2xl overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="px-4 py-4 border-b border-aura-gold/10">
                      <p className="font-fraunces text-sm text-aura-cream">Aura Guest</p>
                      <p className="text-[11px] text-aura-cream/30 mt-0.5">guest@aurastay.com</p>
                      <span className="mt-2 inline-block font-syne text-[9px] tracking-[2px] uppercase text-aura-gold border border-aura-gold/30 px-2 py-0.5 rounded-full">
                        Gold Member
                      </span>
                    </div>

                    {/* My Profile */}
                    <Link
                      to="/stay"
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-aura-cream/60 hover:text-aura-gold hover:bg-aura-gold/5 transition-colors"
                    >
                      <User size={14} />
                      <span className="font-syne text-[11px] tracking-[1px]">My Profile</span>
                    </Link>

                    {/* Rewards */}
                    <Link
                      to="/rewards"
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-aura-cream/60 hover:text-aura-gold hover:bg-aura-gold/5 transition-colors"
                    >
                      <CreditCard size={14} />
                      <span className="font-syne text-[11px] tracking-[1px]">Rewards</span>
                    </Link>

                    {/* Settings — uses navigate, not Link */}
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-3 text-aura-cream/60 hover:text-aura-gold hover:bg-aura-gold/5 transition-colors"
                    >
                      <Settings size={14} />
                      <span className="font-syne text-[11px] tracking-[1px]">Settings</span>
                    </button>

                    {/* Sign Out */}
                    <div className="border-t border-aura-gold/10">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                      >
                        <LogOut size={14} />
                        <span className="font-syne text-[11px] tracking-[1px]">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/booking">
              <button className="btn-gold flex items-center gap-2 text-[9px] px-5 py-3">
                <Sparkles size={10} />
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-aura-cream/60 hover:text-aura-gold transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-aura-black flex flex-col items-center justify-center"
          >
            <div className="gold-divider w-full absolute top-16" />
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
              >
                <Link
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-fraunces text-4xl font-light text-aura-cream/80 hover:text-aura-gold transition-colors py-4"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className="mt-8"
            >
              <Link to="/booking" onClick={() => setMenuOpen(false)}>
                <button className="btn-gold">Book Now</button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};