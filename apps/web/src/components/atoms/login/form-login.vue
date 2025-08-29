<template>
    <a-form :model="formState" :disabled="isPending" :rules="rules" @finish="handleLogin">
        <div class="space-y-6">
            <a-form-item name="email">
                <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <MailOutlined />
                    </span>
                    <a-input 
                        v-model:value="formState.email" 
                        placeholder="Email"
                        size="large"
                        class="pl-10 rounded-lg transition-all hover:border-blue-400 focus:border-blue-500"
                    />
                </div>
            </a-form-item>

            <a-form-item name="password">
                <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <LockOutlined />
                    </span>
                    <a-input-password 
                        v-model:value="formState.password" 
                        placeholder="Password"
                        size="large"
                        class="pl-10 rounded-lg transition-all hover:border-blue-400 focus:border-blue-500"
                    />
                </div>
            </a-form-item>

            <div class="transition-all">
                <a-alert
                    v-if="!!errorMessage"
                    :message="errorMessage"
                    type="error"
                    show-icon
                    class="mb-6"
                />
            </div>

            <a-form-item>
                <a-button 
                    type="primary" 
                    html-type="submit" 
                    :loading="isPending" 
                    size="large" 
                    class="w-full h-12 text-lg font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                    {{ isPending ? 'Logging in...' : 'Login' }}
                </a-button>
            </a-form-item>
        </div>
    </a-form>
</template>

<script setup lang="ts">
import { api } from '@/services';
import type { Rule } from 'ant-design-vue/es/form';
import axios from 'axios';
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue';

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
        appAuthStore.setToken(data.data.token);
        appAuthStore.setUser(data.data.user);
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