<template>
    <a-layout-sider theme="light" v-model:collapsed="collapsed" collapsible width="250">
        <a-flex justify="center" align="center">
            <!-- <img alt="avatar" src="/img/Widya-Logo-Blue.png" style="display:block; width: 70%;" /> -->
        </a-flex>
        <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline">
            <a-menu-item key="1">
                <router-link to="/general">General Statistic</router-link>
            </a-menu-item>
            <a-menu-item key="2">
                <router-link to="/measurements">Measurements Statistic</router-link>
            </a-menu-item>
            <a-menu-item key="3">
                <router-link to="/material">Material Statistic</router-link>
            </a-menu-item>
            <a-menu-item key="4">
                <router-link to="/uptime">Working Hour Statistic</router-link>
            </a-menu-item>
            <a-menu-item key="5">
                <router-link to="/logs">Logs</router-link>
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