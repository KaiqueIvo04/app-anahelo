import { defineStore } from "pinia";
import { Theme } from "~/types/enums/theme.enum";
import type { LoggedUser } from "~/types/logged.user";
import { THEME_KEY, TOKEN_KEY, USER_KEY } from "~/utils/localStorage.utils";

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
            this.token = token
            this.setTheme(this.theme)

            // 1. Sets user in `localStorage` and in store variable.
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            // 2. Sets token in `localStorage` and in store variable.
            localStorage.setItem(TOKEN_KEY, token);
            // 23. Sets theme in `localStorage` and in store variable.
            localStorage.setItem(THEME_KEY, theme);
        },


        async getCredential() {
            if (this.user && this.token) return

            // 1. Gets user of `localStorage`.
            const localStorageUser = localStorage.getItem(USER_KEY);
            // 2. Gets token of `localStorage`.
            const localStorageToken = localStorage.getItem(TOKEN_KEY);
            // 3. Gets theme of `localStorage`.
            const localStorageTheme = localStorage.getItem(THEME_KEY);

            // 3. Sets credentials and headers
            if (localStorageUser && localStorageToken && localStorageTheme) {
                this.setUser(
                    JSON.parse(localStorageUser),
                    localStorageToken,
                    localStorageTheme
                );
            }
        },

        setTheme(theme: Theme) {
            localStorage.setItem(THEME_KEY, theme);
            this.theme = theme
            document.documentElement.setAttribute('data-theme', theme)
        },

        toggleTheme() {
            const newTheme = (this.theme || localStorage.getItem(THEME_KEY)) === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
            this.setTheme(newTheme)
        },

        clearTheme() {
            localStorage.removeItem(THEME_KEY);
            this.theme = undefined;
        },

        clearCredential() {
            // 1. Clears user in `localStorage` and in store variable.
            localStorage.removeItem(USER_KEY);
            this.user = undefined;

            // 2. Clears token in `localStorage` and in store variable.
            localStorage.removeItem(TOKEN_KEY);
            this.token = undefined;

            // 2. Clears theme in `localStorage` and in store variable.
            // localStorage.removeItem(THEME_KEY);
            // this.theme = undefined;
        },
    }
})