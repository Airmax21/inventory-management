<template>
    <a-form ref="formRef" :disabled="formDisabled" :rules="rules" :model="formState" layout="vertical" scroll-to-first-error>
        <a-form-item label="Name" name="name">
            <a-input v-model:value="formState.name" placeholder="Name" size="large" />
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import type { ICategory } from '@/types/category';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

interface FormState extends Partial<ICategory> {}

const props = defineProps<{
    data?: FormState;
    disabled?: boolean
}>();

const formRef = ref<FormInstance>();
const formDisabled = ref<boolean>(false);
const formState = reactive<FormState>({
    ...props.data
})

const rules: Record<string, Rule[]> = {
    name: [
        { required: false, message: 'Silakan masukkan nama Anda' },
    ],
};

const submit = () => {
    return new Promise<Partial<ICategory>>((resolve, reject) => {
        formDisabled.value = true;
        formRef.value?.validateFields()
            .then((value) => {
                resolve(value as Partial<ICategory>)
            })
            .catch((err: Error) => {
                reject(err)
            })
            .finally(() => {
                formDisabled.value = false;
            })
    })
}

const reset = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
}

defineExpose({ submit, reset })
</script>