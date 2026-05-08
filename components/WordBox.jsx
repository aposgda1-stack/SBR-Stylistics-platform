'use client';
import playSound from '@/lib/sounds';
import { syncToCloud } from '@/lib/sync';
import { useState, useEffect } from 'react';

export default function WordBox({ terms, onComplete, mode }) {
  const [placedWords, setPlacedWords] = useState({});
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (terms && terms.length > 0) {
      setShuffledTerms([...terms].sort(() => Math.random() - 0.5));
    }
  }, [terms]);

  if (!terms) return null;

  const handleTermClick = (term) => {
    if (showResults) return;
    playSound('click');
    setSelectedTerm(term === selectedTerm ? null : term);
  };

  const handleSlotClick = (index) => {
    if (showResults) return;
    if (selectedTerm) {
      playSound('click');
      const isCorrectMatch = selectedTerm === terms[index].term;
      
      if (mode === 'practice' && isCorrectMatch && !placedWords[index]) {
        // Real-time points for practice mode
        playSound('success');
        const progress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 0}');
        progress.totalPoints += 10;
        localStorage.setItem('stylistics_user_progress', JSON.stringify(progress));
        window.dispatchEvent(new Event('stylistics_points_updated'));
        
        // REAL-TIME CLOUD SYNC
        syncToCloud({ scoreUpdate: progress.totalPoints });
      } else if (mode === 'practice' && !isCorrectMatch) {
        playSound('error');
      }

      setPlacedWords(prev => ({
        ...prev,
        [index]: selectedTerm
      }));
      setSelectedTerm(null);
    } else if (placedWords[index]) {
      playSound('click');
      const newPlaced = { ...placedWords };
      delete newPlaced[index];
      setPlacedWords(newPlaced);
    }
  };

  const isCorrect = (index) => {
    return placedWords[index] === terms[index].term;
  };

  const validate = () => {
    if (mode === 'practice') {
      setShowResults(true);
    } else {
      finalize();
    }
  };

  const finalize = () => {
    const correctCount = terms.reduce((acc, t, i) => acc + (isCorrect(i) ? 1 : 0), 0);
    onComplete(correctCount, terms.length);
  };

  return (
    <div className="space-y-6 pb-48 md:pb-0">
      {/* Definitions List */}
      <div className="space-y-4 md:space-y-6">
        {terms.map((t, i) => {
          const placed = placedWords[i];
          const correct = isCorrect(i);
          
          let borderStyle = 'border-white/5';
          let bgStyle = 'bg-[#111113]/60 backdrop-blur-xl';
          let elevation = 'shadow-2xl shadow-black/40';
          
          if (showResults && mode === 'practice') {
            borderStyle = correct ? 'border-emerald-500/30' : 'border-rose-500/30';
            bgStyle = correct ? 'bg-emerald-500/5' : 'bg-rose-500/5';
          }

          return (
            <div key={i} className={`flex flex-col gap-4 p-6 md:p-8 rounded-[32px] border transition-all ${bgStyle} ${borderStyle} ${elevation}`}>
              <div 
                onClick={() => handleSlotClick(i)}
                className={`w-full min-h-[64px] md:min-h-[72px] rounded-2xl border-2 border-dashed flex items-center justify-center transition-all px-6 text-center cursor-pointer active:scale-95
                  ${placed ? 
                    (showResults && mode === 'practice' ? (correct ? 'bg-emerald-500 text-white border-transparent' : 'bg-rose-500 text-white border-transparent') : 'bg-white text-black font-black border-transparent shadow-lg') 
                    : 'border-white/10 text-slate-600 hover:border-white/20'}`}
              >
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                  {placed || 'Tap here to place concept'}
                </span>
              </div>
              
              <div className="text-sm md:text-lg text-slate-400 font-medium leading-relaxed px-1">
                <p>{t.definition}</p>
                {showResults && !correct && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">Incorrect</span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Answer: {t.term}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Concept Selector - Optimized for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:relative bg-[#0a0a0b]/80 backdrop-blur-2xl border-t border-white/10 p-5 md:p-0 z-[100] md:bg-transparent md:border-none">
        <div className="max-w-3xl mx-auto">
          {!showResults && (
            <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-8 px-1 no-scrollbar">
              {shuffledTerms.map((t, i) => {
                const isUsed = Object.values(placedWords).includes(t.term);
                const isSelected = selectedTerm === t.term;

                return (
                  <button 
                    key={i}
                    onClick={() => handleTermClick(t.term)}
                    className={`px-5 py-3 md:px-6 md:py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                      ${isSelected ? 'bg-blue-600 text-white border-blue-500 scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 
                        isUsed ? 'bg-white/5 text-slate-700 border-transparent opacity-30 pointer-events-none' : 
                        'bg-[#1a1a1c] text-slate-300 border-white/5 hover:border-blue-500/50'}`}
                  >
                    {t.term}
                  </button>
                );
              })}
            </div>
          )}
          
          <div className="pt-2 md:pt-0 pb-2 md:pb-0">
            {showResults ? (
              <button 
                onClick={finalize}
                className="w-full bg-emerald-500 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                Proceed to Analysis
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={validate}
                disabled={Object.keys(placedWords).length < terms.length}
                className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95
                  ${Object.keys(placedWords).length < terms.length ? 
                    'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5' : 
                    'bg-white text-black hover:bg-blue-500 hover:text-white shadow-white/5'}`}
              >
                Check Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
