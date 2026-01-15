"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Plus, Shield, CheckCircle2, Github } from 'lucide-react';

// --- Engineering Constants & Types ---
interface Reminder {
  id: string;
  note: string;
  time: string;
  createdAt: number;
}

const THEME = {
  background: '#050505',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: '#2563eb',
  textPrimary: '#ffffff',
  textSecondary: '#666666',
  blur: 'blur(40px)'
};

export default function ZenNotisApp() {
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // --- Logic Handlers ---
  const handleSetReminder = () => {
    if (!note || !time) return;

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    if (targetDate.getTime() <= now.getTime()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const timeUntilTrigger = targetDate.getTime() - now.getTime();

    // Schedule Execution
    setTimeout(() => {
      // 1. Separate Vibration Logic (Fixed)
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // 2. Visual Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Zen Notis", {
          body: note,
          icon: '/icon.png'
        });
      } else {
        alert(`🔔 Zen Notis: ${note}`);
      }
    }, timeUntilTrigger);

    setIsSuccess(true);
    setNote('');
    setTime('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <main style={{ 
      backgroundColor: THEME.background, 
      minHeight: '100vh', 
      color: THEME.textPrimary,
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(37, 99, 235, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '100%'
      }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: THEME.glass,
          backdropFilter: THEME.blur,
          WebkitBackdropFilter: THEME.blur,
          border: `1px solid ${THEME.border}`,
          borderRadius: '40px',
          padding: '40px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          zIndex: 10
        }}
      >
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>
              Zen Notis
            </h1>
            <Shield size={24} color={THEME.accent} />
          </div>
          <p style={{ color: THEME.textSecondary, fontSize: '14px', marginTop: '8px' }}>
            Next-gen luxury reminder system.
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 700, color: THEME.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Note Content
            </label>
            <input 
              type="text"
              placeholder="What's on your mind?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${THEME.border}`,
                borderRadius: '18px',
                padding: '16px 20px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: 700, color: THEME.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Execution Time
            </label>
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${THEME.border}`,
                borderRadius: '18px',
                padding: '16px 20px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleSetReminder}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${THEME.accent}, #1e40af)`,
              padding: '18px',
              borderRadius: '20px',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={18} />
            SCHEDULE TASK
          </motion.button>
        </section>
      </motion.div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '30px',
              zIndex: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              padding: '12px 24px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <CheckCircle2 size={20} color="#10b981" />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Reminder Optimized & Saved</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '40px', color: THEME.textSecondary, fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
        ZEN-NOTIS ARCHITECTURE | 
        <a href="https://github.com/bedro95" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: THEME.textSecondary, textDecoration: 'none' }}>
          <Github size={14} /> bedro95
        </a>
      </footer>
    </main>
  );
}
