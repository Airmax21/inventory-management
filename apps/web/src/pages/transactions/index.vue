<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-end gap-4">
            <div class="flex">
                <a-range-picker v-model:value="dateRange" size="large" />
            </div>
            <div class="flex">
                <a-input v-model:value="search" placeholder="Search" allow-clear>
                    <template #prefix>
                        <icon-ri-search-line />
                    </template>
                </a-input>
            </div>
            <div class="flex gap-4">
                <a-button :disabled="selectedRowKeys.length < 1" type="primary" danger
                    class="!flex !items-center !justify-center button-delete-many" @click="handleTransactionDeleteMany">
                    <icon-ri-delete-bin-6-line />
                </a-button>

                <a-button type="primary" class="!flex !items-center !justify-center button-add"
                    @click="handleTransactionCreate">
                    <icon-ri-add-line />
                </a-button>
            </div>
        </div>

        <a-table :row-key="(transaction) => transaction.id" :loading="isFetching" :data-source="data.data"
            :columns="columns" :pagination="{
                total: data.meta.totalItems,
                current: data.meta.currentPage,
                pageSize: data.meta.itemsPerPage,
                showSizeChanger: true,
                responsive: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} entries`
            }" :scroll="{
                scrollToFirstRowOnChange: true,
                x: '100%'
            }" :row-selection="{
                selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (keys) => {
                    if (selectedRowKeys) {
                        selectedRowKeys.splice(
                            0,
                            selectedRowKeys.length ?? 0,
                            ...(keys as string[]),
                        );
                    }
                }
            }" @change="handleChange">
            <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'status'">
                    <div class="flex justify-center">
                        <a-tooltip v-if="record.status == 'approve'" title="Approve">
                            <icon-ri-checkbox-circle-fill style="color: green;" />
                        </a-tooltip>
                        <a-tooltip v-else-if="record.status == 'reject'" title="Reject">
                            <icon-ri-close-circle-fill style="color: red;" />
                        </a-tooltip>
                        <a-tooltip v-else title="Undefined">
                            <icon-ri-question-fill style="color: gray;" />
                        </a-tooltip>
                    </div>
                </template>
                <template v-if="column.key === 'action'">
                    <div class="flex gap-2 items-center justify-center">
                        <!-- <a-button
              shape="circle"
              class="flex transactions-center justify-center button-sync"
              @click="handleMaterialSync(record as Material)"
            >
              <icon-mdi-sync />
            </a-button> -->

                        <a-tooltip title="Approve">
                            <a-button shape="round" @click="handleApproveTransaction(record as ITransaction)">
                                <div class="flex items-center justify-center">
                                    <icon-ri-checkbox-circle-line />
                                </div>
                            </a-button>
                        </a-tooltip>

                        <a-tooltip>
                            <!-- <template v-if="!(record as Material).canUpdate" #title>
                                {{
                                    t('material.action.update.disabled', {
                                        count: (record as Material).ticketsCloseCount,
                                })
                                }}
                            </template> -->
                            <a-button shape="round" class="button-edit"
                                @click="handleTransactionUpdate(record as ITransaction)">
                                <div class="flex items-center justify-center">
                                    <icon-ri-pencil-line />
                                </div>
                            </a-button>
                        </a-tooltip>

                        <a-tooltip>
                            <!-- <template v-if="!(record as Material).canDelete" #title>
                                {{
                                    t('material.action.delete.disabled', {
                                        count: (record as Material).ticketsCount,
                                })
                                }}
                            </template> -->
                            <a-button danger shape="round" class="button-delete"
                                @click="handleTransactionDelete(record as ITransaction)">
                                <div class="flex items-center justify-center">
                                    <icon-ri-delete-bin-6-line />
                                </div>
                            </a-button>
                        </a-tooltip>
                    </div>
                </template>
            </template>
        </a-table>

        <form-modal-create ref="modalCreateRef" />
        <form-modal-update ref="modalUpdateRef" />
        <form-modal-delete ref="modalDeleteRef" />
        <form-modal-delete-many v-model:ids="selectedRowKeys" ref="modalDeleteManyRef" />
        <form-modal-approve ref="modalApproveRef" />
    </div>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { keepPreviousData } from '@tanstack/vue-query';
import type { TableProps } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { isArray, isNumber } from 'lodash';
import formModalCreate from '@/components/moleculs/transactions/modal-create.vue';
import formModalUpdate from '@/components/moleculs/transactions/modal-update.vue';
import formModalDelete from '@/components/moleculs/transactions/modal-delete.vue';
import formModalDeleteMany from '@/components/moleculs/transactions/modal-delete-many.vue';
import formModalApprove from '@/components/moleculs/transactions/modal-approve.vue';
import type { ITransaction } from '@/types/transaction';

const modalCreateRef = ref<InstanceType<typeof formModalCreate>>();
const modalUpdateRef = ref<InstanceType<typeof formModalUpdate>>();
const modalDeleteRef = ref<InstanceType<typeof formModalDelete>>();
const modalDeleteManyRef = ref<InstanceType<typeof formModalDeleteMany>>();
const modalApproveRef = ref<InstanceType<typeof formModalApprove>>();

const page = useRouteQuery<number>('page', 1, { transform: Number });
const limit = useRouteQuery<number>('limit', 10, { transform: Number });
const search = useRouteQuery<string>('search', '');
const sortBy = useRouteQuery<string>('sortBy', 'srcItemName:ASC');
const searchDebounced = refDebounced(search, 500);
const dateRange = ref<[Dayjs, Dayjs]>();

watch(searchDebounced, () => {
    page.value = 1;
});

watch(dateRange, () => {
    page.value = 1;
});

const queryParams = computed(() => {
    const params: Record<string, any> = {
        page: page.value,
        limit: limit.value,
        search: searchDebounced.value,
        sortBy: sortBy.value,
    };

    if (dateRange.value && dateRange.value.length === 2) {
        params.startDate = dateRange.value[0].startOf('day').toISOString();
        params.endDate = dateRange.value[1].endOf('day').toISOString();
    }

    return params;
});

const { data, isFetching } = useQuery({
    queryKey: ['transactions/paginate', queryParams],
    queryFn: async () => {
        const { data } = await api.transaction.paginate(queryParams.value)

        return data;
    },
    placeholderData: keepPreviousData,
    initialData: {
        data: [],
        meta: {
            itemsPerPage: queryParams.value.limit,
            totalItems: 0,
            currentPage: queryParams.value.page,
            totalPages: 0,
        },
    }
})

function getSortOrder(key: string, value: string) {
    const sort = value.split(':');
    if (sort.length === 2) {
        if (key === sort[0]) {
            if (sort[1] === 'ASC') return 'ascend';

            return 'descend';
        }
    }

    return null;
}

const selectedRowKeys = ref<string[]>([]);
const columns = computed<TableProps['columns']>(() => [
    {
        title: 'Item',
        key: 'srcItemName',
        sorter: true,
        sortOrder: getSortOrder('srcItemName', sortBy.value),
        dataIndex: 'srcItemName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Source Item',
        key: 'srcItemLocation',
        sorter: true,
        sortOrder: getSortOrder('srcItemLocation', sortBy.value),
        dataIndex: 'srcItemLocation',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Destination Location',
        key: 'dstLocationName',
        sorter: true,
        sortOrder: getSortOrder('dstLocationName', sortBy.value),
        dataIndex: 'dstLocationName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Quantity',
        key: 'qty',
        sorter: true,
        sortOrder: getSortOrder('qty', sortBy.value),
        dataIndex: 'qty',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Status',
        key: 'status',
        sorter: true,
        sortOrder: getSortOrder('status', sortBy.value),
        dataIndex: 'status',
        width: 100,
    },
    {
        title: 'Approve At',
        key: 'approveAt',
        sorter: true,
        sortOrder: getSortOrder('approveAt', sortBy.value),
        dataIndex: 'approveAt',
        width: 200,
        customRender: ({ record }) => {
            return record.approveAt ? dayjs(record.approveAt).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
    },
    {
        title: 'Created At',
        key: 'createdAt',
        sorter: true,
        sortOrder: getSortOrder('createdAt', sortBy.value),
        width: 200,
        customRender: ({ record }) => {
            return dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: 200,
        fixed: 'right',
    },
])

const handleChange: TableProps['onChange'] = (
    { current, pageSize },
    _filters,
    sorter,
) => {
    if (isNumber(current)) {
        page.value = current;
    }

    if (isNumber(pageSize)) {
        limit.value = pageSize;
    }

    if (!isArray(sorter)) {
        if (sorter.order && ['ascend', 'descend'].includes(sorter.order)) {
            sortBy.value = [
                sorter.columnKey,
                sorter.order === 'ascend' ? 'ASC' : 'DESC',
            ].join(':');
        } else {
            sortBy.value = '';
        }
    }
};

const handleTransactionCreate = () => {
    modalCreateRef.value?.open();
}
const handleTransactionUpdate = (transaction: ITransaction) => {
    modalUpdateRef.value?.open(transaction);
};
const handleTransactionDelete = (transaction: ITransaction) => {
    modalDeleteRef.value?.open(transaction);
};
const handleTransactionDeleteMany = () => {
    modalDeleteManyRef.value?.open();
};

const handleApproveTransaction = (transaction: ITransaction) => {
    modalApproveRef.value?.open(transaction)
}

const appPageStore = useAppPageStore();
appPageStore.setPage(['4'])
</script>