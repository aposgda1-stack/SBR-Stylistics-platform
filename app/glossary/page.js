'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Glossary() {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllTerms = async () => {
      try {
        const res = await fetch('/api/glossary');
        const data = await res.json();
        if (data.success) {
          setTerms(data.terms);
        }
      } catch (err) {
        console.error("Failed to load glossary", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllTerms();
  }, []);

  const filtered = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-10 pb-32 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/platform" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Smart Glossary</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Master the terminology of Senior 2026</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">search</span>
        <input 
          type="text" 
          placeholder="Search for Parallelism, Deviation, Foregrounding..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:border-secondary outline-none transition-all placeholder:text-slate-600 font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Indexing Linguistic Devices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <div key={i} className="glass-card p-6 md:p-8 hover:bg-white/[0.03] transition-all group border-white/5 hover:border-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                   <span className="material-symbols-outlined text-4xl text-secondary">menu_book</span>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white italic tracking-tight">{item.term}</h3>
                  <span className="text-[9px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.chapter}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {item.definition}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/[0.02] rounded-[32px] border border-dashed border-white/10">
              <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">search_off</span>
              <p className="text-slate-500 font-bold italic">No matching devices found in the bank.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
