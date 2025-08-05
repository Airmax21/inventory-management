<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Users" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <user-form ref="formRef" :data="user" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import UserForm from '@/components/atoms/users/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/users/form.vue';
import type { IUser } from '@/types/auth';

const user = ref<IUser>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IUser> }) => api.user.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update User Successful')
        void queryClient.invalidateQueries({ queryKey: ['users/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: IUser) => {
    user.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (user.value) {
                mutate({ id: user.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>