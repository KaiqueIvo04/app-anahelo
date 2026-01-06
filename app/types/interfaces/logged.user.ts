import type { User } from "./user";

export interface LoggedUser {
    user?: User | undefined,
    token: string | undefined,
    theme: string | undefined
}