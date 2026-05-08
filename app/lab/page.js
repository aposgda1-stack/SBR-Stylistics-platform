import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function Chapters() {
  const metaPath = path.join(process.cwd(), 'data', 'chapters-meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

  return (
    <div className="px-6 pt-10 pb-32 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-3 tracking-tight">Chapters</h2>
          <p className="text-slate-400 text-lg">Select a chapter to begin your linguistic training.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Progress</span>
            <span className="text-xl font-bold text-white">12% Complete</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
            <span className="text-xs font-bold">1/6</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meta.chapters
          .filter(chapter => chapter.category !== 'Past Papers')
          .map((chapter, index) => {
            const isMastered = index === 0;
            const isInProgress = index === 1;

            return (
              <article key={chapter.id} className="glass-card overflow-hidden group border-white/5 hover:border-secondary/30 transition-all duration-300">
                {/* Header Part */}
                <div className="p-8 border-b border-white/5 relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${isMastered ? 'bg-emerald-500/10 text-emerald-500' : isInProgress ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-slate-500'}`}>
                      {isMastered ? 'Mastered' : isInProgress ? 'In Progress' : 'Pending'}
                    </span>
                    <span className="text-2xl font-bold text-white/10 group-hover:text-secondary/20 transition-colors">0{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">{chapter.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{chapter.description}</p>
                </div>

                {/* Action Part (Practice vs Exam) */}
                <div className="p-6 grid grid-cols-2 gap-4 bg-black/20">
                  <Link 
                    href={`/quiz/${chapter.id}?mode=practice`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-secondary/40 transition-all text-center"
                  >
                    <span className="material-symbols-outlined text-secondary">school</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Practice</span>
                    <span className="text-[9px] text-slate-500">Immediate Feedback</span>
                  </Link>

                  <Link 
                    href={`/quiz/${chapter.id}?mode=exam`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary transition-all text-center"
                  >
                    <span className="material-symbols-outlined text-secondary fill-1">timer</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Exam</span>
                    <span className="text-[9px] text-slate-500">Timed Assessment</span>
                  </Link>
                </div>

                {/* Progress Bar (at bottom) */}
                <div className="h-1 w-full bg-white/5">
                  <div className={`h-full transition-all duration-1000 ${isMastered ? 'bg-emerald-500 w-full' : isInProgress ? 'bg-secondary w-1/2' : 'w-0'}`} />
                </div>
              </article>
            );
        })}
      </div>
    </div>
  );
}
