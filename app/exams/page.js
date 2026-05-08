'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Exams() {
  const [practiceSets, setPracticeSets] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Practice Questions
        const practiceRes = await fetch('/api/practice');
        if (practiceRes.ok) {
          const json = await practiceRes.json();
          setPracticeSets(json.practice_sets);
        }

        // Fetch Past Papers from Chapters Meta
        const metaRes = await fetch('/api/meta');
        if (metaRes.ok) {
          const json = await metaRes.json();
          const papers = json.chapters.filter(c => c.category === 'Past Papers');
          setPastPapers(papers);
        }
      } catch (err) {
        console.error("Failed to load exam data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="px-6 pt-10 pb-40 max-w-7xl mx-auto space-y-16">
      {/* Exam Prep Hero */}
      <section className="relative overflow-hidden rounded-[40px] bg-[#111113] border border-secondary/20 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-12 shadow-2xl shadow-secondary/5">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[180px] rotate-12">history_edu</span>
        </div>

        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <span className="px-3 py-1 bg-secondary text-black text-[10px] font-black uppercase rounded-full">Senior 2026</span>
            <span className="text-secondary text-xs font-bold uppercase tracking-widest italic">Official Prep Hall</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">FINAL EXAM<br />SIMULATION.</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
            Choose your model and start the grand simulation. These models follow the official 2026 curriculum structure.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              href="/quiz/final-exam-a?mode=exam"
              className="bg-secondary text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-secondary/10"
            >
              Start Model A
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/quiz/final-exam-b?mode=exam"
              className="bg-white/5 text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl shadow-white/5"
            >
              Start Model B
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-auto flex flex-col items-center justify-center p-12 bg-black/60 border border-white/5 rounded-[40px] backdrop-blur-xl">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-secondary">timer</span>
          </div>
          <div className="text-5xl font-black text-white mb-1 italic">120</div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Minutes Allowed</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Previous Materials */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-4 mb-2 px-2">
            <span className="material-symbols-outlined text-secondary">history</span>
            <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Past Materials</h3>
          </div>

          <div className="space-y-3">
            {pastPapers.length > 0 ? pastPapers.sort((a, b) => b.id.localeCompare(a.id)).map((exam) => (
              <Link
                key={exam.id}
                href={`/quiz/${exam.id}`}
                className="w-full group p-6 rounded-2xl bg-[#111113] border border-white/5 hover:border-secondary/30 transition-all flex items-center justify-between block"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-bold text-slate-600 uppercase mb-1">{exam.category} Archive</span>
                  <span className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{exam.title}</span>
                </div>
                <span className="material-symbols-outlined text-slate-800 group-hover:text-secondary transition-all">arrow_forward</span>
              </Link>
            )) : (
              <div className="p-10 text-center text-slate-600 text-xs italic uppercase font-bold tracking-widest bg-white/5 rounded-2xl">
                Loading Past Papers...
              </div>
            )}
          </div>
        </div>

        {/* Detailed Practice */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 mb-2 px-2">
            <span className="material-symbols-outlined text-emerald-500">menu_book</span>
            <h3 className="text-xl font-black text-white tracking-tight uppercase italic">The Question Bank</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceSets.length > 0 ? practiceSets.map((set) => (
              <div key={set.id} className="p-8 rounded-3xl bg-[#111113] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{set.title}</h4>
                  <span className="material-symbols-outlined text-white/5 group-hover:text-emerald-500 transition-colors">science</span>
                </div>
                <div className="space-y-4 flex-grow">
                  {set.questions.slice(0, 1).map((q) => (
                    <div key={q.id}>
                      <p className="text-sm text-slate-400 line-clamp-3 italic leading-relaxed">"{q.text}"</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/lab"
                  className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black text-center uppercase hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all tracking-widest block"
                >
                  Study Materials
                </Link>
              </div>
            )) : (
              <div className="col-span-2 text-center py-20 text-slate-600 text-xs italic uppercase font-bold tracking-widest">Loading SBR Bank...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
