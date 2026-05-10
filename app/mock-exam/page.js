'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractivePassage from '@/components/InteractivePassage';
import { ChevronRight, Award, BookOpen, RefreshCw, Star, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MockExamPage() {
  const [examData, setExamData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [examResults, setExamResults] = useState([]); // Store results for each passage
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    fetch('/api/lecture?id=mock-exam')
      .then(res => res.json())
      .then(data => setExamData(data))
      .catch(err => console.error("Failed to load mock exam data"));
  }, []);

  const handlePassageComplete = (selections, result) => {
    const newResults = [...examResults];
    newResults[currentIndex] = { selections, result };
    setExamResults(newResults);
  };

  const handleNext = () => {
    if (currentIndex < examData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Calculate final score
      const totalPoints = examResults.reduce((acc, curr) => acc + (curr?.result?.points || 0), 0);
      const totalPossible = examResults.reduce((acc, curr) => acc + (curr?.result?.total || 0), 0);
      setTotalScore(Math.round((totalPoints / totalPossible) * 100));
      setIsFinished(true);
    }
  };

  if (examData.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#020617] p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30">
            <Trophy className="text-emerald-500" size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">أداء مذهل!</h1>
          <p className="text-slate-400 text-lg mb-8">لقد أتممت الاختبار التدريبي الشامل بنجاح.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">النتيجة النهائية</p>
              <p className="text-4xl font-black text-emerald-400">{totalScore}%</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">القطع المكتملة</p>
              <p className="text-4xl font-black text-white">{examData.length}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">المستوى</p>
              <p className="text-2xl font-black text-amber-400">{totalScore > 80 ? 'EXPERT' : totalScore > 60 ? 'ADVANCED' : 'PRACTITIONER'}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/platform" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
              العودة للمنصة <ArrowRight size={18} />
            </Link>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-700">
              إعادة الاختبار <RefreshCw size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentPassage = examData[currentIndex];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="text-emerald-500" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">الاختبار التدريبي</h2>
              <p className="text-[10px] text-slate-500 font-bold">القطعة {currentIndex + 1} من {examData.length}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {examData.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : i < currentIndex ? 'bg-emerald-800' : 'bg-slate-800'}`}
              />
            ))}
          </div>

          {examResults[currentIndex] && (
            <button 
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {currentIndex === examData.length - 1 ? 'إنهاء الاختبار' : 'القطعة التالية'} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <main className="pt-24 pb-12 px-4 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <InteractivePassage 
              data={currentPassage} 
              onComplete={handlePassageComplete} 
              isExamMode={true}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
