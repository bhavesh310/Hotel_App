import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Link2, Copy, CheckCircle, Clock, Lock } from 'lucide-react';
import { groupBooking } from '@/data/hotels';

export default function GroupBooking() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pct = Math.round((groupBooking.collected / groupBooking.total) * 100);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">Group Booking</div>
          <h1 className="font-fraunces text-4xl md:text-5xl text-aura-cream font-light">{groupBooking.tripName}</h1>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="font-syne text-[10px] text-aura-cream/40 tracking-[2px]">{groupBooking.hotel}</span>
            <span className="text-aura-cream/20">·</span>
            <span className="font-syne text-[10px] text-aura-cream/40 tracking-[2px]">{groupBooking.dates}</span>
            <span className="text-aura-cream/20">·</span>
            <span className="font-syne text-[10px] text-aura-cream/40 tracking-[2px]">{groupBooking.nights} nights</span>
            <div className="flex items-center gap-1.5 bg-aura-lift border border-aura-cream/8 px-3 py-1">
              <Users size={10} className="text-aura-gold" />
              <span className="font-syne text-[9px] text-aura-cream/50">{groupBooking.members.length} members</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Member list */}
          <div className="lg:col-span-3">
            <div className="surface-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="section-label">Members</div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-2 font-syne text-[9px] tracking-[2px] uppercase text-aura-gold border border-aura-gold/20 px-3 py-2 hover:bg-aura-gold/5 transition-colors"
                >
                  <Link2 size={10} /> Invite Member
                </button>
              </div>

              <div className="space-y-3">
                {groupBooking.members.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-aura-lift border border-aura-cream/5 hover:border-aura-gold/15 transition-colors"
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center font-fraunces text-sm shrink-0"
                      style={{ backgroundColor: m.color + '22', color: m.color, border: `1px solid ${m.color}33` }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-syne text-xs text-aura-cream/70 truncate">{m.name}</p>
                      <p className="font-syne text-[9px] text-aura-cream/30 tracking-[1.5px] mt-0.5">{m.room}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 font-syne text-[8px] tracking-[2px] uppercase ${m.status === 'paid' ? 'bg-aura-green/10 text-aura-green border border-aura-green/20' : 'bg-aura-rose/10 text-aura-rose border border-aura-rose/20'}`}>
                      {m.status === 'paid' ? <CheckCircle size={9} /> : <Clock size={9} />}
                      {m.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment panel */}
          <div className="lg:col-span-2">
            <div className="surface-panel p-6 mb-4">
              <div className="section-label mb-4">Trip Total</div>
              <p className="font-fraunces text-5xl text-aura-gold mb-1">₹{groupBooking.total.toLocaleString()}</p>
              <p className="font-syne text-[9px] text-aura-cream/30 tracking-[2px] mb-6">TOTAL BOOKING AMOUNT</p>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between mb-2">
                  <span className="font-syne text-[9px] text-aura-cream/40">Collected</span>
                  <span className="font-syne text-[9px] text-aura-gold">{pct}%</span>
                </div>
                <div className="h-1.5 bg-aura-lift overflow-hidden">
                  <motion.div
                    className="h-full bg-aura-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-3 pb-4 border-b border-aura-cream/5">
                <div>
                  <p className="font-fraunces text-xl text-aura-green">₹{groupBooking.collected.toLocaleString()}</p>
                  <p className="font-syne text-[8px] text-aura-cream/30 tracking-[1px] mt-0.5">Collected</p>
                </div>
                <div className="text-right">
                  <p className="font-fraunces text-xl text-aura-rose">₹{(groupBooking.total - groupBooking.collected).toLocaleString()}</p>
                  <p className="font-syne text-[8px] text-aura-cream/30 tracking-[1px] mt-0.5">Pending</p>
                </div>
              </div>

              <div className="mt-4 mb-5">
                <p className="font-syne text-[9px] text-aura-cream/30 mb-1">Per person share</p>
                <p className="font-fraunces text-2xl text-aura-cream">₹{(groupBooking.total / groupBooking.members.length).toLocaleString()}</p>
              </div>

              <button className="w-full font-syne text-[9px] tracking-[2px] uppercase text-aura-rose border border-aura-rose/20 py-3 hover:bg-aura-rose/5 transition-colors flex items-center justify-center gap-2 mb-3">
                <Clock size={10} /> Send Reminder to Pending
              </button>

              {/* Payment log */}
              <div>
                <div className="section-label mb-3">Payment History</div>
                <div className="space-y-2">
                  {groupBooking.members.filter(m => m.status === 'paid').map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="font-syne text-[10px] text-aura-cream/40">{m.name.split(' ')[0]}</span>
                      <span className="font-syne text-[9px] text-aura-green">Paid ✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Digital key countdown */}
            <div className="ai-suggestion p-5 mb-4">
              <div className="section-label mb-2">Group Digital Key</div>
              <p className="font-fraunces text-2xl text-aura-cream mb-1">3d 14h 22m</p>
              <p className="font-syne text-[9px] text-aura-cream/30">Unlocks when all payments are confirmed</p>
            </div>

            {/* Lock rooms button */}
            <button disabled className="w-full btn-gold opacity-30 flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock size={12} /> Lock Rooms (Pending Payments)
            </button>
          </div>
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
            onClick={() => setInviteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="surface-panel p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-fraunces text-2xl text-aura-cream mb-2">Invite to Group</h3>
              <p className="font-syne text-xs text-aura-cream/40 mb-6">Share this link to add members to the trip</p>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-aura-lift border border-aura-cream/8 px-3 py-2.5 font-syne text-[10px] text-aura-cream/30 overflow-hidden truncate">
                  aurastay.app/group/goa2026?invite=x8k2n
                </div>
                <button onClick={handleCopy} className="btn-gold px-4 py-2.5 flex items-center gap-1.5">
                  {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-aura-green/10 border border-aura-green/20 text-aura-green font-syne text-[9px] tracking-[2px] uppercase py-3">
                  📱 WhatsApp
                </button>
                <button className="flex-1 bg-aura-violet/10 border border-aura-violet/20 text-aura-violet font-syne text-[9px] tracking-[2px] uppercase py-3">
                  ✉️ Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
