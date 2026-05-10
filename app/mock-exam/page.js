'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractivePassage from '@/components/InteractivePassage';
import { ChevronRight, Award, BookOpen, RefreshCw, Star, Trophy, ArrowRight, Timer, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MockExamPage() {
  const [examData, setExamData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [examResults, setExamResults] = useState([]); 
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes

  useEffect(() => {
    // Force hide global navbar if it exists
    const globalNav = document.querySelector('nav');
    if (globalNav) globalNav.style.display = 'none';
    
    fetch('/api/lecture?id=mock-exam')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setExamData(data);
      })
      .catch(err => console.error("Failed to load mock exam data"));

    return () => {
      if (globalNav) globalNav.style.display = 'block';
    };
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
    // Smooth scroll to the bottom to see the new button
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 500);
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
          className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-[40px] p-12 text-center shadow-[0_0_100px_rgba(16,185,129,0.1)]"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30">
            <Trophy className="text-emerald-500" size={48} />
          </div>
          <h1 className="text-5xl font-black text-white mb-4">انتهت الرحلة!</h1>
          <p className="text-slate-400 text-lg mb-12">إليك تقرير أدائك في الاختبار التجريبي الشامل.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-2">الدقة الإجمالية</p>
              <p className="text-5xl font-black text-white">{totalScore}%</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-2">القطع المكتملة</p>
              <p className="text-5xl font-black text-white">{examResults.filter(r => r).length}</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-2">المستوى</p>
              <p className="text-3xl font-black text-amber-400">{totalScore > 80 ? 'EXPERT' : 'ADVANCED'}</p>
            </div>
          </div>

          <Link href="/platform" className="inline-flex px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all items-center gap-3">
            العودة للرئيسية <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentPassage = examData[currentIndex];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* EXAM HEADER - TOP PRIORITY */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="text-black" size={28} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none mb-1">STYLISITICS MOCK</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Section {currentIndex + 1} of {examData.length}</span>
                <div className="flex gap-1">
                  {examData.map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i === currentIndex ? 'bg-emerald-500' : i < currentIndex ? 'bg-emerald-900' : 'bg-slate-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all duration-700 ${timeLeft < 300 ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.3)]' : 'bg-slate-900 border-slate-800'}`}>
             <Timer className={timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'} size={24} />
             <span className={`text-2xl font-black font-mono ${timeLeft < 300 ? 'text-rose-500' : 'text-white'}`}>
                {formatTime(timeLeft)}
             </span>
          </div>
        </div>
      </div>

      <main className="pt-40 pb-60 px-4 md:px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <InteractivePassage 
              data={currentPassage} 
              onComplete={handlePassageComplete} 
              isExamMode={true}
            />

            {/* CREATIVE NEXT BUTTON CARD */}
            <AnimatePresence>
              {examResults[currentIndex] && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-10 left-0 right-0 z-[1000] px-6"
                >
                  <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 p-1 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.1)] flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-4 px-6">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">تم الانتهاء بنجاح</p>
                        <p className="text-sm font-bold text-white">جاهز للمرحلة التالية؟</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleNext}
                      className="group relative px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all overflow-hidden"
                    >
                      <motion.div 
                        animate={{ x: [-100, 200] }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                      <span className="relative flex items-center gap-2">
                        {currentIndex === examData.length - 1 ? 'إنهاء وحفظ' : 'القطعة التالية'}
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
