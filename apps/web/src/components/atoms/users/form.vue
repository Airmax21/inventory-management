<template>
    <a-form ref="formRef" :disabled="formDisabled" :rules="rules" :model="formState" layout="vertical" scroll-to-first-error>
        <a-form-item label="Email" name="email">
            <a-input v-model:value="formState.email" v-focus placeholder="Email" size="large" />
        </a-form-item>

        <a-form-item label="Password" name="password">
            <a-input-password v-model:value="formState.password" v-focus placeholder="Password" size="large" />
        </a-form-item>

        <a-form-item label="Username" name="username">
            <a-input v-model:value="formState.username" placeholder="Username" size="large" />
        </a-form-item>

        <a-form-item label="Name" name="name">
            <a-input v-model:value="formState.name" placeholder="Name" size="large" />
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import type { IUser } from '@/types/auth';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

interface FormState extends Partial<IUser> {}

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
    email: [
        { required: true, message: 'Silakan masukkan email Anda' },
        { type: 'email', message: 'Format email tidak valid' },
    ],
    password: [
        { required: true, message: 'Silakan masukkan password Anda' },
        { min: 8, message: 'Minimal 8 karakter' }
    ],
    username: [
        { required: true, message: 'Silakan masukkan username Anda' },
    ],
    name: [
        { required: false, message: 'Silakan masukkan nama Anda' },
    ],
};

const submit = () => {
    return new Promise<Partial<IUser>>((resolve, reject) => {
        formDisabled.value = true;
        formRef.value?.validateFields()
            .then((value) => {
                resolve(value as Partial<IUser>)
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