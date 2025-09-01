import { useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useThemeStore } from "@/store";

export function useTheme() {
  const { currentTheme } = useThemeStore();

  // 创建Material-UI主题
  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: currentTheme,
        background: {
          default: currentTheme === "dark" ? "#1a1a1a" : "#ffffff",
          paper: currentTheme === "dark" ? "#2d2d2d" : "#ffffff",
        },
        text: {
          primary: currentTheme === "dark" ? "#ffffff" : "#1a1a1a",
          secondary: currentTheme === "dark" ? "#a1a1aa" : "#6b7280",
        },
        primary: {
          main: currentTheme === "dark" ? "#90caf9" : "#1976d2",
        },
        divider: currentTheme === "dark" ? "#404040" : "#e5e7eb",
      },
    });
  }, [currentTheme]);

  return {
    muiTheme,
  };
}

import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { muiTheme } = useTheme();

  return React.createElement(MuiThemeProvider, { theme: muiTheme }, [
    React.createElement(CssBaseline, { key: "css-baseline" }),
    children,
  ]);
}
