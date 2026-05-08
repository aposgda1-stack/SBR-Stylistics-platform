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
      <section className="relative z-10 pt-16 md:pt-20 pb-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Official Senior 2026 Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            MASTER THE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_auto] animate-gradient-flow">STYLISTICS.</span>
          </h1>

          <div className="max-w-2xl space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">
              The definitive educational hub for linguistic analysis. Summarized by Ruby, engineered for the elite Senior 2026 cohort.
            </p>
            <p className="text-secondary/80 text-xs md:text-sm font-bold uppercase tracking-widest italic">
              "This is your final stand, Senior 2026. Make it legendary. Let's finish this journey with excellence."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 w-full sm:w-auto">
            <Link href="/login" className="px-12 py-5 bg-secondary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(233,193,118,0.3)] transition-all flex items-center justify-center gap-3">
              Get Started <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </Link>
            <Link href="/platform" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
              Go to Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Features Grid */}
      <section className="relative z-10 py-20 md:py-32 px-6 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Study Pack */}
            <div className="md:col-span-8 glass-card p-8 md:p-12 flex flex-col justify-between min-h-[340px] md:min-h-[400px] group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity hidden md:block">
                <span className="material-symbols-outlined text-[120px] rotate-12">menu_book</span>
              </div>
              <div>
                <span className="text-secondary font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-4 block">Comprehensive Materials</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white italic tracking-tight mb-4">SBR Study Pack.</h3>
                <p className="text-slate-400 text-base md:text-lg max-w-md">Every chapter summarized with surgical precision. No fluff, just the concepts you need to dominate the exam.</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Parallelism', 'Deviation', 'Maxims', 'Labov'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[9px] font-bold text-slate-500 uppercase">{tag}</span>
                ))}
              </div>
            </div>

            {/* Feature 2: Podium */}
            <div className="md:col-span-4 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-[32px] md:rounded-[40px] border border-secondary/20 p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 group hover:shadow-[0_0_50px_rgba(233,193,118,0.1)] transition-all">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-secondary flex items-center justify-center text-black shadow-2xl group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl font-bold">military_tech</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white mb-2">THE PODIUM.</h3>
                <p className="text-secondary/60 text-[10px] font-bold uppercase tracking-widest">Real-time Global Ranks</p>
              </div>
            </div>

            {/* Feature 3: Past Papers */}
            <div className="md:col-span-4 glass-card p-8 md:p-12 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <span className="material-symbols-outlined">timer</span>
                </div>
                <h3 className="text-xl font-bold italic">Official Prep.</h3>
              </div>
              <p className="text-slate-400 text-sm">Access the full archive of official exams from 2020 to 2025. Practice in timed exam mode.</p>
            </div>

            {/* Feature 4: Analysis Hub */}
            <div className="md:col-span-8 glass-card p-8 md:p-12 relative overflow-hidden bg-gradient-to-r from-emerald-500/10 to-transparent">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <div className="flex-1 space-y-4 md:space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white italic tracking-tight">Interactive Analysis.</h3>
                  <p className="text-slate-400 text-sm md:text-base">Our smart engine provides immediate academic feedback on every answer, helping you learn from missed patterns.</p>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0b] bg-white/10" />
                        ))}
                     </div>
                     <span className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+1.2k Students Active</span>
                  </div>
                </div>
                <div className="w-20 h-20 md:w-1/3 md:aspect-square bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center relative shrink-0">
                   <div className="absolute inset-2 md:inset-4 border border-emerald-500/20 rounded-xl md:rounded-2xl" />
                   <span className="material-symbols-outlined text-emerald-500 text-3xl md:text-5xl">query_stats</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Ready to secure <br/> your <span className="text-secondary">A+?</span>
          </h2>
          
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 md:p-8 rounded-2xl md:rounded-[32px] max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="material-symbols-outlined text-rose-500">warning</span>
              <span className="text-xs md:text-sm font-black text-rose-500 uppercase tracking-widest">تنويه هام جداً</span>
            </div>
            <p className="text-[11px] md:text-sm text-rose-400 font-bold uppercase tracking-widest leading-relaxed text-center">
              هذه المنصة هي مجهود شخصي تماماً لخدمة زملائي، وهي غير رسمية وغير ربحية ولا تخضع لإشراف أي دكتور أو مؤسسة تعليمية. 
              <br className="hidden md:block" />
              تم تطويرها فقط لتسهيل المذاكرة وتشجيعكم على إنجاز آخر موسم امتحانات في مسيرتكم التعليمية بكل فخر.
            </p>
          </div>

          <Link href="/login" className="inline-flex px-12 md:px-16 py-5 md:py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-secondary hover:scale-105 transition-all shadow-2xl">
            Join the Academy
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Stylistics SBR • Senior 2026 • Made with Passion for the Elite.
        </p>
      </footer>


      <style jsx global>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
