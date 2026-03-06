"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "dayflow-theme-mode";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  toggleMode: () => void;
  mounted: boolean;
};

const ThemeModeContext = React.createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ThemeMode>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setModeState(getInitialMode());
    setMounted(true);
  }, []);

  const setMode = React.useCallback((next: ThemeMode) => {
    setModeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const toggleMode = React.useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  const value = React.useMemo<ThemeModeContextValue>(
    () => ({ mode, setMode, toggleMode, mounted }),
    [mode, setMode, toggleMode, mounted]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
}
