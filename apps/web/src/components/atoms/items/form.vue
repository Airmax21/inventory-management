<template>
    <a-form ref="formRef" :disabled="formDisabled" :rules="rules" :model="formState" layout="vertical"
        scroll-to-first-error>
        <a-form-item label="Master" name="masterId">
            <master-select v-model:value="formState.masterId" placeholder="Master" />
        </a-form-item>
        <a-form-item label="Location" name="locationId">
            <location-select v-model:value="formState.locationId" placeholder="Location" />
        </a-form-item>
        <a-form-item label="Stock" name="stock">
            <a-input v-model:value="formState.stock" placeholder="Stock" type="number" size="large" />
        </a-form-item>
        <a-form-item label="Exp Date" name="expDate">
            <a-date-picker v-model:value="expDateComputed" placeholder="Exp Date" size="large" />
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import type { FormInstance } from 'ant-design-vue';
import MasterSelect from '../masters/select.vue';
import LocationSelect from '../locations/select.vue';
import type { IItem } from '@/types/item';
import type { Rule } from 'ant-design-vue/es/form';

interface FormState extends Partial<IItem> { }

const props = defineProps<{
    data?: FormState;
    disabled?: boolean
}>();

const formRef = ref<FormInstance>();
const formDisabled = ref<boolean>(false);
const formState = reactive<FormState>({
    ...props.data
})

const expDateComputed = computed({
    get: () => dayjs(formState.expDate),
    set: (newValue) => {
        formState.expDate = newValue!.toDate();
    }
});

const rules: Record<string, Rule[]> = {
    masterId: [{ required: true, message: 'Silakan pilih Master' }],
    locationId: [{ required: true, message: 'Silakan pilih Lokasi' }],
    stock: [{ required: true, message: 'Silakan masukkan jumlah stok' }],
};

const submit = () => {
    return new Promise<Partial<IItem>>((resolve, reject) => {
        formDisabled.value = true;
        formRef.value?.validateFields()
            .then((value) => {
                resolve(value as Partial<IItem>)
            })
            .catch((err: Error) => {
                reject(err)
            })
            .finally(() => {
                formDisabled.value = false;
            })
    })
}

const reset = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
}

defineExpose({ submit, reset })
</script>