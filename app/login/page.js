'use client';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#131315]">
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" 
           style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(10, 25, 47, 0.8) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(13, 24, 48, 0.6) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(143, 144, 151, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143, 144, 151, 0.1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Hero Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center" />

      {/* Auth Card */}
      <main className="w-full max-w-[440px] mx-6 bg-[#1f1f21]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-10 flex flex-col gap-10 z-10 shadow-2xl relative">
        <header className="flex flex-col items-center gap-4 pt-4">
          <span className="material-symbols-outlined text-[48px] text-[#818cf8] fill-1">menu_book</span>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[12px] font-black text-[#818cf8] tracking-[0.2em] uppercase">Stylistics</h1>
            <h2 className="text-4xl font-black text-white">Sign In</h2>
          </div>
          <p className="text-sm text-slate-400 text-center mt-2">
            Access your linguistic academy and styling profiles.
          </p>
        </header>

        <form className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">Academic Email</label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">mail</span>
              <input 
                className="w-full bg-[#1b1b1d] border-b border-white/10 focus:border-[#818cf8] focus:ring-0 text-white text-sm rounded-t-lg pl-12 pr-4 py-4 transition-all" 
                id="email" 
                name="email" 
                placeholder="researcher@university.edu" 
                type="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest" htmlFor="password">Password</label>
              <Link className="text-xs text-[#818cf8] font-bold hover:text-[#a5b4fc] transition-colors" href="#">Forgot Password?</Link>
            </div>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">lock</span>
              <input 
                className="w-full bg-[#1b1b1d] border-b border-white/10 focus:border-[#818cf8] focus:ring-0 text-white text-sm rounded-t-lg pl-12 pr-12 py-4 transition-all" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                type="password"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#818cf8] transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
          </div>

          <button className="w-full bg-[#818cf8] text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#a5b4fc] transition-all shadow-lg shadow-[#818cf8]/10 flex justify-center items-center gap-2" type="submit">
            Sign In to Platform
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="flex items-center gap-6 py-2">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        <div className="flex flex-col items-center gap-6 pb-4">
          <button className="w-full border border-white/10 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white/5 transition-all flex justify-center items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">school</span>
            Authenticate via Institution
          </button>
          <p className="text-sm text-slate-400">
            New researcher? 
            <Link className="text-[#818cf8] font-bold ml-2 border-b border-[#818cf8]/30 hover:border-[#818cf8] transition-all pb-0.5" href="#">Apply for Access</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
