// middleware/theme.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const { initTheme } = useTheme();
    // Reaplica o tema em cada navegação
    nextTick(() => {
      initTheme();
    });
  }
});