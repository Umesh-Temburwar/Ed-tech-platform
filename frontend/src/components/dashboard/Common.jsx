import React from 'react';

export const StatCard = ({ icon: Icon, label, value, trend, color = "indigo" }) => {
  const iconColors = {
    indigo: "text-accent bg-surface-2 border-border",
    purple: "text-accent bg-surface-2 border-border",
    blue: "text-accent bg-surface-2 border-border",
    emerald: "text-success bg-surface-2 border-border",
    amber: "text-warning bg-surface-2 border-border",
    red: "text-danger bg-surface-2 border-border",
  };

  const isPositive = trend?.startsWith('+');
  const isNeutral = !trend || trend === '0' || trend === '0%';

  return (
    <div className="bg-surface border border-border rounded-xl p-5 transition-colors shadow-sm hover:border-border/80">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconColors[color] || iconColors.indigo}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
            isNeutral 
              ? 'bg-surface-2 text-muted border-border'
              : isPositive 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-danger/10 text-danger border-danger/20'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-muted text-xs font-medium">{label}</h3>
      <p className="text-2xl font-semibold text-text mt-0.5 tracking-tight">{value}</p>
    </div>
  );
};

export const ProgressBar = ({ pct = 0, color = "bg-hot", size = "h-2" }) => {
  const safePct = Math.min(100, Math.max(0, Number(pct) || 0));
  // Map legacy gradients to solid semantic tokens
  const fillClass = color.includes("indigo") || color.includes("purple") || color.includes("gradient")
    ? "bg-hot"
    : color;

  return (
    <div className={`w-full ${size} bg-surface-2 rounded-full overflow-hidden border border-border/40`}>
      <div
        className={`h-full ${fillClass} transition-all duration-300 ease-out`}
        style={{ width: `${safePct}%` }}
      />
    </div>
  );
};

export const Avatar = ({ initials, color = "bg-surface-2", size = "w-9 h-9" }) => (
  <div className={`${size} rounded-lg ${color} border border-border flex items-center justify-center font-semibold text-text text-xs shrink-0`}>
    {initials}
  </div>
);

export const Badge = ({ text, color = "indigo" }) => {
  const colors = {
    indigo: "text-accent bg-accent/10 border-accent/20",
    emerald: "text-success bg-success/10 border-success/20",
    amber: "text-warning bg-warning/10 border-warning/20",
    red: "text-danger bg-danger/10 border-danger/20",
    blue: "text-accent bg-accent/10 border-accent/20",
    gray: "text-muted bg-surface-2 border-border",
    purple: "text-accent bg-surface-2 border-border",
  };
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-md border font-medium ${colors[color] || colors.indigo}`}>
      {text}
    </span>
  );
};

export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-surface border border-border rounded-xl p-5 shadow-sm transition-colors hover:border-border/80 ${className}`}>
    {children}
  </div>
);

export const EmptyState = ({ icon: Icon, title, subtitle, ctaText, onCta }) => (
  <div className="py-16 px-4 flex flex-col items-center text-center bg-surface rounded-xl border border-dashed border-border my-2">
    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-3 text-muted">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-semibold text-text">{title}</h3>
    <p className="text-xs text-muted mt-1 max-w-sm leading-relaxed">{subtitle}</p>
    {ctaText && (
      <button onClick={onCta} className="mt-4 btn-primary py-2 px-4 rounded-lg text-xs font-semibold">
        {ctaText}
      </button>
    )}
  </div>
);

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
        {children}
      </div>
    </div>
  );
};

export const TabBar = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 p-1 bg-surface-2 border border-border rounded-lg overflow-x-auto w-fit">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
          active === tab
            ? 'bg-surface text-text shadow-sm border border-border font-semibold'
            : 'text-muted hover:text-text'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);
