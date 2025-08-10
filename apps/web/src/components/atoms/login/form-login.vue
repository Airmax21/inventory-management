<template>
    <a-form :model="formState" :disabled="isPending" :rules="rules" @finish="handleLogin">
        <a-form-item name="email">
            <a-input v-model:value="formState.email" placeholder="Email" size="large" />
        </a-form-item>

        <a-form-item name="password">
            <a-input-password v-model:value="formState.password" placeholder="Password" size="large" />
        </a-form-item>

        <p v-if="!!errorMessage" class="text-red-500 text-center mb-5">{{ errorMessage }}</p>

        <a-form-item class="mt-6">
            <a-button type="primary" html-type="submit" :loading="isPending" size="large" class="w-full">
                Masuk
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { api } from '@/services';
import type { Rule } from 'ant-design-vue/es/form';
import axios from 'axios';

const appAuthStore = useAppAuthStore();
const router = useRouter();


const formState = ref({
    email: '',
    password: '',
});

const errorMessage = ref('')

const { isPending, mutate } = useMutation({
    mutationFn: api.auth.login,
    onSuccess: ({ data }) => {
        errorMessage.value = ''
        console.log(data)
        appAuthStore.setToken(data.data.token);
        router.replace('/dashboard')
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            errorMessage.value = error.response?.data.message;
        }
    },

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
};

const handleLogin = () => {
    mutate(formState.value)
};
</script>