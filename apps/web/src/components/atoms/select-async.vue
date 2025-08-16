<template>
    <a-select size="large" v-model:value="value" :options="options" :loading="loading" :disabled="disabled"
        :placeholder="placeholder" show-search option-filter-prop="label" @search="handleSearch" @change="handleChange"
        @popup-scroll="handlePopupScroll">
        <template #dropdownRender="{ menuNode: vnode }">
            <component :is="vnode" />
        </template>
    </a-select>
</template>

<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue';


interface Props {
    options?: SelectProps['options'];
    loading?: SelectProps['loading'];
    disabled?: boolean;
    placeholder?: string;
}

withDefaults(defineProps<Props>(), {
    options: () => [],
    loading: false,
    disabled: undefined,
    placeholder: undefined
});

const value = defineModel<SelectProps['value']>('value');
const emit = defineEmits<{
    search: [value: string];
    next: [];
}>();

const handleSearch: SelectProps['onSearch'] = (val) => {
    emit('search', val)
}
const handleChange: SelectProps['onChange'] = (val) => {
    value.value = val;
}
const handlePopupScroll: SelectProps['onPopupScroll'] = (e) => {
    if (e.target instanceof HTMLElement) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            emit('next');
        }
    }
}

</script>