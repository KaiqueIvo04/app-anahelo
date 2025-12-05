import { useLoggedUserStore } from "~/stores/userLogged.store";
import { THEME_KEY } from "~/utils/localStorage.utils";

export default defineNuxtPlugin(() => {
  const loggedUserStore = useLoggedUserStore();
  
  // Define o tema inicial ao carregar a página
  const savedTheme = loggedUserStore.theme || import.meta.env.VITE_DEFAULT_THEME
  if (!loggedUserStore.theme) localStorage.setItem(THEME_KEY, savedTheme)
  document.documentElement.setAttribute('data-theme', savedTheme)
})