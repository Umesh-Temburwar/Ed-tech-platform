import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

const STORAGE_KEY = "app-theme";
const LEGACY_STORAGE_KEY = "theme";

const getSystemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system" || saved === "auto") {
      return saved === "auto" ? "system" : saved;
    }
    return getSystemPrefersDark() ? "dark" : "light";
  });

  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  // Listen to OS color scheme changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e) => setSystemDark(e.matches);
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else if (media.addListener) {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  // Compute resolved theme ("dark" or "light")
  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return systemDark ? "dark" : "light";
    }
    return theme === "light" ? "light" : "dark";
  }, [theme, systemDark]);

  const applyTheme = useCallback((targetTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (targetTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.setItem(LEGACY_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable or disabled
    }
    // Dispatch global event for third-party or legacy listeners
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme, resolvedTheme } }));
  }, [theme, resolvedTheme, applyTheme]);

  // Listen for dispatched toggle-theme events (e.g. keyboard shortcut or external triggers)
  useEffect(() => {
    const handler = () => {
      setThemeState((prev) => {
        const next = prev === "dark" ? "light" : "dark";
        return next;
      });
    };
    document.addEventListener("toggle-theme", handler);
    return () => document.removeEventListener("toggle-theme", handler);
  }, []);

  const setTheme = useCallback((newTheme) => {
    const normalized = newTheme === "auto" ? "system" : newTheme;
    setThemeState(normalized);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      if (prev === "system") {
        return systemDark ? "light" : "dark";
      }
      return prev === "dark" ? "light" : "dark";
    });
  }, [systemDark]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      setTheme,
      toggle,
    }),
    [theme, resolvedTheme, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
