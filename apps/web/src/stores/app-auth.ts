import type { IUser } from "@/types/auth";
import dayjs from "dayjs";

export interface IToken {
    token: string,
    expiresAt: string
}

interface IState {
    token: Ref<IToken>,
    user: Ref<Partial<IUser>>
}

export const useAppAuthStore = defineStore('auth', {
    state: (): IState => ({
        token: useLocalStorage('auth/token', {
            token: '',
            expiresAt: ''
        }),
        user: useLocalStorage('auth/user', {
            email: '',
            username: ''
        })
    }),
    getters: {
        isAuthenticated(state): boolean {
            return !!state.token.token && !!state.token.expiresAt && dayjs().isBefore(dayjs(state.token.expiresAt));
        }
    },
    actions: {
        setToken(token: IToken) {
            this.token = token;
        },
        setUser(user: Partial<IUser>) {
            this.user = user
        }
    }
})