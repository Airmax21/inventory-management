<template>
    <a-form ref="formRef" :disabled="formDisabled" :rules="rules" :model="formState" layout="vertical"
        scroll-to-first-error>
        <a-form-item label="Item" name="srcItemId">
            <item-select v-model:value="formState.srcItemId" placeholder="Item" />
        </a-form-item>
        <a-form-item label="Location" name="dstLocationId">
            <location-select v-model:value="formState.dstLocationId" placeholder="Location" />
        </a-form-item>
        <a-form-item label="Quantity" name="qty">
            <a-input v-model:value="formState.qty" placeholder="Stock" type="number" size="large" />
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import ItemSelect from '../items/select.vue';
import LocationSelect from '../locations/select.vue';
import type { ITransaction } from '@/types/transaction';
import type { Rule } from 'ant-design-vue/es/form';

interface FormState extends Partial<ITransaction> { }

const props = defineProps<{
    data?: FormState;
    disabled?: boolean
}>();

const formRef = ref<FormInstance>();
const formDisabled = ref<boolean>(false);
const formState = reactive<FormState>({
    ...props.data
})

const rules: Record<string, Rule[]> = {
    srcItemId: [{ required: true, message: 'Silakan pilih Item' }],
    dstLocationId: [{ required: true, message: 'Silakan pilih Lokasi' }],
    qty: [{ required: true, message: 'Silakan masukkan jumlah item' }],
};

const submit = () => {
    return new Promise<Partial<ITransaction>>((resolve, reject) => {
        formDisabled.value = true;
        formRef.value?.validateFields()
            .then((value) => {
                resolve(value as Partial<ITransaction>)
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