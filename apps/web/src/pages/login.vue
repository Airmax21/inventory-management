<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white mb-2">Inventory Management</h1>
                <div class="h-1 w-20 bg-white/30 mx-auto rounded-full"></div>
            </div>
            
            <a-card class="backdrop-blur-sm bg-white/90 rounded-xl shadow-2xl border-0">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                    <p class="text-gray-600">Masuk untuk melanjutkan ke dashboard</p>
                </div>
                
                <form-login />

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        © {{ currentYear }} Inventory Management System. All rights reserved.
                    </p>
                </div>
            </a-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormLogin } from '@/components';

const currentYear = new Date().getFullYear();

definePage({
    meta: {
        layout: 'login'
    }
})
</script>