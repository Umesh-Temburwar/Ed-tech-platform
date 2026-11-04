import React from "react";

function AppSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#000814] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-cyan-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div className="w-full space-y-3">
          <div className="h-2 w-3/4 mx-auto rounded-full bg-white/10 animate-pulse" />
          <div className="h-2 w-1/2 mx-auto rounded-full bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(AppSkeleton);

export const MiniSkeleton = React.memo(function MiniSkeleton() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/[0.03] border border-white/10">
      <div className="w-4 h-4 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Loading...</span>
    </div>
  );
});
