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
                    class="!flex !items-center !justify-center button-delete-many" @click="handleItemDeleteMany">
                    <icon-ri-delete-bin-6-line />
                </a-button>

                <a-button type="primary" class="!flex !items-center !justify-center button-add"
                    @click="handleItemCreate">
                    <icon-ri-add-line />
                </a-button>
            </div>
        </div>

        <a-table :row-key="(item) => item.id" :loading="isFetching" :data-source="data.data" :columns="columns"
            :pagination="{
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
                <template v-if="column.key === 'action'">
                    <div class="flex gap-2 items-center justify-center">
                        <!-- <a-button
              shape="circle"
              class="flex items-center justify-center button-sync"
              @click="handleMaterialSync(record as Material)"
            >
              <icon-mdi-sync />
            </a-button> -->

                        <a-tooltip>
                            <!-- <template v-if="!(record as Material).canUpdate" #title>
                                {{
                                    t('material.action.update.disabled', {
                                        count: (record as Material).ticketsCloseCount,
                                })
                                }}
                            </template> -->
                            <a-button shape="round" class="button-edit" @click="handleItemUpdate(record as IItem)">
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
                                @click="handleItemDelete(record as IItem)">
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
    </div>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { keepPreviousData } from '@tanstack/vue-query';
import type { TableProps } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { isArray, isNumber } from 'lodash';
import formModalCreate from '@/components/moleculs/items/modal-create.vue';
import formModalUpdate from '@/components/moleculs/items/modal-update.vue';
import formModalDelete from '@/components/moleculs/items/modal-delete.vue';
import formModalDeleteMany from '@/components/moleculs/items/modal-delete-many.vue';
import type { IItem } from '@/types/item';

const modalCreateRef = ref<InstanceType<typeof formModalCreate>>();
const modalUpdateRef = ref<InstanceType<typeof formModalUpdate>>();
const modalDeleteRef = ref<InstanceType<typeof formModalDelete>>();
const modalDeleteManyRef = ref<InstanceType<typeof formModalDeleteMany>>();

const page = useRouteQuery<number>('page', 1, { transform: Number });
const limit = useRouteQuery<number>('limit', 10, { transform: Number });
const search = useRouteQuery<string>('search', '');
const sortBy = useRouteQuery<string>('sortBy', 'masterName:ASC');
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
    queryKey: ['items/paginate', queryParams],
    queryFn: async () => {
        const { data } = await api.item.paginate(queryParams.value)

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
        title: 'Master',
        key: 'masterName',
        sorter: true,
        sortOrder: getSortOrder('masterName', sortBy.value),
        dataIndex: 'masterName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Location',
        key: 'locationName',
        sorter: true,
        sortOrder: getSortOrder('locationName', sortBy.value),
        dataIndex: 'locationName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Stock',
        key: 'stock',
        sorter: true,
        sortOrder: getSortOrder('stock', sortBy.value),
        dataIndex: 'stock',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Expired Date',
        key: 'expDate',
        sorter: true,
        sortOrder: getSortOrder('expDate', sortBy.value),
        dataIndex: 'expDate',
        width: 200,
        customRender: ({ record }) => {
            return dayjs(record.expDate).format('YYYY-MM-DD HH:mm:ss');
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
        width: 120,
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

const handleItemCreate = () => {
    modalCreateRef.value?.open();
}
const handleItemUpdate = (item: IItem) => {
    modalUpdateRef.value?.open(item);
};
const handleItemDelete = (item: IItem) => {
    modalDeleteRef.value?.open(item);
};
const handleItemDeleteMany = () => {
    modalDeleteManyRef.value?.open();
};

const appPageStore = useAppPageStore();
appPageStore.setPage(['3'])
</script>