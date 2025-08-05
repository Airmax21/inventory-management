<template>
    <a-card class="w-full max-w-md rounded-lg shadow-lg">
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-700">Login</h2>
            <p class="text-gray-500">Masuk untuk melanjutkan ke dashboard.</p>
        </div>
        
        <form-login />
    </a-card>
</template>

<script setup lang="ts">
import { FormLogin } from '@/components';

definePage({
    meta: {
        layout: 'login'
    }
})
</script>