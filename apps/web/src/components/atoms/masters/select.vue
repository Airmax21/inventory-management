<template>
    <select-async v-model:value="value" :options="options" :disabled="disabled" :loading="isFetching"
        @search="handleSearch" @next="() => {
            hasNextPage && fetchNextPage()
        }">

    </select-async>
</template>

<script setup lang="ts">
import type { IMaster } from '@/types/master';
import selectAsync from '../select-async.vue';
import type { InfiniteData } from '@tanstack/vue-query';
import type { ApiPaginateResponse } from '@/types/api';
import { api } from '@/services';

defineProps<{ disabled?: boolean }>();
const value = defineModel<IMaster['id']>('value');
const search = ref<string>();
const searchDebounced = refDebounced(search, 500);
const queryClient = useQueryClient();

watch(searchDebounced, () => {
    queryClient.setQueryData<InfiniteData<ApiPaginateResponse<IMaster>, number>>(
        ['masters/select'],
        (data) => !data ? undefined : {
            pages: data.pages.slice(0, data.pages.length),
            pageParams: data.pageParams.slice(0, data.pageParams.length)
        }
    )
})

const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['masters/select', searchDebounced],
    queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.master.paginate({
            page: pageParam,
            search: searchDebounced.value,
            limit: 20
        })
        return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPageParam < lastPage.meta.totalPages) return lastPageParam + 1;
        return undefined
    }
});

const options = computed(() => {
    const list: { label: string; value: string }[] = []

    if (data.value) {
        for (const group of data.value.pages) {
            for (const project of group.data) {
                list.push({ label: project.name, value: project.id })
            }
        }
    }

    return list;
})

const handleSearch = (val: string) => {
    search.value = val
}
</script>