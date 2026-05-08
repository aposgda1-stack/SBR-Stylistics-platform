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
    <div className="px-4 md:px-6 pt-6 md:pt-10 pb-40 max-w-7xl mx-auto">
      <div className="mb-8 md:mb-16">
        <h1 className="text-3xl md:text-6xl font-black text-white italic tracking-tighter mb-2 md:mb-4">TRAINING CENTER.</h1>
        <p className="text-slate-500 text-sm md:text-lg max-w-2xl font-medium">
          Choose a chapter to begin your drills. Every question solved brings you closer to the A+.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 md:p-10 flex flex-col justify-between group hover:border-blue-500/30 transition-all hover:-translate-y-2 shadow-2xl shadow-black/50"
            >
              <div>
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] md:text-[10px] font-black uppercase rounded-lg border border-blue-500/20">
                    {chapter.category}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/20 group-hover:text-blue-400 transition-colors text-xl">
                      psychology
                    </span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 italic leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                  {chapter.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mb-6 leading-relaxed line-clamp-3">
                  {chapter.description}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-8 md:mb-12">
                  {chapter.topics.slice(0, 4).map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/[0.03] rounded-md text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 md:gap-3">
                <Link 
                  href={`/quiz/${chapter.id}?mode=practice`}
                  className="flex-1 bg-white text-black text-center py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  Solve Drills
                </Link>
                <button 
                  onClick={() => router.push(`/quiz/${chapter.id}?mode=exam`)}
                  className="w-14 md:w-16 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center"
                  title="Take as Exam"
                >
                  <span className="material-symbols-outlined text-base md:text-lg">timer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motivational Banner */}
      <section className="mt-16 md:mt-24 p-8 md:p-14 rounded-[40px] bg-gradient-to-br from-blue-600/20 via-transparent to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[150px] rotate-12">rocket_launch</span>
        </div>
        <div className="space-y-2 md:space-y-4 text-center md:text-left relative z-10">
          <h3 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter">FINISH THE MISSION.</h3>
          <p className="text-slate-500 text-xs md:text-base font-medium max-w-md uppercase tracking-widest leading-relaxed">You've come a long way. Don't stop until every drill is mastered.</p>
        </div>
        <Link href="/exams" className="relative z-10 px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all text-xs md:text-sm">
          Simulate Final Exam
        </Link>
      </section>
    </div>
  );
}
