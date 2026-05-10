'use client';
import { useState } from 'react';
import InteractivePassage from '@/components/InteractivePassage';
import mockData from '@/data/mock-exam.json';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, ArrowRight, ArrowLeft } from 'lucide-react';

export default function MockExamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState({}); // store scores or completion state

  const handleComplete = (selections) => {
    // In a real app, calculate score and update dossier here
    setCompleted({ ...completed, [currentIndex]: true });
  };

  const nextPassage = () => {
    if (currentIndex < mockData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPassage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentData = mockData[currentIndex];

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <BookOpen className="text-emerald-400" size={24} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Applied Mock Exam</h1>
        </div>
        <p className="text-slate-400 text-lg">
          التدريب التفاعلي على استخراج الظواهر اللغوية (Foregrounding & Cohesion)
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex gap-2">
          {mockData.map((_, idx) => (
            <div 
              key={idx}
              className={`w-10 h-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                completed[idx] ? 'bg-emerald-800' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="text-slate-400 text-sm font-medium">
          تدريب {currentIndex + 1} من {mockData.length}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <InteractivePassage 
            data={currentData} 
            onComplete={handleComplete} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-between items-center">
        <button
          onClick={prevPassage}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
        >
          <ArrowLeft size={18} /> السابق
        </button>
        
        <button
          onClick={nextPassage}
          disabled={currentIndex === mockData.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
        >
          التالي <ArrowRight size={18} />
        </button>
      </div>

    </main>
  );
}
