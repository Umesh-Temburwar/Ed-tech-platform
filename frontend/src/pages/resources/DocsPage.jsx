import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Search, Code2, Server, Terminal, Layers, ChevronRight, ExternalLink } from 'lucide-react';
import { docsData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState(docsData[0]);

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Documentation Hub</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Platform & Developer Documentation
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Comprehensive API documentation, course creation guidelines, markdown formatting specifications, and SDK references.
            </p>
          </div>
        </div>
      </section>

      {/* Docs Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docsData.map((doc, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    {doc.version}
                  </span>
                  <span className="text-muted">{doc.endpointsCount} Modules</span>
                </div>

                <h3 className="text-lg font-bold text-text">{doc.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">{doc.description}</p>

                <div className="pt-3 border-t border-border space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Sections Covered</span>
                  <ul className="space-y-1 text-xs text-text">
                    {doc.categories.map((cat, cidx) => (
                      <li key={cidx} className="flex items-center gap-2 text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => alert(`Navigating to ${doc.title} full documentation...`)}
                className="w-full py-2 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Read Full Documentation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick API Explorer Preview */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span>Quick REST API Request Example</span>
            </h3>
            <span className="text-xs font-mono text-muted">GET /api/v1/courses</span>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] font-mono text-xs text-[#e6edf3] overflow-x-auto">
            <pre>{`curl -X GET "https://api.edtech.org/v1/courses?limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

