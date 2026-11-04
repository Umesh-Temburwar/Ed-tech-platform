import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Star, GitFork, ExternalLink, Github, ChevronRight } from 'lucide-react';
import { projectsData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Full Stack', 'Artificial Intelligence', 'DevOps', 'Systems & C++'];

  const filtered = projectsData.filter(p => {
    return filter === 'All' || p.category === filter;
  });

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Open Source Projects</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Real-World Capstone & Open-Source Projects
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Build your technical portfolio with production repositories, architecture diagrams, and fully implemented distributed applications.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  filter === cat
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

      {/* Projects Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(proj => (
            <div 
              key={proj.id}
              className="rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-surface-2">
                  <img 
                    src={proj.image} 
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface/90 backdrop-blur border border-border text-text">
                    {proj.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-accent/90 text-white">
                    {proj.level}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span>{proj.stars}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{proj.forks}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tech.map((t, tidx) => (
                      <span key={tidx} className="text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-muted font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-border mt-4 pt-4">
                <button
                  onClick={() => alert(`Opening source code for ${proj.title}...`)}
                  className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </button>

                <button
                  onClick={() => alert(`Launching live demo for ${proj.title}...`)}
                  className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

