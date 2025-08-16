<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Create Items" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <item-form ref="formRef" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import ItemForm from '@/components/atoms/items/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/items/form.vue';


const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.item.create,
    onSuccess: () => {
        modalHandleClose();
        if (formRef.value) {
            formRef.value.reset();
        }
        message.success('Create Item Successful')
        void queryClient.invalidateQueries({ queryKey: ['items/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = () => {
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then(mutate).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>