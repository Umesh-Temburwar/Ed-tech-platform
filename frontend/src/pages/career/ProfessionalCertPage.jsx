import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, Share2, ExternalLink, ChevronRight } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function ProfessionalCertPage() {
  const { professionalCert } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Professional Certifications</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              {professionalCert.title}
            </h1>
            <p className="text-base text-muted leading-relaxed">
              {professionalCert.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Certificate Mockup Preview */}
          <div className="p-8 rounded-2xl border border-border bg-surface-2 shadow-card space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="text-xs font-mono font-bold tracking-widest text-accent uppercase">Certificate of Excellence</div>
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted uppercase tracking-wider">Awarded To</div>
              <div className="text-xl sm:text-2xl font-bold text-text">John Doe, Full-Stack Scholar</div>
              <p className="text-xs text-muted">
                Has successfully demonstrated rigorous mastery in Distributed Systems, Operating Systems, and Cloud Native Architecture.
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
              <div>ID: EDTECH-CERT-849201</div>
              <div className="text-success font-semibold">Cryptographically Verified</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text">Why Our Credentials Carry Weight</h3>
            <ul className="space-y-3">
              {professionalCert.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-text">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <span>Browse Certified Tracks</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

