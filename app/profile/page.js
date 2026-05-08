'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRank } from '@/lib/ranks';

export default function Profile() {
  const [profileImg, setProfileImg] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBiVohECAJJTmITVWBy-o-vwvNe1iUEy-ZoOm_FrSWb5XSs7THEZgyo0pRdhnb34KuivNALvf5X5SeqwXx7BXEMnZwQu2fu9B1JS87X9CO3bCvB-JSZVWYJy0R-cvsEtcHwPGbGZaxhM80gaiALLaYgHeytP7PnEWDOxYweWt5yX2hiN80UcFDk-sf_ujdBD-syRuph_e6UGslXVs2xo9x97kMHK7Vt6pIQryiRlLTuQVhJb0mRNXMkcQQwf-h3Y");
  const [userName, setUserName] = useState('Senior Student');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('stylistics_user_name');
    if (saved) setUserName(saved);
  }, []);

  const saveName = (newName) => {
    setUserName(newName);
    localStorage.setItem('stylistics_user_name', newName);
  };

  const badges = [
    { id: 1, name: 'Vanguard', icon: 'workspace_premium', color: 'text-secondary', desc: 'Rank #1 in Official Exam' },
    { id: 2, name: 'Lead Analyst', icon: 'query_stats', color: 'text-emerald-500', desc: '100% Accuracy in Applied Analysis' },
    { id: 3, name: 'Flash Thinker', icon: 'bolt', color: 'text-blue-400', desc: 'Complete Exam in under 60 mins' },
    { id: 4, name: 'SBR Scholar', icon: 'school', color: 'text-orange-400', desc: 'Master all Chapter Summaries' },
    { id: 5, name: 'Night Owl', icon: 'dark_mode', color: 'text-purple-400', desc: 'Study after midnight' },
    { id: 6, name: 'Perfect Streak', icon: 'local_fire_department', color: 'text-rose-500', desc: '7 days consistent activity' },
  ];

  const rank = getRank(12450); // Mock points for now

  return (
    <div className="px-6 pt-10 pb-32 max-w-4xl mx-auto space-y-8">
      {/* Header / Avatar Section */}
      <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary/10 to-transparent" />
        
        <div className="relative group mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-secondary/30 p-1 relative z-10 overflow-hidden bg-[#1c1c1e]">
            <img src={profileImg} className="w-full h-full rounded-full object-cover" alt="Profile" />
          </div>
          <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-white">photo_camera</span>
            <input type="file" className="hidden" onChange={(e) => {
              const file = e.target.files[0];
              if (file) setProfileImg(URL.createObjectURL(file));
            }} />
          </label>
        </div>

        <div className="flex flex-col items-center mb-1">
          {isEditing ? (
            <input 
              autoFocus
              className="bg-black/40 border border-secondary/40 text-3xl font-bold text-white text-center rounded-lg outline-none px-4 py-1"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveName(userName);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-2 group/name cursor-pointer" onClick={() => setIsEditing(true)}>
              <h2 className="text-3xl font-bold text-white">{userName}</h2>
              <span className="material-symbols-outlined text-slate-600 group-hover/name:text-secondary transition-colors text-sm">edit</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-6">
          <span className={`material-symbols-outlined text-sm ${rank.color}`}>{rank.icon}</span>
          <p className={`${rank.color} font-black uppercase tracking-widest text-[10px]`}>{rank.title} • Senior 2026</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/5 px-6 py-2 rounded-xl border border-white/5">
            <span className="block text-xs font-bold text-slate-500 uppercase">Points</span>
            <span className="text-xl font-bold text-secondary">12,450</span>
          </div>
          <div className="bg-white/5 px-6 py-2 rounded-xl border border-white/5">
            <span className="block text-xs font-bold text-slate-500 uppercase">Global Rank</span>
            <span className="text-xl font-bold text-white">#1</span>
          </div>
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div key={badge.id} className="glass-card p-6 flex items-center gap-4 group hover:border-secondary/30 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${badge.color} shrink-0`}>
              <span className="material-symbols-outlined fill-1">{badge.icon}</span>
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-white truncate">{badge.name}</h4>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter leading-tight">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics / Mistakes Section */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <h3 className="text-xl font-bold">Weakness Mapping</h3>
          <span className="text-xs font-bold text-secondary uppercase">Last 30 Days</span>
        </div>
        
        <div className="space-y-6">
          {[
            { label: 'Phonological Analysis', progress: 85, color: 'bg-emerald-500' },
            { label: 'Syntactic Structures', progress: 42, color: 'bg-rose-500' },
            { label: 'Semantic Deviation', progress: 68, color: 'bg-blue-500' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-300">{item.label}</span>
                <span className={`font-bold ${item.progress < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Section Call-to-action */}
      <div className="bg-secondary/10 border border-secondary/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-secondary mb-1">Mistakes Archive</h3>
          <p className="text-sm text-slate-400">Review the 14 linguistic errors you've committed in previous assessments.</p>
        </div>
        <Link href="/review" className="bg-secondary text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap">
          Open Review Mode
        </Link>
      </div>
    </div>
  );
}
