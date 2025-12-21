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
    onRequest({ options }) {
      if (tokenCookie) {
        options.headers.set("Authorization", `Bearer ${tokenCookie.value}`)
      }
    },
    // ✅ Tratamento de erro
    onResponseError({ response }) {
      if (response.status === 401) {
        // Limpa cookies
        tokenCookie.value = null
        userCookie.value = null

        // Redireciona
        if (import.meta.client) {
          navigateTo('/signin')
        }
      }
    },
  })
}