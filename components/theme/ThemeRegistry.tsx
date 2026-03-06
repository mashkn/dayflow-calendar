"use client";

import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useThemeMode } from "@/lib/theme/ThemeModeContext";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: {
      default: "#d0d0d0",
      paper: "#dcdcdc",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#ce93d8" },
    background: {
      default: "#0d0d0d",
      paper: "#1a1a1a",
    },
  },
});

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { mode, mounted } = useThemeMode();
  // Use light until mounted so server and client initial HTML match (avoids hydration mismatch)
  const resolvedMode = mounted ? mode : "light";
  const theme = React.useMemo(
    () => (resolvedMode === "dark" ? darkTheme : lightTheme),
    [resolvedMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
