import { useLoggedUserStore } from "~/stores/userLogged.store"

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const loggedUserStore = useLoggedUserStore();
        loggedUserStore.getCredential();

        console.log(loggedUserStore.token)

        if (to.path === '/admin/home') {
            if (!loggedUserStore.token) return navigateTo('/signin');
        } else {
            if (loggedUserStore.token) return navigateTo('/admin/home');
        }
    }
})