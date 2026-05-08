'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [mistakes, setMistakes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedMistakes = JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]');
      setMistakes(Array.isArray(savedMistakes) ? savedMistakes : []);
    } catch (e) {
      console.error("Review load error", e);
      setMistakes([]);
    }
  }, []);

  const clearMistakes = async () => {
    localStorage.removeItem('stylistics_mistakes');
    setMistakes([]);
    // Also clear from DB
    const userId = localStorage.getItem('stylistics_user_id');
    if (userId) {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mistakes: [] })
      });
    }
  };

  return (
    <div className="px-6 pt-10 pb-32 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Mistakes Archive</h2>
          <p className="text-slate-400 text-base md:text-lg">Analyze and master the concepts you previously missed.</p>
        </div>
        {mistakes.length > 0 && (
          <button 
            onClick={clearMistakes}
            className="text-xs font-bold text-rose-500 uppercase tracking-widest border border-rose-500/20 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-all"
          >
            Clear Archive
          </button>
        )}
      </div>

      {mistakes.length === 0 ? (
        <div className="glass-card p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-emerald-500 text-3xl">verified</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Flawless Record</h3>
          <p className="text-slate-500 max-w-xs mx-auto">You haven't committed any linguistic errors yet. Keep up the precision!</p>
          <button onClick={() => router.push('/training')} className="bg-secondary text-black px-8 py-3 rounded-xl font-bold mt-4">Start Assessment</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {mistakes.map((m, i) => (
            <div key={i} className="glass-card p-8 border-l-4 border-rose-500">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                  {m.chapter || 'Assessment Error'}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="material-symbols-outlined text-rose-500/40">error</span>
                  {m.timestamp && (
                    <span className="text-[8px] text-slate-600 font-bold">
                      {new Date(m.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-black/40 p-6 rounded-2xl mb-6">
                <p className="text-lg text-white font-medium">"{m.text}"</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-rose-500 uppercase">Your Choice:</span>
                  <span className="text-sm text-slate-400">{m.userAnswer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-500 uppercase">Correct Answer:</span>
                  <span className="text-sm text-emerald-400 font-bold">{m.correct}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-secondary uppercase block mb-1">Academic Analysis</span>
                    <p className="text-sm text-slate-400 leading-relaxed italic">{m.explanation}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/quiz/${m.chapter}?mode=practice`)}
                    className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-black transition-all shrink-0 ml-4"
                    title="Practice this chapter"
                  >
                    <span className="material-symbols-outlined text-sm">replay</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
