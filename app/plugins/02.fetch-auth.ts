// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase || import.meta.env.VITE_API_BASE_URL,

    onRequest({ options }) {
      // ✅ Só acessa a store se estiver no cliente OU se o token existir
      const loggedUserStore = useLoggedUserStore()
      
      if (!loggedUserStore.token) return

      options.headers.set("Authorization", `Bearer ${loggedUserStore.token}`);
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        const loggedUserStore = useLoggedUserStore()
        loggedUserStore.clearCredential()
        
        // ✅ navigateTo só funciona no cliente
        if (import.meta.client) {
          navigateTo('/signin')
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
