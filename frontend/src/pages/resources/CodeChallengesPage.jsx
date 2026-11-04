import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, CheckCircle2, Play, Code2, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { codeChallengesData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function CodeChallengesPage() {
  const [activeDiff, setActiveDiff] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(codeChallengesData[0]);

  const filtered = codeChallengesData.filter(ch => {
    return activeDiff === 'All' || ch.difficulty.toLowerCase() === activeDiff.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Code Challenges</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Algorithmic Code Challenges & Interview Benchmarks
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Test your engineering prowess with hands-on data structure problems, graph traversals, and dynamic programming tasks.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setActiveDiff(diff)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeDiff === diff
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-surface-2 border border-border text-muted hover:text-text'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Challenge List */}
          <div className="lg:col-span-7 space-y-3">
            {filtered.map(ch => (
              <div
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedChallenge.id === ch.id
                    ? 'border-accent bg-surface-2 shadow-sm'
                    : 'border-border bg-surface hover:border-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        ch.difficulty === 'Easy' ? 'bg-success/10 text-success border border-success/20' :
                        ch.difficulty === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-danger/10 text-danger border border-danger/20'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="text-xs text-muted font-mono">{ch.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-text pt-1">{ch.title}</h3>
                    <p className="text-xs text-muted line-clamp-2">{ch.description}</p>
                  </div>

                  <div className="text-right shrink-0 space-y-1 text-xs">
                    <div className="font-mono font-semibold text-text">{ch.acceptance}</div>
                    <div className="text-muted text-[11px]">{ch.solvedCount} solved</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-border/60">
                  {ch.tags.map((tag, tidx) => (
                    <span key={tidx} className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Preview Panel */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-mono text-muted">Active Challenge</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedChallenge.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                  selectedChallenge.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                  'bg-danger/10 text-danger'
                }`}>
                  {selectedChallenge.difficulty}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text">{selectedChallenge.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-2 border border-border font-mono text-xs text-text space-y-2">
                <div className="text-muted text-[11px]">Constraints:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-muted">
                  <li>Time complexity requirement: O(1) or O(N log N)</li>
                  <li>Memory limit: 128 MB</li>
                  <li>Execution timeout: 2.0 seconds</li>
                </ul>
              </div>

              <button
                onClick={() => alert(`Opening Code Runner environment for ${selectedChallenge.title}...`)}
                className="w-full py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Solve in Browser Code Editor</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

