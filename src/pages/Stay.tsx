import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Sparkles, ChevronUp, ChevronDown, Thermometer, Wind, Droplets, Eye } from 'lucide-react';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import stayBg from '@/assets/stay-bg.jpg';

// ─── Gold shimmer particle ────────────────────────────────────────────────────
const GoldParticle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: 'radial-gradient(circle, rgba(212,168,67,0.95) 0%, rgba(232,188,87,0.4) 60%, transparent 100%)',
    }}
    animate={{
      opacity: [0, 1, 0.6, 0],
      scale: [0, 1, 1.4, 0],
      x: [(Math.random() - 0.5) * 30],
      y: [0, -20 - Math.random() * 30],
    }}
    transition={{
      duration: 2.5 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: 'easeOut',
    }}
  />
);

// ─── Shimmer sweep across card ────────────────────────────────────────────────
const ShimmerSweep = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none overflow-hidden"
    style={{ borderRadius: 'inherit' }}
  >
    <motion.div
      className="absolute top-0 bottom-0 w-32"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.12), rgba(255,220,100,0.08), transparent)',
        filter: 'blur(8px)',
      }}
      animate={{ left: ['-20%', '120%'] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
    />
  </motion.div>
);

// ─── Fingerprint SVG paths ────────────────────────────────────────────────────
const fingerprintArcs = [
  "M 50,50 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0",
  "M 50,50 m -17,0 a 17,17 0 1,1 34,0 a 17,17 0 1,1 -34,0",
  "M 50,50 m -12,0 a 12,12 0 1,1 24,0 a 12,12 0 1,1 -24,0",
  "M 50,50 m -7,0  a 7,7   0 1,1 14,0 a 7,7   0 1,1 -14,0",
  "M 50,50 m -26,4 a 26,22 0 0,1 52,0",
  "M 50,50 m -30,8 a 30,26 0 0,1 60,0",
  "M 50,50 m -32,12 a 32,28 0 0,1 64,0",
  "M 50,50 m -27,-4 a 27,23 0 0,0 54,0",
  "M 50,50 m -31,-8 a 31,27 0 0,0 62,0",
];

const FingerprintIcon = ({ progress, color }: { progress: number; color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    {fingerprintArcs.map((d, i) => {
      const threshold = (i + 1) / fingerprintArcs.length;
      const isLit = progress >= threshold;
      return (
        <motion.path
          key={i}
          d={d}
          stroke={isLit ? color : 'rgba(240,235,225,0.08)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            stroke: isLit ? color : 'rgba(240,235,225,0.08)',
            filter: isLit ? `drop-shadow(0 0 4px ${color})` : 'none',
          }}
          transition={{ duration: 0.15 }}
        />
      );
    })}
  </svg>
);

// ─── Weather widget ───────────────────────────────────────────────────────────
const WeatherWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const weather = { temp: 31, feels: 29, humidity: 78, wind: 14, visibility: 12, condition: 'Partly Cloudy', icon: '⛅' };
  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="relative overflow-hidden"
      style={{
        background: 'rgba(6, 5, 8, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(212,168,67,0.12)',
      }}
    >
      <ShimmerSweep />
      <div className="p-5 relative z-10">
        {/* Location + live clock */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/30 mb-1">Vagator, Goa</p>
            <div className="flex items-baseline gap-1">
              <span className="font-fraunces text-4xl text-aura-cream tabular-nums">{hh}:{mm}</span>
              <span className="font-fraunces text-xl text-aura-cream/30 tabular-nums">{ss}</span>
            </div>
            <p className="font-syne text-[9px] text-aura-cream/30 mt-0.5">
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl">{weather.icon}</span>
            <p className="font-syne text-[9px] text-aura-cream/40 mt-1">{weather.condition}</p>
          </div>
        </div>

        {/* Temp */}
        <div className="flex items-end gap-2 mb-4">
          <span className="font-fraunces text-5xl text-aura-gold">{weather.temp}°</span>
          <span className="font-syne text-xs text-aura-cream/30 mb-2">Feels {weather.feels}°C</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-aura-cream/5">
          {[
            { icon: <Droplets size={10} />, val: `${weather.humidity}%`, label: 'Humidity' },
            { icon: <Wind size={10} />, val: `${weather.wind} km/h`, label: 'Wind' },
            { icon: <Eye size={10} />, val: `${weather.visibility} km`, label: 'Visibility' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1 text-aura-gold/60">{s.icon}</div>
              <p className="font-fraunces text-sm text-aura-cream/80">{s.val}</p>
              <p className="font-syne text-[8px] text-aura-cream/25 tracking-[1.5px] uppercase mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Digital key frosted card ─────────────────────────────────────────────────
const DigitalKeyCard = () => {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'unlocked'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const controls = useAnimationControls();

  // Particle positions — stable, generated once
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }))
  ).current;

  const startScan = () => {
    if (phase === 'unlocked') { setPhase('idle'); setScanProgress(0); return; }
    if (phase !== 'idle') return;
    setPhase('scanning');
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.09;
      setScanProgress(Math.min(p, 1));
      if (p >= 1) {
        clearInterval(interval);
        setTimeout(() => setPhase('unlocked'), 200);
      }
    }, 60);
    const t = setTimeout(() => clearInterval(interval), 3000);
    setHoldTimer(t);
  };

  const cancelScan = () => {
    if (phase === 'scanning') {
      setScanProgress(0);
      setPhase('idle');
      if (holdTimer) clearTimeout(holdTimer);
    }
  };

  const isUnlocked = phase === 'unlocked';
  const isScanning = phase === 'scanning';

  const cardBg = isUnlocked
    ? 'rgba(212,168,67,0.08)'
    : isScanning
    ? 'rgba(212,168,67,0.04)'
    : 'rgba(6, 5, 8, 0.35)';

  const borderColor = isUnlocked
    ? 'rgba(212,168,67,0.55)'
    : isScanning
    ? `rgba(212,168,67,${0.15 + scanProgress * 0.4})`
    : 'rgba(212,168,67,0.15)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden"
      style={{
        background: cardBg,
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: `1px solid ${borderColor}`,
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: isUnlocked
          ? '0 0 60px rgba(212,168,67,0.2), inset 0 0 40px rgba(212,168,67,0.04)'
          : '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Gold shimmer sweep */}
      <ShimmerSweep />

      {/* Floating gold particles — only when unlocked */}
      <AnimatePresence>
        {isUnlocked && particles.map((p) => (
          <GoldParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}
      </AnimatePresence>

      {/* Radial glow when unlocked */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.1) 0%, transparent 70%)' }}
          />
        )}
      </AnimatePresence>

      <div className="p-8 relative z-10">
        {/* Card header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-gold/70 mb-1">Digital Key</p>
            <p className="font-fraunces text-2xl text-aura-cream font-light">W Goa</p>
          </div>
          <div className="text-right">
            <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/30 mb-1">Room</p>
            <p className="font-fraunces text-2xl text-aura-gold italic">402</p>
          </div>
        </div>

        {/* Fingerprint scanner */}
        <div className="flex flex-col items-center py-6">
          {/* Outer glow ring */}
          <div className="relative w-32 h-32 mb-6">
            {/* Pulsing ring aura */}
            {(isScanning || isUnlocked) && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid rgba(212,168,67,${isUnlocked ? 0.5 : 0.25})` }}
                  animate={{ scale: [1, 1.3, 1.6], opacity: [0.7, 0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid rgba(212,168,67,${isUnlocked ? 0.4 : 0.15})` }}
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}

            {/* Fingerprint circle container */}
            <motion.div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: isUnlocked
                  ? 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.04) 100%)'
                  : 'rgba(17,16,24,0.6)',
                border: `1px solid ${isUnlocked ? 'rgba(212,168,67,0.4)' : 'rgba(240,235,225,0.06)'}`,
              }}
              animate={isUnlocked ? { boxShadow: ['0 0 20px rgba(212,168,67,0.2)', '0 0 40px rgba(212,168,67,0.4)', '0 0 20px rgba(212,168,67,0.2)'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 h-16">
                <FingerprintIcon
                  progress={isUnlocked ? 1 : isScanning ? scanProgress : 0}
                  color={isUnlocked ? '#D4A843' : '#D4A843'}
                />
              </div>
            </motion.div>

            {/* Scan progress arc */}
            {isScanning && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="62" fill="none" stroke="rgba(212,168,67,0.08)" strokeWidth="1.5" />
                <motion.circle
                  cx="64" cy="64" r="62"
                  fill="none"
                  stroke="#D4A843"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 62}`}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - scanProgress)}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(212,168,67,0.8))' }}
                />
              </svg>
            )}
          </div>

          {/* Status text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center mb-6"
            >
              {phase === 'idle' && (
                <>
                  <p className="font-fraunces text-lg text-aura-cream/60">Hold to Unlock</p>
                  <p className="font-syne text-[9px] text-aura-cream/25 tracking-[2px] mt-1 uppercase">Biometric Authentication</p>
                </>
              )}
              {phase === 'scanning' && (
                <>
                  <p className="font-fraunces text-lg text-aura-gold">Scanning…</p>
                  <p className="font-syne text-[9px] text-aura-cream/40 tracking-[2px] mt-1 uppercase">
                    {Math.round(scanProgress * 100)}% verified
                  </p>
                </>
              )}
              {phase === 'unlocked' && (
                <>
                  <motion.p
                    className="font-fraunces text-xl text-aura-gold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ✦ Room Unlocked
                  </motion.p>
                  <p className="font-syne text-[9px] text-aura-gold/50 tracking-[2px] mt-1 uppercase">Tap to lock</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Hold button */}
          <motion.button
            onMouseDown={startScan}
            onTouchStart={startScan}
            onMouseUp={cancelScan}
            onTouchEnd={cancelScan}
            onMouseLeave={cancelScan}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden font-syne text-[9px] tracking-[3px] uppercase px-8 py-4 transition-all select-none"
            style={{
              background: isUnlocked
                ? 'rgba(212,168,67,0.9)'
                : 'rgba(212,168,67,0.08)',
              border: `1px solid ${isUnlocked ? 'rgba(212,168,67,1)' : 'rgba(212,168,67,0.3)'}`,
              color: isUnlocked ? '#060508' : '#D4A843',
              boxShadow: isUnlocked ? '0 0 30px rgba(212,168,67,0.35)' : 'none',
            }}
          >
            {isUnlocked ? '🔓 Unlocked — Tap to Lock' : isScanning ? 'Hold…' : '🔐 Hold to Unlock Room'}
            {/* Scan fill animation */}
            {isScanning && (
              <motion.div
                className="absolute inset-0 bg-aura-gold/20 pointer-events-none"
                style={{ transformOrigin: 'left' }}
                animate={{ scaleX: scanProgress }}
                transition={{ duration: 0.1 }}
              />
            )}
          </motion.button>
        </div>

        {/* Card footer */}
        <div className="flex items-center justify-between pt-4 border-t border-aura-cream/5">
          <div>
            <p className="font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/20">Check In</p>
            <p className="font-syne text-xs text-aura-cream/50 mt-0.5">Mar 22 · 3:00 PM</p>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-aura-gold/20 to-transparent" />
          <div className="text-right">
            <p className="font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/20">Check Out</p>
            <p className="font-syne text-xs text-aura-cream/50 mt-0.5">Mar 25 · 12:00 PM</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Schedule ─────────────────────────────────────────────────────────────────
const schedule = [
  { time: '07:30', label: 'Breakfast', location: 'Drift Restaurant, Level 2', done: true },
  { time: '10:00', label: 'Pool Opens', location: 'Infinity Pool, Rooftop', done: false },
  { time: '13:00', label: 'Spa Appointment', location: 'AWAY Spa, Level 1', done: false },
  { time: '20:00', label: 'Dinner Reservation', location: 'WET Bar & Kitchen', done: false },
];

const quickActions = [
  { label: 'Room Service', emoji: '🍽️' },
  { label: 'Housekeeping', emoji: '🧹' },
  { label: 'Concierge', emoji: '🤖' },
  { label: 'SOS', emoji: '🚨' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Stay() {
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [nightsLeft] = useState(2);

  return (
    <div className="min-h-screen bg-aura-black pt-16 relative overflow-hidden">
      {/* Full-bleed background */}
      <div className="fixed inset-0 z-0">
        <img
          src={stayBg}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.22) saturate(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-aura-black/50 via-aura-black/20 to-aura-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-aura-black/60 via-transparent to-aura-black/60" />
        {/* Subtle gold bloom at horizon */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 45%, rgba(212,168,67,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 pb-40">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <div className="font-syne text-[8px] tracking-[4px] uppercase text-aura-gold/70">Active Stay</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
            <span className="font-syne text-[8px] tracking-[2px] uppercase text-aura-green/70">Live</span>
          </div>
        </motion.div>

        {/* Hotel name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="font-fraunces text-6xl md:text-8xl font-light text-aura-cream leading-none">W Goa</h1>
          <p className="font-fraunces text-3xl italic text-aura-gold mt-1">E-WOW Suite · Floor 4</p>
          <div className="flex items-center gap-5 mt-4">
            {[
              { label: 'Check In', val: 'Mar 22' },
              { label: 'Check Out', val: 'Mar 25' },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/25">{item.label}</span>
                <span className="font-syne text-xs text-aura-cream/50">{item.val}</span>
              </span>
            ))}
            <div className="flex items-center gap-1.5 border border-aura-gold/20 bg-aura-gold/8 px-3 py-1">
              <span className="font-fraunces text-lg text-aura-gold">{nightsLeft}</span>
              <span className="font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/30">nights left</span>
            </div>
          </div>
        </motion.div>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Digital key card — wider */}
          <div className="lg:col-span-3">
            <DigitalKeyCard />
          </div>

          {/* Right column: weather + schedule */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <WeatherWidget />

            {/* Nights countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden"
              style={{
                background: 'rgba(6, 5, 8, 0.45)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(240,235,225,0.06)',
              }}
            >
              <ShimmerSweep />
              <div className="p-5 relative z-10">
                <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/30 mb-3">Stay Duration</p>
                <div className="flex items-end gap-3">
                  <span className="font-fraunces text-5xl text-aura-gold">{nightsLeft}</span>
                  <span className="font-fraunces text-2xl text-aura-cream/30 mb-1">/ 3 nights</span>
                </div>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-1 h-1" style={{ background: i < nightsLeft ? '#D4A843' : 'rgba(240,235,225,0.08)' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-5 relative overflow-hidden"
          style={{
            background: 'rgba(6, 5, 8, 0.45)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(240,235,225,0.06)',
          }}
        >
          <ShimmerSweep />
          <div className="p-6 relative z-10">
            <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-cream/30 mb-5">Today's Schedule</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {schedule.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  className={`flex items-center gap-5 py-4 border-b border-aura-cream/5 last:border-0 md:odd:border-r md:odd:pr-8 md:even:pl-8 ${s.done ? 'opacity-35' : ''}`}
                >
                  <span className="font-fraunces text-xl text-aura-gold w-14 shrink-0">{s.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-syne text-sm text-aura-cream/70 truncate">{s.label}</p>
                    <p className="font-syne text-[9px] text-aura-cream/25 mt-0.5 tracking-[1px] truncate">{s.location}</p>
                  </div>
                  {s.done
                    ? <span className="font-syne text-[8px] tracking-[2px] text-aura-green uppercase shrink-0">Done</span>
                    : <div className="w-1.5 h-1.5 rounded-full bg-aura-gold/40 shrink-0 animate-pulse" />
                  }
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-5 grid grid-cols-4 gap-3"
        >
          {quickActions.map((a, i) => (
            <motion.button
              key={a.label}
              whileHover={{ y: -4, borderColor: 'rgba(212,168,67,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden group py-5"
              style={{
                background: 'rgba(6, 5, 8, 0.45)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: a.label === 'SOS' ? '1px solid rgba(212,127,139,0.15)' : '1px solid rgba(240,235,225,0.06)',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
            >
              <ShimmerSweep />
              <span className="text-2xl block mb-2 relative z-10">{a.emoji}</span>
              <p
                className="font-syne text-[8px] tracking-[1.5px] uppercase relative z-10 transition-colors duration-200"
                style={{ color: a.label === 'SOS' ? 'rgba(212,127,139,0.6)' : 'rgba(240,235,225,0.35)' }}
              >
                {a.label}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* AI Concierge sticky bottom panel */}
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(6,5,8,0.75)', borderTop: '1px solid rgba(212,168,67,0.08)' }}>
        <button
          onClick={() => setConciergeOpen(!conciergeOpen)}
          className="w-full px-6 py-4 flex items-center justify-between max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-aura-gold/10 border border-aura-gold/20 flex items-center justify-center">
              <Sparkles size={10} className="text-aura-gold" />
            </div>
            <span className="font-syne text-xs text-aura-cream/50">AURA AI Concierge</span>
            <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
          </div>
          <motion.div animate={{ rotate: conciergeOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronUp size={14} className="text-aura-cream/30" />
          </motion.div>
        </button>

        <AnimatePresence>
          {conciergeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 max-w-5xl mx-auto">
                <AISuggestionBox
                  suggestion="Good morning, Arjun. Your breakfast is ready at Drift Restaurant (Level 2) at 7:30 AM. Based on today's weather — 31°C with sea breeze — I've reserved your sun lounger by the pool at 10 AM. Shall I arrange a late checkout for you? Your flight is at 6 PM."
                  action="Arrange late checkout"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
