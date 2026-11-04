import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, Clock, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { communityData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function EventsPage() {
  const { events } = communityData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Events & Hackathons</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Upcoming Engineering Hackathons & Live AMAs
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Sharpen your building chops, collaborate with global engineers, win prizes, and learn live from industry experts.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-12 space-y-6">
        {events.map(ev => (
          <div 
            key={ev.id}
            className="p-6 sm:p-8 rounded-2xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                  {ev.type}
                </span>
                <span className="text-xs text-success font-semibold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{ev.prizes}</span>
                </span>
                <span className="text-xs text-muted font-mono">{ev.participants}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-text">{ev.title}</h3>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {ev.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-text">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{ev.date}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`RSVP Confirmed for ${ev.title}! Calendar invite dispatched.`)}
              className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm self-stretch sm:self-center justify-center"
            >
              <span>RSVP & Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}

