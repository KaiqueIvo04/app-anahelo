import { useLoggedUserStore } from "~/stores/userLogged.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const loggedUserStore = useLoggedUserStore();
        
    if (loggedUserStore.token) {
        return navigateTo('/admin/home', { 
            replace: true 
        });
    }
});