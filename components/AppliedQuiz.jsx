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
        const progress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 12450}');
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
          chapter: currentQ.chapter || 'Applied Analysis'
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
    <div className="space-y-8 relative">
      {/* Floating Points */}
      {floatingPoints && (
        <div 
          className="fixed pointer-events-none z-[200] text-emerald-500 font-bold text-2xl animate-bounce-up opacity-0"
          style={{ left: floatingPoints.x, top: floatingPoints.y }}
        >
          {floatingPoints.value}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }} 
          />
        </div>
        <div className="flex items-center gap-3">
          {mode === 'practice' && (
            <button 
              onClick={() => setIsResearchOpen(true)}
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-secondary/10 hover:border-secondary/30 transition-all group"
              title="Quick Research"
            >
              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-secondary transition-colors">menu_book</span>
            </button>
          )}
          <span className="text-xs font-bold text-slate-500">{currentIndex + 1} / {shuffledQuestions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10">
          {currentQ.source && (
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-secondary text-black text-[9px] font-black uppercase rounded-lg shadow-lg shadow-secondary/10">
                {currentQ.source}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Verified Material</span>
            </div>
          )}
          
          <div className="bg-black/40 border border-white/5 p-6 md:p-8 rounded-2xl mb-8">
            <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
              "{currentQ.text}"
            </h3>
          </div>

          <p className="text-lg text-slate-300 mb-8 font-semibold">
            {currentQ.question}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentIndex] === opt;
              const isCorrect = opt === currentQ.correct;
              
              let style = 'bg-white/5 border-white/5 hover:border-secondary/40 hover:bg-white/[0.08] text-slate-200';
              
              if (mode === 'practice' && showExplanation) {
                if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
                else if (isSelected) style = 'bg-rose-500/20 border-rose-500/40 text-rose-400 opacity-60';
                else style = 'bg-white/5 border-white/5 opacity-30';
              } else if (mode === 'exam' && isSelected) {
                style = 'bg-secondary/20 border-secondary text-secondary';
              }

              return (
                <button 
                  key={i}
                  onClick={(e) => handleSelect(opt, e)}
                  className={`p-5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${style}`}
                >
                  <span className="font-semibold">{opt}</span>
                  {mode === 'practice' && showExplanation && isCorrect && <span className="material-symbols-outlined text-sm">check_circle</span>}
                  {mode === 'practice' && showExplanation && isSelected && !isCorrect && <span className="material-symbols-outlined text-sm">cancel</span>}
                </button>
              );
            })}
          </div>

          {mode === 'practice' && showExplanation && (
            <div className="mt-8 p-6 bg-secondary/5 border-l-4 border-secondary rounded-r-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Expert Insight</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                {currentQ.explanation}
              </p>
              <button 
                onClick={nextQuestion}
                className="mt-6 bg-secondary text-black px-8 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all"
              >
                {currentIndex === shuffledQuestions.length - 1 ? 'See Final Results' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-up {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounce-up 1s ease-out forwards;
        }
      `}</style>

      {/* Research Modal */}
      {isResearchOpen && chapterMeta && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsResearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111113] border border-white/10 rounded-[32px] p-8 md:p-12 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 italic">Linguistic Research</h3>
                  <p className="text-xs font-black text-secondary uppercase tracking-[0.2em]">{chapterMeta.title}</p>
                </div>
                <button onClick={() => setIsResearchOpen(false)} className="material-symbols-outlined text-slate-500 hover:text-white transition-colors">close</button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Key Concepts</span>
                  <div className="flex flex-wrap gap-2">
                    {chapterMeta.topics.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Academic Abstract</span>
                  <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-secondary/20 pl-4 py-1">
                    {chapterMeta.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setIsResearchOpen(false)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:border-secondary transition-all"
                  >
                    Return to Assessment
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
