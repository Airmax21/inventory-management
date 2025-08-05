<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Delete Users" ok-text="Delete"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        {{ `Apakah anda yakin menghapus ${user?.username} ?` }}
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import axios from 'axios';
import type { IUser } from '@/types/auth';

const user = ref<IUser>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.user.remove,
    onSuccess: () => {
        modalHandleClose();
        message.success('Delete User Successful')
        void queryClient.invalidateQueries({ queryKey: ['users/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const modalHandleOpen = (data: IUser) => {
    user.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (user.value) {
        mutate(user.value.id)
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>