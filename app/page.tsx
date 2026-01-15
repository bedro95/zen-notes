"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Plus, Shield, CheckCircle2, Github } from 'lucide-react'; // Added Github icon

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
  accent: '#2563eb', // Royal Blue
  textPrimary: '#ffffff',
  textSecondary: '#666666',
  blur: 'blur(40px)'
};

export default function ZenNotisApp() {
  // --- State Management ---
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [reminders, setReminders] = useState<Reminder[]>([]); // Preserving this state as it might be used later

  // --- Logic Handlers ---
  const handleSetReminder = () => {
    if (!note || !time) {
      // Optional: Add a subtle error animation or toast for empty fields
      console.warn("Input fields cannot be empty.");
      return;
    }

    // 1. Calculate Target Time
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to 0

    // If target time is in the past, set for the next day
    if (targetDate.getTime() <= now.getTime()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const timeUntilTrigger = targetDate.getTime() - now.getTime(); // Time in milliseconds

    // 2. Schedule Local HTML5 Notification
    // This will trigger an alert/vibration when the time comes
    const timeoutId = setTimeout(() => {
      // Check if Notification API is supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Zen Notis Reminder", {
          body: note,
          icon: '/icon.png', // Ensure you have an icon.png in public folder
          vibrate: [200, 100, 200, 100, 200] // Custom vibration pattern
        });
      } else if ('vibrate' in navigator) {
        // Fallback for non-granted permission or browser without Notification API
        navigator.vibrate([200, 100, 200]);
        alert(`🔔 Zen Notis: ${note}`); // Fallback alert
      } else {
        alert(`🔔 Zen Notis: ${note}`); // Final fallback
      }
    }, timeUntilTrigger);

    // 3. Update UI State for Success Toast
    setIsSuccess(true);
    
    // Clear input fields only after successful scheduling
    setNote('');
    setTime('');

    // Auto-hide success toast after 4 seconds
    setTimeout(() => setIsSuccess(false), 4000);
    
    // Log for debugging and confirmation
    console.log(`Reminder Scheduled: "${note}" for ${time} (Trigger in ${timeUntilTrigger / 1000} seconds)`);
  };

  // --- Component Mount Effect for Notification Permission ---
  useEffect(() => {
    // Request notification permission on app load for a better UX
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log("Notification permission granted on load.");
        } else {
          console.warn("Notification permission denied or not supported.");
        }
      });
    }
  }, []); // Run only once on component mount


  return (
    <main style={{ 
      backgroundColor: THEME.background, 
      minHeight: '100vh', 
      color: THEME.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Ambient Light */}
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

      {/* Main UI Card */}
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
          {/* Note Input Area */}
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
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          {/* Time Picker Area */}
          <div>
            <label style={{ fontSize: '10px', fontWeight: 700, color: THEME.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Execution Time
            </label>
            <div style={{ position: 'relative' }}>
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
          </div>

          {/* Master Action Button */}
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
              marginTop: '10px',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={18} />
            SCHEDULE TASK
          </motion.button>
        </section>
      </motion.div>

      {/* Success Notification (Floating HUD) */}
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

      {/* Footer with GitHub Profile Link */}
      <footer style={{ marginTop: '40px', color: THEME.textSecondary, fontSize: '12px', fontWeight: 500, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        POWERED BY ZEN-NOTIS ARCHITECTURE
        <a 
          href="https://github.com/bedro95" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: THEME.textSecondary, 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = THEME.accent)}
          onMouseOut={(e) => (e.currentTarget.style.color = THEME.textSecondary)}
        >
          <Github size={16} /> bedro95
        </a>
      </footer>
    </main>
  );
}
