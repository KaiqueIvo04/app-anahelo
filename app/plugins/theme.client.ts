export default defineNuxtPlugin(() => {
  // Define o tema inicial ao carregar a página
  const savedTheme = localStorage.getItem('theme') || import.meta.env.VITE_DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', savedTheme)
})