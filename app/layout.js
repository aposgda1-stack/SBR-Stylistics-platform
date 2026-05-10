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
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLanding = pathname === '/';
  const isQuizPage = pathname?.startsWith('/quiz/');
  const isPublicPage = isLanding || isAuthPage;
  const hideNav = isPublicPage || isQuizPage;

  const handleOpenNotifs = () => {
    setNotifsOpen(true);
    setHasUnreadNotifs(false);
    localStorage.setItem('stylistics_last_read_notif', Date.now().toString());
  };

  useEffect(() => {
    setMounted(true);
    
    const checkUnread = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        const readIds = JSON.parse(localStorage.getItem('sbr_notifications_read') || '[]');
        const hasUnread = data.notifications.some(n => !readIds.includes(n.id));
        setHasUnreadNotifs(hasUnread);
      } catch (err) {
        console.error('Notif check failed');
      }
    };

    const updatePoints = () => {
      const saved = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 0}');
      setPoints(saved.totalPoints || 0);
    };

    const forceUpdate = () => {
      updatePoints();
      setMounted(prev => !prev); 
      setMounted(true);
    };

    updatePoints();
    checkUnread();
    window.addEventListener('storage', updatePoints);
    window.addEventListener('stylistics_points_updated', updatePoints);
    window.addEventListener('avatarUpdate', forceUpdate);
    const interval = setInterval(() => {
      updatePoints();
      checkUnread();
    }, 10000); // Check every 10s
    
    return () => {
      window.removeEventListener('storage', updatePoints);
      window.removeEventListener('stylistics_points_updated', updatePoints);
      window.removeEventListener('avatarUpdate', forceUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#818cf8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
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
                onClick={handleOpenNotifs}
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">notifications</span>
                {hasUnreadNotifs && mounted && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0b] animate-pulse" />
                )}
              </button>
              
              <Link href="/profile" className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-secondary/30 bg-secondary/10 flex items-center justify-center overflow-hidden shrink-0 hover:border-secondary transition-all">
                {mounted && localStorage.getItem('stylistics_user_avatar') ? (
                  <img src={localStorage.getItem('stylistics_user_avatar')} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-secondary font-black text-xs md:text-sm uppercase tracking-tighter italic">
                    {mounted ? (localStorage.getItem('stylistics_user_name') || 'S').charAt(0) : 'S'}
                  </span>
                )}
              </Link>
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
