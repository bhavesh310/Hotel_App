import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Sparkles,
  ChevronRight, Circle, ArrowLeft, X, Volume2, VolumeX, RotateCcw,
} from 'lucide-react';
import { hotels } from '@/data/hotels';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { RoomGallery } from '@/components/RoomGallery';

const tabs = ['Overview', 'Rooms', 'Reviews', 'Live Camera', 'AR Preview'];

const reviews = [
  { name: 'Rahul M.', rating: 5, text: 'Exceptional service. The rooftop view at sunset is unmatched.', date: '2 weeks ago', avatar: 'RM', color: '#52C5BD' },
  { name: 'Priya S.', rating: 4, text: 'Beautiful rooms, spa was world class. WiFi could be better.', date: '1 month ago', avatar: 'PS', color: '#D47F8B' },
  { name: 'Arjun K.', rating: 5, text: 'Best business hotel in the city. Meeting rooms are top notch.', date: '3 weeks ago', avatar: 'AK', color: '#8B7FD4' },
];

const amenityIcons: Record<string, React.ReactNode> = {
  'Rooftop Pool': <Waves size={14} />, 'Spa & Wellness': <Sparkles size={14} />, 'Fine Dining': <Utensils size={14} />,
  'Fitness Centre': <Dumbbell size={14} />, 'Valet Parking': <Car size={14} />, 'Concierge 24/7': <Circle size={14} />,
  'Business Centre': <Wifi size={14} />, 'In-Room Butler': <Star size={14} />,
  'Infinity Pool': <Waves size={14} />, 'Yoga Deck': <Circle size={14} />, 'Spa': <Sparkles size={14} />,
  'Organic Dining': <Utensils size={14} />, 'Cycling Trails': <Car size={14} />,
};

const cameras = [
  { name: 'Pool Cam', location: 'Rooftop · Level 8', viewers: 12 },
  { name: 'Lobby Cam', location: 'Ground Floor · Entrance', viewers: 34 },
  { name: 'Beach Cam', location: 'Private Beach · East Wing', viewers: 8 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3D Math
// ─────────────────────────────────────────────────────────────────────────────
function rotY(x: number, y: number, z: number, a: number) {
  return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) };
}
function rotX(x: number, y: number, z: number, a: number) {
  return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
}
function proj(px: number, py: number, pz: number, W: number, H: number, fov = 300): [number, number, number] {
  const dz = pz + 4.5;
  if (dz < 0.05) return [-9999, -9999, 0];
  const s = fov / dz;
  return [W / 2 + px * s, H / 2 + py * s, s];
}
function xfm(v: { x: number; y: number; z: number }, yaw: number, pitch: number) {
  const r1 = rotY(v.x, v.y, v.z, yaw);
  return rotX(r1.x, r1.y, r1.z, pitch);
}

