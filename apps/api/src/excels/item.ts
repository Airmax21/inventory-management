import { Column } from "exceljs";

export const itemColumns: Partial<Column>[] = [
    { header: 'Master', key: 'masterName', width: 40 },
    { header: 'Location', key: 'locationName', width: 40 },
    { header: 'Stock', key: 'stock', width: 40 },
    { header: 'Expired Date', key: 'expDate', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 40 },
]