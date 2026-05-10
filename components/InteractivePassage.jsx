'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, ChevronRight, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function InteractivePassage({ data, onComplete }) {
  const [selections, setSelections] = useState([]);
  const [pendingSelection, setPendingSelection] = useState([]); // Array of word indices
  const [analysisQueue, setAnalysisQueue] = useState([]); // Array of strings to analyze
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(''); // The string text
  const [currentStep, setCurrentStep] = useState(0); // 0: category, 1: type, 2: subtype/option
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  // Form State
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [subtype, setSubtype] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [score, setScore] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const passageRef = useRef(null);

  // Split passage into words/tokens
  const tokens = data.passage.split(/(\s+)/); // Preserve spaces

  const toggleWord = (index, e) => {
    if (showFeedback) return;
    
    let newPending = [...pendingSelection];
    if (newPending.includes(index)) {
      newPending = newPending.filter(i => i !== index);
    } else {
      newPending.push(index);
    }
    setPendingSelection(newPending);

    if (newPending.length > 0) {
      const rect = e.target.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 10
      });
    }
  };

  const handleStartAnalysis = () => {
    if (pendingSelection.length === 0) return;
    
    // Group contiguous tokens into phrases
    const sortedIndices = [...pendingSelection].sort((a, b) => a - b);
    const groups = [];
    let currentGroup = [sortedIndices[0]];

    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] === sortedIndices[i - 1] + 1) {
        currentGroup.push(sortedIndices[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [sortedIndices[i]];
      }
    }
    groups.push(currentGroup);

    const queue = groups.map(group => group.map(i => tokens[i]).join('').trim()).filter(t => t.length > 0);
    
    if (queue.length > 0) {
      setAnalysisQueue(queue);
      setCurrentQueueIndex(0);
      setCurrentSelection(queue[0]);
      setCurrentStep(0);
      setCategory('');
      setType('');
      setIsMenuOpen(true);
    }
  };

  const handleNextInQueue = (finalData) => {
    // Add current to selections
    const newSelection = {
      id: Math.random().toString(36).substr(2, 9),
      text: currentSelection,
      category,
      type,
      ...finalData
    };
    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);

    // Check if there is more in queue
    const nextIndex = currentQueueIndex + 1;
    if (nextIndex < analysisQueue.length) {
      setCurrentQueueIndex(nextIndex);
      setCurrentSelection(analysisQueue[nextIndex]);
      setCurrentStep(0);
      setCategory('');
      setType('');
      setSubtype('');
      setCustomInput('');
    } else {
      closeMenu();
    }
  };

  const handleAddSelection = () => {
    if (!type) return;
    handleNextInQueue({ subtype, customInput });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setCurrentSelection('');
    setPendingSelection([]);
    setAnalysisQueue([]);
    setCurrentQueueIndex(0);
    setCurrentStep(0);
  };

  const removeSelection = (id) => {
    setSelections(selections.filter(s => s.id !== id));
  };

  // Helper to get local options for the current selection
  const getLocalOptions = () => {
    const match = data.correctAnswers.find(ans => 
      ans.text.toLowerCase() === currentSelection?.toLowerCase()
    );
    return match?.options || null;
  };

  const calculateScore = () => {
    let correctCount = 0;
    const totalPossible = data.correctAnswers.length;
    let hintPenalty = showHint ? 0.05 : 0; 

    selections.forEach(sel => {
      const isCorrect = data.correctAnswers.some(ans => {
        const selText = sel.text.trim().toLowerCase();
        const ansText = ans.text.trim().toLowerCase();
        
        const textMatch = selText.includes(ansText) || ansText.includes(selText);
        const categoryMatch = sel.category === ans.category;
        const typeMatch = sel.type === ans.type;
        const subtypeMatch = (ans.subtype || '') === (sel.subtype || '');
        const customMatch = (ans.correctOption || '') === (sel.customInput || '');
        
        return textMatch && categoryMatch && typeMatch && subtypeMatch && customMatch;
      });
      if (isCorrect) correctCount++;
    });

    const rawPercentage = (correctCount / totalPossible);
    const finalPercentage = Math.max(0, Math.round((rawPercentage - hintPenalty) * 100));

    return {
      points: correctCount,
      total: totalPossible,
      percentage: finalPercentage,
      usedHint: showHint,
      earnedPoints: correctCount * 10 // 10 points per correct discovery
    };
  };

  const handleSubmit = async () => {
    const result = calculateScore();
    setScore(result);
    setShowFeedback(true);

    // PERSISTENCE: Save to database
    const savedProgress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{}');
    const userId = localStorage.getItem('stylistics_user_id') || savedProgress.userId;

    if (userId) {
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            quizResult: {
              quizId: `mock-${data.id}`,
              score: result.points,
              totalQuestions: result.total
            },
            activity: {
              type: 'applied_analysis',
              title: data.title,
              score: `${result.percentage}%`,
              timestamp: new Date()
            }
          })
        });
        // Trigger global points update
        window.dispatchEvent(new Event('stylistics_points_updated'));
      } catch (err) {
        console.error('Failed to save progress to DB');
      }
    }

    if (onComplete) onComplete(selections, result);
  };

  // Highlighting Logic for Feedback Mode
  const renderHighlightedPassage = () => {
    let highlightedText = data.passage;
    const sortedAnswers = [...data.correctAnswers].sort((a, b) => b.text.length - a.text.length);

    sortedAnswers.forEach((ans) => {
      const isFound = selections.some(s => 
        (s.text.toLowerCase().includes(ans.text.toLowerCase()) || ans.text.toLowerCase().includes(s.text.toLowerCase())) &&
        s.type === ans.type
      );
      
      const colorClass = isFound ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300' : 'bg-rose-500/30 border-rose-500 text-rose-300';
      
      const replacement = `<span class="relative group inline-block border-b-2 cursor-help transition-all ${colorClass}">
        ${ans.text}
        <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-xs text-white rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
          <strong class="block text-emerald-400 mb-1">${ans.type} ${ans.subtype ? `(${ans.subtype})` : ''}</strong>
          ${ans.explanation}
        </span>
      </span>`;
      
      highlightedText = highlightedText.replace(ans.text, replacement);
    });

    return <div dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br/>') }} />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full pb-24 lg:pb-0">
      
      {/* Left: The Passage */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{data.title}</h3>
            <p className="text-slate-400 text-sm">{data.tasks[0].instructions}</p>
          </div>
          {data.hint && !showFeedback && (
            <button 
              onClick={() => setShowHint(!showHint)}
              className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <AlertCircle size={14} /> {showHint ? 'إخفاء' : 'تلميح'}
            </button>
          )}
        </div>

        {showHint && !showFeedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm flex items-start gap-3">
            <Search className="shrink-0 mt-0.5" size={16} />
            {data.hint}
          </motion.div>
        )}
        
        {!showFeedback ? (
          <div className="relative">
            <div 
              ref={passageRef}
              className="text-lg md:text-xl text-slate-200 leading-relaxed font-serif whitespace-pre-wrap p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-wrap gap-y-1"
            >
              {tokens.map((token, idx) => {
                const isSelected = pendingSelection.includes(idx);
                const isSpace = token.trim() === '';
                return (
                  <span
                    key={idx}
                    onClick={(e) => !isSpace && toggleWord(idx, e)}
                    className={`cursor-pointer rounded transition-all duration-200 ${isSpace ? '' : (isSelected ? 'bg-amber-500 text-black px-0.5 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'hover:bg-white/10 px-0.5')}`}
                  >
                    {token}
                  </span>
                );
              })}
            </div>

            {/* Floating Selection Control for Mobile */}
            <AnimatePresence>
              {pendingSelection.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-24 left-4 right-4 md:absolute md:bottom-[-20px] md:left-1/2 md:-translate-x-1/2 z-40"
                >
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full bg-amber-500 text-black font-black text-xs uppercase tracking-widest py-4 px-8 rounded-2xl shadow-2xl flex items-center justify-center gap-2 border-2 border-white/20"
                  >
                    تحليل الجزء المختار <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-4 text-xs text-emerald-400 flex items-center gap-1 opacity-70">
              <Search size={14} /> اضغط على الكلمات لتحديدها، ثم اضغط على زر التحليل.
            </p>
          </div>
        ) : (
          <div className="relative">
            {score && (
              <div className="mb-6 flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black border-4 ${score.percentage > 50 ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}>
                  {score.percentage}%
                </div>
                <div>
                  <h4 className="text-white font-bold">نتيجتك النهائية</h4>
                  <p className="text-slate-400 text-sm">لقد اكتشفت {score.points} من أصل {score.total} ظواهر لغوية صحيحة.</p>
                </div>
              </div>
            )}
            <div className="text-lg md:text-xl text-slate-200 leading-relaxed font-serif p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              {renderHighlightedPassage()}
            </div>
            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Check className="text-emerald-500" size={18} /> التغذية الراجعة (الإجابات النموذجية)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.correctAnswers.map((ans, i) => (
                  <div key={i} className="text-sm bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-amber-400 font-serif font-bold italic">"{ans.text}"</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 uppercase font-black tracking-widest">{ans.type}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{ans.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ top: menuPosition.y, left: `max(10px, min(${menuPosition.x}px - 150px, calc(100vw - 320px)))` }}
              className="absolute z-50 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-0.5">تحليل {currentQueueIndex + 1} من {analysisQueue.length}</span>
                  <span className="text-sm text-white font-bold truncate pr-4 italic">"{currentSelection}"</span>
                </div>
                <button onClick={closeMenu} className="text-slate-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {currentStep === 0 ? (
                    <motion.div key="step0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <label className="text-[10px] uppercase tracking-wider font-black text-slate-500 mb-3 block">الخطوة 1: حدد التصنيف العام</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Foregrounding', 'Cohesion', 'Maxims', 'Faces'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setCategory(cat);
                              setCurrentStep(1);
                            }}
                            className={`p-3 rounded-xl text-xs font-bold border transition-all ${category === cat ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : currentStep === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <button onClick={() => setCurrentStep(0)} className="text-slate-500 hover:text-white"><ArrowLeft size={14}/></button>
                        <label className="text-[10px] uppercase tracking-wider font-black text-slate-500 block">الخطوة 2: حدد النوع في {category}</label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(category === 'Foregrounding' ? ['Parallelism', 'Repetition', 'Deviation'] : 
                          category === 'Cohesion' ? ['Reference', 'Ellipsis', 'Conjunction', 'Lexical'] :
                          category === 'Maxims' ? ['Manner', 'Relation', 'Quantity', 'Quality'] :
                          ['Positive', 'Negative']
                        ).map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              setType(t);
                              setCurrentStep(2);
                            }}
                            className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition-all"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <button onClick={() => setCurrentStep(1)} className="text-slate-500 hover:text-white"><ArrowLeft size={14}/></button>
                        <label className="text-[10px] uppercase tracking-wider font-black text-slate-500 block">الخطوة الأخيرة: حدد الخيار</label>
                      </div>
                      
                      <div className="space-y-2">
                        {(() => {
                          const localOptions = getLocalOptions();
                          const availableOptions = (
                            type === 'Deviation' ? ['Lexical', 'Grammatical', 'Phonological', 'Graphological', 'Semantic'] :
                            type === 'Reference' ? (localOptions?.references || data.options?.references || []) :
                            category === 'Maxims' ? (localOptions?.effects || data.options?.effects || []) :
                            category === 'Faces' ? (localOptions?.strategies || data.options?.strategies || []) :
                            []
                          );

                          if (availableOptions.length > 0) {
                            return (
                              <div className="grid grid-cols-1 gap-2">
                                {availableOptions.map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => {
                                      const finalSubtype = type === 'Deviation' ? opt : '';
                                      const finalCustom = type !== 'Deviation' ? opt : '';
                                      handleNextInQueue({ subtype: finalSubtype, customInput: finalCustom });
                                    }}
                                    className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 text-right hover:border-emerald-500 hover:text-emerald-400 transition-all flex justify-between items-center"
                                  >
                                    {opt}
                                    <ChevronRight size={14} className="opacity-30" />
                                  </button>
                                ))}
                              </div>
                            );
                          } else {
                            return (
                              <button 
                                onClick={handleAddSelection}
                                className="w-full py-4 bg-emerald-600 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all"
                              >
                                تأكيد الاختيار
                              </button>
                            );
                          }
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Selections Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1 shadow-2xl backdrop-blur-xl">
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            استخراجاتك <span className="px-2 py-0.5 bg-emerald-500 text-black rounded text-[10px] font-black">{selections.length}</span>
          </h4>
          
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {selections.length === 0 ? (
              <div className="text-slate-600 text-xs text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                <Search size={24} className="opacity-20" />
                <p>قم بتظليل نص داخل القطعة<br/>لبدء التحليل اللغوي</p>
              </div>
            ) : (
              selections.map((sel) => {
                const isFinalAndCorrect = showFeedback && data.correctAnswers.some(ans => 
                  (sel.text.toLowerCase().includes(ans.text.toLowerCase()) || ans.text.toLowerCase().includes(sel.text.toLowerCase())) &&
                  sel.type === ans.type &&
                  (sel.subtype === ans.subtype || !ans.subtype) &&
                  (sel.customInput === ans.correctOption || !ans.correctOption)
                );

                return (
                  <div key={sel.id} className={`bg-slate-800 border rounded-xl p-4 relative group transition-all ${showFeedback ? (isFinalAndCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-rose-500/50 bg-rose-500/5') : 'border-slate-700 hover:border-slate-500'}`}>
                    {!showFeedback && (
                      <button 
                        onClick={() => removeSelection(sel.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    )}
                    
                    <p className="text-amber-400 text-sm font-serif italic mb-2 pr-6">"{sel.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{sel.type}</span>
                      {showFeedback && (
                        isFinalAndCorrect ? <Check className="text-emerald-500" size={14} /> : <X className="text-rose-500" size={14} />
                      )}
                    </div>
                    {sel.subtype && <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-tighter">{sel.subtype}</p>}
                    {sel.customInput && (
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <p className="text-slate-400 text-[10px] font-bold mb-1">
                          {sel.category === 'Cohesion' ? 'Reference:' : 
                           sel.category === 'Maxims' ? 'Effect:' : 
                           sel.category === 'Faces' ? 'Strategy:' : ''}
                        </p>
                        <p className="text-sky-400 text-[11px] leading-tight font-medium italic">{sel.customInput}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selections.length === 0}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale text-black font-black uppercase tracking-[0.2em] text-xs rounded-[24px] shadow-xl shadow-emerald-900/20 transition-all flex justify-center items-center gap-3 active:scale-95"
          >
            تأكيد وتحليل <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => {
              setSelections([]);
              setShowFeedback(false);
              setScore(null);
              setShowHint(false);
            }}
            className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all flex justify-center items-center gap-3 border border-slate-700"
          >
            <RefreshCw size={18} /> محاولة أخرى
          </button>
        )}
      </div>

    </div>
  );
}
