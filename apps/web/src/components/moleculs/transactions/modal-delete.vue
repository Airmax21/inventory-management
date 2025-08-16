<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Delete Transactions" ok-text="Delete"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        {{ `Apakah anda yakin menghapus ${transaction?.srcItemName} ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';
import type { ITransaction } from '@/types/transaction';

const transaction = ref<ITransaction>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.transaction.remove,
    onSuccess: () => {
        modalHandleClose();
        message.success('Delete Transaction Successful')
        void queryClient.invalidateQueries({ queryKey: ['transactions/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const modalHandleOpen = (data: ITransaction) => {
    transaction.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (transaction.value) {
        mutate(transaction.value.id)
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>