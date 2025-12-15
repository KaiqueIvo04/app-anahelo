// composables/useTheme.ts
import { Theme } from "~/types/enums/theme.enum";
import { THEME_KEY } from "~/utils/localStorage.utils";

export const useTheme = () => {
  const applyTheme = (theme: Theme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  };

  const getTheme = (): string => {
    if (import.meta.client) {
      return localStorage.getItem(THEME_KEY) || import.meta.env.VITE_DEFAULT_THEME || Theme.LIGHT;
    }
    return import.meta.env.VITE_DEFAULT_THEME || Theme.LIGHT;
  };

  const initTheme = () => {
    const theme = getTheme();
    applyTheme(theme);
    
    // MutationObserver para reforçar o tema se o atributo for removido
    if (import.meta.client) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const savedTheme = getTheme();
            if (!currentTheme || currentTheme !== savedTheme) {
              document.documentElement.setAttribute('data-theme', savedTheme);
            }
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
  };

  return {
    applyTheme,
    getTheme,
    initTheme
  };
};