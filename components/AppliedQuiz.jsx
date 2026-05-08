'use client';
import { useState, useEffect } from 'react';
import playSound from '@/lib/sounds';

export default function AppliedQuiz({ questions, onComplete, mode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [chapterMeta, setChapterMeta] = useState(null);

  // Correct way to shuffle to avoid Hydration Mismatch in Next.js
  useEffect(() => {
    if (questions && questions.length > 0) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
      
      // Fetch chapter meta for research
      const chapterId = questions[0].chapter;
      if (chapterId) {
        fetch('/api/meta')
          .then(res => res.json())
          .then(data => {
            const meta = data.chapters.find(c => c.id === chapterId);
            setChapterMeta(meta);
          });
      }
    }
  }, [questions]);

  const currentQ = shuffledQuestions[currentIndex];

  const handleSelect = (option, e) => {
    if (showExplanation && mode === 'practice') return;
    
    const isCorrect = option === currentQ.correct;
    const newAnswers = { ...answers, [currentIndex]: option };
    setAnswers(newAnswers);

    if (mode === 'practice') {
      playSound('click');
      setShowExplanation(true);
      if (isCorrect) {
        playSound('success');
        setFloatingPoints({ x: e.clientX, y: e.clientY, value: '+10' });
        
        // SYNC TO CLOUD (Progress Update)
        const progress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 0}');
        progress.totalPoints += 10;
        localStorage.setItem('stylistics_user_progress', JSON.stringify(progress));
        
        setTimeout(() => setFloatingPoints(null), 1000);
      } else {
        playSound('error');
        // Save mistake for review
        const mistake = {
          text: currentQ.text,
          userAnswer: option,
          correct: currentQ.correct,
          explanation: currentQ.explanation,
          chapter: currentQ.chapter || 'Applied Analysis',
          timestamp: new Date().toISOString()
        };
        const currentMistakes = JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]');
        // Avoid duplicates
        if (!currentMistakes.find(m => m.text === mistake.text)) {
          localStorage.setItem('stylistics_mistakes', JSON.stringify([...currentMistakes, mistake]));
        }
      }

      // Track Activity for the Grid
      const today = new Date().toISOString().split('T')[0];
      const activity = JSON.parse(localStorage.getItem('stylistics_activity') || '{}');
      activity[today] = (activity[today] || 0) + 1;
      localStorage.setItem('stylistics_activity', JSON.stringify(activity));
    } else {
      playSound('click');
      setTimeout(() => nextQuestion(newAnswers), 300);
    }
  };

  const nextQuestion = (updatedAnswers = answers) => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      const score = shuffledQuestions.reduce((acc, q, i) => {
        const isCorrect = updatedAnswers[i] === q.correct;
        return acc + (isCorrect ? 1 : 0);
      }, 0);
      onComplete(score, shuffledQuestions.length);
    }
  };

  if (shuffledQuestions.length === 0) return null;

  return (
    <div className="space-y-6 md:space-y-10 relative">
      {/* Floating Points */}
      {floatingPoints && (
        <div 
          className="fixed pointer-events-none z-[200] text-blue-400 font-black text-4xl animate-bounce-up opacity-0"
          style={{ left: floatingPoints.x, top: floatingPoints.y }}
        >
          {floatingPoints.value}
        </div>
      )}

      {/* Progress Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-1">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block">Training Progress</span>
            <div className="text-xl font-black text-white italic">
              {currentIndex + 1} <span className="text-slate-600 font-medium text-sm">/ {shuffledQuestions.length}</span>
            </div>
          </div>
          {mode === 'practice' && (
            <button 
              onClick={() => setIsResearchOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1a1a1c] border border-white/5 flex items-center gap-2 hover:border-blue-500/50 transition-all group"
            >
              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-blue-400 transition-colors">menu_book</span>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-blue-400 uppercase tracking-widest">Guide</span>
            </button>
          )}
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }} 
          />
        </div>
      </div>

      {/* Question Card - Floating Style */}
      <div className="bg-[#111113]/60 backdrop-blur-2xl border border-white/5 rounded-[40px] p-6 md:p-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative z-10">
          {currentQ.source && (
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <span className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase rounded-lg shadow-xl">
                {currentQ.source}
              </span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
          )}
          
          <div className="bg-white/5 border border-white/5 p-6 md:p-10 rounded-[32px] mb-8 md:mb-12 shadow-inner">
            <h3 className="text-lg md:text-2xl font-medium text-slate-200 leading-relaxed italic">
              "{currentQ.text}"
            </h3>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <p className="text-base md:text-xl text-white font-black uppercase tracking-tight">
              {currentQ.question || 'Select the correct stylistic feature:'}
            </p>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentIndex] === opt;
                const isCorrect = opt === currentQ.correct;
                
                let style = 'bg-[#1a1a1c] border-white/5 text-slate-400 hover:border-blue-500/30 hover:bg-[#202022]';
                
                if (mode === 'practice' && showExplanation) {
                  if (isCorrect) style = 'bg-emerald-500 text-white border-transparent shadow-[0_0_30px_rgba(16,185,129,0.2)]';
                  else if (isSelected) style = 'bg-rose-500 text-white border-transparent opacity-60';
                  else style = 'bg-[#1a1a1c] border-transparent opacity-20';
                } else if (mode === 'exam' && isSelected) {
                  style = 'bg-blue-600 text-white border-transparent shadow-[0_0_30px_rgba(37,99,235,0.3)]';
                }

                return (
                  <button 
                    key={i}
                    disabled={showExplanation && mode === 'practice'}
                    onClick={(e) => handleSelect(opt, e)}
                    className={`group relative p-5 md:p-7 rounded-2xl md:rounded-[24px] border-2 text-left transition-all duration-300 flex items-center justify-between active:scale-95 ${style}`}
                  >
                    <span className="text-xs md:text-base font-black uppercase tracking-widest">{opt}</span>
                    <div className="w-8 h-8 rounded-full border border-current/20 flex items-center justify-center">
                       {mode === 'practice' && showExplanation && isCorrect ? <span className="material-symbols-outlined text-sm font-bold">check</span> : 
                        mode === 'practice' && showExplanation && isSelected && !isCorrect ? <span className="material-symbols-outlined text-sm font-bold">close</span> : 
                        <span className="text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity">{String.fromCharCode(65 + i)}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {mode === 'practice' && showExplanation && (
            <div className="mt-10 md:mt-16 p-6 md:p-10 bg-blue-500/5 border-2 border-blue-500/20 rounded-[32px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                   <span className="material-symbols-outlined text-white text-xs font-bold">auto_awesome</span>
                </div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Analysis Insight</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm md:text-lg font-medium italic">
                "{currentQ.explanation}"
              </p>
              <button 
                onClick={() => nextQuestion()}
                className="mt-8 md:mt-12 w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
              >
                {currentIndex === shuffledQuestions.length - 1 ? 'Show Mastery' : 'Next Drill'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; scale: 1.2; }
          100% { transform: translateY(-150px) scale(0.8); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounce-up 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Research Modal */}
      {isResearchOpen && chapterMeta && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsResearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0a0a0b] border border-white/10 rounded-[48px] p-8 md:p-14 overflow-hidden animate-in zoom-in-95 duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10 md:mb-14">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Curriculum Guide</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase">{chapterMeta.title}</h3>
                </div>
                <button onClick={() => setIsResearchOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                   <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="space-y-8 md:space-y-12">
                <div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Core Concepts</span>
                  <div className="flex flex-wrap gap-2">
                    {chapterMeta.topics.map((t, i) => (
                      <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Methodology</span>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                    {chapterMeta.description}
                  </p>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setIsResearchOpen(false)}
                    className="w-full py-5 bg-white text-black rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
                  >
                    Resume Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
