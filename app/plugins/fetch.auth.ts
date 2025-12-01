import { useLoggedUserStore } from "~/stores/userLogged.store";

export default defineNuxtPlugin(() => {
  const store = useLoggedUserStore();

  // Intercepta TODAS as requisições useFetch() / $fetch
  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      if (store.token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${store.token}`,
        };
      }
    },
  });
});
