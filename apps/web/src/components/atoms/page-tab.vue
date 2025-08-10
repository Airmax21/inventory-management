<template>
    <a-card :title="title" :tab-list="tabLists" :active-tab-key="tabActiveKey" :loading="loading"
        @tab-change="onTabChange">
        <template #title>
            <slot name="title" />
        </template>
        <slot />
    </a-card>
</template>

<script setup lang="ts">
import type { CardTabListType } from 'ant-design-vue/es/card/Card';

interface Props {
    title?: string;
    items: CardTabListType[],
    loading?: boolean
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();

const tabLists = computed(() => props.items)

const tabActiveKey = computed(() => tabLists.value.find((list) => {
    let key = list.key;
    return route.fullPath.startsWith(key);
})?.key);

const onTabChange = (key: string) => {
    void router.push(key)
}

</script>