"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Plus, ShieldCheck } from 'lucide-react';

// --- Types & Interfaces ---
interface NotificationState {
  id: string;
  title: string;
  time: string;
  isActive: boolean;
}

export default function ZenNotisPage() {
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isNotified, setIsNotified] = useState<boolean>(false);

  // --- Logic Handlers ---
  const scheduleNotification = () => {
    if (!note || !time) return;
    
    // Trigger Visual Feedback
    setIsNotified(true);
    setTimeout(() => setIsNotified(false), 5000);
    
    console.log(`Notification Set: ${note} at ${time}`);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Background Aesthetic Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
      >
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Zen Notis
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-light">Elegance in reminders.</p>
          </div>
          <div className="p-3 bg-white/[0.05] rounded-2xl border border-white/[0.1]">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
        </header>

        <div className="space-y-6">
          {/* Input: Note Description */}
          <div className="group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 block px-1">Note Content</label>
            <input 
              type="text"
              placeholder="What needs to be done?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Input: Time Picker */}
          <div className="group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 block px-1">Trigger Time</label>
            <div className="relative">
              <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl pl-14 pr-5 py-4 outline-none focus:border-blue-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={scheduleNotification}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Set Zen Reminder
          </button>
        </div>
      </motion.div>

      {/* Glass Notification (Floating HUD) */}
      <AnimatePresence>
        {isNotified && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-10 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Bell className="text-white w-6 h-6 animate-ring" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Notification Set!</h4>
                <p className="text-white/60 text-xs">Reminder for: {note}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
