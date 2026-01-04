// composables/useAPI.ts
import type { UseFetchOptions } from 'nuxt/app'

export async function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  const total = ref<number>(0)
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user')

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
      if (response.status === 401 || response.status === 403) {
        // Limpa cookies
        tokenCookie.value = null;
        userCookie.value = null;
        useLoggedUserStore().clearCredential();

        // Redireciona
        if (import.meta.client && (window.location.pathname !== '/signin')) {
          navigateTo('/signin')
        }
      }

      if (response.status >= 500) {
        useFeedback().show(
          "Erro interno no servidor. Tente novamente mais tarde.",
          "error"
        );
      }

      // Captura x-total-count
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
    total, // Adiciona o total
  }
}