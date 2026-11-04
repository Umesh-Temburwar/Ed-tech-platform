import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { plansData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function PaidMembershipsPage() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-20 text-center">
        <div className="w-11/12 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text">
            Invest in Your Engineering Career
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Gain unlimited access to 250+ computer science courses, interactive cloud coding sandboxes, verified certificates, and interview question explanations.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3 text-sm">
            <span className={`font-medium ${!annualBilling ? 'text-text' : 'text-muted'}`}>Monthly Billing</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-12 h-6 rounded-full bg-surface-3 border border-border p-0.5 transition-colors"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-accent transition-transform ${annualBilling ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
            <span className={`font-medium flex items-center gap-1.5 ${annualBilling ? 'text-text' : 'text-muted'}`}>
              <span>Annual Billing</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                Save 35%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plansData.tiers.map(tier => (
            <div 
              key={tier.id}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                tier.popular 
                  ? 'border-accent bg-surface shadow-lg relative ring-1 ring-accent' 
                  : 'border-border bg-surface shadow-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-text">{tier.name}</h3>
                    {!tier.popular && (
                      <span className="text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted">{tier.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight font-mono">
                      {annualBilling ? tier.priceAnnual : tier.priceMonthly}
                    </span>
                    <span className="text-xs text-muted font-medium">/{tier.period}</span>
                  </div>
                  {annualBilling && tier.id !== 'free' && (
                    <div className="text-[11px] text-success font-medium">Billed annually ($228/year)</div>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">What's Included</span>
                  <ul className="space-y-2">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-border">
                <Link
                  to={tier.id === 'free' ? '/signup' : '/course-purchase'}
                  className={`w-full py-2.5 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                    tier.popular
                      ? 'bg-accent hover:bg-accent-hover text-white'
                      : 'bg-surface-2 hover:bg-surface-3 border border-border text-text'
                  }`}
                >
                  <span>{tier.ctaText}</span>
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

