import { Column } from "exceljs";

export const masterColumns: Partial<Column>[] = [
    { header: 'Name', key: 'name', width: 40 },
    { header: 'Category', key: 'categoryName', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 40 },
]