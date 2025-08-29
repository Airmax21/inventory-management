<template>
    <div class="flex flex-col items-center justify-center text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Backup Data</h2>
        <p class="text-gray-600 mb-6">Buat salinan data terbaru Anda dalam format .BKP.</p>

        <a-button type="primary" size="large" @click="handleBackup" :loading="isBackingUp" class="w-full md:w-auto">
            <template #icon>
                <CloudUploadOutlined />
            </template>
            {{ isPending ? 'Memproses...' : 'Mulai Backup' }}
        </a-button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { api } from '@/services';

const handleBackup = async () => {
    message.info('Memulai proses backup...');
    mutate()
};

const { isPending, mutate } = useMutation({
    mutationFn: api.backupRestore.backup,
    onSuccess: async (response) => {
        const fileName = response.data.file;
        message.success('Backup berhasil dibuat! Unduhan akan segera dimulai.');

        try {
            const downloadResponse = await api.backupRestore.downloadBackup(fileName);

            const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

        } catch (downloadError) {
            console.error('Download failed:', downloadError);
            message.error('Gagal mengunduh file.');
        }
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})
</script>