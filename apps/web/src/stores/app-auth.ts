export const useAppAuthStore = defineStore('auth', {
    state: () => ({
        token: useLocalStorage('token', '')
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