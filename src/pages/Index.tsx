import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, TrendingUp, Globe2, Users, Zap, Shield, Eye, MessageCircle, Building2, Share2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const ticker = [
  'AI-Powered Booking', 'Group Coordination', 'Digital Keys', 'Live Cameras', 'AR Preview', 'Loyalty Rewards',
  'Corporate Portal', 'Social Feed', 'GST Invoicing', 'Real-Time Concierge', 'Mood Travel', 'Network Trust Score',
  'AI-Powered Booking', 'Group Coordination', 'Digital Keys', 'Live Cameras', 'AR Preview', 'Loyalty Rewards',
  'Corporate Portal', 'Social Feed', 'GST Invoicing', 'Real-Time Concierge', 'Mood Travel', 'Network Trust Score',
];

const features = [
  { num: '01', title: 'AI Concierge', desc: 'Personalized recommendations powered by your travel DNA', icon: <MessageCircle size={18} /> },
  { num: '02', title: 'Mood Matching', desc: 'Filter hotels by the vibe — Romantic, Adventure, Business, Family', icon: <Sparkles size={18} /> },
  { num: '03', title: 'Group Booking', desc: 'Coordinate rooms, payments and arrivals in one seamless dashboard', icon: <Users size={18} /> },
  { num: '04', title: 'Digital Key', desc: 'NFC-powered room access. Your phone is your key.', icon: <Zap size={18} /> },
  { num: '05', title: 'Live Cameras', desc: 'Preview pool, lobby & beach in real-time before you arrive', icon: <Eye size={18} /> },
  { num: '06', title: 'AR Room Tours', desc: 'Walk through your suite in augmented reality before booking', icon: <Globe2 size={18} /> },
  { num: '07', title: 'Network Trust', desc: 'See where friends stayed and their verified star ratings', icon: <Shield size={18} /> },
  { num: '08', title: 'Loyalty Engine', desc: 'Earn points on every stay, redeem for upgrades & experiences', icon: <TrendingUp size={18} /> },
  { num: '09', title: 'Corporate Suite', desc: 'Policy controls, expense tracking, GST invoices & team travel', icon: <Building2 size={18} /> },
];

const problems = [
  { stat: '73%', label: 'Booking Friction', desc: 'Travellers abandon hotel bookings due to confusing, multi-step processes' },
  { stat: '₹42K Cr', label: 'Lost Revenue', desc: 'Annual corporate travel spend wasted on non-compliant or unapproved bookings' },
  { stat: '89%', label: 'Generic Experience', desc: 'Hotels use one-size-fits-all service with zero personalization' },
];

