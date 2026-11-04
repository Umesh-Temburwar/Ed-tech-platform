import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Sparkles, Users, ArrowRight, ChevronRight, ShieldAlert } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function BetaContentPage() {
  const { betaContent } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Beta Content & Experimental Labs</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              {betaContent.heroTitle}
            </h1>
            <p className="text-base text-muted leading-relaxed">
              {betaContent.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Beta Labs List */}
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-12 space-y-6">
        {betaContent.labs.map(lab => (
          <div 
            key={lab.id}
            className="p-6 rounded-2xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-warning/10 border border-warning/20 text-warning">
                  {lab.badge}
                </span>
                <span className="text-xs text-muted">{lab.status}</span>
                <span className="text-xs text-muted font-mono">• {lab.learners}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-text flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-accent" />
                <span>{lab.title}</span>
              </h3>

              <p className="text-xs sm:text-sm text-muted">
                Test pre-release interactive playgrounds, provide feedback directly to curriculum authors, and earn contributor badges.
              </p>
            </div>

            <button
              onClick={() => alert(`Enrolled into Beta Program for ${lab.title}!`)}
              className="px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm self-stretch sm:self-center justify-center"
            >
              <span>Join Beta Program</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}

