import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Globe, Shield, CreditCard, ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'Preferences',
    items: [
      { icon: Moon, label: 'Dark Mode', description: 'Always enabled for Roamio', toggle: true, defaultOn: true },
      { icon: Globe, label: 'Language', description: 'English (US)', toggle: false },
      { icon: CreditCard, label: 'Currency', description: 'USD — US Dollar', toggle: false },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: Bell, label: 'Booking Updates', description: 'Get notified about your reservations', toggle: true, defaultOn: true },
      { icon: Bell, label: 'Concierge Replies', description: 'Alerts when concierge responds', toggle: true, defaultOn: true },
      { icon: Bell, label: 'Rewards & Offers', description: 'Exclusive member deals', toggle: true, defaultOn: false },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: Shield, label: 'Two-Factor Authentication', description: 'Add extra security to your account', toggle: true, defaultOn: false },
      { icon: Shield, label: 'Data Sharing', description: 'Share usage data to improve Aura', toggle: true, defaultOn: false },
    ],
  },
];

const ToggleSwitch = ({ defaultOn }: { defaultOn: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? 'bg-aura-gold' : 'bg-aura-cream/10'}`}
    >
      <motion.span
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
};

const Settings = () => {
  return (
    <div className="min-h-screen bg-aura-black pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-syne text-[10px] tracking-[4px] uppercase text-aura-gold mb-2">Account</p>
          <h1 className="font-fraunces text-4xl font-light text-aura-cream">Settings</h1>
        </motion.div>

        {/* Sections */}
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: si * 0.1 } }}
            className="mb-8"
          >
            <p className="font-syne text-[9px] tracking-[3px] uppercase text-aura-gold/60 mb-3 px-1">
              {section.title}
            </p>
            <div className="rounded-xl border border-aura-gold/10 overflow-hidden">
              {section.items.map((item, ii) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-aura-gold/5 transition-colors ${
                    ii < section.items.length - 1 ? 'border-b border-aura-gold/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-aura-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-aura-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-syne text-xs text-aura-cream">{item.label}</p>
                    <p className="text-[11px] text-aura-cream/30 mt-0.5">{item.description}</p>
                  </div>
                  {item.toggle ? (
                    <ToggleSwitch defaultOn={item.defaultOn ?? false} />
                  ) : (
                    <ChevronRight size={14} className="text-aura-cream/20 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          className="mt-10"
        >
          <p className="font-syne text-[9px] tracking-[3px] uppercase text-red-400/50 mb-3 px-1">Danger Zone</p>
          <div className="rounded-xl border border-red-400/10 overflow-hidden">
            <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-400/5 transition-colors border-b border-red-400/5">
              <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center">
                <Shield size={14} className="text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-syne text-xs text-red-400/80">Delete Account</p>
                <p className="text-[11px] text-aura-cream/20 mt-0.5">Permanently remove your account and data</p>
              </div>
              <ChevronRight size={14} className="text-red-400/20" />
            </button>
          </div>
        </motion.div>

        {/* Version */}
        <p className="text-center font-syne text-[10px] tracking-[2px] text-aura-cream/10 mt-12">
          Roamio · VERSION 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;