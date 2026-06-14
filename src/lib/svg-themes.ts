export interface CardTheme {
  bg: string; // outer rounded background
  cardBg: string; // inner card fill
  textPrimary: string; // track name / name emphasis
  textMuted: string; // artist, album, secondary text
  accent: string; // "is playing" name + animated equalizer bars
  barBg: string; // album-art placeholder + border stroke
}

export const DEFAULT_THEME = "default";

export const THEMES: Record<string, CardTheme> = {
  default: { bg: "#1a1815", cardBg: "#232019", textPrimary: "#ede9df", textMuted: "#8a8278", accent: "#c49a5a", barBg: "#2e2a23" },
  onedark: { bg: "#21252b", cardBg: "#282c34", textPrimary: "#abb2bf", textMuted: "#5c6370", accent: "#61afef", barBg: "#3b4048" },
  dracula: { bg: "#1e1f29", cardBg: "#282a36", textPrimary: "#f8f8f2", textMuted: "#6272a4", accent: "#bd93f9", barBg: "#44475a" },
  nord: { bg: "#2e3440", cardBg: "#3b4252", textPrimary: "#eceff4", textMuted: "#7b88a1", accent: "#88c0d0", barBg: "#434c5e" },
  gruvbox: { bg: "#1d2021", cardBg: "#282828", textPrimary: "#ebdbb2", textMuted: "#928374", accent: "#fabd2f", barBg: "#3c3836" },
};

/** Theme names in display order, for building UI pickers. */
export const THEME_NAMES = Object.keys(THEMES);

/**
 * Resolve a `?theme=` query value to a palette. Case-insensitive; unknown or
 * missing names fall back to the default so an embed never breaks.
 * Returns the resolved name (for cache keys) alongside the palette.
 */
export function resolveTheme(name?: string | null): { name: string; theme: CardTheme } {
  const key = (name ?? "").toLowerCase();
  if (key in THEMES) {
    return { name: key, theme: THEMES[key] };
  }
  return { name: DEFAULT_THEME, theme: THEMES[DEFAULT_THEME] };
}
