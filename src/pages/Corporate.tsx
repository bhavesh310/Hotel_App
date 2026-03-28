import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Download, Settings, Users, FileText, Building2, TrendingUp,
  CheckCircle, Clock, AlertCircle, CreditCard, Plus, Search,
  X, TrendingDown, BarChart2, Calendar, ChevronDown, Star,
} from 'lucide-react';

// ─── Shared data ──────────────────────────────────────────────────────────────
const spendData = [
  { month: 'Aug', spend: 124000 },
  { month: 'Sep', spend: 98000 },
  { month: 'Oct', spend: 187000 },
  { month: 'Nov', spend: 210000 },
  { month: 'Dec', spend: 165000 },
  { month: 'Jan', spend: 230000 },
  { month: 'Feb', spend: 195000 },
  { month: 'Mar', spend: 245000 },
];

const bookings = [
  { employee: 'Arjun Kapoor', hotel: 'W Goa', dates: 'Mar 22–25', amount: 65000, status: 'confirmed' },
  { employee: 'Priya Shah', hotel: 'ITC Maratha', dates: 'Mar 18–20', amount: 22000, status: 'confirmed' },
  { employee: 'Rahul Mehta', hotel: 'The Grand Meridian', dates: 'Mar 15–17', amount: 16800, status: 'pending' },
  { employee: 'Sneha Raut', hotel: 'Taj Lands End', dates: 'Mar 10–12', amount: 28000, status: 'confirmed' },
  { employee: 'Karan Desai', hotel: 'Hyatt Regency', dates: 'Apr 2–4', amount: 19500, status: 'pending' },
];

// ─── Billing data ─────────────────────────────────────────────────────────────
type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: string; ref: string; hotel: string; city: string;
  employee: string; dept: string; amount: number; nights: number;
  checkIn: string; checkOut: string; status: InvoiceStatus;
  issuedOn: string; dueDate: string;
}

const invoices: Invoice[] = [
  { id: '1', ref: 'INV-2024-0381', hotel: 'W Goa', city: 'Goa', employee: 'Arjun Kapoor', dept: 'Engineering', amount: 148500, nights: 3, checkIn: 'Mar 22', checkOut: 'Mar 25', status: 'paid', issuedOn: 'Mar 25, 2024', dueDate: 'Apr 10, 2024' },
  { id: '2', ref: 'INV-2024-0374', hotel: 'The Leela Palace', city: 'Mumbai', employee: 'Priya Shah', dept: 'Design', amount: 212000, nights: 4, checkIn: 'Mar 18', checkOut: 'Mar 22', status: 'paid', issuedOn: 'Mar 22, 2024', dueDate: 'Apr 7, 2024' },
  { id: '3', ref: 'INV-2024-0368', hotel: 'Taj Lake Palace', city: 'Udaipur', employee: 'Rahul Mehta', dept: 'Product', amount: 178900, nights: 2, checkIn: 'Mar 14', checkOut: 'Mar 16', status: 'pending', issuedOn: 'Mar 16, 2024', dueDate: 'Apr 1, 2024' },
  { id: '4', ref: 'INV-2024-0355', hotel: 'Aman New Delhi', city: 'Delhi', employee: 'Sneha Raut', dept: 'Sales', amount: 290000, nights: 5, checkIn: 'Mar 8', checkOut: 'Mar 13', status: 'paid', issuedOn: 'Mar 13, 2024', dueDate: 'Mar 28, 2024' },
  { id: '5', ref: 'INV-2024-0342', hotel: 'ITC Grand Chola', city: 'Chennai', employee: 'Karan Desai', dept: 'HR', amount: 96500, nights: 2, checkIn: 'Mar 4', checkOut: 'Mar 6', status: 'overdue', issuedOn: 'Mar 6, 2024', dueDate: 'Mar 21, 2024' },
  { id: '6', ref: 'INV-2024-0338', hotel: 'Ritz-Carlton Bangalore', city: 'Bangalore', employee: 'Arjun Kapoor', dept: 'Engineering', amount: 134200, nights: 3, checkIn: 'Feb 28', checkOut: 'Mar 2', status: 'paid', issuedOn: 'Mar 2, 2024', dueDate: 'Mar 17, 2024' },
  { id: '7', ref: 'INV-2024-0321', hotel: 'Four Seasons Mumbai', city: 'Mumbai', employee: 'Priya Shah', dept: 'Sales', amount: 185000, nights: 3, checkIn: 'Feb 22', checkOut: 'Feb 25', status: 'pending', issuedOn: 'Feb 25, 2024', dueDate: 'Mar 11, 2024' },
];

interface PayCard { id: string; brand: string; last4: string; expiry: string; holder: string; isDefault: boolean; bg: string; }
const payCards: PayCard[] = [
  { id: '1', brand: 'Visa', last4: '4821', expiry: '09/27', holder: 'ACME CORP', isDefault: true, bg: 'linear-gradient(135deg,#1a2240,#0a0c14)' },
  { id: '2', brand: 'Mastercard', last4: '7734', expiry: '03/26', holder: 'ACME CORP', isDefault: false, bg: 'linear-gradient(135deg,#1e1814,#0a0c14)' },
];

