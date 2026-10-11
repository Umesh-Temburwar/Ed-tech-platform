import React from "react";
import { Settings } from "lucide-react";

/**
 * Admin Settings page — Phase 5 placeholder.
 */
export default function AdminSettings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
        <Settings className="w-9 h-9 text-slate-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-sm">
          Platform settings (site config, email templates, feature flags) will
          be built in{" "}
          <span className="text-slate-300 font-semibold">Phase 5</span>.
        </p>
      </div>
    </div>
  );
}
