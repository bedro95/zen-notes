  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW Registered!', reg);
      });
    }

    // 2. Request Notification Permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Plus, Shield, CheckCircle2, Github, Trash2 } from 'lucide-react';

const THEME = {
  background: '#050505',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: '#2563eb',
  textPrimary: '#ffffff',
  textSecondary: '#666666',
  blur: 'blur(40px)'
};

interface Reminder {
  id: string;
  note: string;
  time: string;
}

export default function ZenNotisApp() {
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const handleSetReminder = () => {
    if (!note || !time) return;

    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      note,
      time
    };

    // Logical Trigger (Simulated for Demo)
    const now = new Date();
    const [h, m] = time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);

    setTimeout(() => {
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Zen Notis", { body: note });
      } else {
        alert(`🔔 Reminder: ${note}`);
      }
    }, target.getTime() - now.getTime());

    setReminders([newReminder, ...reminders]);
    setIsSuccess(true);
    setNote('');
    setTime('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <main style={{ backgroundColor: THEME.background, minHeight: '100vh', color: THEME.textPrimary, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Glow Effect */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.1)', filter: 'blur(100px)', borderRadius: '100%' }} />

      {/* Main Form Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '420px', background: THEME.glass, backdropFilter: THEME.blur, WebkitBackdropFilter: THEME.blur, border: `1px solid ${THEME.border}`, borderRadius: '40px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', zIndex: 10 }}>
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>Zen Notis</h1>
            <Shield size={24} color={THEME.accent} />
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input placeholder="What needs to be done?" value={note} onChange={(e) => setNote(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`, borderRadius: '16px', padding: '16px', color: '#fff', outline: 'none' }} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`, borderRadius: '16px', padding: '16px', color: '#fff', outline: 'none', colorScheme: 'dark' }} />
          <button onClick={handleSetReminder} style={{ width: '100%', background: THEME.accent, padding: '16px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            SET ZEN REMINDER
          </button>
        </div>
      </motion.div>

      {/* Scheduled List Section */}
      <div style={{ width: '100%', maxWidth: '420px', marginTop: '32px', zIndex: 10 }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: THEME.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', paddingLeft: '8px' }}>
          Scheduled Services
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {reminders.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${THEME.border}`, borderRadius: '20px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{r.note}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: THEME.textSecondary, fontSize: '12px' }}>
                    <Clock size={12} /> {r.time}
                  </div>
                </div>
                <button onClick={() => deleteReminder(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}>
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {reminders.length === 0 && (
            <p style={{ textAlign: 'center', color: THEME.textSecondary, fontSize: '14px', marginTop: '20px' }}>No active notifications.</p>
          )}
        </div>
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '40px', color: THEME.textSecondary, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ZEN-NOTIS ARCHITECTURE | <Github size={12} /> bedro95
      </footer>

      {/* Success Toast */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', bottom: '30px', background: 'rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid #10b981', padding: '12px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Optimized & Scheduled</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
