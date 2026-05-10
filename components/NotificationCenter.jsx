'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    // Load read state from localStorage
    const saved = localStorage.getItem('sbr_notifications_read');
    if (saved) setReadIds(JSON.parse(saved));

    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(() => {
        setNotifications([
          { id: 'applied-wizard-live', title: 'Applied Linguistic Wizard', msg: 'The interactive Mock Exam is here! Highlight texts and analyze them step-by-step.', date: 'Today', type: 'new-feature' }
        ]);
      });
  }, []);

  const markAsRead = (id) => {
    if (readIds.includes(id)) return;
    const newRead = [...readIds, id];
    setReadIds(newRead);
    localStorage.setItem('sbr_notifications_read', JSON.stringify(newRead));
  };

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('sbr_notifications_read', JSON.stringify(allIds));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-sm bg-slate-900 border-l border-white/10 h-full shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2 italic">
              <Bell className="text-emerald-400" size={20} /> Bulletin Center
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SBR Broadcast System</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Actions */}
        <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-slate-800/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {notifications.filter(n => !readIds.includes(n.id)).length} New Messages
          </span>
          <button 
            onClick={markAllRead}
            className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            <CheckCircle2 size={12} /> Mark all read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <BellOff size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm font-medium italic">No new transmissions for the Senior 2026 cohort.</p>
            </div>
          ) : (
            notifications.slice().reverse().map((n) => {
              const isUnread = !readIds.includes(n.id);
              return (
                <motion.div 
                  key={n.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onViewportEnter={() => isUnread && markAsRead(n.id)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-500 ${isUnread ? 'bg-slate-800/80 border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'bg-slate-900/50 border-white/5 opacity-70 hover:opacity-100'}`}
                >
                  {isUnread && (
                    <div className="absolute top-5 right-5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                  
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${n.type === 'new-feature' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {n.type === 'new-feature' ? <Sparkles size={16} /> : <Info size={16} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{n.title}</h4>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{n.date}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed pl-11">{n.msg}</p>
                  
                  <div className="mt-4 pl-11 flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${n.type === 'new-feature' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                      {n.type}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900">
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-4 rounded-xl border border-emerald-500/20">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={12} /> Systems Operational
            </p>
            <p className="text-[9px] text-slate-500 mt-1">Platform core updated to build v2.6.5-Applied</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
