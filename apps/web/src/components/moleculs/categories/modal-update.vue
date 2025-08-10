<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Categories" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <category-form ref="formRef" :data="category" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import CategoryForm from '@/components/atoms/categories/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/categories/form.vue';
import type { ICategory } from '@/types/category';

const category = ref<ICategory>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICategory> }) => api.category.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update Category Successful')
        void queryClient.invalidateQueries({ queryKey: ['categories/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: ICategory) => {
    category.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (category.value) {
                mutate({ id: category.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>