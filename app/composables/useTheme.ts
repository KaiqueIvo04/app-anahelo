export const useTheme = () => {
  const config = useRuntimeConfig();
  const themeCookie = useCookie<string>('theme', {
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: 'lax',
    default: () => (config.public.defaultTheme) || config.public.defaultTheme,
  });

  const applyTheme = (theme: string) => {
    themeCookie.value = theme;
    
    // Aplica no DOM apenas no cliente
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  const getTheme = (): string => {
    return themeCookie.value || (config.public.defaultTheme) || config.public.defaultTheme;
  };

  const initTheme = () => {
    const theme = getTheme();
    
    // Aplica o tema imediatamente
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme);
      
      // MutationObserver para reforçar o tema se o atributo for removido
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

  const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === config.public.defaultTheme ? config.public.darkTheme : config.public.defaultTheme;
    applyTheme(newTheme);
  };

  return {
    theme: themeCookie,
    applyTheme,
    getTheme,
    initTheme,
    toggleTheme,
  };
};