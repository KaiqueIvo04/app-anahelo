// composables/useAPI.ts
import type { UseFetchOptions } from 'nuxt/app'

export async function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  const total = ref<number>(0);
  const config = useRuntimeConfig();
  const tokenCookie = useCookie('auth_token');
  const userCookie = useCookie('user');
  const feedback = useFeedback();

  // ✅ Cria headers dinamicamente
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  }

  const response = await useFetch(url, {
    baseURL: config.public.apiBase,
    ...options,
    credentials: 'include',
    timeout: 10000,

    onRequest({ options }) {
      if (tokenCookie) {
        options.headers.set("Authorization", `Bearer ${tokenCookie.value}`)
      }
    },

    onResponse({ response }) {
      // Tratamento de erros vindos da API
      feedback.clear();
      switch (response.status) {
        case 401:
          tokenCookie.value = null;
          userCookie.value = null;
          useLoggedUserStore().clearCredential();

          feedback.show(
            "Erro: Você não está autenticado(a)!",
            "error"
          );

          // Redireciona
          if (import.meta.client && (window.location.pathname !== '/signin')) {
            navigateTo('/signin')
          }
          break;
        case 403:
          feedback.show(
            "Erro: Você não tem permissão para acessar esse recurso!",
            "error"
          );
          break;
        case 404:
          feedback.show(
            "Erro: O(s) recurso(s) solicitado não foi encontrado!",
            "error"
          );
          break;
        case 500:
          feedback.show(
            "Erro interno no servidor. Tente novamente mais tarde.",
            "error"
          );
        default:
          break;
      }

      // Captura o total de itens
      const totalCount = response.headers.get('x-total-count')
      if (totalCount) {
        total.value = parseInt(totalCount, 10)
      }
    },
  })

  return {
    data: response.data,
    pending: response.pending,
    error: response.error,
    refresh: response.refresh,
    execute: response.execute,
    status: response.status,
    feedback,
    total,
  }
}