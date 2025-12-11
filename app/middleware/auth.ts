import { useLoggedUserStore } from "~/stores/userLogged.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const loggedUserStore = useLoggedUserStore();
        
    if (!loggedUserStore.token) {
        return navigateTo('/signin', { 
            redirectCode: 401,
            replace: true 
        });
    }
});