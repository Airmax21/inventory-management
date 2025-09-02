<template>
    <a-flex justify="flex-end">
        <a-button type="primary" size="large" @click="mutate()" :loading="isPending">
            <div class="flex items-center gap-2 justify-center">
                <IconRiFileExcel2Line />
                Export Excel
            </div>
        </a-button>
    </a-flex><br>
    <page-tab :items="pageTabItems">
        <router-view />
    </page-tab>
</template>

<script setup lang="ts">
import pageTab from '@/components/atoms/page-tab.vue';
import { api } from '@/services';
import dayjs from 'dayjs';

const pageTabItems = computed(() => [
    {
        key: '/masters/item',
        tab: 'Data Item '
    },
    {
        key: '/masters/category',
        tab: 'Data Category'
    },
    {
        key: '/masters/location',
        tab: 'Data Location'
    }
])

const { isPending, mutate } = useMutation({
    mutationFn: api.excel.master,
    onSuccess: ({ data }) => {
        const unixTimestamp = dayjs().unix();

        // Membuat nama file dengan Unix timestamp
        const fileName = `laporan_master_${unixTimestamp}.xlsx`;

        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    },
})

const appPageStore = useAppPageStore();
appPageStore.setPage(['2'])
</script>