import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, DollarSign, Users, Award, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function AffiliatesPage() {
  const { affiliates } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 lg:py-20 text-center">
        <div className="w-11/12 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
            <Share2 className="w-3.5 h-3.5" />
            <span>Partner & Creator Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text">
            {affiliates.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {affiliates.desc}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => alert("Affiliate application modal opened! Join 1,200+ creators earning with us.")}
              className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Apply as Affiliate Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Tiers Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {affiliates.tiers.map((t, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text">{t.tier}</h3>
                  <span className="text-xs font-mono text-muted">Min payout: {t.minPayout}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-extrabold text-accent font-mono">{t.commission}</div>
                  <div className="text-xs text-muted">Recurring revenue share</div>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Perks</span>
                  <ul className="space-y-2">
                    {t.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2 text-xs sm:text-sm text-text">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => alert(`Applied for ${t.tier} tier!`)}
                className="w-full py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Select {t.tier} Tier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

