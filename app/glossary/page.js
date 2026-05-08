'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const terms = [
    // Lecture 01 — Foregrounding
    { term: 'Poetic Licence', category: 'Foregrounding', icon: 'edit_note', quizLink: 'lecture-01', definition: "The poet's right to ignore rules and conventions generally observed by users of the language, allowing linguistic creativity and rule-breaking." },
    { term: 'Foregrounding', category: 'Foregrounding', icon: 'center_focus_strong', quizLink: 'lecture-01', definition: "The psychological effect of certain textual devices that make aspects of a text stand out and appear prominent, controlling the reader's attention and interpretation." },
    { term: 'Parallelism', category: 'Foregrounding', icon: 'compare', quizLink: 'lecture-01', definition: "A foregrounding device involving an element of identity (same structure) and an element of contrast (different lexical items), which invites the reader to search for meaning connections between the parallel parts.", wide: true },
    { term: 'Deviation', category: 'Foregrounding', icon: 'alt_route', quizLink: 'lecture-01', definition: "Disrupting or departing from readers' expectations or from a pattern established by the text. Can be Internal (against the text itself) or External (against the general language system)." },
    { term: 'Repetition', category: 'Foregrounding', icon: 'repeat', quizLink: 'lecture-01', definition: "The recurrence of a word or structural pattern in a text, used to foreground and emphasize meaning, creating a sense of greater force or prolonged quality." },

    // Lecture 02 — Deviation types
    { term: 'Lexical Deviation', category: 'Deviation', icon: 'spellcheck', quizLink: 'lecture-02', definition: "Creating new words (neologisms/nonce-formations) through Affixation (adding prefixes/suffixes), Compounding (joining two items), or Functional Conversion (adapting a word to a new grammatical class)." },
    { term: 'Syntactic Deviation', category: 'Deviation', icon: 'account_tree', quizLink: 'lecture-02', definition: "Deviating from standard word order constraints, such as placing an adjective after its noun or inverting subject-verb order, departing from normal syntactic patterns." },
    { term: 'Phonological Deviation', category: 'Deviation', icon: 'graphic_eq', quizLink: 'lecture-02', definition: "Oddities in pronunciation or stress used to fit rhyme or meter. Types: Elision (omission for speech ease), Aphesis (initial vowel loss e.g. ''gainst'), Syncope (medial sound loss e.g. 'o'er'), Apocope (final sound loss).", wide: true },
    { term: 'Graphological Deviation', category: 'Deviation', icon: 'font_download', quizLink: 'lecture-02', definition: "Typographic irregularities in layout, punctuation, spelling, or letter arrangement on the page (e.g., splitting HELL into separate lines for phonetic effect)." },
    { term: 'Semantic Deviation', category: 'Deviation', icon: 'psychology', quizLink: 'lecture-02', definition: "Logically inconsistent or paradoxical meaning relations in a text, such as describing cold as 'heart's heat' (paradox) or attributing human qualities to abstractions (personification)." },
    { term: 'Aphesis', category: 'Deviation', icon: 'remove', quizLink: 'lecture-02', definition: "The gradual loss of a short unstressed vowel from the beginning of a word (e.g., 'against' → ''gainst'). A specific type of phonological deviation." },
    { term: 'Syncope', category: 'Deviation', icon: 'remove_circle', quizLink: 'lecture-02', definition: "The omission of sounds from the middle of a word (e.g., 'over' → 'o'er'). A specific type of phonological deviation common in poetry." },
    { term: 'Apocope', category: 'Deviation', icon: 'last_page', quizLink: 'lecture-02', definition: "The loss of sounds from the end of a word (e.g., 'child' → 'chil'). A type of phonological deviation used for metrical purposes." },
    { term: 'Neologism', category: 'Deviation', icon: 'add_circle', quizLink: 'lecture-02', definition: "A new word invented by an author, often through affixation, compounding, or functional conversion. When invented for a single specific occasion, it is called a 'nonce-formation'." },

    // Lecture 03 — Cohesion
    { term: 'Cohesion', category: 'Cohesion', icon: 'link', quizLink: 'lecture-03', definition: "The linguistic means by which sentences are woven together to make connected texts. Unlike sentence grammar, cohesive ties cross sentence boundaries." },
    { term: 'Reference Cohesion', category: 'Cohesion', icon: 'arrow_forward', quizLink: 'lecture-03', definition: "Using a grammatical word in one sentence associated with a word/phrase in another sentence. Types: Personal (pronouns), Demonstrative (this/that), Comparative (same/different/more)." },
    { term: 'Ellipsis', category: 'Cohesion', icon: 'more_horiz', quizLink: 'lecture-03', definition: "Making a mental connection to adjacent text where material is deliberately omitted because it is understood from context. Can be Partial (substitution with 'one/do/so') or Full (complete gap left)." },
    { term: 'Collocation', category: 'Cohesion', icon: 'hub', quizLink: 'lecture-03', definition: "The tendency of certain content words to naturally go together and habitually co-occur in a language (e.g., 'rabbit' and 'hole'). A form of lexical cohesion." },
    { term: 'Deixis', category: 'Cohesion', icon: 'location_on', quizLink: 'lecture-03', definition: "Words that point to a person, place, or time in the situational context (e.g., 'here', 'now', 'tomorrow'), rather than linking to previous text as cohesion does." },
    { term: 'Anaphora', category: 'Cohesion', icon: 'keyboard_return', quizLink: 'lecture-03', definition: "Reference that points back to something already mentioned in the text (e.g., 'Kim collapsed... She was exhausted'). Contrasts with Cataphora, which points forward." },

    // Lecture 04 — Modality
    { term: 'Modality', category: 'Modality', icon: 'tune', quizLink: 'lecture-04', definition: "The ways available to a speaker for expressing opinion or attitude, specifically qualifying claims across four parameters: Probability, Obligation, Willingness, and Usuality." },
    { term: 'Probability', category: 'Modality', icon: 'casino', quizLink: 'lecture-04', definition: "A modality parameter expressing how likely or certain something is. Modal scale from weak to strong: might < may < must. Expressed by modals, adverbs (certainly, possibly), or metaphorized forms (I think/believe)." },
    { term: 'Obligation', category: 'Modality', icon: 'gavel', quizLink: 'lecture-04', definition: "A modality parameter expressing necessity, duty, or requirement (e.g., 'must', 'should', 'need'). 'Why should I?' asks for a reason for the obligation." },
    { term: 'Usuality', category: 'Modality', icon: 'event_repeat', quizLink: 'lecture-04', definition: "A modality parameter expressing how often/regularly something happens (e.g., 'always', 'rarely', 'usually'). Generic sentences represent the extreme positive end of usuality." },
    { term: 'Metaphorized Modality', category: 'Modality', icon: 'swap_calls', quizLink: 'lecture-04', definition: "Expressing modality indirectly through verbs like 'think', 'believe', 'guess' (subjective) or phrases like 'it seems', 'it is likely' (objective/formal), rather than direct modal auxiliaries.", wide: true },
    { term: 'Generic Sentence', category: 'Modality', icon: 'all_inclusive', quizLink: 'lecture-04', definition: "A sentence asserting something to be a general, timeless truth about a whole category of things (e.g., 'The panda's preferred diet is bamboo'). Represents the extreme of usuality. Often used to encode ideology or prejudice." },
    { term: 'Evaluative Verb', category: 'Modality', icon: 'rate_review', quizLink: 'lecture-04', definition: "Verbs that carry a speaker's presupposed stance towards a proposition (e.g., 'deplore', 'regret', 'welcome'). An evaluative device that reveals attitude." },

    // Lecture 05 — Narrative
    { term: 'Narrative', category: 'Narrative', icon: 'auto_stories', quizLink: 'lecture-05', definition: "A text in which the reader perceives a significant change from one state of affairs to a different one, often causally related through a sequence of events. Distinct from static description." },
    { term: 'Complicating Action', category: 'Narrative', icon: 'warning', quizLink: 'lecture-05', definition: "The core, indispensable element of a narrative — the sequence of ordered events ('What happened first?'). Without complicating action, there is no narrative." },
    { term: 'Orientation', category: 'Narrative', icon: 'map', quizLink: 'lecture-05', definition: "The narrative element that answers 'Who? When? Where?' by describing participants and setting the scene. In sophisticated fiction, orientation may be deliberately withheld until later." },
    { term: 'Evaluation', category: 'Narrative', icon: 'star_rate', quizLink: 'lecture-05', definition: "The narrative element that highlights why the story is interesting or relevant to the audience. Can be External (commentary outside the action) or Internal (woven into events: Intensifying, Comparator, Correlative, Explicative).", wide: true },
    { term: 'Coda', category: 'Narrative', icon: 'flag', quizLink: 'lecture-05', definition: "A narrative element that bridges the story world back to the present situation, often providing a moral, lesson, or returning the speaker to the 'here and now' after the story ends." },

    // Lecture 06 — Discourse
    { term: "Grice's Maxims", category: 'Discourse', icon: 'forum', quizLink: 'lecture-06', definition: "Four conversational principles underlying cooperative communication: Quality (be truthful), Quantity (be informative enough), Relation (be relevant), and Manner (be clear and orderly)." },
    { term: 'Implicature', category: 'Discourse', icon: 'tips_and_updates', quizLink: 'lecture-06', definition: "A covert meaning inferred when a speaker deliberately 'flouts' a conversational maxim. The listener uses the Co-operative Principle to work out what the speaker really means." },
    { term: 'Face', category: 'Discourse', icon: 'face', quizLink: 'lecture-06', definition: "An individual's public self-image. Positive Face is the desire to be liked and approved of. Negative Face is the desire to be free from imposition and coercion." },
    { term: 'FTA', category: 'Discourse', icon: 'warning_amber', quizLink: 'lecture-06', definition: "Face Threatening Act — any utterance that threatens an aspect of the interlocutor's positive or negative face, such as a request, criticism, or command." },
    { term: 'Negative Politeness', category: 'Discourse', icon: 'shield', quizLink: 'lecture-06', definition: "Politeness strategies oriented to avoiding imposition on the hearer's negative face. Includes: Hedges, Be pessimistic ('I don't suppose...'), Minimise imposition, Indicate deference, Apologise.", wide: true },
    { term: 'Positive Politeness', category: 'Discourse', icon: 'favorite', quizLink: 'lecture-06', definition: "Politeness strategies oriented to affirming the hearer's positive face and building solidarity. Includes: Compliments, In-group identity markers, Claiming common ground." },
    { term: 'Birmingham Model', category: 'Discourse', icon: 'device_hub', quizLink: 'lecture-06', definition: "A hierarchical model of spoken discourse structure: Exchange → Move → Act. Moves include Opening (new topic), Supporting (concurring), and Challenging (withholding expected response)." },
  ];

  const categories = ['All', 'Foregrounding', 'Deviation', 'Cohesion', 'Modality', 'Narrative', 'Discourse'];

  const filtered = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || t.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categoryColors = {
    Foregrounding: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Deviation: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Cohesion: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Modality: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Narrative: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Discourse: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  const filterButtonColors = {
    All: 'bg-white/10 text-white border-white/20',
    Foregrounding: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    Deviation: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    Cohesion: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Modality: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Narrative: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    Discourse: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  return (
    <div className="px-4 md:px-6 pt-8 md:pt-10 pb-32 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-10 md:mb-12 space-y-6">
        <div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Stylistics SBR • Senior 2026</p>
          <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">Glossary</h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">All key terms from the curriculum — tap any card to practice.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">search</span>
          <input
            type="text"
            placeholder="Search terms (e.g., Aphesis, Implicature, Coda)..."
            className="w-full bg-[#1f1f21] border border-white/10 outline-none text-white text-sm pl-12 pr-4 py-4 rounded-xl focus:border-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all ${
                activeFilter === cat
                  ? filterButtonColors[cat] + ' scale-105 shadow-lg'
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-6">{filtered.length} term{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filtered.map((t, i) => (
          <div
            key={i}
            className={`glass-card p-6 flex flex-col h-full hover:border-secondary/30 transition-all group ${t.wide ? 'lg:col-span-2' : ''}`}
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-2">
                <span className={`self-start text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoryColors[t.category]}`}>
                  {t.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">{t.term}</h2>
              </div>
              <span className="material-symbols-outlined text-slate-700 group-hover:text-secondary transition-colors text-2xl shrink-0 mt-1">{t.icon}</span>
            </div>

            <p className="text-sm text-slate-400 flex-1 mb-6 leading-relaxed">{t.definition}</p>

            <Link
              href={`/quiz/${t.quizLink}?mode=practice`}
              className="bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-black uppercase tracking-widest py-2.5 px-5 rounded-lg hover:bg-secondary hover:text-black transition-all self-start flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-secondary/10"
            >
              <span className="material-symbols-outlined text-[16px]">quiz</span>
              Practice This Topic
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <span className="material-symbols-outlined text-5xl text-slate-700">search_off</span>
          <p className="text-slate-500 font-bold">No terms match "{search}"</p>
          <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="text-secondary text-sm font-bold hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
