<template>
    <a-card class="m-8 p-4 shadow-lg rounded-lg bg-gray-50">
        <div class="flex flex-col items-center justify-center text-center">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Restore Data</h2>

            <a-alert message="Peringatan Serius!"
                description="Proses ini akan menghapus semua data yang ada di database saat ini dan menggantinya dengan data dari file backup. Pastikan Anda sudah siap sebelum melanjutkan."
                type="error" show-icon class="!mb-6 !w-full" />

            <a-upload-dragger name="backupFile" :multiple="false" :before-upload="beforeUpload" @change="handleChange"
                class="!w-full !mb-4">
                <p class="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p class="ant-upload-text">Klik atau seret file backup (.json atau .bkp) ke area ini</p>
                <p class="ant-upload-hint">Hanya mendukung satu file backup.</p>
            </a-upload-dragger>

            <a-button type="primary" size="large" :disabled="!isReadyToRestore" :loading="isPending"
                @click="handleRestore" class="!mt-6 !w-full md:w-auto">
                <template #icon>
                    <CloudDownloadOutlined />
                </template>
                {{ isPending ? 'Memulihkan...' : 'Mulai Restore' }}
            </a-button>

            <a-alert v-if="restoreStatus.message" :message="restoreStatus.message" :type="restoreStatus.type" show-icon
                class="!mt-4 !w-full" />
        </div>
    </a-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { InboxOutlined, CloudDownloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { api } from '@/services';

const fileList = ref([]);
const restoreStatus = ref({ message: '', type: 'info' });

// Menentukan apakah tombol restore siap diaktifkan
const isReadyToRestore = computed(() => fileList.value.length > 0 && !isPending.value);

const beforeUpload = (file) => {
    const isJsonOrBkp = file.type === 'application/json' || file.name.endsWith('.bkp');
    if (!isJsonOrBkp) {
        message.error(`${file.name} bukan file JSON atau .bkp.`);
    }
    return isJsonOrBkp || false;
};

const handleChange = (info) => {
    fileList.value = info.fileList.slice(-1);
};

const handleRestore = async () => {
    if (!isReadyToRestore.value) {
        message.error('Silakan unggah file backup terlebih dahulu.');
        return;
    }
    restoreStatus.value = { message: 'Memulai proses restore...', type: 'info' };

    const formData = new FormData();
    formData.append('backupFile', fileList.value[0].originFileObj);

    mutate(formData)
};

const { isPending, mutate } = useMutation({
    mutationFn: api.backupRestore.restore,
    onSuccess: (response) => {
        restoreStatus.value = { message: 'Restore berhasil!', type: 'success' };
        message.success('Restore berhasil!');
        fileList.value = [];
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            restoreStatus.value = { message: 'Restore gagal. Silakan coba lagi.', type: 'error' };
            message.error(error.response?.data.message);
        }
    }
})
</script>