// ─────────────────────────────────────────────────────────────────────────────
// AR Room Canvas Renderer
// ─────────────────────────────────────────────────────────────────────────────
function drawARRoom(ctx: CanvasRenderingContext2D, W: number, H: number, yaw: number, pitch: number, t: number) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#06080f'); bg.addColorStop(1, '#090e18');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const p = (x: number, y: number, z: number) => {
    const r = xfm({ x, y, z }, yaw, pitch);
    return proj(r.x, r.y, r.z, W, H, 300);
  };

  type Quad = { verts: [number, number, number][]; fill: string; stroke?: string };
  const quads: Quad[] = [];

  // Room box: half-width 1.8, half-height 1.2, depth 0..4.2
  const RW = 1.8, RH = 1.2, RD = 4.2;

  // Floor
  quads.push({ verts: [[-RW, RH, 0], [RW, RH, 0], [RW, RH, RD], [-RW, RH, RD]], fill: '#1a1508', stroke: '#252010' });

  // Floor tiles
  for (let tx = -4; tx < 5; tx++) {
    for (let tz = 0; tz < 11; tz++) {
      const x0 = tx * 0.4, x1 = x0 + 0.4;
      const z0 = tz * 0.4, z1 = z0 + 0.4;
      if (Math.abs(x0) > RW) continue;
      quads.push({
        verts: [[Math.max(-RW, x0), RH - 0.001, z0], [Math.min(RW, x1), RH - 0.001, z0], [Math.min(RW, x1), RH - 0.001, z1], [Math.max(-RW, x0), RH - 0.001, z1]],
        fill: (tx + tz) % 2 === 0 ? '#231c0a' : '#1a1508', stroke: 'rgba(255,255,255,0.035)',
      });
    }
  }

  // Ceiling
  quads.push({ verts: [[-RW, -RH, 0], [RW, -RH, 0], [RW, -RH, RD], [-RW, -RH, RD]], fill: '#100e0a', stroke: '#1a1810' });

  // Back wall
  quads.push({ verts: [[-RW, -RH, RD], [RW, -RH, RD], [RW, RH, RD], [-RW, RH, RD]], fill: '#1a1610', stroke: '#242015' });

  // Left wall
  quads.push({ verts: [[-RW, -RH, 0], [-RW, -RH, RD], [-RW, RH, RD], [-RW, RH, 0]], fill: '#15120c', stroke: '#1e1a12' });

  // Right wall
  quads.push({ verts: [[RW, -RH, 0], [RW, -RH, RD], [RW, RH, RD], [RW, RH, 0]], fill: '#15120c', stroke: '#1e1a12' });

  // ── King Bed ──
  const BX = 0, BZ = 1.6, BW = 0.85, BH = 0.22, BD = 0.75;

  // Bed frame top
  quads.push({ verts: [[BX - BW, RH - BH, BZ], [BX + BW, RH - BH, BZ], [BX + BW, RH - BH, BZ + BD], [BX - BW, RH - BH, BZ + BD]], fill: '#7c6238', stroke: '#5a4428' });
  // Bed frame front
  quads.push({ verts: [[BX - BW, RH, BZ], [BX + BW, RH, BZ], [BX + BW, RH - BH, BZ], [BX - BW, RH - BH, BZ]], fill: '#6a5230', stroke: '#4a3820' });
  // Bed frame left
  quads.push({ verts: [[BX - BW, RH, BZ], [BX - BW, RH, BZ + BD], [BX - BW, RH - BH, BZ + BD], [BX - BW, RH - BH, BZ]], fill: '#5a4428', stroke: '#3a2c18' });
  // Bed frame right
  quads.push({ verts: [[BX + BW, RH, BZ], [BX + BW, RH, BZ + BD], [BX + BW, RH - BH, BZ + BD], [BX + BW, RH - BH, BZ]], fill: '#5a4428', stroke: '#3a2c18' });
  // Headboard
  quads.push({ verts: [[BX - BW, RH - BH * 3, BZ + 0.015], [BX + BW, RH - BH * 3, BZ + 0.015], [BX + BW, RH - BH, BZ + 0.015], [BX - BW, RH - BH, BZ + 0.015]], fill: '#3e2e18', stroke: '#5a4428' });
  // Mattress
  quads.push({ verts: [[BX - BW + 0.04, RH - BH - 0.015, BZ + 0.02], [BX + BW - 0.04, RH - BH - 0.015, BZ + 0.02], [BX + BW - 0.04, RH - BH - 0.015, BZ + BD - 0.02], [BX - BW + 0.04, RH - BH - 0.015, BZ + BD - 0.02]], fill: '#ede5d2', stroke: '#cdc5b0' });
  // Sheet
  quads.push({ verts: [[BX - BW + 0.05, RH - BH - 0.025, BZ + BD * 0.28], [BX + BW - 0.05, RH - BH - 0.025, BZ + BD * 0.28], [BX + BW - 0.05, RH - BH - 0.025, BZ + BD - 0.03], [BX - BW + 0.05, RH - BH - 0.025, BZ + BD - 0.03]], fill: '#c8b890', stroke: '#a89870' });
  // Pillows
  for (const px of [-0.38, 0.38]) {
    quads.push({ verts: [[BX + px - 0.22, RH - BH - 0.04, BZ + 0.06], [BX + px + 0.22, RH - BH - 0.04, BZ + 0.06], [BX + px + 0.22, RH - BH - 0.04, BZ + 0.33], [BX + px - 0.22, RH - BH - 0.04, BZ + 0.33]], fill: '#f4f0e8', stroke: '#ddd8c8' });
  }

  // ── Side Table (right) ──
  const STX = RW - 0.06, STZ = 1.62, STW = 0.28, STH = 0.28;
  quads.push({ verts: [[STX - STW, RH, STZ], [STX, RH, STZ], [STX, RH, STZ + STW], [STX - STW, RH, STZ + STW]], fill: '#282015', stroke: '#181208' });
  quads.push({ verts: [[STX - STW, RH - STH, STZ], [STX, RH - STH, STZ], [STX, RH, STZ], [STX - STW, RH, STZ]], fill: '#342818', stroke: '#241a0c' });
  quads.push({ verts: [[STX - STW, RH - STH, STZ], [STX - STW, RH - STH, STZ + STW], [STX - STW, RH, STZ + STW], [STX - STW, RH, STZ]], fill: '#2c2010', stroke: '#1c1408' });

  // ── Window (back wall center-right) ──
  const WX = 0.5, WW = 0.75, WY1 = -RH + 0.18, WY2 = RH - 0.45;
  quads.push({ verts: [[WX, WY1, RD - 0.01], [WX + WW, WY1, RD - 0.01], [WX + WW, WY2, RD - 0.01], [WX, WY2, RD - 0.01]], fill: 'rgba(80,140,230,0.38)', stroke: '#c8a838' });
  // Frame
  quads.push({ verts: [[WX - 0.04, WY1 - 0.04, RD - 0.01], [WX + WW + 0.04, WY1 - 0.04, RD - 0.01], [WX + WW + 0.04, WY1, RD - 0.01], [WX - 0.04, WY1, RD - 0.01]], fill: '#b89030', stroke: '#988020' });
  quads.push({ verts: [[WX - 0.04, WY2, RD - 0.01], [WX + WW + 0.04, WY2, RD - 0.01], [WX + WW + 0.04, WY2 + 0.04, RD - 0.01], [WX - 0.04, WY2 + 0.04, RD - 0.01]], fill: '#b89030', stroke: '#988020' });
  // Curtain (sways)
  const sway = Math.sin(t * 0.0008) * 0.06;
  quads.push({ verts: [[WX - 0.04 + sway, WY1 - 0.04, RD - 0.015], [WX + 0.16 + sway, WY1 - 0.04, RD - 0.015], [WX + 0.12, WY2 + 0.04, RD - 0.015], [WX - 0.04, WY2 + 0.04, RD - 0.015]], fill: 'rgba(120,85,30,0.85)', stroke: 'rgba(160,115,50,0.4)' });

  // ── Wardrobe (left wall) ──
  const WDX = -RW + 0.01, WDZ = 0.4, WDW = 0.6, WDH = RH * 1.7;
  quads.push({ verts: [[WDX, RH - WDH, WDZ], [WDX, RH - WDH, WDZ + WDW], [WDX, RH, WDZ + WDW], [WDX, RH, WDZ]], fill: '#3c3020', stroke: '#4c4028' });
  quads.push({ verts: [[WDX, RH - WDH, WDZ], [WDX + 0.1, RH - WDH, WDZ], [WDX + 0.1, RH, WDZ], [WDX, RH, WDZ]], fill: '#4a3c24', stroke: '#5a4c2e' });
  quads.push({ verts: [[WDX, RH - WDH, WDZ], [WDX + 0.1, RH - WDH, WDZ], [WDX + 0.1, RH - WDH, WDZ + WDW], [WDX, RH - WDH, WDZ + WDW]], fill: '#5c4e30', stroke: '#6c5e40' });

  // ── Ceiling light fixture ──
  quads.push({ verts: [[-0.12, -RH + 0.01, RD * 0.4], [0.12, -RH + 0.01, RD * 0.4], [0.12, -RH + 0.12, RD * 0.4], [-0.12, -RH + 0.12, RD * 0.4]], fill: 'rgba(255,235,160,0.45)', stroke: 'rgba(212,168,67,0.6)' });

  // ── Render all quads ──
  for (const q of quads) {
    const pts = q.verts.map(([x, y, z]) => p(x, y, z));
    if (pts.some(pt => pt[0] < -500)) continue;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
    ctx.closePath();
    ctx.fillStyle = q.fill; ctx.fill();
    if (q.stroke) { ctx.strokeStyle = q.stroke; ctx.lineWidth = 0.5; ctx.stroke(); }
  }

  // ── Lamp glow (radial, drawn after quads) ──
  const lampPt = p(STX - STW * 0.5, RH - STH - 0.2, STZ + STW * 0.5);
  const lampFlicker = 0.8 + Math.sin(t * 0.004) * 0.2;
  if (lampPt[0] > -500) {
    const glowR = ctx.createRadialGradient(lampPt[0], lampPt[1], 0, lampPt[0], lampPt[1], 70 * lampFlicker);
    glowR.addColorStop(0, `rgba(255,200,80,${0.3 * lampFlicker})`);
    glowR.addColorStop(0.4, `rgba(240,160,40,${0.1 * lampFlicker})`);
    glowR.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowR;
    ctx.beginPath(); ctx.arc(lampPt[0], lampPt[1], 70, 0, Math.PI * 2); ctx.fill();
    // Lamp shade cone
    ctx.fillStyle = `rgba(255,220,120,${0.55 * lampFlicker})`;
    ctx.beginPath(); ctx.arc(lampPt[0], lampPt[1], 5, 0, Math.PI * 2); ctx.fill();
  }

  // Ceiling light glow
  const cPt = p(0, -RH + 0.1, RD * 0.4);
  if (cPt[0] > -500) {
    const cg = ctx.createRadialGradient(cPt[0], cPt[1], 0, cPt[0], cPt[1], 100);
    cg.addColorStop(0, 'rgba(255,230,130,0.2)');
    cg.addColorStop(0.5, 'rgba(240,190,80,0.07)');
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(cPt[0], cPt[1], 100, 0, Math.PI * 2); ctx.fill();
  }

  // Wardrobe handles
  for (const hz of [WDZ + WDW * 0.3, WDZ + WDW * 0.75]) {
    const hp = p(WDX + 0.105, RH - WDH * 0.48, hz);
    if (hp[0] > -500) {
      ctx.fillStyle = 'rgba(212,168,67,0.85)';
      ctx.beginPath(); ctx.arc(hp[0], hp[1], 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── AR Grid ground ──
  for (let gx = -6; gx <= 6; gx++) {
    for (let gz = -1; gz <= 11; gz++) {
      const c = [[gx * 0.4, RH + 0.002, gz * 0.4], [(gx + 1) * 0.4, RH + 0.002, gz * 0.4], [(gx + 1) * 0.4, RH + 0.002, (gz + 1) * 0.4], [gx * 0.4, RH + 0.002, (gz + 1) * 0.4]] as [number, number, number][];
      const pts = c.map(([x, y, z]) => p(x, y, z));
      if (pts.some(pt => pt[0] < -500)) continue;
      const d = Math.abs(gx) + Math.abs(gz - 5);
      const alpha = Math.max(0, 0.14 - d * 0.01);
      if (alpha < 0.01) continue;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
      ctx.closePath();
      ctx.strokeStyle = `rgba(100,180,255,${alpha})`; ctx.lineWidth = 0.5; ctx.stroke();
    }
  }

  // ── AR annotation labels ──
  const labels = [
    { txt: 'King Suite · 52 m²', sub: 'Room 402 · Floor 4', pos: { x: 0, y: -RH + 0.3, z: 2.4 } },
    { txt: 'Premium Bedding', sub: 'Egyptian Cotton · 1000TC', pos: { x: BX, y: RH - BH - 0.45, z: BZ + BD * 0.5 } },
    { txt: 'City View Window', sub: '180° Panoramic', pos: { x: WX + WW * 0.5, y: -0.15, z: RD - 0.35 } },
    { txt: 'Wardrobe', sub: 'Built-in · 2-door', pos: { x: WDX + 0.35, y: 0.1, z: WDZ + WDW * 0.5 } },
  ];

  for (const lbl of labels) {
    const r = xfm(lbl.pos, yaw, pitch);
    const [sx, sy, sc] = proj(r.x, r.y, r.z, W, H, 300);
    if (sx < -500 || sc < 20 || sc > 600) continue;
    const fs = Math.max(8.5, Math.min(11.5, sc * 0.2));
    ctx.font = `${fs}px 'Courier New', monospace`;
    const tw = ctx.measureText(lbl.txt).width;
    const sw = ctx.measureText(lbl.sub).width;
    const bw = Math.max(tw, sw) + 18, bh = fs * 2.4 + 10;
    const bx = sx - bw / 2, by = sy - bh * 0.6;

    ctx.fillStyle = 'rgba(5,9,18,0.86)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 3); else ctx.rect(bx, by, bw, bh);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,168,67,0.55)'; ctx.lineWidth = 0.75; ctx.stroke();

    // Corner ticks
    const tk = 5;
    ctx.strokeStyle = 'rgba(212,168,67,0.9)'; ctx.lineWidth = 1.2;
    for (const [cx, cy, dx, dy] of [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]] as [number, number, number, number][]) {
      ctx.beginPath(); ctx.moveTo(cx, cy + dy * tk); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * tk, cy); ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(212,168,67,0.95)';
    ctx.font = `${fs}px 'Courier New', monospace`;
    ctx.fillText(lbl.txt, sx, by + fs + 4);
    ctx.fillStyle = 'rgba(160,195,230,0.65)';
    ctx.font = `${fs - 1}px 'Courier New', monospace`;
    ctx.fillText(lbl.sub, sx, by + fs * 2 + 6);
    ctx.textAlign = 'left';

    // Dot
    ctx.beginPath(); ctx.arc(sx, by + bh + 5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,168,67,0.75)'; ctx.fill();
    ctx.beginPath(); ctx.arc(sx, by + bh + 5, 5.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212,168,67,0.28)'; ctx.lineWidth = 1; ctx.stroke();
  }

  // Crosshair reticle
  const cx2 = W / 2, cy2 = H / 2;
  ctx.strokeStyle = 'rgba(212,168,67,0.35)'; ctx.lineWidth = 1;
  const rl = 10;
  ctx.beginPath(); ctx.moveTo(cx2 - rl, cy2); ctx.lineTo(cx2 + rl, cy2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx2, cy2 - rl); ctx.lineTo(cx2, cy2 + rl); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx2, cy2, 4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,168,67,0.5)'; ctx.stroke();

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.022)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCanvas component
// ─────────────────────────────────────────────────────────────────────────────
function ARCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef(performance.now());
  const yawRef = useRef(0.28);
  const pitchRef = useRef(-0.12);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const autoRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const loop = (now: number) => {
      const t = now - startRef.current;
      if (autoRef.current) yawRef.current += 0.003;
      drawARRoom(ctx, canvas.width, canvas.height, yawRef.current, pitchRef.current, t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); autoRef.current = false; dragRef.current.active = true;
      const pt = 'touches' in e ? e.touches[0] : e;
      dragRef.current.lastX = pt.clientX; dragRef.current.lastY = pt.clientY;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.active) return; e.preventDefault();
      const pt = 'touches' in e ? e.touches[0] : e;
      yawRef.current += (pt.clientX - dragRef.current.lastX) * 0.007;
      pitchRef.current = Math.max(-0.45, Math.min(0.3, pitchRef.current + (pt.clientY - dragRef.current.lastY) * 0.005));
      dragRef.current.lastX = pt.clientX; dragRef.current.lastY = pt.clientY;
    };
    const onUp = () => { dragRef.current.active = false; setTimeout(() => { autoRef.current = true; }, 2500); };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Person class (live cameras)
