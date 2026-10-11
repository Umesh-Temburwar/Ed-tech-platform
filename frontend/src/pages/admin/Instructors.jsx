import React from "react";
import { Users } from "lucide-react";

/**
 * Admin Instructors page — Phase 5 placeholder.
 */
export default function AdminInstructors() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
        <Users className="w-9 h-9 text-violet-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Instructors</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-sm">
          Instructor management will be built in{" "}
          <span className="text-violet-400 font-semibold">Phase 5</span>.
        </p>
      </div>
    </div>
  );
}
