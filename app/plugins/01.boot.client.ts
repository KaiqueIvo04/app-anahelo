// plugins/02.boot.client.ts
import { useLoggedUserStore } from "~/stores/userLogged.store";

export default defineNuxtPlugin(async () => {
  const loggedUserStore = useLoggedUserStore();
  const { initTheme, applyTheme } = useTheme();
  
  // Aplica o tema IMEDIATAMENTE
  initTheme();
  
  // Busca as credenciais
  await loggedUserStore.getCredential();
  
  // Atualiza o tema se vier da store
  if (loggedUserStore.theme) {
    applyTheme(loggedUserStore.theme);
  }
  
  // Watch para mudanças
  watch(() => loggedUserStore.theme, (newTheme) => {
    if (newTheme) {
      applyTheme(newTheme);
    }
  });
});