<template>
    <a-layout style="min-height: 100vh;" hasSider>
        <Navbar />
        <a-layout style="height: 100vh; overflow: hidden;">
            <a-layout-header style="background: #fff; padding: 0;">
                <div class="flex items-center justify-center h-full">
                    <p class="text-2xl text-center font-bold">
                        Manajemen Inventory
                    </p>
                </div>
            </a-layout-header>

            <a-layout-content style="" class="my-5 overflow-auto">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { Navbar } from '@/components/atoms';

</script>