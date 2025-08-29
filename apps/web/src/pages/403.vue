<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Forbidden</h2>
      <p class="text-gray-600 mb-6">Maaf, Anda tidak memiliki akses ke halaman ini.</p>
      <router-link 
        to="/dashboard" 
        class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ForbiddenPage'
})
definePage({
    meta: {
        layout: 'login'
    }
})
</script>
