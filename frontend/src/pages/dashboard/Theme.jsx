import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Eye,
  Type,
  Maximize2,
  Sparkles,
  Layout,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card, Button, Badge } from '../../components/ui';

export default function ThemePage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('app-font-size') || 'medium');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('app-compact-mode') === 'true');
  const [accentChoice, setAccentChoice] = useState(() => localStorage.getItem('app-accent') || 'blue');

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: Sun,
      description: 'Luminous, high-contrast canvas engineered for daytime focus',
      previewSurface: 'bg-white border-slate-200 text-slate-900',
      badge: 'Crisp & Clean',
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: Moon,
      description: 'Deep neutral zinc background designed for long study sessions without eye strain',
      previewSurface: 'bg-[#111113] border-zinc-800 text-zinc-100',
      badge: 'Zero Eye-Fatigue',
    },
    {
      id: 'system',
      name: 'System Default',
      icon: Laptop,
      description: 'Automatically synchronizes with your device operating system preference',
      previewSurface: 'bg-gradient-to-br from-white to-zinc-950 border-zinc-700 text-zinc-200',
      badge: 'Auto-Sync',
    },
  ];

  const accentColors = [
    { id: 'blue', name: 'Royal Blue', class: 'bg-blue-600', ring: 'ring-blue-600', hex: '#2563eb' },
    { id: 'indigo', name: 'Deep Indigo', class: 'bg-indigo-600', ring: 'ring-indigo-600', hex: '#4f46e5' },
    { id: 'emerald', name: 'Emerald', class: 'bg-emerald-600', ring: 'ring-emerald-600', hex: '#10b981' },
    { id: 'amber', name: 'Amber Flame', class: 'bg-amber-600', ring: 'ring-amber-600', hex: '#d97706' },
    { id: 'rose', name: 'Rose', class: 'bg-rose-600', ring: 'ring-rose-600', hex: '#e11d48' },
  ];

  const fontSizes = [
    { id: 'small', name: 'Compact', desc: 'Dense text scale for maximum visible content' },
    { id: 'medium', name: 'Standard (Recommended)', desc: 'Balanced readability with comfortable line height' },
    { id: 'large', name: 'Expanded', desc: 'Enlarged body text for optimal visual accessibility' },
  ];

  const handleFontSizeChange = (sizeId) => {
    setFontSize(sizeId);
    localStorage.setItem('app-font-size', sizeId);
    const root = document.documentElement;
    if (sizeId === 'small') {
      root.style.fontSize = '14px';
    } else if (sizeId === 'large') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const handleCompactToggle = () => {
    const next = !compactMode;
    setCompactMode(next);
    localStorage.setItem('app-compact-mode', String(next));
    if (next) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  };

  const handleAccentChange = (accentId) => {
    setAccentChoice(accentId);
    localStorage.setItem('app-accent', accentId);
    const item = accentColors.find((c) => c.id === accentId);
    if (item) {
      document.documentElement.style.setProperty('--accent', item.hex);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
          Interface Customization
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
          Theme & Display Settings
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Select your color scheme, font scale, and layout density. All settings synchronize instantly across your workspace.
        </p>
      </div>

      {/* Theme Cards Grid */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Color Scheme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative bg-surface rounded-xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-accent ring-2 ring-accent/20 shadow-sm'
                    : 'border-border hover:border-border/80 hover:bg-surface-2/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-border ${
                      isSelected ? 'bg-accent/10 text-accent border-accent/20' : 'bg-surface-2 text-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-text">{t.name}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{t.description}</p>
                </div>

                {/* Miniature Preview Pill */}
                <div className={`mt-5 p-3 rounded-lg border flex items-center justify-between text-xs font-medium ${t.previewSurface}`}>
                  <span>Aa Sample Text</span>
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Workspace Preview */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-accent" />
          Live Interactive Preview
        </h2>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                CSE 2028 Academic Track
              </span>
              <h3 className="text-base font-semibold text-text mt-0.5">
                Algorithms & Distributed Systems Masterclass
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Current active view rendered with your <span className="font-semibold text-text capitalize">{resolvedTheme}</span> mode tokens.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success text-xs">
                In Progress
              </span>
              <span className="text-xs font-semibold text-text">
                74% Complete
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-surface-2 border border-border">
              <span className="text-[11px] text-muted font-medium">Study Streak</span>
              <p className="text-xl font-bold text-text mt-1">18 Days</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-2 border border-border">
              <span className="text-[11px] text-muted font-medium">Completed Modules</span>
              <p className="text-xl font-bold text-text mt-1">42 of 56</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-2 border border-border">
              <span className="text-[11px] text-muted font-medium">Current Goal</span>
              <p className="text-xl font-bold text-hot mt-1">AIR &lt; 100</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Font Size & Density Controls */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-accent" />
          Reading Scale & Density
        </h2>
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">
          {/* Font scale options */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-text">Font Scale</h3>
              <p className="text-xs text-muted mt-0.5">Adjust body text sizing for lesson reading and problem statements</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {fontSizes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFontSizeChange(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    fontSize === f.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-2 text-text border-border hover:bg-surface-3'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact mode toggle */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-text">High-Density Mode</h3>
              <p className="text-xs text-muted mt-0.5">Reduces padding across tables, lists, and quiz trees to display more data</p>
            </div>
            <button
              onClick={handleCompactToggle}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                compactMode ? 'bg-accent' : 'bg-surface-2 border border-border'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  compactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
