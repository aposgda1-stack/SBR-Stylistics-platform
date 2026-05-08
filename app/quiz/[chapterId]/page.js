'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import WordBox from '@/components/WordBox';
import AppliedQuiz from '@/components/AppliedQuiz';

export default function QuizPage() {
  const { chapterId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'exam'; // Default to exam for final
  
  const [data, setData] = useState(null);
  const [section, setSection] = useState('intro');
  const [scores, setScores] = useState({ theoretical: 0, applied: 0 });
  const [totals, setTotals] = useState({ theoretical: 0, applied: 0 });
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState('00:00');
  const [userName, setUserName] = useState('Researcher');

  useEffect(() => {
    const saved = localStorage.getItem('stylistics_user_name');
    if (saved) setUserName(saved);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/lecture?id=${chapterId}`);
        const json = await res.json();
        setData(json);
        
        if (json.questions && !json.theoretical) {
          setSection('intro');
        }
      } catch (err) {
        console.error("Failed to fetch quiz data", err);
      }
    }
    fetchData();
  }, [chapterId]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Stylistics Academy...</span>
      </div>
    </div>
  );

  const handleTheoreticalComplete = (score, total) => {
    setScores(prev => ({ ...prev, theoretical: score }));
    setTotals(prev => ({ ...prev, theoretical: total }));
    
    // If there's an applied section, go to it. Otherwise, end.
    if (data.applied || data.questions) {
      setSection('applied');
    } else {
      setSection('results');
      syncProgress((scores.theoretical || 0) + score, (totals.theoretical || 0) + total);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const syncProgress = async (finalScore, finalTotal) => {
    const userId = localStorage.getItem('stylistics_user_id');
    if (userId) {
      try {
        const mistakes = JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]');
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            quizResult: {
              quizId: chapterId,
              score: finalScore,
              totalQuestions: finalTotal
            },
            mistakes // Sync mistakes too
          })
        });
        console.log("Cloud sync successful");
      } catch (err) {
        console.error("Cloud sync failed", err);
      }
    }
  };

  const handleAppliedComplete = async (score, total) => {
    const end = Date.now();
    const diff = end - startTime;
    setDuration(formatTime(diff));
    
    setScores(prev => ({ ...prev, applied: score }));
    setTotals(prev => ({ ...prev, applied: total }));
    setSection('results');

    syncProgress((scores.theoretical || 0) + score, (totals.theoretical || 0) + total);
  };

  const startQuiz = () => {
    setStartTime(Date.now());
    if (data.theoretical) {
      setSection('theoretical');
    } else {
      setSection('applied');
    }
  };

  // Calculate totals
  const totalCorrect = scores.theoretical + scores.applied;
  const totalQuestions = totals.theoretical + totals.applied;
  const totalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const pointsEarned = totalCorrect * 10;

  const getEncouragement = (pct) => {
    if (pct >= 90) return { title: "LEGENDARY PERFORMANCE!", msg: `Absolutely brilliant, ${userName}! You've mastered this chapter with surgical precision. The SBR leaderboard is waiting for you.` };
    if (pct >= 75) return { title: "OUTSTANDING WORK!", msg: `Great job, ${userName}! You have a solid grasp of these stylistic devices. Just a few more tweaks and you'll be perfect.` };
    if (pct >= 50) return { title: "GOOD PROGRESS!", msg: `Well done, ${userName}. You're on the right track. Review your mistakes in the Dossier to reach the next level.` };
    return { title: "KEEP PUSHING!", msg: `Don't give up, ${userName}! Stylistics is a deep field. Re-read the summaries and try again—you've got this.` };
  };

  const feedback = getEncouragement(totalPercentage);

  return (
    <div className="px-6 pt-10 pb-32 max-w-4xl mx-auto relative">
      {/* Floating Exit Button */}
      <div className="fixed top-6 left-6 z-[150]">
        <Link 
          href="/platform" 
          className="w-12 h-12 bg-[#111113]/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-2xl"
          title="Exit Session"
        >
          <span className="material-symbols-outlined">close</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="mb-10 border-b border-white/5 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-1">{data.title}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            {chapterId.includes('final') || chapterId.includes('exam') ? 'Official Examination' : 'Study Practice'} • <span className="text-blue-400">{mode}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1 italic">
            {section === 'results' ? 'Time Elapsed' : 'Session Status'}
          </span>
          <span className="text-lg font-bold text-white">
            {section === 'results' ? duration : 'Active'}
          </span>
        </div>
      </div>

      {section === 'intro' && (
        <div className="glass-card p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto rotate-3 group-hover:rotate-0 transition-all">
            <span className="material-symbols-outlined text-secondary text-4xl">
              {chapterId.includes('final') || chapterId.includes('exam') ? 'workspace_premium' : 'menu_book'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {chapterId.includes('final') || chapterId.includes('exam') ? 'Start Official Exam' : 'Ready to begin?'}
            </h3>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              {chapterId.includes('final') || chapterId.includes('exam')
                ? "This assessment reflects the 2026 official curriculum. Your score will be added to the global leaderboard." 
                : "Analyze the definitions and extracts to master this chapter's stylistic devices."}
            </p>
          </div>
          <button 
            onClick={startQuiz}
            className="bg-secondary text-black px-16 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-secondary/20"
          >
            Start Now
          </button>
        </div>
      )}

      {section === 'theoretical' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-secondary mb-2 uppercase tracking-tighter italic">Part 1: Theoretical Concepts</h3>
            <p className="text-slate-400 text-sm">Match the linguistic terms with their official definitions.</p>
          </div>
          <WordBox 
            terms={data.theoretical} 
            mode={mode}
            onComplete={handleTheoreticalComplete} 
          />
        </div>
      )}

      {section === 'applied' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-secondary mb-2 uppercase tracking-tighter italic">
              {data.theoretical ? 'Part 2: Extract Analysis' : 'Examination Section'}
            </h3>
            <p className="text-slate-400 text-sm">Analyze the following extracts and identify the correct stylistic feature.</p>
          </div>
          <AppliedQuiz 
            questions={(data.applied || data.questions || []).map(q => ({ ...q, chapter: chapterId }))} 
            mode={mode}
            onComplete={handleAppliedComplete} 
          />
        </div>
      )}

      {section === 'results' && (
        <div className="glass-card p-12 text-center space-y-10 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-7xl font-black text-white italic tracking-tighter">{totalPercentage}%</h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Mastery Index</p>
            </div>
            <div className="pt-4 max-w-lg mx-auto">
              <h4 className="text-secondary font-black text-sm uppercase tracking-widest mb-2">{feedback.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feedback.msg}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto relative z-10">
            <div className="bg-black/40 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 md:mb-2">Score</span>
              <div className="text-xl md:text-2xl font-black text-white italic">{totalCorrect}/{totalQuestions}</div>
            </div>
            <div className="bg-secondary text-black p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-secondary/10">
              <span className="text-[9px] md:text-[10px] font-bold text-black/60 uppercase tracking-widest block mb-1 md:mb-2">Points</span>
              <div className="text-xl md:text-2xl font-black">+{pointsEarned}</div>
            </div>
            <div className="bg-black/40 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 md:mb-2">Time</span>
              <div className="text-xl md:text-2xl font-black text-white italic">{duration}</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 relative z-10">
            <button onClick={() => router.push('/platform')} className="bg-white/5 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Back to Platform</button>
            <button onClick={() => window.location.reload()} className="bg-secondary text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-secondary/10">Re-attempt</button>
          </div>
        </div>
      )}
    </div>
  );
}
