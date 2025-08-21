<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Transactions" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <transaction-form ref="formRef" :data="transaction" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import TransactionForm from '@/components/atoms/transactions/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/transactions/form.vue';
import type { ITransaction } from '@/types/transactions';

const transaction = ref<ITransaction>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ITransaction> }) => api.transaction.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update Transaction Successful')
        void queryClient.invalidateQueries({ queryKey: ['transactions/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: ITransaction) => {
    transaction.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (transaction.value) {
                mutate({ id: transaction.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>