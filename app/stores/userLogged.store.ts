import { defineStore } from "pinia";
import type { LoggedUser } from "~/types/logged.user";
import type { User } from "~/types/user";

export const useLoggedUserStore = defineStore('loggedUser', {
    state: (): LoggedUser => {
        return {
            user: undefined,
            token: undefined,
        }
    },

    actions: {
        setUser(user: LoggedUser['user'], token: string) {
            // 1. Sets user in `localStorage` and in store variable.
            localStorage.setItem("user", JSON.stringify(user));
            this.user = user;
            this.token = token
        },
    }
})