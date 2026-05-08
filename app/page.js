'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden selection:bg-secondary selection:text-black">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 md:pt-40 pb-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="space-y-8 md:space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Senior 2026 • Practice Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              PRACTICE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_auto] animate-gradient-flow">STYLISTICS.</span>
            </h1>

            <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">
                A high-fidelity analytical environment designed for the senior cohort. Master linguistic devices through targeted drills and real-time cloud sync.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 w-full sm:w-auto">
              <Link href="/login" className="px-12 py-5 bg-secondary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/10 relative overflow-hidden group animate-float premium-glow">
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                <span className="relative z-10">Start Solving</span> <span className="material-symbols-outlined font-bold relative z-10">edit_note</span>
              </Link>
              <Link href="/platform" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                Dashboard
              </Link>
            </div>
          </div>

          <div className="relative group animate-in fade-in zoom-in duration-1000 hidden lg:block">
            <div className="absolute inset-0 bg-secondary/20 blur-[150px] rounded-full group-hover:bg-secondary/30 transition-all" />
            <img 
              src="/hero-main.png" 
              alt="Linguistics 3D" 
              className="relative z-10 w-full transform group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Bento Features Grid */}
      <section className="relative z-10 py-20 md:py-32 px-6 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Question Bank */}
            <div className="md:col-span-8 glass-card p-8 md:p-12 flex flex-col justify-between min-h-[340px] md:min-h-[400px] group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity hidden md:block">
                <span className="material-symbols-outlined text-[120px] rotate-12">quiz</span>
              </div>
              <div>
                <span className="text-secondary font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-4 block">Chapter Drills</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white italic tracking-tight mb-4">The Question Bank.</h3>
                <p className="text-slate-400 text-base md:text-lg max-w-md">hundreds of questions covering every lecture. Test your knowledge on Parallelism, Deviation, and Discourse structure.</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Theory Drills', 'Applied Analysis', 'Exam Patterns'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[9px] font-bold text-slate-500 uppercase">{tag}</span>
                ))}
              </div>
            </div>

            {/* Feature 2: Podium */}
            <div className="md:col-span-4 bg-gradient-to-br from-blue-500/10 to-transparent rounded-[32px] md:rounded-[40px] border border-white/5 p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-500 flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl font-bold">military_tech</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white mb-2">THE PODIUM.</h3>
                <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest">See where you stand</p>
              </div>
            </div>

            {/* Feature 3: Past Papers */}
            <div className="md:col-span-4 glass-card p-8 md:p-12 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <h3 className="text-xl font-bold italic">Exam Archive.</h3>
              </div>
              <p className="text-slate-400 text-sm">Solve official past papers from 2020 to 2025 in a simulated exam environment to get used to the timing.</p>
            </div>

            {/* Feature 4: Analysis Hub */}
            <div className="md:col-span-8 glass-card p-8 md:p-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <div className="flex-1 space-y-4 md:space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white italic tracking-tight">Immediate Feedback.</h3>
                  <p className="text-slate-400 text-sm md:text-base">Every wrong answer is an opportunity to learn. Get instant academic explanations for every question you solve.</p>
                  <div className="flex items-center gap-4">
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest italic">Learning Focused</span>
                  </div>
                </div>
                <div className="w-20 h-20 md:w-1/3 md:aspect-square bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center relative shrink-0">
                   <span className="material-symbols-outlined text-secondary text-3xl md:text-5xl">fact_check</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 py-20 md:py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Ready to <br/> start <span className="text-secondary">solving?</span>
          </h2>
          
          <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[32px] max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="material-symbols-outlined text-slate-500">info</span>
              <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest">تنبيه لزملائي</span>
            </div>
            <p className="text-[11px] md:text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed text-center">
              هذه المنصة هي مجرد أداة تدريبية لمساعدتنا في المذاكرة، وهي غير رسمية وغير ربحية. 
              <br className="hidden md:block" />
              الهدف منها هو التدريب على حل الأسئلة استعداداً لآخر امتحانات في مسيرتنا التعليمية. بالتوفيق للجميع.
            </p>
          </div>

          <Link href="/login" className="inline-flex px-12 md:px-16 py-5 md:py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-secondary hover:scale-105 transition-all shadow-2xl">
            Go to Drills
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Senior 2026 • Practice Platform • Unofficial Student Project
        </p>
      </footer>


      {/* WhatsApp Floating Assistance */}
      <a 
        href="https://wa.me/201015960695?text=Hello!%20I%20need%20help%20with%20the%20Stylistics%20Academy%20platform." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-all group animate-bounce-slow"
      >
        <span className="text-[10px] md:text-xs">Do you need help?</span>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <style jsx global>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
