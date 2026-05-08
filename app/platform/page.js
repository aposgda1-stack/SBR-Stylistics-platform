'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [countdown, setCountdown] = useState('');
  const [userName, setUserName] = useState('Researcher');

  useEffect(() => {
    const saved = localStorage.getItem('stylistics_user_name');
    if (saved) setUserName(saved);
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const syncProgress = () => {
      const progress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 12450}');
      setPoints(progress.totalPoints);
      setMistakes(JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]'));
    };

    const updateCountdown = () => {
      const target = new Date('2026-05-11T09:00:00').getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("EXAM LIVE");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };

    syncProgress();
    updateCountdown();
    
    const progressInterval = setInterval(syncProgress, 1000);
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  if (!mounted) return null;

  const navCards = [
    { label: 'Study Pack', icon: 'menu_book', path: '/lab', color: 'bg-blue-500', desc: 'Summaries.' },
    { label: 'Final Prep', icon: 'timer', path: '/exams', color: 'bg-secondary', desc: 'Mock Exams.' },
    { label: 'My Dossier', icon: 'folder_managed', path: '/dashboard', color: 'bg-rose-500', desc: 'Mistakes Archive.' },
    { label: 'The Podium', icon: 'military_tech', path: '/leaderboard', color: 'bg-emerald-500', desc: 'Class Ranks.' },
  ];

  return (
    <main className="px-4 md:px-6 pt-4 md:pt-10 pb-40 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
        
        {/* Welcome Bento Card */}
        <section className="lg:col-span-8 bg-[#111113] rounded-[24px] md:rounded-[32px] border border-white/5 p-6 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-[340px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl border-4 border-secondary/20 p-1 bg-[#1c1c1e] shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiVohECAJJTmITVWBy-o-vwvNe1iUEy-ZoOm_FrSWb5XSs7THEZgyo0pRdhnb34KuivNALvf5X5SeqwXx7BXEMnZwQu2fu9B1JS87X9CO3bCvB-JSZVWYJy0R-cvsEtcHwPGbGZaxhM80gaiALLaYgHeytP7PnEWDOxYweWt5yX2hiN80UcFDk-sf_ujdBD-syRuph_e6UGslXVs2xo9x97kMHK7Vt6pIQryiRlLTuQVhJb0mRNXMkcQQwf-h3Y" 
                className="w-full h-full rounded-xl md:rounded-2xl object-cover" 
                alt="Avatar" 
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-3xl md:text-6xl font-black text-white italic tracking-tighter leading-none">YOU GOT THIS, {userName.split(' ')[0].toUpperCase()}.</h1>
              <p className="text-secondary/60 text-[10px] md:text-sm font-bold uppercase tracking-widest">Senior 2026 • Summarized By Ruby</p>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap justify-center md:justify-start gap-2">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">SBR ACTIVE</span>
            </div>
            <div className="px-3 py-1.5 bg-secondary/10 rounded-lg border border-secondary/20 flex items-center gap-2">
              <span className="text-[9px] font-black text-secondary uppercase tracking-widest italic">RANK #1</span>
            </div>
          </div>
        </section>

        {/* Global Stats Card */}
        <section className="lg:col-span-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-[24px] md:rounded-[32px] border border-secondary/20 p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 md:mb-4">Mastery Points</span>
          <div className="text-5xl md:text-7xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-all">{points.toLocaleString()}</div>
          <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-white/5 w-full">
            <button className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-rose-500 uppercase hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span> Take a break
            </button>
          </div>
        </section>

        {/* Resume Card */}
        <section className="lg:col-span-12 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-900 rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-3xl rounded-full" />
          
          <div className="relative z-10 space-y-4 md:space-y-6 text-center md:text-left">
            <div>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest mb-2 md:mb-4 inline-block italic">Ready for the exam?</span>
              <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">SMASH THE EXAM.</h2>
            </div>
            <Link href="/lab" className="bg-white text-blue-900 px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full md:w-fit hover:scale-105 transition-all shadow-xl">
              <span className="material-symbols-outlined text-sm md:text-base">play_arrow</span> Start Studying
            </Link>
          </div>

          <div className="relative z-10 w-24 h-24 md:w-40 md:h-40 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
            <div className="absolute inset-0 border-4 md:border-8 border-white/20 rounded-full" />
            <div className="absolute inset-0 border-4 md:border-8 border-white rounded-full transition-all duration-1000" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }} />
            <span className="text-xl md:text-4xl font-black text-white italic">45%</span>
          </div>
        </section>

        {/* Action Grid */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {navCards.map((card, i) => (
            <Link key={i} href={card.path} className="glass-card p-5 md:p-8 group hover:border-white/20 transition-all flex flex-col items-center text-center gap-2 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${card.color} rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-xl md:text-2xl font-bold">{card.icon}</span>
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold text-white italic leading-none">{card.label}</h3>
                <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1 hidden md:block">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Analytics Summary */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="glass-card p-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span>
              <span className="text-xl font-black text-white italic">92%</span>
           </div>
           
           <div className="glass-card p-6 flex items-center justify-between bg-gradient-to-r from-secondary/5 to-transparent border-secondary/20">
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Exam Countdown</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white italic">{countdown}</span>
                <span className="material-symbols-outlined text-secondary animate-pulse text-sm">alarm</span>
              </div>
           </div>

           <div className="glass-card p-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mistakes Archive</span>
              <span className="text-xl font-black text-white italic text-rose-500">{mistakes.length}</span>
           </div>
        </div>


        {/* Message Banner */}
        <section className="lg:col-span-12 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 text-center italic">
          <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed">
            "This platform is created by SBR (Summarized By Ruby) for our class Senior 2026. Unofficial and made with love."
          </p>
        </section>

      </div>
    </main>
  );
}
