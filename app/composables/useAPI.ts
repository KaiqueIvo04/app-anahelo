import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T> (
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(import.meta.env.VITE_API_BASE_URL + url, {
    ...options,
    $fetch: useNuxtApp().$customFetch as typeof $fetch,
  })
}
