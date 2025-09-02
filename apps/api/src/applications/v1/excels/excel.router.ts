import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import { Router, Response } from "express";
import ExcelService from "./excel.service";
import { AppDataSource } from "@/database/datasource";
import { Category, Item, Location, Master, Transaction } from "@/database/entity";
import MasterService from "../masters/master.service";
import LocationService from "../locations/location.service";
import CategoryService from "../categories/category.service";
import ItemService from "../items/item.service";
import TransactionService from "../transactions/transaction.service";

const router = Router()
const categoryRepository = AppDataSource.getRepository(Category);
const masterRepository = AppDataSource.getRepository(Master);
const locationRepository = AppDataSource.getRepository(Location);
const itemRepository = AppDataSource.getRepository(Item);
const transactionRepository = AppDataSource.getRepository(Transaction);

const masterService: MasterService = new MasterService(masterRepository);
const locationService: LocationService = new LocationService(locationRepository);
const categoryService: CategoryService = new CategoryService(categoryRepository);
const itemService: ItemService = new ItemService(itemRepository, masterRepository);
const transactionService: TransactionService = new TransactionService(transactionRepository, itemRepository)

const excelService = new ExcelService(masterService, locationService, categoryService, itemService, transactionService)

router.get("/master", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    excelService.master(res)
})

router.get("/items", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    excelService.item(res)
})

router.get("/transactions", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    excelService.transaction(res)
})

export default router