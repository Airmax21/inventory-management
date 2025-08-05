import type { IUser } from "@/types/auth";

interface IState {
    token: Ref<string>,
    user: Ref<Partial<IUser>>
}

export const useAppAuthStore = defineStore('auth', {
    state: (): IState => ({
        token: useLocalStorage('auth/token', ''),
        user: useLocalStorage('auth/user', {
            email: '',
            username: ''
        })
    }),
    getters: {
        isAuthenticated(state): boolean {
            return !!state.token;
        }
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: Partial<IUser>) {
            this.user = user
        }
    }
})