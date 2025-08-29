<template>
    <a-typography-title :level="3">Overview</a-typography-title>
    <a-flex :gap="50">
        <a-card style="width: 100%;background-color: #e7edf4;">
            <a-flex vertical :gap="10" justify="center">
                <p class="text-base text-base font-medium text-[#0d141c]">Total Items</p>
                <a-typography-title :level="3">{{ total.itemTotal }}</a-typography-title>
            </a-flex>
        </a-card>
        <a-card style="width: 100%;background-color: #e7edf4;">
            <a-flex vertical :gap="10" justify="center">
                <p class="text-base text-base font-medium text-[#0d141c]">Total Transactions</p>
                <a-typography-title :level="3">{{ total.transactionTotal }}</a-typography-title>
            </a-flex>
        </a-card>
    </a-flex>
    <br>
    <a-typography-title :level="3">Expiring Soon</a-typography-title>
    <a-table :row-key="(item) => item.id" :loading="itemsFething" :data-source="itemsData.data" :columns="itemColumns"
        :scroll="{
            scrollToFirstRowOnChange: true,
            x: '100%'
        }" :pagination="false">

    </a-table>
    <br>
    <a-typography-title :level="3">Recent Transactions</a-typography-title>
    <a-table :row-key="(transaction) => transaction.id" :loading="isFetching" :data-source="data.data"
        :columns="columns" :scroll="{
            scrollToFirstRowOnChange: true,
            x: '100%'
        }" :pagination="false">

    </a-table>
</template>

<script setup lang="ts">
import { api } from '@/services';
import { keepPreviousData } from '@tanstack/vue-query';
import type { TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';

const { data, isFetching } = useQuery({
    queryKey: ['transactions/paginate'],
    queryFn: async () => {
        const { data } = await api.transaction.paginate({
            limit: 10,
            page: 1,
            sortBy: 'createdAt:DESC'
        })

        return data
    },
    placeholderData: keepPreviousData,
    initialData: {
        data: [],
        meta: {
            itemsPerPage: 10,
            totalItems: 0,
            currentPage: 1,
            totalPages: 0,
        },
    }
})

const { data: itemsData, isFetching: itemsFething } = useQuery({
    queryKey: ['items/paginate'],
    queryFn: async () => {
        const { data } = await api.item.paginate({
            limit: 10,
            page: 1,
            sortBy: 'expDate:ASC'
        })

        return data;
    },
    placeholderData: keepPreviousData,
    initialData: {
        data: [],
        meta: {
            itemsPerPage: 10,
            totalItems: 0,
            currentPage: 1,
            totalPages: 0,
        },
    }
})

const { data: total } = useQuery({
    queryKey: ['dashboard/totals'],
    queryFn: async () => {
        const { data: itemTotal } = await api.item.getTotal();
        const { data: transactionTotal } = await api.transaction.getTotal();
        return {
            itemTotal,
            transactionTotal
        }
    },
    placeholderData: keepPreviousData,
    initialData: {
        itemTotal: 0,
        transactionTotal: 0
    }
})


const columns = computed<TableProps['columns']>(() => [
    {
        title: 'Created At',
        key: 'createdAt',
        width: 200,
        customRender: ({ record }) => {
            return dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    {
        title: 'Item',
        key: 'srcItemName',
        dataIndex: 'srcItemName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Source Item',
        key: 'srcItemLocation',
        dataIndex: 'srcItemLocation',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Destination Location',
        key: 'dstLocationName',
        dataIndex: 'dstLocationName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Quantity',
        key: 'qty',
        dataIndex: 'qty',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        width: 100,
    },
    {
        title: 'Approve At',
        key: 'approveAt',
        dataIndex: 'approveAt',
        width: 200,
        customRender: ({ record }) => {
            return record.approveAt ? dayjs(record.approveAt).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
    },
])

const itemColumns = computed<TableProps['columns']>(() => [
    {
        title: 'Expired Date',
        key: 'expDate',
        dataIndex: 'expDate',
        width: 200,
        customRender: ({ record }) => {
            return dayjs(record.expDate).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    {
        title: 'Master',
        key: 'masterName',
        dataIndex: 'masterName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Location',
        key: 'locationName',
        dataIndex: 'locationName',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Stock',
        key: 'stock',
        dataIndex: 'stock',
        width: 200,
        ellipsis: true,
    },
    {
        title: 'Created At',
        key: 'createdAt',
        width: 200,
        customRender: ({ record }) => {
            return dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss');
        },
    }
])
</script>