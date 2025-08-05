<template>
    <a-layout-sider theme="light" v-model:collapsed="collapsed" collapsible width="250">
        <a-flex justify="center" align="center">
            <img alt="logo" src="https://placehold.co/600x400/png" style="display:block; width: 70%;" />
        </a-flex>
        <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline">
            <a-menu-item key="1">
                <template #icon>
                    <icon-ri-dashboard-line />
                </template>
                <router-link to="/dashboard">Dashboard</router-link>
            </a-menu-item>
            <a-menu-item key="2">
                <template #icon>
                    <icon-ri-database-2-line />
                </template>
                <router-link to="/masters">Masters</router-link>
            </a-menu-item>
            <a-menu-item key="3">
                <template #icon>
                    <icon-ri-box-3-line />
                </template>
                <router-link to="/items">Items</router-link>
            </a-menu-item>
            <a-menu-item key="4">
                <template #icon>
                    <icon-ri-file-chart-line />
                </template>
                <router-link to="/report">Report</router-link>
            </a-menu-item>
            <a-menu-item key="5">
                <template #icon>
                    <icon-ri-refresh-line />
                </template>
                <router-link to="/backup-restore">Backup & Restore</router-link>
            </a-menu-item>
            <a-menu-item key="6">
                <template #icon>
                    <icon-ri-user-3-line />
                </template>
                <router-link to="/users">Users</router-link>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script setup lang="ts">
const appPageStore = useAppPageStore()
const collapsed = ref<boolean>(false);
const selectedKeys = computed({
    get: () => appPageStore.page,
    set: (val) => appPageStore.setPage(val)
});
const openKeys = ref(['sub1']);
</script>