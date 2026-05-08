'use client';
import { useState } from 'react';

export default function Glossary() {
  const [search, setSearch] = useState('');

  const terms = [
    {
      term: 'Metaphor',
      icon: 'auto_stories',
      definition: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable, creating a direct comparison without using "like" or "as".'
    },
    {
      term: 'Paradox',
      icon: 'sync_alt',
      definition: 'A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.'
    },
    {
      term: 'Oxymoron',
      icon: 'compare_arrows',
      definition: 'A figure of speech in which apparently contradictory terms appear in conjunction (e.g., "deafening silence").'
    },
    {
      term: 'Synecdoche',
      icon: 'pie_chart',
      definition: 'A figure of speech in which a part is made to represent the whole or vice versa (e.g., "all hands on deck").'
    },
    {
      term: 'Hyperbole',
      icon: 'bolt',
      definition: 'Exaggerated statements or claims not meant to be taken literally, used for emphasis or effect. Common in both academic rhetoric and everyday speech to amplify the emotional resonance of a statement.',
      wide: true
    }
  ];

  const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-6 pt-10 pb-32 max-w-[1200px] mx-auto">
      <div className="mb-12 space-y-4">
        <div>
          <h1 className="text-6xl font-black mb-2 tracking-tight">Glossary</h1>
          <p className="text-slate-400 text-lg leading-relaxed">An interactive dictionary of rhetorical devices and stylistic terms.</p>
        </div>
        
        <div className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">search</span>
          <input 
            type="text" 
            placeholder="Search terms (e.g., Metaphor, Paradox)..."
            className="w-full bg-[#1f1f21] border-b border-white/20 outline-none text-white text-sm pl-12 pr-4 py-4 focus:border-[#818cf8] transition-all bg-opacity-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((t, i) => (
          <div key={i} className={`glass-card p-8 flex flex-col h-full hover:border-[#818cf8]/50 transition-all group ${t.wide ? 'lg:col-span-2' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-4xl font-black text-[#818cf8] tracking-tighter">{t.term}</h2>
              <span className="material-symbols-outlined text-slate-700 group-hover:text-[#818cf8] transition-colors">{t.icon}</span>
            </div>
            
            <p className="text-base text-slate-400 flex-1 mb-8 leading-relaxed">
              {t.definition}
            </p>

            <button className="bg-[#818cf8] text-black text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-lg hover:bg-[#a5b4fc] transition-all self-start flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
