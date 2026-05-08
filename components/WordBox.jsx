'use client';
import { useState, useEffect } from 'react';

export default function WordBox({ terms, onComplete, mode }) {
  const [placedWords, setPlacedWords] = useState({});
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShuffledTerms([...terms].sort(() => Math.random() - 0.5));
  }, [terms]);

  const handleTermClick = (term) => {
    if (showResults) return;
    setSelectedTerm(term === selectedTerm ? null : term);
  };

  const handleSlotClick = (index) => {
    if (showResults) return;
    if (selectedTerm) {
      setPlacedWords(prev => ({
        ...prev,
        [index]: selectedTerm
      }));
      setSelectedTerm(null);
    } else if (placedWords[index]) {
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
    <div className="space-y-8 pb-40 lg:pb-0">
      {/* Instructions */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-slate-400">
        <span className="font-bold text-secondary mr-2">Method:</span>
        {showResults ? 'Review your matches below.' : 'Tap a concept, then tap a definition box to place it.'}
      </div>

      {/* Definitions List */}
      <div className="space-y-4">
        {terms.map((t, i) => {
          const placed = placedWords[i];
          const correct = isCorrect(i);
          
          let borderStyle = 'border-white/10';
          let bgStyle = 'bg-white/[0.02]';
          
          if (showResults && mode === 'practice') {
            borderStyle = correct ? 'border-emerald-500/50' : 'border-rose-500/50';
            bgStyle = correct ? 'bg-emerald-500/5' : 'bg-rose-500/5';
          }

          return (
            <div key={i} className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${bgStyle} ${borderStyle}`}>
              <div 
                onClick={() => handleSlotClick(i)}
                className={`w-full min-h-[56px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all px-6 text-center cursor-pointer
                  ${placed ? 
                    (showResults && mode === 'practice' ? (correct ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : 'bg-secondary text-black font-bold') 
                    : 'border-white/10 text-slate-500'}`}
              >
                {placed || 'Tap here to place'}
              </div>
              
              <div className="text-base text-slate-300 leading-relaxed px-2 flex justify-between items-start gap-4">
                <span>{t.definition}</span>
                {showResults && !correct && (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase whitespace-nowrap bg-emerald-500/10 px-2 py-1 rounded">
                    Correct: {t.term}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating UI */}
      <div className="fixed bottom-24 left-0 right-0 lg:relative lg:bottom-0 bg-[#111113]/90 backdrop-blur-xl border-t border-white/10 p-6 z-[90] lg:bg-transparent lg:border-none lg:p-0">
        <div className="max-w-2xl mx-auto">
          {!showResults && (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto lg:max-h-none lg:overflow-visible p-1 mb-6">
              {shuffledTerms.map((t, i) => {
                const isUsed = Object.values(placedWords).includes(t.term);
                const isSelected = selectedTerm === t.term;

                return (
                  <button 
                    key={i}
                    onClick={() => handleTermClick(t.term)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                      ${isSelected ? 'bg-secondary text-black border-secondary scale-110' : 
                        isUsed ? 'bg-white/5 text-slate-600 border-transparent opacity-40' : 
                        'bg-white/10 text-white border-white/10 hover:border-secondary'}`}
                  >
                    {t.term}
                  </button>
                );
              })}
            </div>
          )}
          
          <div className="flex justify-center">
            {showResults ? (
              <button 
                onClick={finalize}
                className="w-full lg:w-auto bg-emerald-500 text-white px-12 py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3"
              >
                Continue to Applied Section
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={validate}
                disabled={Object.keys(placedWords).length < terms.length}
                className={`w-full lg:w-auto px-12 py-4 rounded-xl font-bold transition-all shadow-xl
                  ${Object.keys(placedWords).length < terms.length ? 
                    'bg-white/5 text-slate-600 cursor-not-allowed' : 
                    'bg-secondary text-black hover:brightness-110 shadow-secondary/10'}`}
              >
                Check My Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
