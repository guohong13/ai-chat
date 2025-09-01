import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  currentTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// 获取系统主题
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// 计算实际主题
const getActualTheme = (theme: ThemeMode): "light" | "dark" => {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      currentTheme: "light",

      setTheme: (theme: ThemeMode) => {
        const actualTheme = getActualTheme(theme);
        set({ theme, currentTheme: actualTheme });

        // 监听系统主题变化
        if (theme === "system" && typeof window !== "undefined") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            const { theme: currentTheme } = get();
            if (currentTheme === "system") {
              set({ currentTheme: getSystemTheme() });
            }
          };
          mediaQuery.addEventListener("change", handleChange);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const themes: ThemeMode[] = ["light", "dark", "system"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        const actualTheme = getActualTheme(nextTheme);
        set({ theme: nextTheme, currentTheme: actualTheme });
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        theme: state.theme,
        currentTheme: state.currentTheme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const actualTheme = getActualTheme(state.theme);
          state.currentTheme = actualTheme;
        }
      },
    }
  )
);
