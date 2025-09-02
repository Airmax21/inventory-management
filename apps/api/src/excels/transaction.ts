import { Column } from "exceljs";

export const transactionColumns: Partial<Column>[] = [
    { header: 'Item', key: 'srcItemName', width: 40 },
    { header: 'Source Location', key: 'srcItemLocation', width: 40 },
    { header: 'Destination Location', key: 'dstLocationName', width: 40 },
    { header: 'Quantity', key: 'qty', width: 40 },
    { header: 'Status', key: 'status', width: 40 },
    { header: 'Approve At', key: 'approveAt', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 40 },
]