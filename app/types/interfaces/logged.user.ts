import type { Theme } from "../enums/theme.enum";
import type { User } from "./user";

export interface LoggedUser {
    user?: User | undefined,
    token: string | undefined,
    theme: Theme | undefined
}