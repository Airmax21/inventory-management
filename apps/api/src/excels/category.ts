import { Column } from "exceljs";

export const categoryColumns: Partial<Column>[] = [
    { header: 'Name', key: 'name', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 40 },
]