const revenueStreams = [
  { title: 'Commission Model', pct: '8–12%', desc: 'Per booking commission from hotel partners on every confirmed reservation' },
  { title: 'SaaS Corporate', pct: '₹2,999/mo', desc: 'Monthly subscription for corporate travel portals with full expense management' },
  { title: 'Premium Concierge', pct: '₹499/trip', desc: 'AI concierge upgrade with personal travel manager and priority booking' },
];

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default function Index() {
  const words = ['STAY', 'BEYOND', 'ORDINARY'];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // Image moves at 40% the scroll speed — classic parallax
  const bgY = useTransform(scrollY, [0, 800], ['0%', '40%']);
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.08]);

  return (
    <div className="min-h-screen bg-aura-black">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic background image — parallax layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: bgY, scale: bgScale }}
        >
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.35) saturate(0.8)' }}
          />
        </motion.div>

        {/* Overlays sit outside the parallax layer so they stay fixed */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Multi-layer gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-aura-black/60 via-transparent to-aura-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-aura-black/40 via-transparent to-aura-black/40" />
          {/* Subtle gold vignette */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(212,168,67,0.04) 0%, transparent 70%)' }} />
          {/* Grid lines on top */}
          <div className="absolute inset-0 grid-lines opacity-40" />
        </div>
        {/* Floating gold dust particles */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-aura-gold"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -20, -40], scale: [0, 1.5, 0] }}
              transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 8 }}
            />
          ))}
        </div>

        {/* Market badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gold-chip flex items-center gap-2 mb-12 relative z-10"
        >
          <TrendingUp size={8} />
          $1.5T Global Travel Market
        </motion.div>

        {/* Giant headline */}
        <div className="text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-label mb-6"
          >
            Redefining Luxury Hospitality
          </motion.div>

          <h1 className="font-fraunces font-light leading-none tracking-tight mb-4">
            {['AURA'].map((word, wi) => (
              <div key={wi} className="overflow-hidden">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + wi * 0.1, ease: 'easeOut' }}
                  className="block text-[clamp(5rem,15vw,14rem)] text-aura-cream"
                >
                  {word}
                </motion.span>
              </div>
            ))}
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="block text-[clamp(4rem,12vw,10rem)] italic text-aura-gold"
              >
                Stay.
              </motion.span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-syne text-sm text-aura-cream/40 tracking-widest max-w-md mx-auto mb-12"
          >
            AI-powered luxury hotel bookings — crafted for the discerning modern traveller
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/explore">
              <button className="btn-gold">Explore Hotels</button>
            </Link>
            <Link to="/concierge">
              <button className="btn-ghost flex items-center gap-2">
                <Sparkles size={10} />
                Ask AI Concierge
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="section-label">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={12} className="text-aura-gold/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="py-5 bg-aura-dark border-y border-aura-gold/10 overflow-hidden">
        <div className="ticker-track">
          {ticker.map((item, i) => (
            <span key={i} className="flex items-center mx-8">
              <span className="font-syne text-[9px] tracking-[3px] uppercase text-aura-cream/40">{item}</span>
              <span className="mx-6 text-aura-gold text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Problem section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <SectionReveal>
          <div className="section-label mb-6">The Problem</div>
          <h2 className="font-fraunces text-4xl md:text-6xl font-light text-aura-cream mb-16 max-w-2xl">
            Luxury travel is broken at the <em className="text-aura-gold">experience layer</em>
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {problems.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="luxury-card p-7 h-full">
                <p className="font-fraunces text-4xl text-aura-gold mb-2">{p.stat}</p>
                <p className="section-label mb-3">{p.label}</p>
                <p className="font-syne text-xs text-aura-cream/40 leading-relaxed">{p.desc}</p>
              </div>
            </SectionReveal>
          ))}
          {/* Opportunity card */}
          <SectionReveal delay={0.3}>
            <div className="luxury-card p-7 h-full border border-aura-gold/15 bg-gradient-to-br from-aura-gold/8 to-transparent">
              <div className="section-label mb-3 text-aura-gold">The Opportunity</div>
              <p className="font-fraunces text-2xl text-aura-cream font-light mb-3">Roamio solves all three</p>
              <p className="font-syne text-xs text-aura-cream/50 leading-relaxed">One unified platform — AI-powered, socially connected, corporately compliant.</p>
              <Link to="/explore">
                <button className="btn-gold mt-5 text-[8px] px-4 py-3">See How →</button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Core Features 3x3 */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <SectionReveal>
          <div className="section-label mb-6">Core Platform</div>
          <h2 className="font-fraunces text-4xl md:text-5xl font-light text-aura-cream mb-16">
            9 features that change <em className="text-aura-gold">everything</em>
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <SectionReveal key={i} delay={(i % 3) * 0.1}>
              <div className="luxury-card p-7 h-full group">
                <div className="flex items-start justify-between mb-5">
                  <span className="font-fraunces text-4xl font-light text-aura-gold/20">{f.num}</span>
                  <div className="w-9 h-9 border border-aura-gold/15 flex items-center justify-center text-aura-cream/30 group-hover:text-aura-gold group-hover:border-aura-gold/40 transition-colors duration-300">
                    {f.icon}
                  </div>
                </div>
                <h3 className="font-fraunces text-xl text-aura-cream mb-3">{f.title}</h3>
                <p className="font-syne text-xs text-aura-cream/40 leading-relaxed">{f.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Business & Social */}
      <section className="border-y border-aura-cream/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="section-label mb-6">Platform Ecosystem</div>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light text-aura-cream mb-16">
              B2B + Social. <em className="text-aura-gold">All-in-one.</em>
            </h2>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Building2 size={20} />, title: 'Corporate Portal', desc: 'Full company travel management — policy, approvals, expenses, GST invoices.', color: 'text-aura-violet' },
              { icon: <Share2 size={20} />, title: 'Social Travel Feed', desc: 'See where friends are staying. Network-verified hotel ratings and recommendations.', color: 'text-aura-teal' },
              { icon: <Users size={20} />, title: 'Group Coordinator', desc: 'Multi-room booking, shared payments, group digital keys and real-time status.', color: 'text-aura-gold' },
              { icon: <Sparkles size={20} />, title: 'AI Trip Planner', desc: 'Tell the AI your mood, budget, and dates — it builds your perfect itinerary.', color: 'text-aura-rose' },
              { icon: <Globe2 size={20} />, title: 'AR Preview', desc: 'Walk through your room before booking using augmented reality on any device.', color: 'text-aura-green' },
              { icon: <TrendingUp size={20} />, title: 'Loyalty Ecosystem', desc: 'Cross-hotel point redemption, tier benefits, and instant upgrade auctions.', color: 'text-aura-gold' },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="luxury-card p-7 h-full group">
                  <div className={`${item.color} mb-5 opacity-60 group-hover:opacity-100 transition-opacity`}>{item.icon}</div>
                  <h3 className="font-fraunces text-xl text-aura-cream mb-2">{item.title}</h3>
                  <p className="font-syne text-xs text-aura-cream/40 leading-relaxed">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <SectionReveal>
          <div className="section-label mb-6">Revenue Model</div>
          <h2 className="font-fraunces text-4xl md:text-5xl font-light text-aura-cream mb-16">
            Three streams. <em className="text-aura-gold">Compounding returns.</em>
          </h2>
        </SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {revenueStreams.map((r, i) => (
            <SectionReveal key={i} delay={i * 0.12}>
              <div className="luxury-card p-8 h-full border-t border-aura-gold/20">
                <p className="font-fraunces text-4xl text-aura-gold mb-4">{r.pct}</p>
                <h3 className="font-fraunces text-xl text-aura-cream mb-3">{r.title}</h3>
                <p className="font-syne text-xs text-aura-cream/40 leading-relaxed">{r.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Pitch Stats */}
      <section className="bg-aura-dark border-y border-aura-cream/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '$1.5T', label: 'TAM — Global Travel' },
              { num: '9', label: 'Core Platform Features' },
              { num: '3', label: 'Revenue Streams' },
              { num: '10', label: 'App Screens Built' },
            ].map((s, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <p className="font-fraunces text-4xl md:text-5xl text-aura-gold mb-2">{s.num}</p>
                <p className="section-label text-aura-cream/30">{s.label}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <SectionReveal>
          <div className="section-label mb-6">Tech Stack</div>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Zustand', 'Recharts', 'Supabase', 'OpenAI GPT-4', 'Node.js', 'AWS', 'Stripe', 'React Router'].map((tech) => (
              <span key={tech} className="gold-chip">{tech}</span>
            ))}
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
