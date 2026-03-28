import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = ['Review', 'Guest Details', 'Payment'];

const addOns = [
  { id: 'early', label: 'Early Check-In (10am)', price: 1200, icon: '🌅' },
  { id: 'late', label: 'Late Check-Out (2pm)', price: 1500, icon: '🌙' },
  { id: 'transfer', label: 'Airport Transfer', price: 2500, icon: '🚗' },
  { id: 'breakfast', label: 'Daily Breakfast', price: 800, icon: '☕' },
];

const moods = [
  { id: 'romantic', label: 'Romantic', emoji: '💑' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'leisure', label: 'Leisure', emoji: '🏖️' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
];

const paymentMethods = ['Card', 'UPI', 'Corporate Wallet', 'Pay Later'];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [confirmed, setConfirmed] = useState(false);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const basePrice = 54600;
  const addOnTotal = addOns.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const cgst = Math.round((basePrice + addOnTotal) * 0.09);
  const sgst = cgst;
  const total = basePrice + addOnTotal + cgst + sgst;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-aura-black pt-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-8 bg-aura-gold/10 border border-aura-gold/30 flex items-center justify-center"
          >
            <Check size={32} className="text-aura-gold" />
          </motion.div>
          <h2 className="font-fraunces text-4xl text-aura-cream mb-4">Booking Confirmed</h2>
          <p className="font-syne text-xs text-aura-cream/40 mb-8 leading-relaxed">Your stay at W Goa has been confirmed. A digital key will be sent 24 hours before check-in.</p>
          <div className="gold-chip mx-auto inline-block mb-8">Booking #AURA-2026-0322</div>
          <div className="flex gap-3 justify-center">
            <Link to="/stay"><button className="btn-gold">View My Stay</button></Link>
            <Link to="/explore"><button className="btn-ghost">Explore More</button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 ${i === step ? 'text-aura-gold' : i < step ? 'text-aura-cream/40' : 'text-aura-cream/20'}`}>
                <div className={`w-5 h-5 border flex items-center justify-center font-syne text-[9px] ${i === step ? 'border-aura-gold text-aura-gold bg-aura-gold/10' : i < step ? 'border-aura-green bg-aura-green/10 text-aura-green' : 'border-aura-cream/10'}`}>
                  {i < step ? <Check size={10} /> : i + 1}
                </div>
                <span className="font-syne text-[9px] tracking-[2px] uppercase">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="w-12 h-px bg-aura-cream/10" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

            {/* Step 1: Review */}
            {step === 0 && (
              <div>
                <h2 className="font-fraunces text-3xl text-aura-cream mb-8">Review Your Stay</h2>

                {/* Booking summary */}
                <div className="surface-panel p-6 mb-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-950 to-black flex items-center justify-center shrink-0">
                      <span className="text-2xl opacity-40">🌊</span>
                    </div>
                    <div>
                      <h3 className="font-fraunces text-xl text-aura-cream">W Goa</h3>
                      <p className="font-syne text-[10px] text-aura-cream/40 tracking-[2px] uppercase">Vagator Beach, Goa</p>
                      <div className="flex gap-4 mt-3">
                        <div>
                          <p className="section-label">Check In</p>
                          <p className="font-syne text-xs text-aura-cream/60">March 22, 2026</p>
                        </div>
                        <div>
                          <p className="section-label">Check Out</p>
                          <p className="font-syne text-xs text-aura-cream/60">March 25, 2026</p>
                        </div>
                        <div>
                          <p className="section-label">Room</p>
                          <p className="font-syne text-xs text-aura-cream/60">E-WOW Suite</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-fraunces text-2xl text-aura-gold">₹{basePrice.toLocaleString()}</p>
                      <p className="font-syne text-[9px] text-aura-cream/30">3 nights</p>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="section-label mb-4">Enhance Your Stay</div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {addOns.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => toggleAddOn(a.id)}
                      className={`p-4 border text-left transition-all ${selectedAddOns.includes(a.id) ? 'border-aura-gold/40 bg-aura-gold/5' : 'border-aura-cream/8 hover:border-aura-gold/20'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xl">{a.icon}</span>
                        <div className={`w-4 h-4 border flex items-center justify-center ${selectedAddOns.includes(a.id) ? 'border-aura-gold bg-aura-gold' : 'border-aura-cream/20'}`}>
                          {selectedAddOns.includes(a.id) && <Check size={9} className="text-aura-black" />}
                        </div>
                      </div>
                      <p className="font-syne text-xs text-aura-cream/70 mb-1">{a.label}</p>
                      <p className="font-fraunces text-sm text-aura-gold">+₹{a.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>

                {/* Mood selector */}
                <div className="section-label mb-4">What's the vibe of this trip?</div>
                <div className="flex gap-2 flex-wrap mb-8">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`flex items-center gap-2 px-4 py-2 border transition-colors font-syne text-[9px] tracking-[2px] uppercase ${selectedMood === m.id ? 'border-aura-gold/50 text-aura-gold bg-aura-gold/8' : 'border-aura-cream/8 text-aura-cream/40 hover:border-aura-gold/20'}`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep(1)} className="btn-gold flex items-center gap-2">
                  Continue to Guest Details <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {step === 1 && (
              <div>
                <h2 className="font-fraunces text-3xl text-aura-cream mb-8">Guest Details</h2>
                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Full Name', placeholder: 'Arjun Kapoor', type: 'text' },
                    { label: 'Email Address', placeholder: 'arjun@company.com', type: 'email' },
                    { label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="section-label block mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/80 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30 transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="section-label block mb-2">Special Requests</label>
                    <textarea
                      placeholder="High floor room, extra pillows, sea view preference..."
                      rows={3}
                      className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/80 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Business trip toggle */}
                <div className="surface-panel p-5 mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 size={14} className="text-aura-cream/40" />
                      <span className="font-syne text-xs text-aura-cream/60">This is a business trip</span>
                    </div>
                    <button
                      onClick={() => setIsBusiness(!isBusiness)}
                      className={`w-10 h-5 relative transition-colors ${isBusiness ? 'bg-aura-gold' : 'bg-aura-lift border border-aura-cream/15'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-aura-black transition-transform ${isBusiness ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {isBusiness && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div>
                            <label className="section-label block mb-2">Company Name</label>
                            <input type="text" placeholder="Acme Corp" className="w-full bg-aura-lift border border-aura-cream/8 px-3 py-2.5 font-syne text-xs text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                          </div>
                          <div>
                            <label className="section-label block mb-2">GSTIN</label>
                            <input type="text" placeholder="27AABCU9603R1ZM" className="w-full bg-aura-lift border border-aura-cream/8 px-3 py-2.5 font-syne text-xs text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-ghost">Back</button>
                  <button onClick={() => setStep(2)} className="btn-gold flex items-center gap-2">
                    Continue to Payment <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 2 && (
              <div>
                <h2 className="font-fraunces text-3xl text-aura-cream mb-8">Confirm & Pay</h2>

                {/* Payment method tabs */}
                <div className="section-label mb-4">Payment Method</div>
                <div className="flex gap-0 border-b border-aura-cream/8 mb-6 overflow-x-auto">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPaymentMethod(pm)}
                      className={`px-5 py-3 font-syne text-[9px] tracking-[2px] uppercase shrink-0 transition-colors relative ${paymentMethod === pm ? 'text-aura-gold' : 'text-aura-cream/30 hover:text-aura-cream/60'}`}
                    >
                      {pm}
                      {paymentMethod === pm && <motion.div layoutId="payment-tab" className="absolute bottom-0 left-0 right-0 h-px bg-aura-gold" />}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={paymentMethod} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {paymentMethod === 'Card' && (
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="section-label block mb-2">Card Number</label>
                          <input placeholder="4242 4242 4242 4242" className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="section-label block mb-2">Expiry</label>
                            <input placeholder="MM / YY" className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                          </div>
                          <div>
                            <label className="section-label block mb-2">CVV</label>
                            <input placeholder="•••" type="password" className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                          </div>
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'UPI' && (
                      <div className="flex gap-6 items-start mb-6">
                        <div className="flex-1">
                          <label className="section-label block mb-2">UPI ID</label>
                          <input placeholder="yourname@upi" className="w-full bg-aura-lift border border-aura-cream/8 px-4 py-3 font-syne text-sm text-aura-cream/60 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30" />
                        </div>
                        <div className="w-24 h-24 bg-aura-lift border border-aura-cream/8 flex items-center justify-center shrink-0">
                          <div className="text-center">
                            <p className="text-2xl">📱</p>
                            <p className="font-syne text-[8px] text-aura-cream/30 mt-1">QR</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {(paymentMethod === 'Corporate Wallet' || paymentMethod === 'Pay Later') && (
                      <div className="ai-suggestion p-5 mb-6">
                        <p className="font-syne text-xs text-aura-cream/50">
                          {paymentMethod === 'Corporate Wallet' ? '🏢 Corporate wallet balance: ₹2,40,000. This booking will be charged to your company account.' : '⏳ Pay Later activated. You can pay up to 3 days before check-in with no additional charges.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Price breakdown */}
                <div className="surface-panel p-5 mb-6">
                  <div className="section-label mb-4">Order Summary</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-syne text-[10px] text-aura-cream/40">E-WOW Suite × 3 nights</span>
                      <span className="font-syne text-[10px] text-aura-cream/60">₹{basePrice.toLocaleString()}</span>
                    </div>
                    {addOns.filter(a => selectedAddOns.includes(a.id)).map(a => (
                      <div key={a.id} className="flex justify-between">
                        <span className="font-syne text-[10px] text-aura-cream/40">{a.label}</span>
                        <span className="font-syne text-[10px] text-aura-cream/60">₹{a.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="gold-divider my-2" />
                    <div className="flex justify-between">
                      <span className="font-syne text-[10px] text-aura-cream/40">CGST 9% (SAC 996311)</span>
                      <span className="font-syne text-[10px] text-aura-cream/50">₹{cgst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-syne text-[10px] text-aura-cream/40">SGST 9%</span>
                      <span className="font-syne text-[10px] text-aura-cream/50">₹{sgst.toLocaleString()}</span>
                    </div>
                    <div className="gold-divider my-2" />
                    <div className="flex justify-between">
                      <span className="font-fraunces text-lg text-aura-cream">Total</span>
                      <span className="font-fraunces text-2xl text-aura-gold">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost">Back</button>
                  <button
                    onClick={() => setConfirmed(true)}
                    className="btn-gold flex items-center gap-2 flex-1 justify-center"
                  >
                    <Sparkles size={12} />
                    Confirm Booking — ₹{total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
