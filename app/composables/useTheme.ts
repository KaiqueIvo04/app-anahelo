const defaultTheme = import.meta.env.VITE_DEFAULT_THEME
const darkTheme = import.meta.env.VITE_DARK_THEME

export const useTheme = () => {
  const theme = useState<string>('theme', () => {
    if (import.meta.client) {
      return localStorage.getItem('theme') || defaultTheme
    }
    return defaultTheme
  })

  function setTheme(newTheme: string) {
    theme.value = newTheme
    
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      
      localStorage.setItem('theme', newTheme)
    }
  }

  function toggleTheme() {
    const newTheme = theme.value === defaultTheme ? darkTheme : defaultTheme
    setTheme(newTheme)
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme
  }
}