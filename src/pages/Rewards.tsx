import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rewardsData } from '@/data/hotels';
import { Copy, CheckCircle, X, Sparkles } from 'lucide-react';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const tierColors: Record<string, string> = {
  Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#D4A843', Platinum: '#E5E4E2'
};

type Reward = {
  id: string | number;
  name: string;
  icon: string;
  points: number;
  unlocked: boolean;
};

type ModalState =
  | { type: 'confirm'; reward: Reward }
  | { type: 'success'; reward: Reward }
  | null;

export default function Rewards() {
  const [currentPoints, setCurrentPoints] = useState(rewardsData.points);
  const points = useCountUp(currentPoints);
  const pct = Math.round((currentPoints / rewardsData.nextTierPoints) * 100);
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [redeemedIds, setRedeemedIds] = useState<Set<string | number>>(new Set());

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleRedeemClick = (reward: Reward) => {
    if (!reward.unlocked || redeemedIds.has(reward.id)) return;
    setModal({ type: 'confirm', reward });
  };

  const handleConfirm = () => {
    if (modal?.type !== 'confirm') return;
    const reward = modal.reward;
    setCurrentPoints(prev => Math.max(0, prev - reward.points));
    setRedeemedIds(prev => new Set(prev).add(reward.id));
    setModal({ type: 'success', reward });
  };

  const handleClose = () => setModal(null);

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-label mb-4">Loyalty Programme</div>
          <h1 className="font-fraunces text-5xl md:text-7xl font-light text-aura-cream mb-2">
            {rewardsData.userName}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="gold-chip text-sm"
              style={{
                color: tierColors[rewardsData.tier],
                borderColor: tierColors[rewardsData.tier] + '40',
                backgroundColor: tierColors[rewardsData.tier] + '12'
              }}
            >
              {rewardsData.tier} Member
            </div>
          </div>
          <div className="font-fraunces text-7xl md:text-8xl text-aura-gold count-up">
            {points.toLocaleString()}
          </div>
          <p className="section-label mt-2 text-aura-cream/30">AURA POINTS</p>
        </div>

        {/* Progress to next tier */}
        <div className="surface-panel p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-syne text-xs text-aura-cream/50">{rewardsData.tier}</span>
            <span className="font-syne text-xs text-aura-cream/50">{rewardsData.nextTier}</span>
          </div>
          <div className="h-2 bg-aura-lift overflow-hidden relative mb-3">
            <motion.div
              className="h-full bg-aura-gold relative"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-aura-gold border-2 border-aura-black" />
            </motion.div>
            {[25, 50, 75].map(m => (
              <div key={m} className="absolute top-0 bottom-0 w-px bg-aura-cream/10" style={{ left: `${m}%` }} />
            ))}
          </div>
          <p className="font-syne text-[10px] text-aura-cream/30 text-center">
            {(rewardsData.nextTierPoints - currentPoints).toLocaleString()} points to{' '}
            <span className="text-aura-gold">{rewardsData.nextTier}</span>
          </p>
        </div>

        {/* Rewards grid */}
        <div className="section-label mb-5">Your Rewards</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {rewardsData.rewards.map((r, i) => {
            const isRedeemed = redeemedIds.has(r.id);
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`luxury-card p-6 ${!r.unlocked ? 'opacity-50' : ''}`}
              >
                <div className="text-3xl mb-4">{r.icon}</div>
                <h3 className="font-fraunces text-lg text-aura-cream mb-1">{r.name}</h3>
                <p className="font-syne text-[9px] text-aura-cream/30 tracking-[2px] mb-4">
                  {r.points.toLocaleString()} POINTS
                </p>

                {r.unlocked ? (
                  <div className="w-full bg-aura-gold/10 border border-aura-gold/20 h-1 mb-4">
                    <div
                      className="h-full bg-aura-gold"
                      style={{ width: `${Math.min(100, (currentPoints / r.points) * 100)}%` }}
                    />
                  </div>
                ) : (
                  <div className="w-full bg-aura-lift h-1 mb-4" />
                )}

                {isRedeemed ? (
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 border border-aura-gold/30 bg-aura-gold/5">
                    <CheckCircle size={11} className="text-aura-gold" />
                    <span className="font-syne text-[8px] tracking-[2px] uppercase text-aura-gold">Redeemed</span>
                  </div>
                ) : (
                  <button
                    disabled={!r.unlocked}
                    onClick={() => handleRedeemClick(r)}
                    className={
                      r.unlocked
                        ? 'btn-gold w-full text-[8px] py-2.5 cursor-pointer'
                        : 'w-full font-syne text-[8px] tracking-[2px] uppercase border border-aura-cream/10 text-aura-cream/20 py-2.5 cursor-not-allowed'
                    }
                  >
                    {r.unlocked ? 'Redeem' : `🔒 ${r.points.toLocaleString()} pts`}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity log */}
          <div>
            <div className="section-label mb-4">Recent Activity</div>
            <div className="space-y-0">
              {rewardsData.activity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-aura-cream/5">
                  <div>
                    <p className="font-syne text-xs text-aura-cream/60">{a.hotel}</p>
                    <p className="font-syne text-[9px] text-aura-cream/25 mt-0.5">{a.date}</p>
                  </div>
                  <span className="font-fraunces text-lg text-aura-green">+{a.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referral */}
          <div>
            <div className="section-label mb-4">Refer & Earn</div>
            <div className="surface-panel p-6">
              <p className="font-fraunces text-2xl text-aura-cream mb-1">+500 pts</p>
              <p className="font-syne text-xs text-aura-cream/40 mb-5 leading-relaxed">
                Earn 500 points when a friend books their first stay using your referral link.
              </p>
              <div className="flex gap-2 mb-5">
                <div className="flex-1 bg-aura-lift border border-aura-cream/8 px-3 py-2 font-syne text-[9px] text-aura-cream/30 truncate">
                  aurastay.app/ref/arjun2026
                </div>
                <button onClick={handleCopy} className="btn-gold px-3 flex items-center gap-1">
                  {copied ? <CheckCircle size={11} /> : <Copy size={11} />}
                </button>
              </div>
              <div className="section-label mb-3">Referred Friends</div>
              {[
                { name: 'Rahul M.', status: 'Booked ✓', color: '#7DC97A' },
                { name: 'Sneha R.', status: 'Joined', color: '#8B7FD4' },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-aura-cream/5">
                  <span className="font-syne text-[10px] text-aura-cream/50">{f.name}</span>
                  <span className="font-syne text-[9px]" style={{ color: f.color }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(6,5,8,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="surface-panel w-full max-w-sm p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-aura-cream/30 hover:text-aura-cream transition-colors"
              >
                <X size={16} />
              </button>

              {modal.type === 'confirm' ? (
                <>
                  {/* Confirm redeem */}
                  <div className="text-4xl mb-5 text-center">{modal.reward.icon}</div>
                  <p className="section-label text-center mb-2">Redeem Reward</p>
                  <h2 className="font-fraunces text-2xl text-aura-cream text-center mb-1">
                    {modal.reward.name}
                  </h2>
                  <p className="font-syne text-[10px] text-aura-cream/30 tracking-[2px] text-center mb-6">
                    {modal.reward.points.toLocaleString()} POINTS
                  </p>

                  <div className="gold-divider mb-6" />

                  <div className="flex justify-between items-center mb-1">
                    <span className="font-syne text-xs text-aura-cream/40">Current Balance</span>
                    <span className="font-fraunces text-sm text-aura-gold">{currentPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-syne text-xs text-aura-cream/40">After Redemption</span>
                    <span className="font-fraunces text-sm text-aura-cream">
                      {(currentPoints - modal.reward.points).toLocaleString()} pts
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="btn-ghost flex-1 text-[9px] py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="btn-gold flex-1 text-[9px] py-3 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={10} />
                      Confirm
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Success state */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-5xl mb-5 text-center"
                  >
                    {modal.reward.icon}
                  </motion.div>

                  <p className="section-label text-center mb-2 text-aura-gold">Success!</p>
                  <h2 className="font-fraunces text-2xl text-aura-cream text-center mb-2">
                    {modal.reward.name}
                  </h2>
                  <p className="font-syne text-xs text-aura-cream/40 text-center mb-6 leading-relaxed">
                    Your reward has been redeemed. Check your email for the voucher details.
                  </p>

                  <div className="gold-divider mb-6" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-syne text-xs text-aura-cream/40">New Balance</span>
                    <span className="font-fraunces text-sm text-aura-gold">
                      {(currentPoints).toLocaleString()} pts
                    </span>
                  </div>

                  <button
                    onClick={handleClose}
                    className="btn-gold w-full text-[9px] py-3"
                  >
                    Done
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}