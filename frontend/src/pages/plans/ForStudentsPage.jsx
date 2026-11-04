import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Percent, CheckCircle2, Award, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { plansData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function ForStudentsPage() {
  const { studentPerks } = plansData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-20 text-center">
        <div className="w-11/12 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 border border-success/20 text-success">
            <GraduationCap className="w-4 h-4" />
            <span>Student Developer Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text">
            {studentPerks.title}
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {studentPerks.description}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Verify with Student ID (.edu)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Perks Grid */}
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentPerks.perks.map((perk, pidx) => (
            <div 
              key={pidx}
              className="p-6 rounded-xl border border-border bg-surface space-y-3 hover:border-accent/40 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-text">{perk.title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Verification Info */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface-2 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-text">How student verification works</h4>
            <p className="text-xs sm:text-sm text-muted max-w-xl">
              We partner with SheerID and university registrar systems worldwide. Simply sign up with your college email address or upload a snapshot of your valid student ID card.
            </p>
          </div>

          <Link
            to="/register/student"
            className="px-5 py-2.5 rounded-md bg-surface border border-border hover:border-accent text-text text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            Create Student Account
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

