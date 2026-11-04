import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Cpu, MemoryStick, Zap, Play, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { workspacesData } from '../../data/allResourcesData';
import Footer from '../../components/common/Footer';

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Cloud Workspaces</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
              Instant Cloud Developer Workspaces
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Launch isolated, web-based VS Code environments in seconds. Zero local setup, pre-configured runtimes, GPU compute, and live port forwarding.
            </p>
          </div>
        </div>
      </section>

      {/* Workspaces Grid */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspacesData.map(ws => (
            <div 
              key={ws.id}
              className="p-6 rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded border border-accent/20 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Boot time {ws.launchTime}</span>
                  </span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sandboxed</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-accent" />
                  <span>{ws.title}</span>
                </h3>

                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {ws.desc}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-surface-2 border border-border flex items-center gap-2 text-xs">
                    <Cpu className="w-4 h-4 text-muted" />
                    <div>
                      <div className="text-[11px] text-muted">Compute</div>
                      <div className="font-bold text-text">{ws.cores}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-surface-2 border border-border flex items-center gap-2 text-xs">
                    <MemoryStick className="w-4 h-4 text-muted" />
                    <div>
                      <div className="text-[11px] text-muted">Memory</div>
                      <div className="font-bold text-text">{ws.memory}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">Pre-installed dependencies</span>
                <button
                  onClick={() => alert(`Provisioning cloud container for ${ws.title}...`)}
                  className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Workspace</span>
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

