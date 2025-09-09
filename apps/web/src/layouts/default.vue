<template>
    <a-layout style="min-height: 100vh;" hasSider>
        <Navbar />
        <a-layout style="height: 100vh; overflow: hidden;">
            <a-layout-header style="background: #fff; padding: 0;">
                <div class="flex items-center justify-between h-full px-6">
                    <p class="text-2xl font-bold">
                        MAGIS
                    </p>
                    <div class="flex items-center">
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor-pointer flex items-center">
                                <a-avatar class="bg-blue-500">
                                    {{ userInitials }}
                                </a-avatar>
                                <span class="ml-2 text-gray-700">{{ authStore.user.username }}</span>
                            </a>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="handleLogout">
                                        <LogoutOutlined />
                                        <span class="ml-2">Logout</span>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </div>
            </a-layout-header>

            <a-layout-content style="" class="overflow-auto">
                <div class="m-7">
                    <a-card>
                        <router-view />
                    </a-card>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { Navbar } from '@/components';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useAppAuthStore } from '@/stores/app-auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const authStore = useAppAuthStore();

console.log(authStore.user)

const userInitials = computed(() => {
    const username = authStore.user.username || '';
    return username
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
});

const handleLogout = () => {    
    authStore.setToken({
        token: '',
        expiresAt: ''
    });
    authStore.setUser({
        email: '',
        username: '',
        role: undefined
    });
        
    router.push('/login');
};
</script>