export const useAppAuthStore = defineStore('auth', {
    state: () => ({
        token: useLocalStorage('auth/token', '')
    }),
    getters: {
        isAuthenticated(state): boolean {
            return !!state.token;
        }
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        }
    }
})