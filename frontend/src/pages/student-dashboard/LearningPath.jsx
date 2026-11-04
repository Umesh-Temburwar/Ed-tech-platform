import React from 'react';
import { PlayCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Badge, ProgressBar } from '../../components/dashboard/Common';
import { LEARNING_MODULES } from '../../data/student-dashboard-data';

const LearningPathPage = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-surface border border-border rounded-xl p-6 shadow-sm">
      <div>
        <div className="inline-flex items-center gap-2 mb-2">
          <Badge text="CSE Core Curriculum" color="emerald" />
          <span className="text-xs text-muted">Specialization Path</span>
        </div>
        <h2 className="text-2xl font-semibold text-text tracking-tight">Computer Systems & Software Track</h2>
        <p className="text-xs text-muted mt-1">Structured prerequisite progression for core engineering topics</p>
      </div>
      <div className="w-full md:w-60 space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted">Track Completion</span>
          <span className="text-text font-semibold">62%</span>
        </div>
        <ProgressBar pct={62} color="bg-success" />
      </div>
    </div>

    {/* Timeline */}
    <div className="relative space-y-6 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-px before:bg-border">
      {LEARNING_MODULES.map((mod, i) => {
        const isDone = mod.status === 'DONE';
        const isCurrent = mod.status === 'CURRENT';

        return (
          <div key={mod.id} className="relative pl-12">
            {/* Timeline icon */}
            <div className={`absolute left-0 top-3 w-10 h-10 rounded-full border flex items-center justify-center text-xs shrink-0 bg-surface ${
              isDone 
                ? 'border-success text-success bg-success/10' 
                : isCurrent 
                ? 'border-hot text-hot bg-hot/10 font-bold' 
                : 'border-border text-muted bg-surface-2'
            }`}>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isCurrent ? (
                <PlayCircle className="w-4 h-4 fill-hot text-white" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Module Card */}
            <div className={`bg-surface border rounded-xl p-5 shadow-sm transition-colors ${
              isCurrent ? 'border-hot/50 ring-1 ring-hot/30' : 'border-border'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    Module {mod.num}
                  </span>
                  <h3 className="text-base font-semibold text-text mt-0.5">{mod.title}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="shrink-0">
                  {isDone ? (
                    <button className="btn-secondary py-1.5 px-3.5 rounded-lg text-xs font-medium">
                      Review Module
                    </button>
                  ) : isCurrent ? (
                    <button className="btn-primary py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-muted">Complete previous module to unlock</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default LearningPathPage;
