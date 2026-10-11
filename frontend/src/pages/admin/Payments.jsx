import React from "react";
import { CreditCard } from "lucide-react";

/**
 * Admin Payments page — Phase 5 placeholder.
 */
export default function AdminPayments() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CreditCard className="w-9 h-9 text-emerald-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-sm">
          Payment history and revenue breakdown will be built in{" "}
          <span className="text-emerald-400 font-semibold">Phase 5</span>.
        </p>
      </div>
    </div>
  );
}
