'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem('stylistics_user_id', data.user.userId);
        localStorage.setItem('stylistics_user_name', data.user.name);
        localStorage.setItem('stylistics_user_email', data.user.email);
        // Sync points immediately so header shows correct value
        localStorage.setItem('stylistics_user_progress', JSON.stringify({ totalPoints: data.user.totalPoints || 0 }));
        
        // Redirect to platform
        router.push('/platform');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#131315]">
      {/* Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" 
           style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(10, 25, 47, 0.8) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(13, 24, 48, 0.6) 0%, transparent 50%)' }} />
      
      <main className="w-full max-w-[440px] mx-6 bg-[#1f1f21]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-10 flex flex-col gap-8 z-10 shadow-2xl relative">
        <header className="flex flex-col items-center gap-4 pt-4">
          <span className="material-symbols-outlined text-[48px] text-secondary fill-1">school</span>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[12px] font-black text-secondary tracking-[0.2em] uppercase">Stylistics Academy</h1>
            <h2 className="text-4xl font-black text-white italic">Welcome Back</h2>
          </div>
          {error && <p className="text-rose-500 text-xs font-bold bg-rose-500/10 px-4 py-2 rounded-lg w-full text-center border border-rose-500/20">{error}</p>}
        </header>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">Email Address</label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">mail</span>
              <input 
                required
                className="w-full bg-[#1b1b1d] border-b border-white/10 focus:border-secondary focus:ring-0 text-white text-sm rounded-t-lg pl-12 pr-4 py-4 transition-all" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                type="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">Password</label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">lock</span>
              <input 
                required
                className="w-full bg-[#1b1b1d] border-b border-white/10 focus:border-secondary focus:ring-0 text-white text-sm rounded-t-lg pl-12 pr-4 py-4 transition-all" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                type="password"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-secondary text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all shadow-lg shadow-secondary/10 flex justify-center items-center gap-2 disabled:opacity-50" 
            type="submit"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <span className="material-symbols-outlined text-[18px]">login</span>
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-6">
          <p className="text-sm text-slate-400">
            Don't have an account? 
            <Link className="text-secondary font-bold ml-2 border-b border-secondary/30 hover:border-secondary transition-all pb-0.5" href="/signup">Join Academy</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
