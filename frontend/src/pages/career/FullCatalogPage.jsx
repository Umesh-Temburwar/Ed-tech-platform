import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Code2, Compass, Layers, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { allSubjectsData } from '../../data/allSubjectsData';
import { allLanguagesData } from '../../data/allLanguagesData';
import Footer from '../../components/common/Footer';

export default function FullCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const subjectsList = Object.values(allSubjectsData);
  const languagesList = Object.values(allLanguagesData);

  const filteredSubjects = subjectsList.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLanguages = languagesList.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Full Academy Catalog</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Comprehensive Computer Science & Engineering Catalog
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Explore 17 technical disciplines and 14 modern programming languages. Every track includes verified academic syllabi and interactive code environments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subjects, languages, or tracks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md bg-surface-2 border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Catalog' },
                { id: 'subjects', label: '17 Subjects' },
                { id: 'languages', label: '14 Languages' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-accent text-white font-semibold'
                      : 'bg-surface-2 border border-border text-muted hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12 space-y-12">
        {/* Subjects Section */}
        {(activeTab === 'all' || activeTab === 'subjects') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text">Core Technical Disciplines</h2>
                <p className="text-xs sm:text-sm text-muted">Specialized subject curriculums from beginner foundations to systems engineering.</p>
              </div>
              <span className="text-xs font-mono font-semibold text-accent">{filteredSubjects.length} Disciplines</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map(sub => (
                <Link
                  key={sub.slug}
                  to={`/${sub.slug}`}
                  className="rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-all shadow-sm group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-surface-2">
                      <img 
                        src={sub.heroImage} 
                        alt={sub.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface/90 backdrop-blur border border-border text-text">
                        {sub.coursesCount}+ Courses
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {sub.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-muted border-t border-border mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span className="font-bold text-text">{sub.avgRating}</span>
                    </div>
                    <span className="font-semibold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore Curriculum <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {(activeTab === 'all' || activeTab === 'languages') && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text">Programming Languages</h2>
                <p className="text-xs sm:text-sm text-muted">Comprehensive roadmaps, interactive syntax previews, and practical projects.</p>
              </div>
              <span className="text-xs font-mono font-semibold text-accent">{filteredLanguages.length} Languages</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLanguages.map(lang => (
                <Link
                  key={lang.slug}
                  to={`/${lang.slug === 'c++' ? 'cpp' : lang.slug}`}
                  className="p-6 rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors shadow-sm flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                        {lang.version}
                      </span>
                      <span className="text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded">
                        {lang.popularityRank}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                      {lang.name}
                    </h3>

                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {lang.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span>{lang.paradigm}</span>
                    <span className="font-semibold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Language <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

