'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LabPage() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch('/api/meta');
        const data = await res.json();
        // Only show lectures, not past papers in the Lab/Study Pack
        const lectures = data.chapters.filter(c => c.id.startsWith('lecture'));
        setChapters(lectures);
      } catch (err) {
        console.error("Failed to load chapters", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, []);

  return (
    <div className="px-6 pt-10 pb-40 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">STUDY PACK.</h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          The ultimate vault of stylistic knowledge. Choose a chapter to start your practice session.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className="glass-card p-8 flex flex-col justify-between group hover:border-secondary/30 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded-lg border border-secondary/20">
                    {chapter.category}
                  </span>
                  <span className="material-symbols-outlined text-white/10 group-hover:text-secondary transition-colors">
                    menu_book
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 italic leading-tight group-hover:text-secondary transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {chapter.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {chapter.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-slate-500 uppercase">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link 
                  href={`/quiz/${chapter.id}?mode=practice`}
                  className="flex-1 bg-secondary text-black text-center py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-secondary/5"
                >
                  Start Practice
                </Link>
                <button 
                  onClick={() => router.push(`/quiz/${chapter.id}?mode=exam`)}
                  className="px-6 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                  title="Take as Exam"
                >
                  <span className="material-symbols-outlined text-sm">timer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Banner */}
      <section className="mt-20 p-10 rounded-[32px] bg-gradient-to-r from-blue-600/20 to-secondary/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white italic">Mastered everything?</h3>
          <p className="text-slate-400 text-sm">Try the full simulation to see your global rank.</p>
        </div>
        <Link href="/exams" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
          Go to Exam Prep
        </Link>
      </section>
    </div>
  );
}
