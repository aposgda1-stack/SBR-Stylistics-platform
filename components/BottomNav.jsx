'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: 'Platform', icon: 'dashboard', path: '/platform' },
  { label: 'Training', icon: 'menu_book', path: '/training' },
  { label: 'Exams', icon: 'timer', path: '/exams' },
  { label: 'Applied', icon: 'edit_note', path: '/mock-exam' },
  { label: 'Dossier', icon: 'folder_managed', path: '/history' },
  { label: 'Podium', icon: 'military_tech', path: '/leaderboard' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 md:px-6 pb-6 md:pb-8 pt-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[24px] md:rounded-2xl p-1.5 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`relative flex flex-col items-center gap-1.5 flex-1 py-3 rounded-[18px] transition-all duration-500
                ${isActive ? 'text-secondary' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-[20px] md:text-[22px] transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-secondary rounded-full animate-in fade-in zoom-in duration-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
