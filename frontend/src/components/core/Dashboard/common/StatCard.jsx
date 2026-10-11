import React from "react";

// Reusable stat display card with soft gradient accent
const StatCard = React.memo(function StatCard({ title, value, sub, accent = "indigo" }) {
  const accentMap = {
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  };
  return (
    <div className={`rounded-lg border bg-gradient-to-br p-4 backdrop-blur-sm ${accentMap[accent] || accentMap.indigo}`}>
      <div className="text-sm text-richblack-200 font-medium mb-1">{title}</div>
      <div className="text-2xl font-bold text-richblack-5 leading-tight">{value}</div>
      {sub && <div className="text-xs mt-1 text-richblack-300">{sub}</div>}
    </div>
  );
});

export default StatCard;
