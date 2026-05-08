'use client';
import { useState, useEffect } from 'react';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    fetch('/data/notifications.json')
      .then(res => res.json())
      .then(data => setNotifications(data.notifications))
      .catch(() => {
        // Fallback if fetch fails (e.g. static export)
        setNotifications([
          { id: 1, title: 'Exam Prep Live', msg: 'The Monday exam models are now available.', date: '2h ago', type: 'announcement' },
          { id: 2, title: 'Rank Up!', msg: 'You just reached Stylistic Analyst rank!', date: '1d ago', type: 'achievement' }
        ]);
      });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111113] border-l border-white/5 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="text-lg font-bold text-white italic">Bulletin Center</h3>
          <button onClick={onClose} className="material-symbols-outlined text-slate-500 hover:text-white transition-colors">close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <span className="material-symbols-outlined text-4xl text-slate-700">notifications_off</span>
              <p className="text-slate-500 text-sm font-medium">No new transmissions for the Senior 2026 cohort.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="glass-card p-5 border-l-2 border-secondary/40 hover:border-secondary transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-sm">{n.title}</h4>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">{n.date}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.msg}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-secondary" />
                  <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{n.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 text-center">
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">SBR Platform • Broadcast System</p>
        </div>
      </div>
    </div>
  );
}
