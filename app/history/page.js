'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem('stylistics_user_id');
      if (!userId) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`/api/user?userId=${userId}`);
        const data = await res.json();
        if (data.user && data.user.recentActivity) {
          setHistory(data.user.recentActivity);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-10 pb-32 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-16">
        <Link href="/platform" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Dossier Archive</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Chronological Record of Stylistic Excellence</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Retrieving Records...</p>
        </div>
      ) : (
        <div className="space-y-6 relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

          {history.length > 0 ? (
            history.map((activity, i) => (
              <div key={i} className="relative pl-0 md:pl-16 group">
                {/* Timeline Dot */}
                <div className="absolute left-[22px] top-8 w-1.5 h-1.5 rounded-full bg-secondary group-hover:scale-150 transition-transform hidden md:block" />
                
                <div className="glass-card p-6 md:p-8 border-white/5 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
                      <span className="material-symbols-outlined text-xl md:text-2xl">
                        {activity.type === 'quiz_complete' ? 'verified' : 'history_edu'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white italic capitalize tracking-tight">{activity.title.replace(/-/g, ' ')}</h3>
                      <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                        {new Date(activity.timestamp).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-6 self-end md:self-auto">
                    <div className="text-right">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Performance</span>
                       <span className="text-lg md:text-xl font-black text-white italic">{activity.score || 'N/A'}</span>
                    </div>
                    <div className="h-8 w-px bg-white/5 hidden md:block" />
                    <div className="text-right">
                       <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Points</span>
                       <span className="text-lg md:text-xl font-black text-secondary italic">+{activity.points || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white/[0.02] rounded-[48px] border border-dashed border-white/10">
               <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">inventory_2</span>
               <h3 className="text-2xl font-bold text-white italic tracking-tight mb-2">Archive is empty</h3>
               <p className="text-slate-500 max-w-sm mx-auto text-sm">Your accomplishments haven't been recorded yet. Start a chapter practice to build your dossier.</p>
               <Link href="/training" className="inline-block mt-8 text-secondary font-black uppercase tracking-widest text-xs underline underline-offset-4">Begin Training Now</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
