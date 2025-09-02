import { Response } from "express";
import ExcelJS from 'exceljs'
import { categoryColumns, itemColumns, locationColumns, masterColumns, styleHeaderForAll, transactionColumns } from "@/excels";
import MasterService from "../masters/master.service";
import LocationService from "../locations/location.service";
import CategoryService from "../categories/category.service";
import ItemService from "../items/item.service";
import TransactionService from "../transactions/transaction.service";

export default class ExcelService {
    private masterService: MasterService;
    private locationService: LocationService;
    private categoryService: CategoryService;
    private itemService: ItemService;
    private transactionService: TransactionService

    constructor(
        masterService: MasterService,
        locationService: LocationService,
        categoryService: CategoryService,
        itemService: ItemService,
        transactionService: TransactionService
    ) {
        this.masterService = masterService;
        this.locationService = locationService;
        this.categoryService = categoryService;
        this.itemService = itemService;
        this.transactionService = transactionService;
    }

    async master(res: Response) {
        try {
            const workbook = new ExcelJS.Workbook()
            const master = workbook.addWorksheet('Data Master')
            const category = workbook.addWorksheet('Data Category')
            const location = workbook.addWorksheet('Data Location')

            master.columns = masterColumns
            category.columns = categoryColumns
            location.columns = locationColumns

            styleHeaderForAll([master, category, location]);

            const masterData = await this.masterService.getAll()
            const categoryData = await this.categoryService.getAll()
            const locationData = await this.locationService.getAll()

            master.addRows(masterData)
            category.addRows(categoryData)
            location.addRows(locationData)


            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + 'data_pengguna.xlsx'
            );
            await workbook.xlsx.write(res);
            res.end()
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Export gagal" });
        }
    }

    async item(res: Response) {
        try {
            const workbook = new ExcelJS.Workbook()
            const item = workbook.addWorksheet('Data Item')

            item.columns = itemColumns

            styleHeaderForAll([item]);

            const itemData = await this.itemService.getAll()

            item.addRows(itemData)

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + 'data_pengguna.xlsx'
            );
            await workbook.xlsx.write(res);
            res.end()
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Export gagal" });
        }
    }

    async transaction(res: Response) {
        try {
            const workbook = new ExcelJS.Workbook()
            const transaction = workbook.addWorksheet('Data Transactions')

            transaction.columns = transactionColumns

            styleHeaderForAll([transaction]);

            const transactionData = await this.transactionService.getAll()

            transaction.addRows(transactionData)

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + 'data_pengguna.xlsx'
            );
            await workbook.xlsx.write(res);
            res.end()
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Export gagal" });
        }
    }
}