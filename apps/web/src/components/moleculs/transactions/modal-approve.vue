<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Approve Transactions"
        ok-text="Approve" cancel-text="Decline" :cancel-button-props="{ danger: true, type: 'primary' }"
        :confirm-loading="isPending" :mask-closable="!isPending" :closable="true" destroy-on-close @ok="modalHandleOk"
        @cancel="modalHandleDecline">
        {{ `Apakah anda yakin mensetujui ${transaction?.srcItemName} - ${transaction?.dstLocationName} ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { type ITransaction } from '@/types/transaction';

enum StatusEnum {
    APPROVE = 'approve',
    REJECT = 'reject'
}

const transaction = ref<ITransaction>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Pick<ITransaction, 'status'> }) => api.transaction.approve(id, data),
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
        mutate({
            id: transaction.value.id,
            data: {
                status: StatusEnum.APPROVE
            }
        })
    }
}

const modalHandleDecline = () => {
    if (transaction.value) {
        mutate({
            id: transaction.value.id,
            data: {
                status: StatusEnum.REJECT
            }
        })
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>