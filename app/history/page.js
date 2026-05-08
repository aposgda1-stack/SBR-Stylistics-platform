'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [activeTab, setActiveTab] = useState('mistakes');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDossier = async () => {
    const userId = localStorage.getItem('stylistics_user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/user?userId=${userId}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      if (data.user) {
        setHistory(data.user.recentActivity || []);
        setMistakes(data.user.mistakes || []);
        localStorage.setItem('stylistics_mistakes', JSON.stringify(data.user.mistakes || []));
      }
    } catch (err) {
      console.error("Failed to fetch dossier", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossier();
  }, [router]);

  const deleteMistake = async (index) => {
    const newMistakes = [...mistakes];
    newMistakes.splice(index, 1);
    setMistakes(newMistakes);
    
    const userId = localStorage.getItem('stylistics_user_id');
    if (userId) {
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, mistakes: newMistakes })
        });
        localStorage.setItem('stylistics_mistakes', JSON.stringify(newMistakes));
      } catch (err) {
        console.error("Failed to delete mistake", err);
      }
    }
  };

  const clearAllMistakes = async () => {
    if (!confirm('Are you sure you want to wipe your entire mistakes archive?')) return;
    setMistakes([]);
    const userId = localStorage.getItem('stylistics_user_id');
    if (userId) {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mistakes: [] })
      });
      localStorage.setItem('stylistics_mistakes', '[]');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-10 pb-40 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link href="/platform" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">The Dossier</h1>
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2 italic">Intelligence Archive • Senior 2026</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('mistakes')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mistakes' ? 'bg-secondary text-black shadow-lg shadow-secondary/10' : 'text-slate-500 hover:text-white'}`}
          >
            Mistakes ({mistakes.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-secondary text-black shadow-lg shadow-secondary/10' : 'text-slate-500 hover:text-white'}`}
          >
            Activity
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Accessing Secure Records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'mistakes' ? (
            <div className="space-y-6">
              {mistakes.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button onClick={clearAllMistakes} className="text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-500/20 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-all">
                    Clear Entire Archive
                  </button>
                </div>
              )}
              {mistakes.length > 0 ? (
                mistakes.map((m, i) => (
                  <div key={i} className="glass-card p-6 md:p-10 border-l-4 border-rose-500 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                      <span className="material-symbols-outlined text-[120px]">error_outline</span>
                    </div>
                    
                    <button 
                      onClick={() => deleteMistake(i)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                      title="Remove from Dossier"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {m.chapter || 'Session Error'}
                      </span>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">
                        {m.timestamp ? new Date(m.timestamp).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="bg-black/40 p-5 md:p-8 rounded-[24px] border border-white/5">
                        <p className="text-base md:text-xl text-white font-medium italic leading-relaxed">"{m.text}"</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-1">Your Incorrect Response</span>
                          <p className="text-sm text-slate-400">{m.userAnswer || 'No Answer'}</p>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Academic Correction</span>
                          <p className="text-sm text-emerald-400 font-bold">{m.correct}</p>
                        </div>
                      </div>

                      {m.explanation && (
                        <div className="pt-6 border-t border-white/5">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] block mb-2">Linguistic Analysis</span>
                          <p className="text-sm text-slate-400 italic leading-relaxed">{m.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 bg-white/[0.02] rounded-[48px] border border-dashed border-white/10">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-emerald-500 text-4xl">verified</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white italic tracking-tight mb-2">Flawless Record</h3>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm">No linguistic anomalies detected. Your analysis remains precise.</p>
                  <Link href="/training" className="inline-block mt-8 bg-secondary text-black px-10 py-3 rounded-full font-black uppercase tracking-widest text-[10px]">Start Assessment</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
              {history.length > 0 ? (
                history.map((activity, i) => (
                  <div key={i} className="relative pl-0 md:pl-16 group">
                    <div className="absolute left-[22px] top-8 w-1.5 h-1.5 rounded-full bg-secondary group-hover:scale-150 transition-transform hidden md:block" />
                    <div className="glass-card p-6 md:p-8 border-white/5 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                          <span className="material-symbols-outlined">{activity.type === 'quiz_complete' ? 'verified' : 'history_edu'}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white italic capitalize">{(activity.title || 'Session').replace(/-/g, ' ')}</h3>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[9px] font-black text-slate-600 uppercase block">Score</span>
                          <span className="text-lg font-black text-white italic">{activity.score}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-secondary uppercase block">Points</span>
                          <span className="text-lg font-black text-secondary italic">+{activity.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 text-slate-600 italic">No activity recorded yet.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
