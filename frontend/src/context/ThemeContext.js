import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
	return ctx;
};

const STORAGE_KEY = "app-theme";
const prefersDark = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || (prefersDark() ? "dark" : "light"));

	const applyTheme = useCallback(
		(t) => {
			const root = document.documentElement;
			if (t === "light") {
				root.classList.remove("dark");
			} else {
				root.classList.add("dark");
			}
		},
		[]
	);

	useEffect(() => {
		applyTheme(theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme, applyTheme]);

	// Listen for dispatched toggle-theme events (from sidebar)
	useEffect(() => {
		const handler = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
		document.addEventListener("toggle-theme", handler);
		return () => document.removeEventListener("toggle-theme", handler);
	}, []);

	const value = { theme, setTheme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
