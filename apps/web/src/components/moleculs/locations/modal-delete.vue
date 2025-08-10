<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Delete Locations" ok-text="Delete"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        {{ `Apakah anda yakin menghapus ${location?.name} ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';
import type { ILocation } from '@/types/location';

const location = ref<ILocation>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.location.remove,
    onSuccess: () => {
        modalHandleClose();
        message.success('Delete Location Successful')
        void queryClient.invalidateQueries({ queryKey: ['locations/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const modalHandleOpen = (data: ILocation) => {
    location.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (location.value) {
        mutate(location.value.id)
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>