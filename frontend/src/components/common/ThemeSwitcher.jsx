import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSwitcher({
  variant = 'toggle',
  className = '',
  size = 'md',
  showLabel = false,
}) {
  const { theme, resolvedTheme, setTheme, toggle, isDark } = useTheme();

  // Size mappings
  const buttonSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  // 1. Segmented Control Variant (Light | Dark | System)
  if (variant === 'segmented') {
    const options = [
      { id: 'light', label: 'Light', icon: Sun },
      { id: 'dark', label: 'Dark', icon: Moon },
      { id: 'system', label: 'System', icon: Laptop },
    ];

    return (
      <div
        role="group"
        aria-label="Theme selection"
        className={`inline-flex items-center p-1 bg-surface-2 border border-border rounded-lg ${className}`}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-surface text-text shadow-sm border border-border/80'
                  : 'text-muted hover:text-text hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Default Quick Toggle Button (Sun <-> Moon)
  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-lg bg-surface-2 border border-border text-muted hover:text-text hover:bg-surface-3 transition-colors ${
        buttonSizes[size] || buttonSizes.md
      } ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size] || iconSizes.md} text-amber-400 transition-transform hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSizes[size] || iconSizes.md} text-slate-700 transition-transform hover:-rotate-12`} />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

