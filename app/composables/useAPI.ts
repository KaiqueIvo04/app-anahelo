// composables/useAPI.ts
import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user')

  // ✅ Cria headers dinamicamente
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  }

  return useFetch(url, {
    baseURL: config.public.apiBase,
    ...options,
    credentials: 'include',
    timeout: 10000,

    onRequest({ options, error, response }) {
      if (tokenCookie) {
        options.headers.set("Authorization", `Bearer ${tokenCookie.value}`)
      }
    },

    onResponse({ response, error }) {
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
    },
  })
}