<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Masters" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <master-form ref="formRef" :data="master" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import MasterForm from '@/components/atoms/masters/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/masters/form.vue';
import type { IMaster } from '@/types/master';

const master = ref<IMaster>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IMaster> }) => api.master.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update Master Successful')
        void queryClient.invalidateQueries({ queryKey: ['masters/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: IMaster) => {
    master.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (master.value) {
                mutate({ id: master.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>