<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Delete Locations" ok-text="Delete"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        {{ `Apakah anda yakin menghapus semua locations yang dipilih ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';

const ids = defineModel<string[]>('ids', { required: true });

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.location.removeMany,
    onSuccess: () => {
        modalHandleClose();
        message.success('Delete Location Successful')
        void queryClient.invalidateQueries({ queryKey: ['locations/paginate'] })
        ids.value.splice(0, ids.value.length ?? 0);

    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const modalHandleOpen = () => {
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    mutate(ids.value)
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>