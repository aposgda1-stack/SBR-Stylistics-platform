'use client';
import { useState } from 'react';
import WordBox from '@/components/WordBox';
import AppliedQuiz from '@/components/AppliedQuiz';
import { motion, AnimatePresence } from 'framer-motion';

export default function LectureClient({ chapterData }) {
  const [activeTab, setActiveTab] = useState('lecture');

  // Extract theoretical items (definitions) for Word Box
  const theoreticalItems = chapterData.content?.filter(item => item.type === 'definition' || item.type === 'concept')
    .map(item => ({
      term: item.term || item.title,
      definition: item.definition
    })) || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-black mb-4">{chapterData.title}</h1>
        <div className="h-1 w-20 bg-sky-500 rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-12 w-fit">
        {['lecture', 'theory', 'practice'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all uppercase tracking-widest
              ${activeTab === tab ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'lecture' && (
          <motion.div
            key="lecture"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-12"
          >
            {chapterData.content?.map((block, i) => (
              <section key={i} className="glass-card p-10">
                <h3 className="text-2xl font-black mb-6 text-sky-400">{block.title || block.term}</h3>
                {block.definition && <p className="text-slate-300 text-lg mb-6 leading-relaxed">{block.definition}</p>}
                
                {block.items && (
                  <ul className="space-y-4">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex gap-4">
                        <span className="text-sky-500 font-black">/</span>
                        <div>
                          <p className="font-bold text-white">{item.level || item}</p>
                          {item.sub && <p className="text-slate-500 text-sm mt-1">{item.sub.join(', ')}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {block.examples && (
                  <div className="mt-8 space-y-4">
                    {block.examples.map((ex, j) => (
                      <div key={j} className="p-6 bg-black/20 rounded-2xl border-l-4 border-sky-500">
                        <p className="italic text-slate-200 mb-3">"{ex.text}"</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{ex.analysis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </motion.div>
        )}

        {activeTab === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2">Word Box</h2>
              <p className="text-slate-400">Match the terms in the box to their corresponding definitions.</p>
            </div>
            <WordBox data={theoreticalItems} />
          </motion.div>
        )}

        {activeTab === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
             <div className="mb-8">
              <h2 className="text-3xl font-black mb-2">Applied Analysis</h2>
              <p className="text-slate-400">Test your ability to apply stylistic concepts to literary extracts.</p>
            </div>
            <AppliedQuiz questions={chapterData.questions || chapterData.applied || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
