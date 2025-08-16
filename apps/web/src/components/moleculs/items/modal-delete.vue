<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Delete Items" ok-text="Delete"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        {{ `Apakah anda yakin menghapus ${item?.masterName} ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';
import type { IItem } from '@/types/item';

const item = ref<IItem>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.item.remove,
    onSuccess: () => {
        modalHandleClose();
        message.success('Delete Item Successful')
        void queryClient.invalidateQueries({ queryKey: ['items/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const modalHandleOpen = (data: IItem) => {
    item.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (item.value) {
        mutate(item.value.id)
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>