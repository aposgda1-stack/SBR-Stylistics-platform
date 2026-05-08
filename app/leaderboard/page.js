'use client';
import { useState, useEffect } from 'react';

const badgeConfig = {
  vanguard: { label: 'Vanguard', icon: 'workspace_premium', color: 'text-secondary', bg: 'bg-secondary/10' },
  analyst: { label: 'Lead Analyst', icon: 'query_stats', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  thinker: { label: 'Flash Thinker', icon: 'bolt', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  scholar: { label: 'SBR Scholar', icon: 'school', color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeaders(data.leaders);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Results...</p>
      </div>
    );
  }

  // Fallback for empty state
  if (leaders.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">analytics</span>
        <h2 className="text-2xl font-black text-white italic">The podium is quiet...</h2>
        <p className="text-slate-500 mt-2">Start a quiz to be the first one on the list!</p>
      </div>
    );
  }

  const renderAvatar = (name, size = "md") => {
    const initial = name?.charAt(0).toUpperCase() || 'S';
    const dimensions = size === "lg" ? "w-20 h-20" : size === "sm" ? "w-10 h-10" : "w-16 h-16";
    const textClasses = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-xl";

    return (
      <div className={`${dimensions} rounded-full border-2 border-white/10 bg-secondary/10 flex items-center justify-center overflow-hidden shrink-0`}>
        <span className={`text-secondary font-black ${textClasses} italic`}>{initial}</span>
      </div>
    );
  };

  return (
    <div className="px-6 pt-10 pb-32 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">The Podium</h2>
        <p className="text-slate-400 text-sm">Recognizing the top 10 vanguards of stylistic analysis.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-20">
        {/* Rank 2 */}
        {leaders[1] && (
          <div className="flex flex-col items-center group">
            <div className="relative mb-4">
              {renderAvatar(leaders[1].name)}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">2</div>
            </div>
            <div className="w-20 h-28 bg-white/5 border border-white/10 rounded-t-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] font-bold text-white truncate w-full px-1 mb-1">{leaders[1].name.split(' ')[0]}</span>
              <span className="text-xs text-slate-500 mb-2">{leaders[1].points}</span>
              <div className={`px-1.5 py-0.5 rounded-full ${badgeConfig[leaders[1].badge].bg} flex items-center gap-1`}>
                <span className={`material-symbols-outlined text-[8px] ${badgeConfig[leaders[1].badge].color}`}>{badgeConfig[leaders[1].badge].icon}</span>
                <span className={`text-[6px] font-black uppercase ${badgeConfig[leaders[1].badge].color}`}>{badgeConfig[leaders[1].badge].label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 (Tallest) */}
        {leaders[0] && (
          <div className="flex flex-col items-center group -mb-4">
            <div className="relative mb-4">
              <div className="rounded-full border-4 border-secondary shadow-[0_0_20px_rgba(129,140,248,0.2)]">
                {renderAvatar(leaders[0].name, "lg")}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary text-black text-[12px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
              </div>
            </div>
            <div className="w-28 h-40 bg-secondary/10 border border-secondary/20 rounded-t-2xl flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-bold text-white mb-1 truncate w-full">{leaders[0].name}</span>
              <span className="text-lg font-bold text-secondary mb-2">{leaders[0].points}</span>
              <div className={`px-2 py-0.5 rounded-full ${badgeConfig.vanguard.bg} flex items-center gap-1 border border-secondary/20 shadow-lg shadow-secondary/5`}>
                <span className="material-symbols-outlined text-[10px] text-secondary">workspace_premium</span>
                <span className="text-[8px] font-black uppercase text-secondary">Vanguard</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {leaders[2] && (
          <div className="flex flex-col items-center group">
            <div className="relative mb-4">
              {renderAvatar(leaders[2].name)}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">3</div>
            </div>
            <div className="w-20 h-24 bg-white/5 border border-white/10 rounded-t-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] font-bold text-white truncate w-full px-1 mb-1">{leaders[2].name.split(' ')[0]}</span>
              <span className="text-xs text-slate-500 mb-2">{leaders[2].points}</span>
              <div className={`px-1.5 py-0.5 rounded-full ${badgeConfig[leaders[2].badge].bg} flex items-center gap-1`}>
                <span className={`material-symbols-outlined text-[8px] ${badgeConfig[leaders[2].badge].color}`}>{badgeConfig[leaders[2].badge].icon}</span>
                <span className={`text-[6px] font-black uppercase ${badgeConfig[leaders[2].badge].color}`}>{badgeConfig[leaders[2].badge].label}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Others List */}
      <div className="space-y-3">
        {leaders.slice(3).map((player) => (
          <div key={player.id} className="glass-card p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500 w-6">#{player.rank}</span>
              {renderAvatar(player.name, "sm")}
              <span className="font-bold text-white">{player.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-secondary">{player.points} pts</span>
              <div className="flex items-center gap-1 mt-1">
                <span className={`material-symbols-outlined text-[10px] ${badgeConfig[player.badge].color}`}>{badgeConfig[player.badge].icon}</span>
                <span className={`text-[8px] font-black uppercase ${badgeConfig[player.badge].color}`}>{badgeConfig[player.badge].label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
