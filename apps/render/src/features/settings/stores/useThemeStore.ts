import { create } from "zustand";

let themeSwitchTimeoutId: number | null = null;

export const normalizeColorScheme = (colorScheme: string | null): string =>
  colorScheme || "standard";

export const getInitialFontFamily = (): string =>
  localStorage.getItem("fontFamily") || "poppins";

const applyThemeSwitchTransition = () => {
  const root = document.documentElement;

  root.classList.add("theme-switching");

  if (themeSwitchTimeoutId !== null) {
    window.clearTimeout(themeSwitchTimeoutId);
  }

  themeSwitchTimeoutId = window.setTimeout(() => {
    root.classList.remove("theme-switching");
    themeSwitchTimeoutId = null;
  }, 180);
};

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  colorScheme: string;
  fontFamily: string;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setColorScheme: (colorScheme: string) => void;
  setFontFamily: (fontFamily: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: normalizeColorScheme(localStorage.getItem("colorScheme")),
  fontFamily: getInitialFontFamily(),
  themeMode: (localStorage.getItem("themeMode") as ThemeMode) || "light",

  toggleThemeMode: () => {
    applyThemeSwitchTransition();
    set((state) => {
      const nextMode: ThemeMode =
        state.themeMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", nextMode);
      document.documentElement.dataset.themeMode = nextMode;
      return { themeMode: nextMode };
    });
  },

  setColorScheme: (colorScheme: string) => {
    localStorage.setItem("colorScheme", colorScheme);
    document.documentElement.dataset.colorScheme = colorScheme;
    set({ colorScheme });
  },

  setFontFamily: (fontFamily: string) => {
    localStorage.setItem("fontFamily", fontFamily);
    document.documentElement.dataset.fontFamily = fontFamily;
    set({ fontFamily });
  },
}));