// ─────────────────────────────────────────────────────────────────────────────
class Person {
  x: number; y: number; tx: number; ty: number; speed: number;
  paused: boolean; pauseTimer: number; pauseDur: number;
  dir: number; phase: number;
  shirt: string; pant: string; skin: string; hairIdx: number; id: number;

  constructor(id: number) {
    this.id = id;
    this.x = Math.random(); this.y = 0.52 + Math.random() * 0.38;
    this.tx = 0.1 + Math.random() * 0.8; this.ty = 0.52 + Math.random() * 0.38;
    this.speed = 0.0005 + Math.random() * 0.0008;
    this.paused = false; this.pauseTimer = 0; this.pauseDur = 0;
    this.dir = 1; this.phase = Math.random() * Math.PI * 2;
    const hues = [210, 30, 60, 180, 90, 0, 270, 150];
    const h = hues[id % hues.length];
    this.shirt = `hsl(${h},28%,${28 + Math.random() * 20}%)`;
    this.pant = `hsl(${(h + 130) % 360},12%,${18 + Math.random() * 14}%)`;
    const skins = ['#c8956c', '#a0714f', '#f5cba7', '#8d5524', '#d4a574', '#e8b89a'];
    this.skin = skins[id % skins.length];
    this.hairIdx = id % 5;
  }

