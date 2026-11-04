import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye, Sparkles, ChevronRight, Video } from 'lucide-react';
import { videosData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'System Design', 'Computer Science', 'Artificial Intelligence', 'Web Development'];

  const filtered = videosData.filter(v => {
    return selectedCategory === 'All' || v.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Video Lectures & Masterclasses</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Engineering Masterclasses & System Design Videos
            </h1>
            <p className="text-base text-muted leading-relaxed">
              In-depth technical breakdowns, distributed systems architecture lectures, and live code walk-throughs.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-surface-2 border border-border text-muted hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {filtered.map(vid => (
            <div 
              key={vid.id}
              onClick={() => alert(`Playing: ${vid.title}`)}
              className="rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-all shadow-sm group cursor-pointer"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden bg-surface-2">
                <img 
                  src={vid.thumbnail} 
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-accent/90 group-hover:bg-accent flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-black/80 text-white">
                  {vid.duration}
                </div>

                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface/90 backdrop-blur text-text border border-border">
                  {vid.category}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-accent transition-colors line-clamp-2">
                  {vid.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border">
                  <span>Instructor: {vid.author}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{vid.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

