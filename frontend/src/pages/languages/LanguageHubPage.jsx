import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Code2, Copy, Check, Terminal, Cpu, Layers, Trophy, 
  ChevronRight, ArrowRight, BookOpen, Star, DollarSign,
  HelpCircle, Sparkles, FolderGit2
} from 'lucide-react';
import { allLanguagesData } from '../../data/allLanguagesData';
import Footer from '../../components/common/Footer';

export default function LanguageHubPage({ defaultSlug }) {
  const { langSlug } = useParams();
  let slug = defaultSlug || langSlug || 'python';
  if (slug === 'cpp' || slug === 'c%2B%2B') slug = 'c++';

  const data = allLanguagesData[slug] || allLanguagesData['python'];

  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Hero Header */}
      <section className="relative border-b border-border bg-surface overflow-hidden py-14 lg:py-18">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img 
            src={data.heroImage} 
            alt={data.name}
            className="w-full h-full object-cover filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-transparent" />
        </div>

        <div className="w-11/12 max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-4">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/full-catalog" className="hover:text-accent transition-colors">Languages</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">{data.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
                  {data.paradigm}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-surface-2 border border-border text-muted">
                  {data.version}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 border border-success/20 text-success">
                  {data.popularityRank}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text leading-tight">
                {data.name}
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                {data.tagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link 
                  to="/courses"
                  className="px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Start Learning {data.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/chart-sheet"
                  className="px-5 py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-sm font-medium transition-colors"
                >
                  View Cheatsheet
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-5 rounded-xl border border-border bg-surface/90 backdrop-blur shadow-card space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Language Difficulty</span>
                  <span className="font-semibold text-text">{data.difficulty}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full"
                    style={{ width: data.difficulty.includes('Beginner') ? '40%' : data.difficulty.includes('Intermediate') ? '70%' : '95%' }}
                  />
                </div>

                <div className="pt-3 border-t border-border space-y-2 text-xs text-muted">
                  <div className="flex items-center justify-between">
                    <span>Active Learners:</span>
                    <span className="font-mono font-bold text-text">35,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Interactive Labs:</span>
                    <span className="font-mono font-bold text-text">Cloud GPU / Sandbox</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Roles:</span>
                    <span className="font-semibold text-text">Backend, Systems, Web</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
        <div className="w-11/12 max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 text-xs sm:text-sm font-medium">
          {[
            { id: 'code', label: 'Code Preview & Syntax' },
            { id: 'roadmap', label: 'Learning Roadmap' },
            { id: 'projects', label: 'Portfolio Projects' },
            { id: 'careers', label: 'Careers & Salaries' },
            { id: 'faq', label: 'FAQs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-accent text-white font-semibold' 
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        {/* Code Preview Tab */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-text">Live {data.name} Syntax & Idiomatic Code</h2>
                <p className="text-xs sm:text-sm text-muted">
                  Clean, production-grade snippet highlighting contemporary standards and modern features.
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surface-2 text-xs font-medium text-text flex items-center gap-1.5 transition-colors self-start sm:self-center"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden shadow-card font-mono text-xs sm:text-sm text-[#e6edf3]">
              <div className="px-4 py-2.5 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs text-[#8b949e]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#f85149]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#d29922]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#3fb950]/80" />
                  </div>
                  <span className="ml-2 font-medium text-[#c9d1d9]">example.{data.slug === 'c++' ? 'cpp' : data.slug}</span>
                </div>
                <span>Syntax Verified</span>
              </div>

              <div className="p-4 sm:p-6 overflow-x-auto leading-relaxed">
                <pre>{data.codeSnippet}</pre>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface-2 text-xs sm:text-sm text-muted flex items-start gap-3">
              <Terminal className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-text font-semibold">Ready to test this in your browser? </strong>
                Launch our instantaneous cloud sandbox workspace preloaded with compiler runtimes and debugger tooling.
              </div>
            </div>
          </div>
        )}

        {/* Learning Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text">Curated Step-by-Step Learning Roadmap</h2>
              <p className="text-xs sm:text-sm text-muted">
                Follow our structured four-stage path to master {data.name} from syntax basics to production scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.roadmap.map((stage, i) => (
                <div key={i} className="p-5 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      Step 0{i + 1}
                    </span>
                    <span className="text-xs text-muted">Comprehensive Milestone</span>
                  </div>

                  <h3 className="text-base font-semibold text-text">{stage.stage}</h3>

                  <ul className="space-y-2 pt-1">
                    {stage.topics.map((t, tidx) => (
                      <li key={tidx} className="flex items-start gap-2 text-xs sm:text-sm text-muted">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text">Real-World Projects You Will Build</h2>
              <p className="text-xs sm:text-sm text-muted">
                Proof of skill matters more than certificates. These hands-on portfolio projects make your GitHub stand out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((proj, pidx) => (
                <div key={pidx} className="p-5 rounded-lg border border-border bg-surface hover:border-accent/50 transition-colors flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-accent font-semibold flex items-center gap-1">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>Project 0{pidx + 1}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-muted text-[11px]">
                        {proj.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text">{proj.title}</h3>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Technology Stack</span>
                    <div className="text-xs font-mono text-text bg-surface-2 p-2 rounded border border-border">
                      {proj.stack}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Careers & Salary Tab */}
        {activeTab === 'careers' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text">Career Market & Compensation</h2>
              <p className="text-xs sm:text-sm text-muted">
                Typical salary ranges and enterprise organizations hiring {data.name} engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.careerRoles.map((role, idx) => (
                <div key={idx} className="p-5 rounded-lg border border-border bg-surface space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text">{role.role}</h3>
                    <div className="text-sm font-semibold text-success flex items-center gap-1">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>{role.avgSalary}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">Hiring Companies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.companies.map((company, cidx) => (
                        <span key={cidx} className="text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-muted-dark">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-muted">
                Everything you need to know before starting your {data.name} journey.
              </p>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, fidx) => (
                <div 
                  key={fidx} 
                  className="rounded-lg border border-border bg-surface overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === fidx ? null : fidx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm sm:text-base font-medium text-text hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-muted transition-transform ${openFaq === fidx ? 'rotate-90' : ''}`} />
                  </button>

                  {openFaq === fidx && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted border-t border-border/50 bg-surface-2/40 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

