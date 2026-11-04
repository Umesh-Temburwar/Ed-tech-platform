import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code2, Users, CheckCircle2, ArrowRight, ChevronRight, Play } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function InterviewPrepPage() {
  const { interviewPrep } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Interview Prep</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              {interviewPrep.heroTitle}
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Curated FAANG question banks, high-throughput system design templates, and behavioral interview masterclasses.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewPrep.categories.map((cat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    {cat.questions} Curated Problems
                  </span>
                  <span className="text-xs text-muted">FAANG Rubric</span>
                </div>

                <h3 className="text-lg font-bold text-text">{cat.title}</h3>

                <div className="space-y-2 pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Core Topics</span>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.topics.map((t, tidx) => (
                      <div key={tidx} className="flex items-center gap-1.5 text-xs text-text bg-surface-2 p-2 rounded border border-border">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Starting ${cat.title} Question Bank Practice...`)}
                className="w-full py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Practice Drill</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

