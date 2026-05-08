'use client';

const leaders = [
  { id: 1, name: "Dr. Elena Vance", points: 12450, rank: 1, badge: 'vanguard', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiVohECAJJTmITVWBy-o-vwvNe1iUEy-ZoOm_FrSWb5XSs7THEZgyo0pRdhnb34KuivNALvf5X5SeqwXx7BXEMnZwQu2fu9B1JS87X9CO3bCvB-JSZVWYJy0R-cvsEtcHwPGbGZaxhM80gaiALLaYgHeytP7PnEWDOxYweWt5yX2hiN80UcFDk-sf_ujdBD-syRuph_e6UGslXVs2xo9x97kMHK7Vt6pIXNc-Avknm56PpIQryiRlLTuQVhJb0mRNXMkcQQwf-h3Y" },
  { id: 2, name: "Professor Aris", points: 11200, rank: 2, badge: 'analyst', img: "https://lh3.googleusercontent.com/aida-public/AF6AXuByVohECAJJTmITVWBy-o-vwvNe1iUEy-ZoOm_FrSWb5XSs7THEZgyo0pRdhnb34KuivNALvf5X5SeqwXx7BXEMnZwQu2fu9B1JS87X9CO3bCvB-JSZVWYJy0R-cvsEtcHwPGbGZaxhM80gaiALLaYgHeytP7PnEWDOxYweWt5yX2hiN80UcFDk-sf_ujdBD-syRuph_e6UGslXVs2xo9x97kMHK7Vt6pIXNc-Avknm56PpIQryiRlLTuQVhJb0mRNXMkcQQwf-h3Y" },
  { id: 3, name: "Julian Thorne", points: 9850, rank: 3, badge: 'thinker', img: "https://lh3.googleusercontent.com/aida-public/AI6AXuBiVohECAJJTmITVWBy-o-vwvNe1iUEy-ZoOm_FrSWb5XSs7THEZgyo0pRdhnb34KuivNALvf5X5SeqwXx7BXEMnZwQu2fu9B1JS87X9CO3bCvB-JSZVWYJy0R-cvsEtcHwPGbGZaxhM80gaiALLaYgHeytP7PnEWDOxYweWt5yX2hiN80UcFDk-sf_ujdBD-syRuph_e6UGslXVs2xo9x97kMHK7Vt6pIXNc-Avknm56PpIQryiRlLTuQVhJb0mRNXMkcQQwf-h3Y" },
  { id: 4, name: "Marcus Wright", points: 8600, rank: 4, badge: 'scholar', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: 5, name: "Sarah Connor", points: 7200, rank: 5, badge: 'scholar', img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 6, name: "Arthur Morgan", points: 6850, rank: 6, badge: 'analyst', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: 7, name: "Sadie Adler", points: 6100, rank: 7, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: 8, name: "John Marston", points: 5400, rank: 8, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { id: 9, name: "Dutch van der Linde", points: 4900, rank: 9, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
  { id: 10, name: "Charles Smith", points: 4200, rank: 10, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
];

const badgeConfig = {
  vanguard: { label: 'Vanguard', icon: 'workspace_premium', color: 'text-secondary', bg: 'bg-secondary/10' },
  analyst: { label: 'Lead Analyst', icon: 'query_stats', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  thinker: { label: 'Flash Thinker', icon: 'bolt', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  scholar: { label: 'SBR Scholar', icon: 'school', color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export default function Leaderboard() {
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
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 rounded-full border-2 border-slate-400 p-1 mb-4 relative">
            <img src={leaders[1].img} className="w-full h-full rounded-full object-cover" alt="" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">2</div>
          </div>
          <div className="w-20 h-28 bg-white/5 border border-white/10 rounded-t-xl flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] font-bold text-white truncate w-full px-1 mb-1">{leaders[1].name.split(' ')[0]}</span>
            <span className="text-xs text-slate-500 mb-2">{leaders[1].points}</span>
            {leaders[1].badge && (
              <div className={`px-1.5 py-0.5 rounded-full ${badgeConfig[leaders[1].badge].bg} flex items-center gap-1`}>
                <span className={`material-symbols-outlined text-[8px] ${badgeConfig[leaders[1].badge].color}`}>{badgeConfig[leaders[1].badge].icon}</span>
                <span className={`text-[6px] font-black uppercase ${badgeConfig[leaders[1].badge].color}`}>{badgeConfig[leaders[1].badge].label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rank 1 (Tallest) */}
        <div className="flex flex-col items-center group -mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-secondary p-1 mb-4 relative shadow-[0_0_20px_rgba(233,193,118,0.2)]">
            <img src={leaders[0].img} className="w-full h-full rounded-full object-cover" alt="" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary text-black text-[12px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
            </div>
          </div>
          <div className="w-28 h-40 bg-secondary/10 border border-secondary/20 rounded-t-2xl flex flex-col items-center justify-center p-4 text-center">
            <span className="text-xs font-bold text-white mb-1">{leaders[0].name}</span>
            <span className="text-lg font-bold text-secondary mb-2">{leaders[0].points}</span>
            <div className={`px-2 py-0.5 rounded-full ${badgeConfig.vanguard.bg} flex items-center gap-1 border border-secondary/20 shadow-lg shadow-secondary/5`}>
              <span className="material-symbols-outlined text-[10px] text-secondary">workspace_premium</span>
              <span className="text-[8px] font-black uppercase text-secondary">Vanguard</span>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 rounded-full border-2 border-orange-400/50 p-1 mb-4 relative">
            <img src={leaders[2].img} className="w-full h-full rounded-full object-cover" alt="" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#111113]">3</div>
          </div>
          <div className="w-20 h-24 bg-white/5 border border-white/10 rounded-t-xl flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] font-bold text-white truncate w-full px-1 mb-1">{leaders[2].name.split(' ')[0]}</span>
            <span className="text-xs text-slate-500 mb-2">{leaders[2].points}</span>
            {leaders[2].badge && (
              <div className={`px-1.5 py-0.5 rounded-full ${badgeConfig[leaders[2].badge].bg} flex items-center gap-1`}>
                <span className={`material-symbols-outlined text-[8px] ${badgeConfig[leaders[2].badge].color}`}>{badgeConfig[leaders[2].badge].icon}</span>
                <span className={`text-[6px] font-black uppercase ${badgeConfig[leaders[2].badge].color}`}>{badgeConfig[leaders[2].badge].label}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Others List */}
      <div className="space-y-3">
        {leaders.slice(3).map((player) => (
          <div key={player.id} className="glass-card p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500 w-6">#{player.rank}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <img src={player.img} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="font-bold text-white">{player.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-secondary">{player.points} pts</span>
              {player.badge ? (
                <div className="flex items-center gap-1 mt-1">
                  <span className={`material-symbols-outlined text-[10px] ${badgeConfig[player.badge].color}`}>{badgeConfig[player.badge].icon}</span>
                  <span className={`text-[8px] font-black uppercase ${badgeConfig[player.badge].color}`}>{badgeConfig[player.badge].label}</span>
                </div>
              ) : (
                <span className="text-[9px] text-slate-600 font-bold uppercase mt-1">Candidate</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
