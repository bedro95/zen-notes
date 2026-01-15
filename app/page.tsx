"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Plus, ShieldCheck } from 'lucide-react';

export default function ZenNotisPage() {
  const [note, setNote] = useState('');
  const [time, setTime] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/[0.1] rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tighter">Zen Notis</h1>
          <ShieldCheck className="text-blue-500 w-6 h-6" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Note</span>
            <input 
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
              placeholder="What to remember?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Time</span>
            <input 
              type="time"
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4 outline-none focus:border-blue-500 [color-scheme:dark]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setIsNotified(true); setTimeout(() => setIsNotified(false), 3000); }}
            className="w-full bg-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-95"
          >
            <Plus size={20} /> Set Reminder
          </button>
        </div>
      </div>

      {/* Floating Glass Notification */}
      <AnimatePresence>
        {isNotified && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 z-50 w-[90%] max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center gap-4"
          >
            <div className="bg-blue-500 p-2 rounded-xl">
              <Bell size={20} />
            </div>
            <p className="text-sm font-medium">Notification Scheduled!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
