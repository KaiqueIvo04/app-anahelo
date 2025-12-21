import { defineStore } from "pinia";
import { Theme } from "~/types/enums/theme.enum";
import type { LoggedUser } from "~/types/interfaces/logged.user";

export const useLoggedUserStore = defineStore('loggedUser', {
    state: (): LoggedUser => {
        return {
            user: undefined,
            token: undefined,
            theme: undefined
        }
    },

    actions: {
        setUser(user: LoggedUser['user'], token: string, theme: Theme) {
            this.user = user;
            this.token = token;
            this.theme = theme;

            // ✅ Usa cookies ao invés de localStorage
            const userCookie = useCookie('user', {
                maxAge: 60 * 60 * 24 * 7, // 7 dias
                sameSite: 'lax',
            });
            const tokenCookie = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7,
                sameSite: 'lax',
                secure: import.meta.env.VITE_NODE_ENV === 'production',
            });
            const themeCookie = useCookie('theme', {
                maxAge: 60 * 60 * 24 * 365, // 1 ano
                sameSite: 'lax',
            });

            userCookie.value = JSON.stringify(user);
            tokenCookie.value = token;
            themeCookie.value = theme;

            // Aplica o tema no DOM (apenas no cliente)
            if (import.meta.client) {
                document.documentElement.setAttribute('data-theme', theme);
            }
        },

        async getCredential() {
            if (this.user && this.token) return;

            // ✅ Lê dos cookies
            const userCookie = useCookie('user');
            const tokenCookie = useCookie('auth_token');
            const themeCookie = useCookie('theme');

            if (userCookie.value && tokenCookie.value && themeCookie.value) {
                this.user = typeof userCookie.value === 'string' 
                    ? JSON.parse(userCookie.value) 
                    : userCookie.value;
                this.token = tokenCookie.value;
                this.theme = themeCookie.value as Theme;

                // Aplica o tema no DOM (apenas no cliente)
                if (import.meta.client && this.theme) {
                    document.documentElement.setAttribute('data-theme', this.theme);
                }
            }
        },

        setTheme(theme: Theme) {
            this.theme = theme;
            
            const themeCookie = useCookie('theme', {
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
            });
            themeCookie.value = theme;

            // Aplica o tema no DOM (apenas no cliente)
            if (import.meta.client) {
                document.documentElement.setAttribute('data-theme', theme);
            }
        },

        toggleTheme() {
            const themeCookie = useCookie('theme');
            const currentTheme = this.theme || themeCookie.value;
            const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
            this.setTheme(newTheme);
        },

        clearTheme() {
            const themeCookie = useCookie('theme');
            themeCookie.value = null;
            this.theme = undefined;
        },

        clearCredential() {
            // ✅ Limpa os cookies
            const userCookie = useCookie('user');
            const tokenCookie = useCookie('auth_token');

            userCookie.value = null;
            tokenCookie.value = null;

            this.user = undefined;
            this.token = undefined;
        },
    }
})