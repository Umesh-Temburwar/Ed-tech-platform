/**
 * Unified Theme Configuration Tokens
 * Aligned with shadcn/ui & Linear modern design system
 */

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const THEMES = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean, crisp high-contrast layout for focused daytime study',
    previewBg: '#f8fafc',
    previewBorder: '#e2e8f0',
    previewText: '#0f172a',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Deep neutral zinc dark theme for long sessions without eye fatigue',
    previewBg: '#09090b',
    previewBorder: '#27272a',
    previewText: '#fafafa',
  },
  {
    id: 'system',
    name: 'System',
    description: 'Automatically synchronizes with your operating system preference',
    previewBg: 'linear-gradient(135deg, #f8fafc 50%, #09090b 50%)',
    previewBorder: '#3f3f46',
    previewText: '#3b82f6',
  },
];

export const ACCENT_COLORS = [
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb', bgClass: 'bg-blue-600' },
  { id: 'indigo', name: 'Indigo', hex: '#4f46e5', bgClass: 'bg-indigo-600' },
  { id: 'emerald', name: 'Emerald', hex: '#10b981', bgClass: 'bg-emerald-600' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', bgClass: 'bg-amber-600' },
  { id: 'rose', name: 'Rose', hex: '#e11d48', bgClass: 'bg-rose-600' },
];

export const FONT_SIZES = [
  { id: 'sm', name: 'Compact', scale: '0.925', description: 'Dense layout with high information density' },
  { id: 'base', name: 'Standard', scale: '1.0', description: 'Recommended balance of readability and structure' },
  { id: 'lg', name: 'Comfortable', scale: '1.075', description: 'Enhanced typography for easier reading' },
];

export default {
  THEME_MODES,
  THEMES,
  ACCENT_COLORS,
  FONT_SIZES,
};

