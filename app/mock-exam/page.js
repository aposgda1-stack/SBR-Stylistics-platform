'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractivePassage from '@/components/InteractivePassage';
import { ChevronRight, Award, BookOpen, RefreshCw, Star, Trophy, ArrowRight, Timer } from 'lucide-react';
import Link from 'next/link';

export default function MockExamPage() {
  const [examData, setExamData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [examResults, setExamResults] = useState([]); 
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes

  useEffect(() => {
    fetch('/api/lecture?id=mock-exam')
      .then(res => res.json())
      .then(data => setExamData(data))
      .catch(err => console.error("Failed to load mock exam data"));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (isFinished || timeLeft <= 0) {
    return (
      <div className="min-h-screen bg-[#020617] p-6 lg:p-12 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30">
            <Trophy className="text-emerald-500" size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {timeLeft <= 0 ? 'انتهى الوقت!' : 'أداء مذهل!'}
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            {timeLeft <= 0 ? 'لقد انتهى الوقت المخصص للاختبار، إليك نتيجتك بناءً على ما قمت بحله.' : 'لقد أتممت الاختبار التدريبي الشامل بنجاح.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">النتيجة النهائية</p>
              <p className="text-4xl font-black text-emerald-400">{totalScore}%</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">القطع المكتملة</p>
              <p className="text-4xl font-black text-white">{examResults.filter(r => r).length}</p>
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
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <BookOpen className="text-emerald-500" size={20} />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-wider">الاختبار التدريبي</h2>
              <p className="text-[10px] text-emerald-400 font-bold">القطعة {currentIndex + 1} من {examData.length}</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${timeLeft < 300 ? 'bg-rose-500/10 border-rose-500 animate-pulse' : 'bg-slate-900 border-slate-700'}`}>
             <Timer className={`text-slate-400 ${timeLeft < 300 ? 'text-rose-400' : ''}`} size={16} />
             <span className={`text-sm font-black font-mono ${timeLeft < 300 ? 'text-rose-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
             </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {examData.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : i < currentIndex ? 'bg-emerald-800' : 'bg-slate-800'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="pt-28 pb-32 px-4 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-7xl mx-auto"
          >
            <InteractivePassage 
              data={currentPassage} 
              onComplete={handlePassageComplete} 
              isExamMode={true}
            />

            {examResults[currentIndex] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-12 flex justify-center pb-20"
              >
                <button 
                  onClick={handleNext}
                  className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-4 shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95"
                >
                  {currentIndex === examData.length - 1 ? 'عرض النتيجة النهائية' : `القطعة التالية: ${examData[currentIndex+1]?.title || ''}`} <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
