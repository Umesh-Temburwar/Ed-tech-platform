import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, BarChart3, Users2, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { plansData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function BusinessSolutionsPage() {
  const { businessSolutions } = plansData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 lg:py-20">
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
              <Building2 className="w-4 h-4" />
              <span>Enterprise Learning Management</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text leading-tight">
              {businessSolutions.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              {businessSolutions.heroDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert("Thank you! An Enterprise Specialist will reach out within 2 hours.")}
                className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Request Enterprise Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/paid-memberships"
                className="px-5 py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-sm font-medium transition-colors"
              >
                View Team Pricing
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl border border-border bg-surface shadow-card space-y-4">
              <h3 className="text-base font-bold text-text">Proven Engineering ROI</h3>
              <div className="space-y-3">
                {businessSolutions.stats.map((stat, sidx) => (
                  <div key={sidx} className="p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="text-2xl font-bold text-text font-mono">{stat.metric}</div>
                    <div className="text-xs text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessSolutions.features.map((feat, fidx) => (
            <div 
              key={fidx}
              className="p-6 rounded-xl border border-border bg-surface space-y-3 hover:border-accent/40 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <BarChart3 className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-text">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

