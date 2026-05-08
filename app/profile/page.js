'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRank } from '@/lib/ranks';

export default function Profile() {
  const [userName, setUserName] = useState('Senior Student');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('stylistics_user_name');
    if (saved) setUserName(saved);

    const fetchProfile = async () => {
      const userId = localStorage.getItem('stylistics_user_id');
      if (!userId) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/user?userId=${userId}`);
        if (!res.ok) throw new Error("Profile fetch failed");
        const data = await res.json();
        if (data && data.user) {
          setUserData(data.user);
          setStats(data.stats);
          if (data.user.avatar) {
            localStorage.setItem('stylistics_user_avatar', data.user.avatar);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const handleUpdate = () => fetchProfile();
    window.addEventListener('avatarUpdate', handleUpdate);
    return () => window.removeEventListener('avatarUpdate', handleUpdate);
  }, []);

  const saveName = async (newName) => {
    setUserName(newName);
    localStorage.setItem('stylistics_user_name', newName);
    const userId = localStorage.getItem('stylistics_user_id');
    if (userId) {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: newName })
      });
    }
  };

  const allBadges = [
    { id: 1, name: 'Vanguard', icon: 'workspace_premium', color: 'text-secondary', desc: 'Reach 10,000+ Mastery Points', threshold: 10000 },
    { id: 2, name: 'Lead Analyst', icon: 'query_stats', color: 'text-emerald-500', desc: 'Reach 5,000+ Mastery Points', threshold: 5000 },
    { id: 3, name: 'Flash Thinker', icon: 'bolt', color: 'text-blue-400', desc: 'Reach 2,000+ Mastery Points', threshold: 2000 },
    { id: 4, name: 'SBR Scholar', icon: 'school', color: 'text-orange-400', desc: 'Complete your first quiz', threshold: 10 },
    { id: 5, name: 'Night Owl', icon: 'dark_mode', color: 'text-purple-400', desc: 'Study after midnight' },
    { id: 6, name: 'Perfect Streak', icon: 'local_fire_department', color: 'text-rose-500', desc: '7 days consistent activity' },
  ];

  const points = userData?.totalPoints || 0;
  const rank = getRank(points);
  const accuracy = stats?.accuracy || 0;
  const totalQuizzes = stats?.totalQuizzes || 0;

  const chapterLabels = [
    { id: 'lecture-01', label: 'Lec 1 — Foregrounding' },
    { id: 'lecture-02', label: 'Lec 2 — Deviation' },
    { id: 'lecture-03', label: 'Lec 3 — Cohesion' },
    { id: 'lecture-04', label: 'Lec 4 — Modality' },
    { id: 'lecture-05', label: 'Lec 5 — Narrative' },
    { id: 'lecture-06', label: 'Lec 6 — Dialogue' },
  ];

  const chapterProgress = chapterLabels.map(ch => {
    const pct = userData?.chapterProgress?.[ch.id] || 0;
    return {
      label: ch.label,
      progress: pct,
      color: pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-secondary' : 'bg-rose-500'
    };
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-4 md:px-6 pt-6 md:pt-10 pb-32 max-w-4xl mx-auto space-y-6 md:space-y-8">

      {/* Header / Avatar */}
      <div className="glass-card p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary/10 to-transparent" />
        
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[48px] border-4 border-secondary/30 bg-secondary/10 flex items-center justify-center relative z-10 mb-6 overflow-hidden">
          {userData?.avatar ? (
            <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-secondary font-black text-4xl md:text-5xl italic">
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center mb-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-black/40 border border-secondary/40 text-2xl md:text-3xl font-bold text-white text-center rounded-lg outline-none px-4 py-1"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => { saveName(userName); setIsEditing(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { saveName(userName); setIsEditing(false); } }}
            />
          ) : (
            <div className="flex items-center gap-2 cursor-pointer group/name" onClick={() => setIsEditing(true)}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{userName}</h2>
              <span className="material-symbols-outlined text-slate-600 group-hover/name:text-secondary transition-colors text-sm">edit</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className={`material-symbols-outlined text-sm ${rank.color}`}>{rank.icon}</span>
          <p className={`${rank.color} font-black uppercase tracking-widest text-[10px]`}>{rank.title} • Senior 2026</p>
        </div>

        <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
          <div className="bg-white/5 px-4 md:px-6 py-2 rounded-xl border border-white/5">
            <span className="block text-[9px] md:text-xs font-bold text-slate-500 uppercase">Points</span>
            <span className="text-lg md:text-xl font-bold text-secondary">{points.toLocaleString()}</span>
          </div>
          <div className="bg-white/5 px-4 md:px-6 py-2 rounded-xl border border-white/5">
            <span className="block text-[9px] md:text-xs font-bold text-slate-500 uppercase">Accuracy</span>
            <span className="text-lg md:text-xl font-bold text-white">{accuracy}%</span>
          </div>
          <div className="bg-white/5 px-4 md:px-6 py-2 rounded-xl border border-white/5">
            <span className="block text-[9px] md:text-xs font-bold text-slate-500 uppercase">Quizzes</span>
            <span className="text-lg md:text-xl font-bold text-white">{totalQuizzes}</span>
          </div>
        </div>
      </div>

      {/* Badges / Achievements */}
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allBadges.map(badge => {
            const unlocked = badge.threshold ? points >= badge.threshold : false;
            return (
              <div key={badge.id} className={`glass-card p-4 md:p-6 flex items-center gap-3 md:gap-4 transition-all ${unlocked ? 'border-white/10 hover:border-secondary/30' : 'opacity-30'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center ${badge.color} shrink-0`}>
                  <span className="material-symbols-outlined fill-1">{badge.icon}</span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm truncate">{badge.name}</h4>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter leading-tight">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Mastery — REAL DATA FROM DB */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
          <h3 className="text-lg md:text-xl font-bold">Chapter Mastery</h3>
          <span className="text-xs font-bold text-secondary uppercase">Live Data</span>
        </div>
        <div className="space-y-4">
          {chapterProgress.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-slate-300 text-xs md:text-sm">{item.label}</span>
                <span className={`font-bold text-xs ${item.progress >= 70 ? 'text-emerald-500' : item.progress >= 40 ? 'text-secondary' : item.progress > 0 ? 'text-rose-500' : 'text-slate-600'}`}>
                  {item.progress > 0 ? `${item.progress}%` : 'Not Started'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to Mistakes Archive */}
      <div className="bg-secondary/10 border border-secondary/20 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-secondary mb-1">Mistakes Archive</h3>
          <p className="text-sm text-slate-400">Review linguistic errors from previous assessments.</p>
        </div>
        <Link href="/review" className="w-full md:w-auto bg-secondary text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap text-center">
          Open Review Mode
        </Link>
      </div>
    </div>
  );
}
