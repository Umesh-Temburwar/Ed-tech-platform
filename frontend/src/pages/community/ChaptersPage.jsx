import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight, ChevronRight, Globe2 } from 'lucide-react';
import { communityData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function ChaptersPage() {
  const { chapters } = communityData;

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Global Tech Chapters</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Join a Local Engineering Community Chapter
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Meet fellow computer science students, participate in in-person hackathons, study groups, and attend tech talks led by local industry leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chap, cidx) => (
            <div 
              key={cidx}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-md bg-accent/10 border border-accent/20 text-accent">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono font-semibold text-muted">{chap.eventsHosted} events held</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text">{chap.city}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Users className="w-3.5 h-3.5 text-success" />
                    <span>{chap.members} members</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-border text-xs space-y-1">
                  <div className="font-semibold text-text flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>Upcoming Meetup:</span>
                  </div>
                  <div className="text-muted leading-relaxed">{chap.nextMeetup}</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Joined ${chap.city} Community Chapter! Check your email for meetup details.`)}
                className="w-full py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Join Local Chapter</span>
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