  update(dt: number) {
    if (this.paused) {
      this.pauseTimer += dt;
      if (this.pauseTimer > this.pauseDur) { this.paused = false; this.tx = 0.1 + Math.random() * 0.8; this.ty = 0.52 + Math.random() * 0.38; }
      return;
    }
    const dx = this.tx - this.x, dy = this.ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.012) {
      if (Math.random() < 0.4) { this.paused = true; this.pauseTimer = 0; this.pauseDur = 800 + Math.random() * 2800; }
      else { this.tx = 0.1 + Math.random() * 0.8; this.ty = 0.52 + Math.random() * 0.38; }
    } else {
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
      this.phase += dt * 0.012;
      this.dir = dx > 0 ? 1 : -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const px = this.x * W, py = this.y * H;
    const sc = 0.35 + (this.y - 0.5) * 0.85;
    const ph = 36 * sc, pw = 11 * sc;
    const bob = this.paused ? 0 : Math.sin(this.phase) * 1.1 * sc;
    ctx.save(); ctx.translate(px, py + bob);
    if (this.dir < 0) ctx.scale(-1, 1);
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); } else { ctx.beginPath(); ctx.rect(x, y, w, h); }
    };
    ctx.fillStyle = this.pant; rr(-pw * 0.5, -ph * 0.44, pw * 0.52, ph * 0.44, 2); ctx.fill();
    rr(pw * 0.02 - pw * 0.5, -ph * 0.44, pw * 0.52, ph * 0.44, 2); ctx.fill();
    ctx.fillStyle = this.shirt; rr(-pw * 0.5, -ph * 0.86, pw, ph * 0.44, 3); ctx.fill();
    ctx.fillStyle = this.skin;
    ctx.beginPath(); ctx.ellipse(-pw * 0.63, -ph * 0.75, pw * 0.17, pw * 0.12, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -ph * 0.9, pw * 0.27, pw * 0.27, 0, 0, Math.PI * 2); ctx.fill();
    const hairs = ['#1a1007', '#3d2508', '#2d1b00', '#1c1c1c', '#6a4020'];
    ctx.fillStyle = hairs[this.hairIdx];
    ctx.beginPath(); ctx.ellipse(0, -ph * 0.98, pw * 0.29, pw * 0.17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Camera scene renderers
// ─────────────────────────────────────────────────────────────────────────────
function renderLobby(ctx: CanvasRenderingContext2D, W: number, H: number, people: Person[], _t: number) {
  ctx.fillStyle = '#181a20'; ctx.fillRect(0, 0, W, H);
  const wg = ctx.createLinearGradient(0, 0, 0, H * 0.48);
  wg.addColorStop(0, '#1a1c22'); wg.addColorStop(1, '#252830');
  ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H * 0.48);
  ctx.fillStyle = '#1e2028';
  ctx.fillRect(0, 0, W * 0.14, H * 0.48); ctx.fillRect(W * 0.86, 0, W * 0.14, H * 0.48);
  for (const cx of [W * 0.19, W * 0.36, W * 0.64, W * 0.81]) { ctx.fillStyle = '#2a2d36'; ctx.fillRect(cx, H * 0.04, 14, H * 0.43); }
  const dx = W * 0.38, dw = W * 0.24;
  const dg = ctx.createLinearGradient(dx, 0, dx + dw, 0);
  dg.addColorStop(0, '#1c2040'); dg.addColorStop(0.2, '#2e3868'); dg.addColorStop(0.5, '#3a4880'); dg.addColorStop(0.8, '#2e3868'); dg.addColorStop(1, '#1c2040');
  ctx.fillStyle = dg; ctx.fillRect(dx, H * 0.04, dw, H * 0.44);
  ctx.fillStyle = 'rgba(100,140,220,0.11)'; ctx.fillRect(dx, H * 0.04, dw, H * 0.44);
  ctx.strokeStyle = 'rgba(150,170,230,0.28)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(dx + dw / 2, H * 0.04); ctx.lineTo(dx + dw / 2, H * 0.48); ctx.stroke();
  for (const lx of [W * 0.2, W * 0.5, W * 0.8]) {
    const lg = ctx.createRadialGradient(lx, H * 0.05, 0, lx, H * 0.32, H * 0.35);
    lg.addColorStop(0, 'rgba(230,240,255,0.11)'); lg.addColorStop(0.4, 'rgba(180,210,255,0.04)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H * 0.6);
    ctx.beginPath(); ctx.arc(lx, H * 0.05, 5, 0, Math.PI * 2); ctx.fillStyle = '#e8f0ff'; ctx.fill();
  }
  ctx.fillStyle = '#292c36'; ctx.fillRect(0, H * 0.46, W, 6);
  const tW = 80, tH = 50, ox = W / 2, oy = H * 0.48;
  for (let row = -2; row < 14; row++) for (let col = -4; col < 16; col++) {
    const tx = ox + (col - 6) * tW / 2 - (row - 2) * tW / 2;
    const ty = oy + (col - 6) * tH / 2 + (row - 2) * tH / 2;
    if (ty < H * 0.44 || ty > H * 1.1) continue;
    const sh = 22 + (row + col) % 2 * 5;
    ctx.beginPath(); ctx.moveTo(tx, ty - tH / 2); ctx.lineTo(tx + tW / 2, ty); ctx.lineTo(tx, ty + tH / 2); ctx.lineTo(tx - tW / 2, ty); ctx.closePath();
    ctx.fillStyle = `rgb(${sh},${sh},${sh + 3})`; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5; ctx.stroke();
  }
  for (const ppx of [W * 0.07, W * 0.93]) {
    ctx.fillStyle = '#1a2218'; ctx.fillRect(ppx - 10, H * 0.62, 20, 20);
    ctx.fillStyle = '#243320'; ctx.beginPath(); ctx.ellipse(ppx, H * 0.6, 16, 22, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e2d1c'; ctx.beginPath(); ctx.ellipse(ppx + 10, H * 0.59, 12, 17, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  people.sort((a, b) => a.y - b.y);
  people.forEach(p => { p.update(16); p.draw(ctx, W, H); });
  ctx.fillStyle = 'rgba(0,0,0,0.035)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

function renderPool(ctx: CanvasRenderingContext2D, W: number, H: number, people: Person[], t: number) {
  ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.4);
  sky.addColorStop(0, '#0e1e3a'); sky.addColorStop(1, '#1a2f55');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.4);
  for (let i = 0; i < 40; i++) {
    const sx = (Math.sin(i * 73.1) * 0.5 + 0.5) * W, sy = (Math.sin(i * 37.7) * 0.5 + 0.5) * H * 0.35;
    const alpha = 0.4 + Math.sin(t * 0.001 + i) * 0.3;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 6; i++) {
    const bx = (i / 6) * W, bww = W / 7, bh = H * (0.1 + (i % 3) * 0.06);
    ctx.fillStyle = '#0a1220'; ctx.fillRect(bx, H * 0.38 - bh, bww - 4, bh);
  }
  const pool = ctx.createLinearGradient(0, H * 0.4, 0, H);
  pool.addColorStop(0, '#1e6aaa'); pool.addColorStop(0.5, '#155a90'); pool.addColorStop(1, '#0d3f66');
  ctx.fillStyle = pool; ctx.fillRect(0, H * 0.4, W, H * 0.6);
  ctx.fillStyle = '#c8b88a'; ctx.fillRect(0, H * 0.38, W, H * 0.04);
  for (let i = 0; i < 5; i++) {
    const rx = W * (0.1 + i * 0.18), ry = H * (0.5 + i * 0.08);
    const rw = 40 + Math.sin(t * 0.002 + i) * 15, alpha = 0.08 + Math.sin(t * 0.003 + i * 1.5) * 0.06;
    ctx.strokeStyle = `rgba(150,220,255,${alpha})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(rx, ry, rw, rw * 0.15, 0, 0, Math.PI * 2); ctx.stroke();
  }
  people.sort((a, b) => a.y - b.y);
  people.forEach(p => { if (p.y < 0.43) p.y = 0.43 + Math.random() * 0.2; p.update(16); p.draw(ctx, W, H); });
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

function renderBeach(ctx: CanvasRenderingContext2D, W: number, H: number, people: Person[], t: number) {
  ctx.fillStyle = '#0d1a0d'; ctx.fillRect(0, 0, W, H);
  const sk = ctx.createLinearGradient(0, 0, 0, H * 0.45);
  sk.addColorStop(0, '#0e1a2a'); sk.addColorStop(0.5, '#1e2a18'); sk.addColorStop(1, '#2a3a20');
  ctx.fillStyle = sk; ctx.fillRect(0, 0, W, H * 0.45);
  ctx.fillStyle = '#f0e8c0'; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.1, 18, 0, Math.PI * 2); ctx.fill();
  for (const [ppx, flip] of [[W * 0.06, 1], [W * 0.15, -1], [W * 0.9, 1], [W * 0.82, -1]] as [number, number][]) {
    ctx.save(); ctx.translate(ppx, H * 0.46); if (flip < 0) ctx.scale(-1, 1);
    ctx.strokeStyle = '#2a2010'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -H * 0.15, 20, -H * 0.28); ctx.stroke();
    ctx.strokeStyle = '#3a3a18'; ctx.lineWidth = 2;
    for (let a = -0.8; a < 0.8; a += 0.25) {
      ctx.beginPath(); ctx.moveTo(20, -H * 0.28);
      ctx.quadraticCurveTo(20 + Math.cos(a) * 40, -H * 0.28 + Math.sin(a) * 20, 20 + Math.cos(a) * 70, -H * 0.28 + Math.sin(a) * 50);
      ctx.stroke();
    }
    ctx.restore();
  }
  const sea = ctx.createLinearGradient(0, H * 0.45, 0, H * 0.65);
  sea.addColorStop(0, '#1a4a6a'); sea.addColorStop(1, '#0d2a3a');
  ctx.fillStyle = sea; ctx.fillRect(0, H * 0.45, W, H * 0.2);
  for (let i = 0; i < 4; i++) {
    const wy = H * (0.46 + i * 0.04), phase = t * 0.002 + i * 0.8;
    ctx.strokeStyle = `rgba(150,200,255,${0.12 - i * 0.02})`; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < W; x += 4) { const y = wy + Math.sin((x / W) * Math.PI * 4 + phase) * 4; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }
  const sand = ctx.createLinearGradient(0, H * 0.65, 0, H);
  sand.addColorStop(0, '#8a7040'); sand.addColorStop(0.4, '#a08050'); sand.addColorStop(1, '#7a6030');
  ctx.fillStyle = sand; ctx.fillRect(0, H * 0.65, W, H * 0.35);
  people.sort((a, b) => a.y - b.y);
  people.forEach(p => { if (p.y < 0.67) p.y = 0.67 + Math.random() * 0.2; p.update(16); p.draw(ctx, W, H); });
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// LiveCameraCanvas
// ─────────────────────────────────────────────────────────────────────────────
function LiveCameraCanvas({ camName, mini = false }: { camName: string; mini?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peopleRef = useRef<Person[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    peopleRef.current = Array.from({ length: mini ? 3 : 6 }, (_, i) => new Person(i));
    const loop = (now: number) => {
      const t = now - startRef.current;
      const W = canvas.width, H = canvas.height;
      if (camName === 'Lobby Cam') renderLobby(ctx, W, H, peopleRef.current, t);
      else if (camName === 'Pool Cam') renderPool(ctx, W, H, peopleRef.current, t);
      else renderBeach(ctx, W, H, peopleRef.current, t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [camName]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// LiveCameraModal
// ─────────────────────────────────────────────────────────────────────────────
const LiveCameraModal = ({ cam, onClose }: { cam: typeof cameras[0]; onClose: () => void }) => {
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(new Date());
  const [watcherCount, setWatcherCount] = useState(cam.viewers);
  const [motionVisible, setMotionVisible] = useState(false);

  useEffect(() => {
    const t1 = setInterval(() => setTime(new Date()), 1000);
    const t2 = setInterval(() => setWatcherCount(c => Math.max(5, Math.min(60, c + Math.floor(Math.random() * 3) - 1))), 4000);
    const t3 = setInterval(() => { setMotionVisible(true); setTimeout(() => setMotionVisible(false), 2000); }, 7000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,5,8,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }} className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-aura-dark border border-aura-cream/10 overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0"><LiveCameraCanvas camName={cam.name} /></div>
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }} />
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <motion.div className="w-2 h-2 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="font-syne text-[9px] tracking-[3px] uppercase text-white/80">Live</span>
            <span className="font-syne text-[9px] text-white/40 ml-1">{watcherCount} watching</span>
          </div>
          <div className="absolute top-3 right-3 font-syne text-[9px] text-white/50 tabular-nums z-20">{hh}:{mm}:{ss}</div>
          <motion.div className="absolute top-3 left-1/2 -translate-x-1/2 font-syne text-[9px] tracking-[2px] uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: motionVisible ? 1 : 0 }}>Motion Detected</motion.div>
          <div className="absolute bottom-3 left-3 z-20">
            <p className="font-syne text-[9px] tracking-[2px] uppercase text-white/60">{cam.name}</p>
            <p className="font-syne text-[8px] text-white/30 mt-0.5">{cam.location}</p>
          </div>
          <div className="absolute bottom-3 right-3 font-syne text-[9px] text-white/30 border border-white/15 px-2 py-0.5 z-20">HD</div>
          {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-4 h-4 ${cls} border-aura-gold/40 z-20`} />
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-aura-dark border border-t-0 border-aura-cream/10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMuted(!muted)} className="flex items-center gap-2 text-aura-cream/40 hover:text-aura-gold transition-colors">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="font-syne text-[9px] tracking-[2px] uppercase">{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <div className="w-px h-4 bg-aura-cream/10" />
            <button className="flex items-center gap-2 text-aura-cream/40 hover:text-aura-gold transition-colors">
              <RotateCcw size={13} /><span className="font-syne text-[9px] tracking-[2px] uppercase">Refresh</span>
            </button>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 text-aura-cream/40 hover:text-red-400 transition-colors">
            <X size={14} /><span className="font-syne text-[9px] tracking-[2px] uppercase">Close</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ARPreviewModal
// ─────────────────────────────────────────────────────────────────────────────
const ARPreviewModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'ready'>('intro');
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setStep('scanning'); setScanProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 1.6; setScanProgress(Math.min(Math.round(p), 100));
      if (p >= 100) { clearInterval(iv); setTimeout(() => setStep('ready'), 400); }
    }, 30);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,5,8,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
        className="w-full max-w-sm surface-panel p-6 relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-aura-cream/30 hover:text-aura-cream transition-colors"><X size={16} /></button>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-20 h-20 mx-auto mb-5 border border-aura-gold/20 flex items-center justify-center"><span className="text-3xl">📱</span></div>
              <p className="section-label text-center mb-2">AR Experience</p>
              <h3 className="font-fraunces text-2xl text-aura-cream text-center mb-3">AR Room Preview</h3>
              <p className="font-syne text-xs text-aura-cream/40 text-center leading-relaxed mb-5">Walk through Room 402 in full 3D. Drag to rotate and explore every corner.</p>
              <div className="space-y-2 mb-5">
                {[{ icon: '📡', label: 'Requires camera access' }, { icon: '🛋️', label: 'Works on any flat surface' }, { icon: '🔄', label: 'Full 360° room walkthrough' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2 bg-aura-lift border border-aura-cream/5">
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-syne text-[10px] text-aura-cream/40 tracking-[1px]">{item.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={startScan} className="btn-gold w-full flex items-center justify-center gap-2 text-[9px] py-3">
                <Sparkles size={11} /> Launch AR Preview
              </button>
            </motion.div>
          )}

          {step === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div className="absolute inset-0 rounded-full border border-aura-gold/20"
                  animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.2, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <motion.div className="absolute inset-0 rounded-full border border-aura-gold/15"
                  animate={{ scale: [1, 1.6, 2.2], opacity: [0.4, 0.1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span className="text-4xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>📱</motion.span>
                </div>
              </div>
              <p className="font-fraunces text-lg text-aura-gold mb-1">Initializing AR…</p>
              <p className="font-syne text-[9px] text-aura-cream/30 tracking-[2px] uppercase mb-5">Building room model · {scanProgress}%</p>
              <div className="h-1 bg-aura-lift overflow-hidden mb-3">
                <motion.div className="h-full bg-aura-gold" style={{ width: `${scanProgress}%` }} />
              </div>
              <p className="font-syne text-[9px] text-aura-cream/20 tracking-[1px]">Rendering surfaces…</p>
            </motion.div>
          )}

          {step === 'ready' && (
            <motion.div key="ready" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-aura-gold block"
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span className="font-syne text-[9px] tracking-[2px] uppercase text-aura-gold">AR Live · Room 402</span>
                </div>
                <span className="font-syne text-[8px] text-aura-cream/25">Drag to rotate</span>
              </div>

              {/* ── 3D AR CANVAS ── */}
              <div className="relative overflow-hidden border border-aura-gold/30 mb-4" style={{ height: 260, background: '#06080f' }}>
                <ARCanvas />
                {/* HUD corner brackets */}
                {(['top-1 left-1 border-t border-l', 'top-1 right-1 border-t border-r', 'bottom-1 left-1 border-b border-l', 'bottom-1 right-1 border-b border-r'] as const).map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 ${cls} border-aura-gold/65 z-10 pointer-events-none`} />
                ))}
                <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-10">
                  <span className="font-syne text-[8px] tracking-[2px] uppercase text-aura-gold/35">360° walkthrough active</span>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex gap-2 flex-wrap mb-4">
                {['52 m²', 'King Bed', 'City View', '5-Star Rated'].map(tag => (
                  <span key={tag} className="font-syne text-[9px] px-3 py-1 bg-aura-lift border border-aura-gold/15 text-aura-cream/50 tracking-[1px]">{tag}</span>
                ))}
              </div>

              {/* AI insight */}
              <div className="mb-4 p-3 border border-aura-gold/12 bg-aura-gold/5">
                <p className="font-syne text-[9px] text-aura-gold/70 tracking-[1px] mb-1">✦ AI INSIGHT</p>
                <p className="font-syne text-[10px] text-aura-cream/40 leading-relaxed">Room 402 faces East — expect golden sunrise light through the city-view window. Best for early risers.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep('intro'); setScanProgress(0); }}
                  className="btn-ghost flex-1 text-[9px] py-3 flex items-center justify-center gap-2">
                  <RotateCcw size={10} /> Restart
                </button>
                <button onClick={onClose} className="btn-gold flex-1 text-[9px] py-3">Done</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main HotelDetail
// ─────────────────────────────────────────────────────────────────────────────
export default function HotelDetail() {
  const { id } = useParams();
  const hotel = hotels.find(h => h.id === Number(id)) || hotels[0];
  const [activeTab, setActiveTab] = useState('Overview');
  const [guests, setGuests] = useState(2);
  const [checkIn] = useState('Mar 22');
  const [checkOut] = useState('Mar 25');
  const [activeCam, setActiveCam] = useState<typeof cameras[0] | null>(null);
  const [arOpen, setArOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '30%']);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  const nights = 3, roomPrice = hotel.rooms[0].price;
  const taxes = Math.round(roomPrice * nights * 0.18);
  const total = roomPrice * nights + taxes;

  return (
    <div className="min-h-screen bg-aura-black pt-16">
      {/* Hero */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY, scale: bgScale }}>
          {hotel.image
            ? <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover object-center" style={{ filter: 'brightness(0.55) saturate(0.9)' }} />
            : <div className={`w-full h-full bg-gradient-to-br ${hotel.gradient}`} />}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-aura-black via-aura-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-aura-black/50 via-transparent to-transparent pointer-events-none" />
        <Link to="/explore" className="absolute top-6 left-6 z-20">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 bg-aura-black/40 backdrop-blur-md border border-aura-cream/10 text-aura-cream/60 hover:text-aura-cream hover:border-aura-gold/30 transition-colors">
            <ArrowLeft size={12} /><span className="font-syne text-[9px] tracking-[2px] uppercase">Explore</span>
          </motion.div>
        </Link>
        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
          {hotel.vibe.map((v, i) => (
            <motion.span key={v} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="font-syne text-[8px] tracking-[2px] uppercase bg-black/50 text-aura-cream/80 px-3 py-1.5 backdrop-blur-sm border border-white/10">{v}</motion.span>
          ))}
          {hotel.aiPick && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="gold-chip flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-aura-gold animate-pulse-gold" />AI Pick</motion.div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
            <div className="flex items-center gap-1.5 mb-3">
              {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} size={11} className="fill-aura-gold text-aura-gold" />)}
              <span className="font-syne text-[9px] text-aura-cream/40 tracking-[2px] uppercase ml-2">{hotel.stars}-Star Luxury</span>
            </div>
            <h1 className="font-fraunces text-5xl md:text-7xl text-aura-cream font-light leading-none mb-3">{hotel.name}</h1>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-aura-gold" />
              <span className="font-syne text-xs text-aura-cream/50 tracking-[2px]">{hotel.area}, {hotel.city}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 flex-wrap mb-6">{hotel.vibe.map(v => <span key={v} className="gold-chip">{v}</span>)}</div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-aura-cream/8 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-5 py-3 font-syne text-[9px] tracking-[2.5px] uppercase transition-all relative ${activeTab === tab ? 'text-aura-gold' : 'text-aura-cream/30 hover:text-aura-cream/60'}`}>
                {tab}
                {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-aura-gold" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {activeTab === 'Overview' && (
                <div>
                  <p className="font-syne text-sm text-aura-cream/50 leading-7 mb-8">{hotel.description}</p>
                  <div className="section-label mb-5">Amenities</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hotel.amenities.map(a => (
                      <div key={a} className="flex items-center gap-3 p-3 border border-aura-cream/5 hover:border-aura-gold/20 transition-colors">
                        <span className="text-aura-cream/30">{amenityIcons[a] || <Circle size={14} />}</span>
                        <span className="font-syne text-[10px] text-aura-cream/50">{a}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 h-32 bg-aura-lift border border-aura-cream/5 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-aura-cream/30"><MapPin size={14} /><span className="font-syne text-xs">{hotel.area}, {hotel.city}</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'Rooms' && (
                <div className="space-y-6">
                  {hotel.roomGallery && hotel.roomGallery.length > 0 && (
                    <div className="mb-2">
                      <div className="section-label mb-3">Photo Gallery</div>
                      <RoomGallery images={hotel.roomGallery} roomName={hotel.name} />
                      <p className="font-syne text-[9px] text-aura-cream/25 mt-2 tracking-[2px]">HOVER TO BROWSE · CLICK TO ENLARGE</p>
                    </div>
                  )}
                  <div className="section-label mb-3">Select Your Room</div>
                  {hotel.rooms.map((room, i) => (
                    <div key={i} className="luxury-card overflow-hidden">
                      {hotel.roomGallery?.[i] && (
                        <div className="relative h-40 overflow-hidden">
                          <img src={hotel.roomGallery[i]} alt={room.type} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {room.aiSuggested && <div className="absolute top-3 left-3 gold-chip flex items-center gap-1"><Sparkles size={7} /> AI Suggested</div>}
                          <div className="absolute bottom-3 left-4">
                            <h3 className="font-fraunces text-lg text-aura-cream">{room.type}</h3>
                            <p className="font-syne text-[9px] text-aura-cream/50 tracking-[2px]">{room.size} · King Bed</p>
                          </div>
                        </div>
                      )}
                      <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                        {!hotel.roomGallery?.[i] && (
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-fraunces text-lg text-aura-cream">{room.type}</h3>
                              {room.aiSuggested && <span className="gold-chip flex items-center gap-1"><Sparkles size={7} /> AI Suggested</span>}
                            </div>
                            <p className="font-syne text-[10px] text-aura-cream/30 tracking-[2px]">{room.size} · King Bed · City View</p>
                          </div>
                        )}
                        <div className="flex items-center gap-5 ml-auto">
                          <div className="text-right">
                            <p className="font-fraunces text-2xl text-aura-gold">₹{room.price.toLocaleString()}</p>
                            <p className="font-syne text-[9px] text-aura-cream/30">per night</p>
                          </div>
                          <Link to="/booking"><button className="btn-gold text-[8px] px-5 py-3">Book Now</button></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div>
                  <div className="flex items-center gap-6 mb-8 p-6 border border-aura-cream/5">
                    <div className="text-center">
                      <p className="font-fraunces text-5xl text-aura-gold">4.8</p>
                      <div className="flex gap-0.5 justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className="fill-aura-gold text-aura-gold" />)}</div>
                      <p className="font-syne text-[9px] text-aura-cream/30 mt-1 tracking-[2px]">OVERALL</p>
                    </div>
                    <div className="flex-1">
                      <div className="ai-suggestion p-3">
                        <p className="section-label mb-1">✦ AI Sentiment</p>
                        <p className="font-syne text-xs text-aura-cream/50">
                          Guests love the <span className="text-aura-green">pool & rooftop views</span> · WiFi reported as <span className="text-aura-rose">inconsistent</span> · Staff service rated <span className="text-aura-green">excellent</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="luxury-card p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-fraunces text-xs flex-shrink-0" style={{ backgroundColor: r.color + '22', color: r.color }}>{r.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-syne text-xs text-aura-cream/70">{r.name}</span>
                              <span className="font-syne text-[9px] text-aura-cream/25">{r.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={9} className="fill-aura-gold text-aura-gold" />)}</div>
                            <p className="font-syne text-xs text-aura-cream/40 leading-relaxed">{r.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Live Camera' && (
                <div>
                  <p className="font-syne text-xs text-aura-cream/30 mb-6 leading-relaxed">View live feeds from around the property. All cameras are updated in real time.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cameras.map(cam => (
                      <motion.div key={cam.name} whileHover={{ y: -4 }}
                        className="luxury-card overflow-hidden cursor-pointer group"
                        onClick={() => setActiveCam(cam)}>
                        <div className="h-40 relative overflow-hidden">
                          <LiveCameraCanvas camName={cam.name} mini />
                          <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }} />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                            <motion.span className="w-2 h-2 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                            <span className="font-syne text-[8px] tracking-[2px] text-white/70 uppercase">Live</span>
                          </div>
                          <div className="absolute bottom-3 right-3 font-syne text-[8px] text-white/30 z-20">{cam.viewers} watching</div>
                          <div className="absolute inset-0 bg-aura-gold/0 group-hover:bg-aura-gold/5 transition-colors flex items-center justify-center z-20">
                            <span className="font-syne text-[9px] tracking-[3px] uppercase text-aura-gold/0 group-hover:text-aura-gold/80 transition-colors">Click to Watch</span>
                          </div>
                          {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((cls, i) => (
                            <div key={i} className={`absolute w-3 h-3 ${cls} border-aura-gold/30 z-10`} />
                          ))}
                        </div>
                        <div className="p-4">
                          <p className="font-syne text-[10px] text-aura-cream/60 tracking-[2px] uppercase mb-0.5">{cam.name}</p>
                          <p className="font-syne text-[9px] text-aura-cream/25">{cam.location}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'AR Preview' && (
                <div className="luxury-card p-10 text-center border border-aura-gold/10">
                  <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 mx-auto mb-6 border border-aura-gold/20 flex items-center justify-center"><span className="text-3xl">📱</span></motion.div>
                  <h3 className="font-fraunces text-2xl text-aura-cream mb-3">AR Room Preview</h3>
                  <p className="font-syne text-xs text-aura-cream/40 max-w-sm mx-auto mb-8 leading-relaxed">Walk through Room 402 in full 3D augmented reality. Drag to look around — bed, wardrobe, window and all.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => setArOpen(true)} className="btn-gold flex items-center justify-center gap-2">
                      <Sparkles size={11} /> Launch AR Preview
                    </button>
                    <button onClick={() => setActiveTab('Live Camera')} className="btn-ghost flex items-center justify-center gap-2">Switch to Live Camera</button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-32">
            <div className="surface-panel p-6 mb-4">
              <div className="section-label mb-4">Book Your Stay</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-aura-lift border border-aura-cream/8 p-3"><p className="section-label mb-1">Check In</p><p className="font-fraunces text-sm text-aura-cream">{checkIn}</p></div>
                <div className="bg-aura-lift border border-aura-cream/8 p-3"><p className="section-label mb-1">Check Out</p><p className="font-fraunces text-sm text-aura-cream">{checkOut}</p></div>
              </div>
              <div className="flex items-center justify-between bg-aura-lift border border-aura-cream/8 p-3 mb-5">
                <span className="font-syne text-[10px] text-aura-cream/40 tracking-[2px] uppercase">Guests</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-aura-cream/40 hover:text-aura-gold">−</button>
                  <span className="font-fraunces text-lg text-aura-cream">{guests}</span>
                  <button onClick={() => setGuests(Math.min(6, guests + 1))} className="text-aura-cream/40 hover:text-aura-gold">+</button>
                </div>
              </div>
              <div className="mb-5">
                <AISuggestionBox
                  suggestion={`Based on your profile, we suggest the ${hotel.rooms[hotel.rooms.findIndex(r => r.aiSuggested)].type}. Guests like you rated it 4.9★`}
                  action="Select this room"
                />
              </div>
              <div className="space-y-2 mb-5 pt-4 border-t border-aura-cream/5">
                <div className="flex justify-between">
                  <span className="font-syne text-[10px] text-aura-cream/40">₹{roomPrice.toLocaleString()} × {nights} nights</span>
                  <span className="font-syne text-[10px] text-aura-cream/60">₹{(roomPrice * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-syne text-[10px] text-aura-cream/40">Taxes (18% GST)</span>
                  <span className="font-syne text-[10px] text-aura-cream/60">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-aura-cream/5">
                  <span className="font-syne text-[10px] text-aura-cream/70 tracking-[2px] uppercase">Total</span>
                  <span className="font-fraunces text-xl text-aura-gold">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/booking"><button className="btn-gold w-full flex items-center justify-center gap-2">Book Now <ChevronRight size={12} /></button></Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{activeCam && <LiveCameraModal cam={activeCam} onClose={() => setActiveCam(null)} />}</AnimatePresence>
      <AnimatePresence>{arOpen && <ARPreviewModal onClose={() => setArOpen(false)} />}</AnimatePresence>
    </div>
  );
}