const monthlyBillingSpend = [
  { month: 'Oct', amount: 680000 }, { month: 'Nov', amount: 920000 },
  { month: 'Dec', amount: 1140000 }, { month: 'Jan', amount: 780000 },
  { month: 'Feb', amount: 1020000 }, { month: 'Mar', amount: 1245100 },
];

const deptColors: Record<string, string> = {
  Engineering: '#52C5BD', Design: '#D4A843', Product: '#8B7FD4', Sales: '#D47F8B', HR: '#7FB5D4',
};

const statusCfg: Record<InvoiceStatus, { label: string; color: string; bg: string; Icon: typeof CheckCircle }> = {
  paid:    { label: 'Paid',    color: '#52C5BD', bg: 'rgba(82,197,189,0.12)',  Icon: CheckCircle },
  pending: { label: 'Pending', color: '#D4A843', bg: 'rgba(212,168,67,0.12)', Icon: Clock },
  overdue: { label: 'Overdue', color: '#D47F8B', bg: 'rgba(212,127,139,0.12)', Icon: AlertCircle },
};

// ─── Sidebar config ───────────────────────────────────────────────────────────
const sidebarLinks = ['Overview', 'Employees', 'Bookings', 'Expenses', 'Policy', 'Billing'];
const sidebarIcons: Record<string, React.ReactNode> = {
  Overview:  <TrendingUp size={14} />,
  Employees: <Users size={14} />,
  Bookings:  <Building2 size={14} />,
  Expenses:  <FileText size={14} />,
  Policy:    <Settings size={14} />,
  Billing:   <Download size={14} />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtK  = (n: number) => `₹${(n / 1000).toFixed(0)}K`;
const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ─── Overview chart tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-aura-panel border border-aura-gold/20 px-4 py-3">
        <p className="font-syne text-[9px] text-aura-cream/40 tracking-[2px] mb-1">{label}</p>
        <p className="font-fraunces text-lg text-aura-gold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// ─── Billing: mini bar chart ──────────────────────────────────────────────────
const BillingChart = () => {
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...monthlyBillingSpend.map(m => m.amount));
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {monthlyBillingSpend.map((m, i) => {
        const pct = (m.amount / max) * 100;
        const isCur = i === monthlyBillingSpend.length - 1;
        const isH = hov === i;
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1" style={{ height: '100%' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <div className="flex-1 w-full flex flex-col justify-end" style={{ height: 88 }}>
              {isH && (
                <p className="font-syne text-[8px] text-aura-gold text-center mb-1 whitespace-nowrap">{fmtK(m.amount)}</p>
              )}
              <motion.div className="w-full"
                initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                style={{
                  background: isCur
                    ? 'linear-gradient(180deg,rgba(212,168,67,0.9),rgba(212,168,67,0.35))'
                    : isH ? 'rgba(212,168,67,0.3)' : 'rgba(240,235,225,0.07)',
                  transition: 'background 0.2s',
                }} />
            </div>
            <p className="font-syne text-[8px] text-aura-cream/25 tracking-[1px]">{m.month}</p>
          </div>
        );
      })}
    </div>
  );
};

// ─── Billing: credit card visual ─────────────────────────────────────────────
const CardVisual = ({ card }: { card: PayCard }) => (
  <div className="relative w-full rounded-lg overflow-hidden select-none"
    style={{ aspectRatio: '1.6/1', background: card.bg, border: '1px solid rgba(212,168,67,0.15)' }}>
    <div className="absolute inset-0 opacity-15"
      style={{ background: 'radial-gradient(circle at 80% 20%,rgba(212,168,67,0.7) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(212,168,67,0.3) 0%,transparent 50%)' }} />
    {/* Chip */}
    <div className="absolute top-5 left-5 w-8 h-5 rounded-sm border border-aura-gold/40"
      style={{ background: 'linear-gradient(135deg,rgba(212,168,67,0.5),rgba(212,168,67,0.2))' }}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-px p-0.5">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-aura-gold/20 rounded-[1px]" />)}
      </div>
    </div>
    {/* Brand */}
    <div className="absolute top-5 right-4">
      {card.brand === 'Visa'
        ? <p className="font-fraunces text-base italic text-aura-gold/80 tracking-wider">VISA</p>
        : <div className="flex"><div className="w-4 h-4 rounded-full bg-red-500/70" /><div className="w-4 h-4 rounded-full bg-yellow-500/70 -ml-1.5" /></div>}
    </div>
    <div className="absolute bottom-8 left-5 font-syne text-[10px] text-aura-cream/50 tracking-[3px]">
      •••• •••• •••• {card.last4}
    </div>
    <div className="absolute bottom-3 left-5 right-4 flex justify-between items-end">
      <div>
        <p className="font-syne text-[6px] text-aura-cream/20 tracking-[2px] uppercase mb-0.5">Holder</p>
        <p className="font-syne text-[9px] text-aura-cream/60">{card.holder}</p>
      </div>
      <div className="text-right">
        <p className="font-syne text-[6px] text-aura-cream/20 tracking-[2px] uppercase mb-0.5">Expires</p>
        <p className="font-syne text-[9px] text-aura-cream/60">{card.expiry}</p>
      </div>
    </div>
    {card.isDefault && (
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <span className="font-syne text-[6px] tracking-[2px] uppercase text-aura-gold/60 border border-aura-gold/20 bg-aura-gold/5 px-2 py-0.5">Default</span>
      </div>
    )}
  </div>
);

