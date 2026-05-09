'use client';
import { useState, useEffect, Suspense, use } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import WordBox from '@/components/WordBox';
import AppliedQuiz from '@/components/AppliedQuiz';
import Link from 'next/link';

function QuizContent({ paramsPromise }) {
  const params = use(paramsPromise);
  const chapterId = params.chapterId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') || 'exam';
  
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [section, setSection] = useState('intro');
  const [mounted, setMounted] = useState(false);
  const [scores, setScores] = useState({ theoretical: 0, applied: 0 });
  const [totals, setTotals] = useState({ theoretical: 0, applied: 0 });
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState('00:00');
  const [userName, setUserName] = useState('Researcher');

  const handleMistake = (mistake) => {
    const mistakes = JSON.parse(localStorage.getItem('stylistics_mistakes') || '[]');
    if (!mistakes.some(m => m.text === mistake.text && m.question === mistake.question)) {
      mistakes.push({ ...mistake, timestamp: new Date() });
      localStorage.setItem('stylistics_mistakes', JSON.stringify(mistakes));
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('stylistics_user_name');
    if (saved) setUserName(saved);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/lecture?id=${chapterId}`);
        const json = await res.json();
        
        if (json.error) {
          setError(json.error);
          return;
        }
        
        setData(json);
        
        if (json.questions && !json.theoretical) {
          setSection('intro');
        }
      } catch (err) {
        console.error("Failed to fetch quiz data", err);
        setError("Could not connect to the academy server.");
      }
    }
    if (chapterId) fetchData();
  }, [chapterId]);

  if (!mounted || (!data && !error)) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Stylistics Academy...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-rose-500 text-4xl">error</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Chapter Unavailable</h2>
      <p className="text-slate-400 max-w-md mb-8">{error}</p>
      <Link href="/platform" className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
        Back to Platform
      </Link>
    </div>
  );

  const handleTheoreticalComplete = (score, total) => {
    const currentScores = { ...scores, theoretical: score };
    const currentTotals = { ...totals, theoretical: total };
    setScores(currentScores);
    setTotals(currentTotals);
    
    if (data.applied || data.questions) {
      setSection('applied');
    } else {
      setSection('results');
      syncProgress(score, total);
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
            mistakes
          })
        });
        window.dispatchEvent(new Event('stylistics_points_updated'));
      } catch (err) {
        console.error("Cloud sync failed", err);
      }
    }
  };

  const handleAppliedComplete = async (score, total) => {
    const end = Date.now();
    const diff = end - startTime;
    setDuration(formatTime(diff));
    
    const finalScore = scores.theoretical + score;
    const finalTotal = totals.theoretical + total;
    
    setScores(prev => ({ ...prev, applied: score }));
    setTotals(prev => ({ ...prev, applied: total }));
    setSection('results');

    syncProgress(finalScore, finalTotal);
  };

  const startQuiz = () => {
    setStartTime(Date.now());
    if (data.theoretical) {
      setSection('theoretical');
    } else {
      setSection('applied');
    }
  };

  const totalCorrect = scores.theoretical + scores.applied;
  const totalQuestions = totals.theoretical + totals.applied;
  const totalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const pointsEarned = totalCorrect * 10;

  const getEncouragement = (pct) => {
    if (pct >= 90) return { title: "LEGENDARY PERFORMANCE!", msg: `Absolutely brilliant, ${userName}! You've mastered this chapter with surgical precision.` };
    if (pct >= 75) return { title: "OUTSTANDING WORK!", msg: `Great job, ${userName}! You have a solid grasp of these stylistic devices.` };
    if (pct >= 50) return { title: "GOOD PROGRESS!", msg: `Well done, ${userName}. Review your mistakes in the Dossier to reach the next level.` };
    return { title: "KEEP PUSHING!", msg: `Don't give up, ${userName}! Re-read the summaries and try again.` };
  };

  const feedback = getEncouragement(totalPercentage);

  return (
    <div className="px-6 pt-10 pb-32 max-w-4xl mx-auto relative">
      <div className="fixed top-6 left-6 z-[150]">
        <Link 
          href="/platform" 
          className="w-12 h-12 bg-[#111113]/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-2xl"
        >
          <span className="material-symbols-outlined">close</span>
        </Link>
      </div>

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
          <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-secondary text-4xl">
              {chapterId.includes('final') || chapterId.includes('exam') ? 'workspace_premium' : 'menu_book'}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">Ready to begin?</h3>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              Analyze the definitions and extracts to master this chapter's stylistic devices.
            </p>
          </div>
          <button 
            onClick={startQuiz}
            className="bg-secondary text-black px-16 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl"
          >
            Start Now
          </button>
        </div>
      )}

      {section === 'theoretical' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <WordBox 
            terms={data.theoretical} 
            mode={mode} 
            onComplete={handleTheoreticalComplete} 
            onError={handleMistake}
          />
        </div>
      )}

      {section === 'applied' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <AppliedQuiz 
            questions={(data.applied || data.questions || []).map(q => ({ ...q, chapter: chapterId }))} 
            mode={mode}
            onComplete={handleAppliedComplete} 
            onError={handleMistake}
            startIndex={data.theoretical?.length || 0}
          />
        </div>
      )}

      {section === 'results' && (
        <div className="animate-in fade-in zoom-in-95 duration-500 relative">
          {/* Decorative Backdrop */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
          
          <div className="glass-card p-6 md:p-16 text-center space-y-10 md:space-y-16 relative z-10 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-[40px] md:rounded-[64px]">
            
            {/* Score Visualization */}
            <div className="space-y-6">
              <div className="relative inline-flex flex-col items-center">
                <div className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-2">
                  {totalPercentage}<span className="text-2xl md:text-4xl text-secondary">%</span>
                </div>
                <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full">
                   <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Mastery Level Achieved</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">{feedback.title}</h3>
                <p className="text-slate-400 text-sm md:text-lg max-w-lg mx-auto leading-relaxed font-medium">
                  {feedback.msg}
                </p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-[#111113]/40 border border-white/5 p-6 md:p-10 rounded-[32px] flex flex-col items-center gap-1 md:gap-2">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Score Accuracy</span>
                <div className="text-2xl md:text-3xl font-black text-white italic">{totalCorrect} <span className="text-slate-600 text-sm font-medium">/ {totalQuestions}</span></div>
              </div>
              
              <div className="bg-secondary/10 border border-secondary/20 p-6 md:p-10 rounded-[32px] flex flex-col items-center gap-1 md:gap-2 shadow-xl shadow-secondary/5">
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Mastery Points</span>
                <div className="text-2xl md:text-3xl font-black text-secondary italic">+{pointsEarned}</div>
              </div>

              <div className="bg-[#111113]/40 border border-white/5 p-6 md:p-10 rounded-[32px] flex flex-col items-center gap-1 md:gap-2">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Completion Time</span>
                <div className="text-2xl md:text-3xl font-black text-white italic">{duration}</div>
              </div>
            </div>

            {/* Post-Session Actions */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
              <button 
                onClick={() => router.push('/platform')} 
                className="w-full md:w-auto px-10 py-5 rounded-2xl bg-white/5 text-white border border-white/10 font-black uppercase tracking-widest hover:bg-white/10 transition-all text-xs"
              >
                Back to Command
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full md:w-auto px-14 py-5 rounded-2xl bg-secondary text-black font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl shadow-secondary/20 text-xs"
              >
                Restart Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPage({ params }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    }>
      <QuizContent paramsPromise={params} />
    </Suspense>
  );
}
