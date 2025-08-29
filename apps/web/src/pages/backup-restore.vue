<template>
    <page-tab :items="pageTabItems">
        <RouterView />
    </page-tab>
</template>
<script setup lang="ts">
import pageTab from '@/components/atoms/page-tab.vue';

const pageTabItems = computed(() =>[
    {
        key: '/backup-restore/backup',
        tab: 'Backup Data'
    },
    {
        key: '/backup-restore/restore',
        tab: 'Restore Data'
    }
])

const appPageStore = useAppPageStore();
appPageStore.setPage(['6'])
</script>