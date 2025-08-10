<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Create Categories" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <category-form ref="formRef" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import CategoryForm from '@/components/atoms/categories/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/categories/form.vue';


const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: api.category.create,
    onSuccess: () => {
        modalHandleClose();
        if (formRef.value) {
            formRef.value.reset();
        }
        message.success('Create Category Successful')
        void queryClient.invalidateQueries({ queryKey: ['categories/paginate'] })
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