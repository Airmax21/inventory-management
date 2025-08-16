<template>
    <page-tab :items="pageTabItems">
        <router-view />
    </page-tab>
</template>

<script setup lang="ts">
import pageTab from '@/components/atoms/page-tab.vue';

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

const appPageStore = useAppPageStore();
appPageStore.setPage(['2'])
</script>