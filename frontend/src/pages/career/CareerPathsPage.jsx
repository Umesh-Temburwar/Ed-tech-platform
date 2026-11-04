import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, DollarSign, Clock, CheckCircle2, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function CareerPathsPage() {
  const { careerPaths } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Career Paths</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Engineered Roadmaps to High-Paying Tech Careers
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Step-by-step career paths vetted by tech hiring managers. Go from zero or novice to job-ready engineer with verified portfolio projects.
            </p>
          </div>
        </div>
      </section>

      {/* Paths Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {careerPaths.map(path => (
            <div 
              key={path.id}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold px-2.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                    {path.weeks}
                  </span>
                  <span className="text-xs text-muted font-medium">{path.level}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-text">{path.title}</h3>
                  <div className="text-sm font-semibold text-success flex items-center gap-1">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span>Average Compensation: {path.salary}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                    {path.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Milestones & Curriculum</span>
                  <div className="grid grid-cols-2 gap-2">
                    {path.milestones.map((m, midx) => (
                      <div key={midx} className="flex items-center gap-2 text-xs text-text bg-surface-2 p-2 rounded border border-border">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Link
                  to="/courses"
                  className="w-full py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Start Career Track</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

