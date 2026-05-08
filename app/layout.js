'use client';
import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import NotificationCenter from "@/components/NotificationCenter";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [points, setPoints] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLanding = pathname === '/';
  const isQuizPage = pathname?.startsWith('/quiz/');
  const isPublicPage = isLanding || isAuthPage;
  const hideNav = isPublicPage || isQuizPage;

  useEffect(() => {
    setMounted(true);
    const updatePoints = () => {
      const saved = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 0}');
      setPoints(saved.totalPoints || 0);
    };

    updatePoints();
    window.addEventListener('storage', updatePoints);
    const interval = setInterval(updatePoints, 5000);
    
    return () => {
      window.removeEventListener('storage', updatePoints);
      clearInterval(interval);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0b] text-white antialiased min-h-screen flex flex-col`}>
        <header className={`px-4 md:px-6 py-4 md:py-6 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0 z-[110] ${hideNav ? 'hidden' : ''}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold tracking-tight text-white italic">STYLISTICS <span className="text-secondary">SBR</span></Link>
            
            <div className="flex items-center gap-3 md:gap-4">
              {/* Global Points Display */}
              <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-secondary text-sm md:text-base fill-1">stars</span>
                <span className="text-sm md:text-base font-black text-white italic tracking-tighter">
                  {mounted ? points.toLocaleString() : '---'}
                </span>
              </div>

              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Senior 2026</span>
                <span className="text-xs font-bold text-secondary">Active Study</span>
              </div>
              
              {/* Notification Bell */}
              <button 
                onClick={() => setNotifsOpen(true)}
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0b] animate-pulse" />
              </button>
              
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-secondary/30 bg-secondary/10 flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-secondary font-black text-xs md:text-sm uppercase tracking-tighter italic">
                  {mounted ? (localStorage.getItem('stylistics_user_name') || 'S').charAt(0) : 'S'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        {!hideNav && (
          <footer className="px-6 py-12 border-t border-white/5 bg-[#0a0a0b] text-center space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-3xl mx-auto leading-relaxed">
              SBR: Summarized By Ruby • Senior 2026 Edition<br/>
              <span className="text-rose-500/70 font-bold italic block mt-2">
                تنويه: منصة مجانية غير ربحية لمساعدة الزملاء، ولا تخضع لإشراف أي جهة رسمية أو أكاديمية.
              </span>
            </p>
          </footer>
        )}
        
        {!hideNav && <BottomNav />}
        <NotificationCenter isOpen={notifsOpen} onClose={() => setNotifsOpen(false)} />
      </body>
    </html>
  );
}