// ─── Billing: invoice detail modal ───────────────────────────────────────────
const InvoiceModal = ({ inv, onClose }: { inv: Invoice; onClose: () => void }) => {
  const { label, color, bg, Icon } = statusCfg[inv.status];
  const tax = Math.round(inv.amount * 0.18);
  const base = inv.amount - tax;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,5,8,0.9)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-md relative overflow-hidden"
        style={{ background: '#0e0c10', border: '1px solid rgba(212,168,67,0.12)' }}
        onClick={e => e.stopPropagation()}>
        <div className="h-px bg-gradient-to-r from-transparent via-aura-gold/50 to-transparent" />
        <div className="p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-gold/60 mb-1">Invoice</p>
              <h2 className="font-fraunces text-2xl text-aura-cream">{inv.ref}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm" style={{ background: bg }}>
                <Icon size={10} style={{ color }} />
                <span className="font-syne text-[9px] tracking-[1px]" style={{ color }}>{label}</span>
              </div>
              <button onClick={onClose} className="text-aura-cream/20 hover:text-aura-cream transition-colors"><X size={15} /></button>
            </div>
          </div>
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 border border-aura-cream/5 bg-white/[0.02]">
            {[
              { l: 'Property', v: inv.hotel, s: inv.city },
              { l: 'Guest', v: inv.employee, s: inv.dept },
              { l: 'Check In', v: `${inv.checkIn}, 2024`, s: null },
              { l: 'Check Out', v: `${inv.checkOut}, 2024`, s: null },
            ].map(r => (
              <div key={r.l}>
                <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/25 mb-1">{r.l}</p>
                <p className={`font-syne text-xs ${r.l === 'Property' ? 'font-fraunces text-sm text-aura-cream' : 'text-aura-cream/60'}`}>{r.v}</p>
                {r.s && <p className="font-syne text-[9px] text-aura-cream/30 mt-0.5">{r.s}</p>}
              </div>
            ))}
          </div>
          {/* Line items */}
          <div className="space-y-2 mb-6">
            {[
              { label: `Room rate (${inv.nights} nights)`, amount: base },
              { label: 'Taxes & GST (18%)', amount: tax },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-aura-cream/5">
                <span className="font-syne text-xs text-aura-cream/40">{item.label}</span>
                <span className="font-syne text-xs text-aura-cream/55">{fmtFull(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <span className="font-syne text-[10px] tracking-[2px] uppercase text-aura-cream/40">Total</span>
              <span className="font-fraunces text-xl text-aura-gold">{fmtFull(inv.amount)}</span>
            </div>
          </div>
          {/* Dates row */}
          <div className="flex gap-4 mb-7 p-4 border border-aura-cream/5">
            <div className="flex-1">
              <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/25 mb-1">Issued</p>
              <p className="font-syne text-[10px] text-aura-cream/45">{inv.issuedOn}</p>
            </div>
            <div className="w-px bg-aura-cream/5" />
            <div className="flex-1">
              <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/25 mb-1">Due Date</p>
              <p className="font-syne text-[10px]" style={{ color: inv.status === 'overdue' ? '#D47F8B' : 'rgba(240,235,225,0.45)' }}>{inv.dueDate}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-aura-cream/10 font-syne text-[9px] tracking-[2px] uppercase text-aura-cream/35 hover:text-aura-cream hover:border-aura-gold/25 transition-colors">
              <Download size={11} /> PDF
            </button>
            {inv.status !== 'paid' && (
              <button className="flex-1 py-3 font-syne text-[9px] tracking-[2px] uppercase text-aura-black bg-aura-gold hover:bg-aura-gold/85 transition-colors">
                Pay Now
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Billing: add card modal ──────────────────────────────────────────────────
const AddCardModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(6,5,8,0.9)', backdropFilter: 'blur(14px)' }}
    onClick={onClose}>
    <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
      className="w-full max-w-xs p-7 relative"
      style={{ background: '#0e0c10', border: '1px solid rgba(212,168,67,0.12)' }}
      onClick={e => e.stopPropagation()}>
      <div className="h-px bg-gradient-to-r from-transparent via-aura-gold/40 to-transparent mb-7" />
      <button onClick={onClose} className="absolute top-5 right-5 text-aura-cream/20 hover:text-aura-cream transition-colors"><X size={14} /></button>
      <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-gold/60 mb-1">Add</p>
      <h3 className="font-fraunces text-xl text-aura-cream mb-6">Payment Method</h3>
      {[{ l: 'Card Number', ph: '•••• •••• •••• ••••' }, { l: 'Card Holder', ph: 'COMPANY NAME' }].map(f => (
        <div key={f.l} className="mb-4">
          <p className="font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/25 mb-2">{f.l}</p>
          <input placeholder={f.ph} className="w-full px-4 py-3 bg-transparent font-syne text-xs text-aura-cream/50 placeholder-aura-cream/15 outline-none border border-aura-cream/8 focus:border-aura-gold/30 transition-colors" />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[{ l: 'Expiry', ph: 'MM/YY' }, { l: 'CVV', ph: '•••' }].map(f => (
          <div key={f.l}>
            <p className="font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/25 mb-2">{f.l}</p>
            <input placeholder={f.ph} className="w-full px-4 py-3 bg-transparent font-syne text-xs text-aura-cream/50 placeholder-aura-cream/15 outline-none border border-aura-cream/8 focus:border-aura-gold/30 transition-colors" />
          </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full py-3 font-syne text-[9px] tracking-[2px] uppercase bg-aura-gold text-aura-black hover:bg-aura-gold/85 transition-colors">
        Add Card
      </button>
    </motion.div>
  </motion.div>
);

// ─── Billing tab (full) ───────────────────────────────────────────────────────
const BillingTab = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  const totalSpend  = invoices.reduce((s, i) => s + i.amount, 0);
  const paidSpend   = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingSpend = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const overdueSpend = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    return (filterStatus === 'all' || inv.status === filterStatus)
      && (!q || inv.ref.toLowerCase().includes(q) || inv.hotel.toLowerCase().includes(q) || inv.employee.toLowerCase().includes(q));
  });

  // Dept breakdown
  const deptTotals = invoices.reduce((acc, inv) => {
    acc[inv.dept] = (acc[inv.dept] || 0) + inv.amount;
    return acc;
  }, {} as Record<string, number>);

  const surface = { background: 'rgba(240,235,225,0.025)', border: '1px solid rgba(240,235,225,0.06)' };

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-gold/60 mb-1">Corporate Account</p>
          <h1 className="font-fraunces text-3xl text-aura-cream font-light">Billing</h1>
          <p className="font-syne text-[10px] text-aura-cream/30 mt-1">Invoices, payments & corporate spend — Mar 2024</p>
        </div>
        <button className="btn-gold flex items-center gap-2 text-[9px]">
          <Download size={11} /> Export All
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {[
          { label: 'Total Spend',  value: fmtFull(totalSpend),   sub: `${invoices.length} invoices`, accent: '#D4A843', trend: '+12%', up: true },
          { label: 'Paid',         value: fmtFull(paidSpend),    sub: `${invoices.filter(i => i.status === 'paid').length} invoices`, accent: '#52C5BD', trend: null },
          { label: 'Pending',      value: fmtFull(pendingSpend), sub: `${invoices.filter(i => i.status === 'pending').length} invoices`, accent: '#D4A843', trend: null },
          { label: 'Overdue',      value: fmtFull(overdueSpend), sub: `${invoices.filter(i => i.status === 'overdue').length} invoice`, accent: '#D47F8B', trend: null },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-5 relative overflow-hidden" style={surface}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${kpi.accent}50,transparent)` }} />
            <p className="font-syne text-[8px] tracking-[3px] uppercase text-aura-cream/25 mb-2">{kpi.label}</p>
            <p className="font-fraunces text-lg mb-1" style={{ color: kpi.accent }}>{kpi.value}</p>
            <div className="flex items-center justify-between">
              <p className="font-syne text-[9px] text-aura-cream/20">{kpi.sub}</p>
              {kpi.trend && (
                <div className="flex items-center gap-0.5">
                  <TrendingUp size={9} className="text-aura-green" />
                  <span className="font-syne text-[9px] text-aura-green">{kpi.trend}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle: chart + payment methods */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-7">
        {/* Spend chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-3 p-6" style={surface}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-cream/25 mb-1">Monthly Spend</p>
              <p className="font-fraunces text-2xl text-aura-gold">{fmtK(monthlyBillingSpend[5].amount)}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp size={9} className="text-aura-green" />
                <span className="font-syne text-[9px] text-aura-green">+22% vs last month</span>
              </div>
            </div>
            <BarChart2 size={13} className="text-aura-cream/15" />
          </div>
          <BillingChart />
        </motion.div>

        {/* Payment methods */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6" style={surface}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-cream/25">Payment Methods</p>
            <button onClick={() => setShowAddCard(true)}
              className="flex items-center gap-1 text-aura-cream/25 hover:text-aura-gold transition-colors font-syne text-[9px]">
              <Plus size={10} /> Add
            </button>
          </div>
          <div className="mb-3"><CardVisual card={payCards[activeCard]} /></div>
          {/* Dots */}
          <div className="flex gap-1.5 justify-center mb-4">
            {payCards.map((_, i) => (
              <button key={i} onClick={() => setActiveCard(i)} className="h-1 transition-all"
                style={{ width: activeCard === i ? 20 : 8, background: activeCard === i ? 'rgba(212,168,67,0.8)' : 'rgba(240,235,225,0.12)' }} />
            ))}
          </div>
          {/* Card list */}
          <div className="space-y-2">
            {payCards.map((c, i) => (
              <button key={c.id} onClick={() => setActiveCard(i)} className="w-full flex items-center gap-3 p-3 transition-all text-left"
                style={{
                  background: activeCard === i ? 'rgba(212,168,67,0.06)' : 'rgba(240,235,225,0.02)',
                  border: `1px solid ${activeCard === i ? 'rgba(212,168,67,0.22)' : 'rgba(240,235,225,0.05)'}`,
                }}>
                <CreditCard size={12} style={{ color: activeCard === i ? '#D4A843' : 'rgba(240,235,225,0.22)' }} />
                <div className="flex-1">
                  <p className="font-syne text-[10px] text-aura-cream/55">{c.brand} •••• {c.last4}</p>
                  <p className="font-syne text-[8px] text-aura-cream/22">Exp {c.expiry}</p>
                </div>
                {c.isDefault && <span className="font-syne text-[7px] text-aura-gold/45 tracking-[1px] uppercase">Default</span>}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dept breakdown */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="p-6 mb-7" style={surface}>
        <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-cream/25 mb-5">Spend by Department</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {Object.entries(deptTotals).map(([dept, amt]) => {
            const pct = Math.round((amt / totalSpend) * 100);
            return (
              <div key={dept}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: deptColors[dept] || '#888' }} />
                  <p className="font-syne text-[9px] text-aura-cream/45">{dept}</p>
                </div>
                <div className="h-1 w-full rounded-full mb-1.5" style={{ background: 'rgba(240,235,225,0.06)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: deptColors[dept] || '#888' }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} />
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="font-fraunces text-sm" style={{ color: deptColors[dept] || '#888' }}>{fmtK(amt)}</p>
                  <p className="font-syne text-[9px] text-aura-cream/20">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Invoices table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={surface}>
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-aura-cream/5 flex-wrap gap-3">
          <p className="font-syne text-[8px] tracking-[4px] uppercase text-aura-cream/25">
            Invoices <span className="ml-2 text-aura-gold/60">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-cream/20" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-7 pr-3 py-2 font-syne text-[10px] text-aura-cream/45 placeholder-aura-cream/18 bg-transparent outline-none w-36 border border-aura-cream/8 focus:border-aura-gold/25 transition-colors" />
            </div>
            {/* Status filters */}
            <div className="flex gap-1">
              {(['all', 'paid', 'pending', 'overdue'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className="px-3 py-1.5 font-syne text-[8px] tracking-[1.5px] uppercase transition-all"
                  style={{
                    background: filterStatus === s ? 'rgba(212,168,67,0.1)' : 'transparent',
                    color: filterStatus === s ? '#D4A843' : 'rgba(240,235,225,0.22)',
                    border: `1px solid ${filterStatus === s ? 'rgba(212,168,67,0.25)' : 'rgba(240,235,225,0.05)'}`,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-aura-cream/5">
                {['Invoice', 'Property', 'Employee', 'Amount', 'Status', ''].map((h, i) => (
                  <th key={i} className={`py-3 font-syne text-[8px] tracking-[2px] uppercase text-aura-cream/20 text-left ${i === 0 ? 'pl-6 pr-3' : i === 5 ? 'pl-3 pr-6 w-10' : 'px-3'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const { label, color, bg, Icon } = statusCfg[inv.status];
                return (
                  <motion.tr key={inv.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-aura-cream/5 cursor-pointer transition-colors hover:bg-aura-gold/[0.03]"
                    onClick={() => setSelectedInv(inv)}>
                    <td className="py-4 pl-6 pr-3">
                      <p className="font-syne text-[10px] text-aura-gold tracking-[1px]">{inv.ref}</p>
                      <p className="font-syne text-[9px] text-aura-cream/22 mt-0.5">{inv.issuedOn}</p>
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-syne text-xs text-aura-cream/60">{inv.hotel}</p>
                      <p className="font-syne text-[9px] text-aura-cream/28 mt-0.5">{inv.city} · {inv.nights}N</p>
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-syne text-xs text-aura-cream/55">{inv.employee}</p>
                      <span className="font-syne text-[8px] px-2 py-0.5 mt-1 inline-block rounded-sm"
                        style={{ background: `${deptColors[inv.dept] || '#888'}18`, color: deptColors[inv.dept] || '#888' }}>
                        {inv.dept}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-fraunces text-sm text-aura-cream/80">{fmtFull(inv.amount)}</p>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-sm" style={{ background: bg }}>
                        <Icon size={9} style={{ color }} />
                        <span className="font-syne text-[8px] tracking-[1px]" style={{ color }}>{label}</span>
                      </div>
                    </td>
                    <td className="py-4 pl-3 pr-6" onClick={e => e.stopPropagation()}>
                      <button className="text-aura-cream/18 hover:text-aura-gold transition-colors">
                        <Download size={12} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={22} className="text-aura-cream/10 mx-auto mb-3" />
              <p className="font-syne text-xs text-aura-cream/22">No invoices match your filters</p>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-aura-cream/5">
          <p className="font-syne text-[9px] text-aura-cream/18">
            Showing {filtered.length} of {invoices.length} invoices
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className="w-7 h-7 font-syne text-[9px] transition-all"
                style={{
                  background: p === 1 ? 'rgba(212,168,67,0.12)' : 'transparent',
                  color: p === 1 ? '#D4A843' : 'rgba(240,235,225,0.22)',
                  border: `1px solid ${p === 1 ? 'rgba(212,168,67,0.22)' : 'rgba(240,235,225,0.06)'}`,
                }}>{p}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedInv && <InvoiceModal inv={selectedInv} onClose={() => setSelectedInv(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />}
      </AnimatePresence>
    </>
  );
};

// ─── Employees placeholder ────────────────────────────────────────────────────
const EmployeesTab = () => (
  <div>
    <div className="section-label mb-3">Team Management</div>
    <div className="flex items-center justify-between mb-8">
      <h1 className="font-fraunces text-3xl text-aura-cream">Employees</h1>
      <button className="btn-gold flex items-center gap-2 text-[9px]"><Plus size={11} /> Add Employee</button>
    </div>
    <div className="surface-panel overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-aura-cream/5">
            {['Name', 'Department', 'Role', 'Total Spent', 'Trips', 'Status'].map(h => (
              <th key={h} className="px-5 py-3 text-left font-syne text-[8px] tracking-[3px] text-aura-cream/25 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Arjun Kapoor', dept: 'Engineering', role: 'Senior Engineer', spent: 282700, trips: 2, active: true },
            { name: 'Priya Shah', dept: 'Design', role: 'Lead Designer', spent: 397000, trips: 2, active: true },
            { name: 'Rahul Mehta', dept: 'Product', role: 'Product Manager', spent: 178900, trips: 1, active: false },
            { name: 'Sneha Raut', dept: 'Sales', role: 'Sales Lead', spent: 290000, trips: 1, active: true },
            { name: 'Karan Desai', dept: 'HR', role: 'HR Manager', spent: 96500, trips: 1, active: false },
          ].map((e, i) => (
            <tr key={i} className="border-b border-aura-cream/5 hover:bg-aura-lift/40 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-fraunces text-[10px]"
                    style={{ background: `${deptColors[e.dept] || '#888'}20`, color: deptColors[e.dept] || '#888' }}>
                    {e.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-syne text-xs text-aura-cream/60">{e.name}</span>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className="font-syne text-[9px] px-2 py-0.5 rounded-sm"
                  style={{ background: `${deptColors[e.dept] || '#888'}18`, color: deptColors[e.dept] || '#888' }}>{e.dept}</span>
              </td>
              <td className="px-5 py-3 font-syne text-[10px] text-aura-cream/35">{e.role}</td>
              <td className="px-5 py-3 font-fraunces text-sm text-aura-cream/70">{fmtFull(e.spent)}</td>
              <td className="px-5 py-3 font-syne text-xs text-aura-cream/40">{e.trips}</td>
              <td className="px-5 py-3">
                <span className="flex items-center gap-1.5 w-fit font-syne text-[8px] tracking-[1.5px] uppercase px-2 py-1"
                  style={{ background: e.active ? 'rgba(82,197,189,0.1)' : 'rgba(240,235,225,0.04)', color: e.active ? '#52C5BD' : 'rgba(240,235,225,0.25)' }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: e.active ? '#52C5BD' : 'rgba(240,235,225,0.25)' }} />
                  {e.active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Bookings tab ─────────────────────────────────────────────────────────────
const BookingsTab = () => (
  <div>
    <div className="section-label mb-3">Booking Management</div>
    <div className="flex items-center justify-between mb-8">
      <h1 className="font-fraunces text-3xl text-aura-cream">All Bookings</h1>
      <div className="flex gap-3">
        {(['All', 'Confirmed', 'Pending'] as const).map(s => (
          <button key={s} className="px-3 py-1.5 font-syne text-[9px] tracking-[1.5px] uppercase border border-aura-cream/10 text-aura-cream/30 hover:border-aura-gold/25 hover:text-aura-gold transition-colors">{s}</button>
        ))}
      </div>
    </div>
    <div className="surface-panel overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-aura-cream/5">
            {['Employee', 'Hotel', 'Dates', 'Amount', 'Status', 'Action'].map(h => (
              <th key={h} className="px-5 py-3 text-left font-syne text-[8px] tracking-[3px] text-aura-cream/25 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="border-b border-aura-cream/5 hover:bg-aura-lift/40 transition-colors">
              <td className="px-5 py-3 font-syne text-xs text-aura-cream/60">{b.employee}</td>
              <td className="px-5 py-3 font-syne text-xs text-aura-cream/40">{b.hotel}</td>
              <td className="px-5 py-3 font-syne text-[10px] text-aura-cream/30">{b.dates}</td>
              <td className="px-5 py-3 font-fraunces text-base text-aura-cream/70">₹{b.amount.toLocaleString()}</td>
              <td className="px-5 py-3">
                <span className={`flex items-center gap-1.5 w-fit font-syne text-[8px] tracking-[2px] uppercase px-2 py-1 ${b.status === 'confirmed' ? 'text-aura-green bg-aura-green/10' : 'text-aura-gold bg-aura-gold/8'}`}>
                  {b.status === 'confirmed' ? <CheckCircle size={8} /> : <Clock size={8} />} {b.status}
                </span>
              </td>
              <td className="px-5 py-3">
                {b.status === 'pending' && (
                  <button className="font-syne text-[8px] tracking-[1.5px] uppercase text-aura-gold border border-aura-gold/20 px-3 py-1 hover:bg-aura-gold/8 transition-colors">
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Main Corporate component ─────────────────────────────────────────────────
export default function Corporate() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [maxBudget, setMaxBudget] = useState(15000);
  const [allowedStars, setAllowedStars] = useState([4, 5]);
  const [requireApproval, setRequireApproval] = useState(true);

  return (
    <div className="min-h-screen bg-aura-black pt-16 flex">
      {/* ── Sidebar ── */}
      <div className="hidden md:flex flex-col w-52 shrink-0 border-r border-aura-cream/5 bg-aura-dark">
        <div className="p-6 border-b border-aura-cream/5">
          <p className="font-fraunces text-sm text-aura-cream">Acme Corp</p>
          <p className="font-syne text-[9px] text-aura-cream/30 tracking-[2px] mt-0.5">CORPORATE ACCOUNT</p>
        </div>
        <nav className="p-4 flex-1">
          {sidebarLinks.map(link => (
            <button key={link} onClick={() => setActiveTab(link)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 font-syne text-[10px] tracking-[2px] uppercase text-left transition-colors ${activeTab === link ? 'text-aura-gold bg-aura-gold/8 border border-aura-gold/15' : 'text-aura-cream/30 hover:text-aura-cream/60 hover:bg-aura-lift'}`}>
              <span className={activeTab === link ? 'text-aura-gold' : 'text-aura-cream/20'}>{sidebarIcons[link]}</span>
              {link}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>

              {/* ── Overview ── */}
              {activeTab === 'Overview' && (
                <div>
                  <div className="section-label mb-3">Dashboard</div>
                  <h1 className="font-fraunces text-3xl text-aura-cream mb-8">Corporate Overview</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Total Spend', value: '₹2.45L', sub: 'This month', color: 'text-aura-gold' },
                      { label: 'Active Trips', value: '3', sub: '2 in progress', color: 'text-aura-teal' },
                      { label: 'Pending Approvals', value: '2', sub: 'Needs review', color: 'text-aura-rose' },
                      { label: 'Budget Used', value: '67%', sub: 'Of ₹3.65L', color: 'text-aura-violet' },
                    ].map((s, i) => (
                      <div key={i} className="luxury-card p-5">
                        <p className="section-label mb-2">{s.label}</p>
                        <p className={`font-fraunces text-3xl ${s.color}`}>{s.value}</p>
                        <p className="font-syne text-[9px] text-aura-cream/25 mt-1">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="surface-panel p-6 mb-8">
                    <div className="section-label mb-4">Monthly Spend Trend</div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendData} barSize={24}>
                          <XAxis dataKey="month" axisLine={false} tickLine={false}
                            tick={{ fill: 'rgba(240,235,225,0.3)', fontSize: 9, fontFamily: 'Syne', letterSpacing: 2 }} />
                          <YAxis hide />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,168,67,0.05)' }} />
                          <Bar dataKey="spend" fill="#D4A843" fillOpacity={0.8} radius={0} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="section-label mb-4">Recent Bookings</div>
                  <div className="surface-panel overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-aura-cream/5">
                          {['Employee', 'Hotel', 'Dates', 'Amount', 'Status'].map(h => (
                            <th key={h} className="px-5 py-3 text-left font-syne text-[8px] tracking-[3px] text-aura-cream/25 uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => (
                          <tr key={i} className="border-b border-aura-cream/5 hover:bg-aura-lift/40 transition-colors">
                            <td className="px-5 py-3 font-syne text-xs text-aura-cream/60">{b.employee}</td>
                            <td className="px-5 py-3 font-syne text-xs text-aura-cream/40">{b.hotel}</td>
                            <td className="px-5 py-3 font-syne text-[10px] text-aura-cream/30">{b.dates}</td>
                            <td className="px-5 py-3 font-fraunces text-base text-aura-cream/70">₹{b.amount.toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <span className={`flex items-center gap-1.5 w-fit font-syne text-[8px] tracking-[2px] uppercase px-2 py-1 ${b.status === 'confirmed' ? 'text-aura-green bg-aura-green/10' : 'text-aura-rose bg-aura-rose/10'}`}>
                                {b.status === 'confirmed' ? <CheckCircle size={8} /> : <Clock size={8} />} {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Employees ── */}
              {activeTab === 'Employees' && <EmployeesTab />}

              {/* ── Bookings ── */}
              {activeTab === 'Bookings' && <BookingsTab />}

              {/* ── Expenses ── */}
              {activeTab === 'Expenses' && (
                <div>
                  <div className="section-label mb-3">Expense Management</div>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="font-fraunces text-3xl text-aura-cream">All Expenses</h1>
                    <button className="btn-gold flex items-center gap-2"><Download size={12} /> Export All</button>
                  </div>
                  <div className="flex gap-3 mb-6 flex-wrap">
                    <input placeholder="Employee name…" className="bg-aura-lift border border-aura-cream/8 px-4 py-2.5 font-syne text-xs text-aura-cream/50 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30 w-44" />
                    <input placeholder="Project code…" className="bg-aura-lift border border-aura-cream/8 px-4 py-2.5 font-syne text-xs text-aura-cream/50 placeholder:text-aura-cream/20 focus:outline-none focus:border-aura-gold/30 w-36" />
                  </div>
                  <div className="surface-panel overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-aura-cream/5">
                          {['Employee', 'Hotel', 'Dates', 'Amount', 'GST', 'ITC', 'Invoice'].map(h => (
                            <th key={h} className="px-4 py-3 text-left font-syne text-[8px] tracking-[3px] text-aura-cream/25 uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => {
                          const gst = Math.round(b.amount * 0.18);
                          const itc = Math.round(gst * 0.5);
                          return (
                            <tr key={i} className="border-b border-aura-cream/5 hover:bg-aura-lift/40 transition-colors">
                              <td className="px-4 py-3 font-syne text-xs text-aura-cream/60">{b.employee}</td>
                              <td className="px-4 py-3 font-syne text-xs text-aura-cream/40">{b.hotel}</td>
                              <td className="px-4 py-3 font-syne text-[10px] text-aura-cream/30">{b.dates}</td>
                              <td className="px-4 py-3 font-fraunces text-sm text-aura-cream/70">₹{b.amount.toLocaleString()}</td>
                              <td className="px-4 py-3 font-syne text-[10px] text-aura-cream/40">₹{gst.toLocaleString()}</td>
                              <td className="px-4 py-3 font-syne text-[10px] text-aura-green">₹{itc.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <button className="font-syne text-[8px] tracking-[2px] uppercase text-aura-gold border border-aura-gold/20 px-2.5 py-1 hover:bg-aura-gold/5 transition-colors flex items-center gap-1">
                                  <Download size={8} /> PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Policy ── */}
              {activeTab === 'Policy' && (
                <div>
                  <div className="section-label mb-3">Travel Policy</div>
                  <h1 className="font-fraunces text-3xl text-aura-cream mb-8">Policy Configuration</h1>
                  <div className="space-y-6 max-w-xl">
                    <div className="surface-panel p-6">
                      <p className="section-label mb-3">Max Nightly Budget</p>
                      <p className="font-fraunces text-4xl text-aura-gold mb-4">₹{maxBudget.toLocaleString()}</p>
                      <input type="range" min={5000} max={50000} step={1000} value={maxBudget}
                        onChange={e => setMaxBudget(+e.target.value)} className="w-full accent-aura-gold" />
                      <div className="flex justify-between font-syne text-[8px] text-aura-cream/25 mt-1">
                        <span>₹5,000</span><span>₹50,000</span>
                      </div>
                    </div>
                    <div className="surface-panel p-6">
                      <p className="section-label mb-4">Allowed Star Ratings</p>
                      <div className="flex gap-3">
                        {[3, 4, 5].map(s => (
                          <button key={s}
                            onClick={() => setAllowedStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                            className={`flex-1 py-3 border font-syne text-[9px] tracking-[2px] transition-colors ${allowedStars.includes(s) ? 'border-aura-gold/40 text-aura-gold bg-aura-gold/8' : 'border-aura-cream/10 text-aura-cream/30 hover:border-aura-gold/20'}`}>
                            {'★'.repeat(s)} {s}-Star
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="surface-panel p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-syne text-xs text-aura-cream/60 mb-1">Require manager approval above</p>
                          <p className="font-fraunces text-2xl text-aura-cream">₹10,000 / night</p>
                        </div>
                        <button onClick={() => setRequireApproval(!requireApproval)}
                          className={`w-10 h-5 relative transition-colors ${requireApproval ? 'bg-aura-gold' : 'bg-aura-lift border border-aura-cream/15'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-aura-black transition-transform ${requireApproval ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>
                    <button className="btn-gold">Save Policy</button>
                  </div>
                </div>
              )}

              {/* ── Billing ── */}
              {activeTab === 'Billing' && <BillingTab />}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}