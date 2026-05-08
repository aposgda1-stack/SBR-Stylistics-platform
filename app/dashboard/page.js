'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dossier() {
  const [mistakes, setMistakes] = useState([]);
  const [activity, setActivity] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState([
    { label: 'Lec 1', id: 'lecture-01', value: 100, angle: 0 },
    { label: 'Lec 2', id: 'lecture-02', value: 100, angle: 60 },
    { label: 'Lec 3', id: 'lecture-03', value: 100, angle: 120 },
    { label: 'Lec 4', id: 'lecture-04', value: 100, angle: 180 },
    { label: 'Lec 5', id: 'lecture-05', value: 100, angle: 240 },
    { label: 'Lec 6', id: 'lecture-06', value: 100, angle: 300 },
  ]);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedMistakes = JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]');
      const savedActivity = JSON.parse(localStorage.getItem('stylistics_activity') || '{}');
      setMistakes(Array.isArray(savedMistakes) ? savedMistakes : []);
      setActivity(savedActivity || {});

      setStats(prev => {
        if (!Array.isArray(prev)) return prev;
        return prev.map(s => {
          const chapterMistakes = Array.isArray(savedMistakes) ? savedMistakes.filter(m => m && m.chapter === s.id).length : 0;
          return { ...s, value: Math.max(20, 100 - (chapterMistakes * 10)) };
        });
      });
    } catch (e) {
      console.error("Dossier load error", e);
    }
  }, []);

  const size = 300;
  const center = size / 2;
  const maxRadius = (size / 2) * 0.8;
  const points = stats.map((s) => {
    const rad = (s.angle - 90) * (Math.PI / 180);
    const r = (s.value / 100) * maxRadius;
    return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`;
  }).join(' ');

  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const clearArchive = () => {
    if (confirm('Wipe all intelligence data?')) {
      localStorage.removeItem('stylistics_mistakes');
      setMistakes([]);
    }
  };

  const filteredMistakes = activeTab === 'all' 
    ? mistakes 
    : mistakes.filter(m => m.chapter === activeTab);

  return (
    <div className="px-4 md:px-6 pt-6 md:pt-10 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      {/* Dossier Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">THE DOSSIER.</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Personal Study Tracker & Mistakes Feed</p>
        </div>
        <button onClick={clearArchive} className="w-full md:w-auto px-6 py-2 rounded-lg border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
          Clear Study History
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Analytics Hub */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          <div className="glass-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
            
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
              <h3 className="text-xl font-black text-white italic">MASTER INDEX</h3>
              <div className="space-y-2 md:space-y-3">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 md:gap-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 w-10 md:w-12">{s.label}</span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${s.value}%` }} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-white w-8 text-right">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-[220px] md:max-w-[240px] aspect-square scale-90 md:scale-100">
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <circle key={i} cx={center} cy={center} r={maxRadius * scale} className="fill-none stroke-white/5" />
                ))}
                {stats.map((s, i) => {
                  const rad = (s.angle - 90) * (Math.PI / 180);
                  const r = (s.value / 100) * maxRadius;
                  return (
                    <g key={i}>
                      <line x1={center} y1={center} x2={center + maxRadius * Math.cos(rad)} y2={center + maxRadius * Math.sin(rad)} className="stroke-white/10" />
                      <text x={center + (maxRadius + 20) * Math.cos(rad)} y={center + (maxRadius + 20) * Math.sin(rad)} className="fill-slate-500 text-[8px] md:text-[9px] font-bold uppercase" textAnchor="middle" dominantBaseline="middle">{s.label}</text>
                    </g>
                  );
                })}
                <polygon points={points} className="fill-secondary/10 stroke-secondary/50 stroke-2 transition-all duration-1000" />
              </svg>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 mb-4 md:mb-6">Activity Heatmap</h3>
            <div className="grid grid-cols-10 md:grid-cols-15 gap-1.5 md:gap-2">
              {last30Days.map((date, i) => {
                const count = activity[date] || 0;
                let bg = 'bg-white/5';
                if (count > 0) bg = 'bg-emerald-500/20';
                if (count > 10) bg = 'bg-emerald-500';
                return <div key={i} className={`aspect-square rounded-sm ${bg}`} title={`${date}: ${count}`} />;
              })}
            </div>
            <div className="flex justify-between mt-4 text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Mistakes Filter & List */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <div className="glass-card p-6 md:p-8 flex flex-col min-h-[400px] lg:h-[650px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-rose-500">Mistakes Feed</h3>
              <select 
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full md:w-auto bg-black/40 border border-white/10 rounded-lg text-[9px] md:text-[10px] font-bold uppercase text-slate-400 p-2 outline-none"
              >
                <option value="all">Everything</option>
                <option value="lecture-01">Lec 1</option>
                <option value="lecture-02">Lec 2</option>
                <option value="lecture-03">Lec 3</option>
                <option value="lecture-04">Lec 4</option>
                <option value="lecture-05">Lec 5</option>
                <option value="lecture-06">Lec 6</option>
              </select>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 md:space-y-4 pr-2 custom-scrollbar">
              {filteredMistakes.length === 0 ? (
                <div className="h-full flex items-center justify-center italic text-slate-600 text-xs md:text-sm py-10">No anomalies logged.</div>
              ) : (
                filteredMistakes.slice().reverse().map((m, i) => (
                  <div key={i} className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-rose-500/30 transition-all">
                    <span className="text-[8px] font-black text-slate-600 uppercase mb-2 block">{m.chapter}</span>
                    <p className="text-[10px] md:text-[11px] text-white italic line-clamp-3 md:line-clamp-2 leading-relaxed">"{m.text}"</p>
                    <div className="mt-2 text-[9px] md:text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">done_all</span>
                      {m.correct}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
