<template>
    <a-modal ref="modalRef" v-model:open="modalShow" centered :keyboard="false" title="Update Locations" ok-text="Save"
        cancel-text="Cancel" :confirm-loading="isPending" :mask-closable="!isPending" :closable="false" destroy-on-close
        @ok="modalHandleOk">
        <location-form ref="formRef" :data="location" :disabled="isPending" />
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { message } from 'ant-design-vue';
import LocationForm from '@/components/atoms/locations/form.vue';
import axios from 'axios';
import type FormCreate from '@/components/atoms/locations/form.vue';
import type { ILocation } from '@/types/location';

const location = ref<ILocation>();

const modalShow = ref<boolean>(false);
const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ILocation> }) => api.location.update(id, data),
    onSuccess: () => {
        modalHandleClose();
        message.success('Update Location Successful')
        void queryClient.invalidateQueries({ queryKey: ['locations/paginate'] })
    },
    onError: (error) => {
        if (axios.isAxiosError(error)) {
            message.error(error.response?.data.message);
        }
    }
})

const formRef = ref<InstanceType<typeof FormCreate>>();
const modalHandleOpen = (data: ILocation) => {
    location.value = data;
    modalShow.value = true;
}
const modalHandleClose = () => {
    modalShow.value = false;
}
const modalHandleOk = () => {
    if (formRef.value) {
        formRef.value.submit().then((value) => {
            if (location.value) {
                mutate({ id: location.value.id, data: value })
            }
        }).catch();
    }
}

defineExpose({ open: modalHandleOpen, close: modalHandleClose })
</script>