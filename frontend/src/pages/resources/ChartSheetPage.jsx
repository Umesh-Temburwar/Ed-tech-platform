import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Copy, Check, FileCode, ChevronRight, Terminal } from 'lucide-react';
import { cheatsheetsData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function ChartSheetPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCmd, setCopiedCmd] = useState(null);

  const categories = ['All', 'DevOps & Tools', 'DevOps', 'Databases', 'Programming', 'Frontend', 'Systems'];

  const filteredSheets = cheatsheetsData.filter(sheet => {
    const matchesCat = selectedCategory === 'All' || sheet.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sheet.commands.some(c => c.cmd.toLowerCase().includes(searchTerm.toLowerCase()) || c.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Chart Sheet & Cheatsheets</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Developer Cheatsheets & Quick Reference
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Fast, high-density reference cards covering Git, Docker, SQL, Python, React, and Linux. Built for production engineers and competitive exams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search commands, syntax, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md bg-surface-2 border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
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
        </div>
      </section>

      {/* Sheets Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSheets.map(sheet => (
            <div 
              key={sheet.id}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                    {sheet.badge}
                  </span>
                  <span className="text-xs text-muted font-mono">{sheet.category}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-accent" />
                    <span>{sheet.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted">{sheet.description}</p>
                </div>

                <div className="space-y-2 pt-2">
                  {sheet.commands.map((c, cidx) => (
                    <div 
                      key={cidx}
                      className="p-2.5 rounded-md bg-surface-2 border border-border/80 flex items-center justify-between gap-3 text-xs font-mono group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-text font-semibold truncate">{c.cmd}</div>
                        <div className="text-[11px] font-sans text-muted truncate mt-0.5">{c.desc}</div>
                      </div>

                      <button
                        onClick={() => handleCopy(c.cmd)}
                        title="Copy command"
                        className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-muted hover:text-accent transition-colors shrink-0"
                      >
                        {copiedCmd === c.cmd ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted">{sheet.commands.length} verified commands</span>
                <button
                  onClick={() => alert(`Downloaded ${sheet.title} offline reference.`)}
                  className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border text-text font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
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

