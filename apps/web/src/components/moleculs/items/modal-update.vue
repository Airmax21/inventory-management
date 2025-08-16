<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Items" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <item-form ref="formRef" :data="item" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import ItemForm from '@/components/atoms/items/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/items/form.vue';
import type { IItem } from '@/types/item';

const item = ref<IItem>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IItem> }) => api.item.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update Item Successful')
        void queryClient.invalidateQueries({ queryKey: ['items/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: IItem) => {
    item.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (item.value) {
                mutate({ id: item.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>