export const useAppPageStore = defineStore('app-page',{
    state: () => ({
        page: ['']
    }),
    actions: {
        setPage(page: Array<string>) {
            this.page = page ?? this.page
        }
    }
})