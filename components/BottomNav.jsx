'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { label: 'Platform', icon: 'dashboard', path: '/platform' },
  { label: 'Training', icon: 'menu_book', path: '/training' },
  { label: 'Exams', icon: 'timer', path: '/exams' },
  { label: 'Dossier', icon: 'folder_managed', path: '/history' },
  { label: 'Podium', icon: 'military_tech', path: '/leaderboard' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 flex justify-between items-center shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all duration-300
                ${isActive ? 'bg-secondary/10 text-secondary' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
