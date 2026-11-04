import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, UserCheck, FileText, CheckCircle2, ArrowRight, ChevronRight, ShieldAlert } from 'lucide-react';
import { careerBuildingData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function CareerServicesPage() {
  const { careerServices } = careerBuildingData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Career Services</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              1-on-1 Mentorship & Career Services
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Accelerate your job search with personalized guidance from senior engineers at Google, Amazon, and Microsoft.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerServices.map((srv, sidx) => (
            <div 
              key={sidx}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
                    {srv.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">{srv.desc}</p>
              </div>

              <button
                onClick={() => alert(`Booking consultation for ${srv.title}... Our career concierge will match you with a mentor.`)}
                className="w-full py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Book Mentor Session</span>
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

