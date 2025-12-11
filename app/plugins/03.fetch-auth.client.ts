import { useLoggedUserStore } from "~/stores/userLogged.store";

export default defineNuxtPlugin((nuxtApp) => {

  const customFetch = $fetch.create({
    onRequest({ options }) {
      const loggedUserStore = useLoggedUserStore();
      if (!loggedUserStore.token) return;

      // Define o Authorization corretamente
      options.headers.set("Authorization", `Bearer ${loggedUserStore.token}`);
    },
  });

  return {
    provide: {
      customFetch,
    },
  }
});
