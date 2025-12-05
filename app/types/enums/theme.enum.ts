export const Theme = {
  LIGHT: import.meta.env.VITE_DEFAULT_THEME,
  DARK: import.meta.env.VITE_DARK_THEME,
} as const;

export type Theme = typeof Theme[keyof typeof Theme];
