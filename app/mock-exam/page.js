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
  const [examResults, setExamResults] = useState([]); // <--- هاد السطر كان محذوف بالخطأ
  const [totalScore, setTotalScore] = useState(0);    // <--- وهذا أيضاً
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes

  useEffect(() => {
    fetch('/api/lecture?id=mock-exam')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExamData(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
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
    console.log("Passage complete recorded for index:", currentIndex);
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
      {/* FORCE COVER GLOBAL NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-slate-950/95 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <BookOpen className="text-emerald-500" size={24} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">الاختبار التدريبي الشامل</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black tracking-tighter uppercase">Passage {currentIndex + 1} / {examData.length}</span>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border-2 transition-all duration-500 ${timeLeft < 300 ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'bg-slate-900/80 border-slate-800'}`}>
             <Timer className={`${timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-emerald-500'}`} size={20} />
             <span className={`text-xl font-black font-mono tracking-wider ${timeLeft < 300 ? 'text-rose-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
             </span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {examData.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-16 rounded-full transition-all duration-700 ${i === currentIndex ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : i < currentIndex ? 'bg-emerald-800/50' : 'bg-slate-800'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="pt-32 pb-40 px-4 md:px-8 relative z-10">
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
