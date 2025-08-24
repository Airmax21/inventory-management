import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { Transaction } from "@database/entity/transaction.entity";
import TransactionService from "./transaction.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import { Master } from "@/database/entity/master.entity";
import dayjs from 'dayjs';
import { Item } from "@/database/entity/item.entity";


const router = Router();
const transactionRepository = AppDataSource.getRepository(Transaction);
const itemRepository = AppDataSource.getRepository(Item);
const transactionService = new TransactionService(transactionRepository, itemRepository);
/**
 * @swagger
 * "/transaction":
 *  post:
 *   summary: Register Transaction
 *   tags:
 *   - Transaction
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *           - email
 *           - password
 *           - name
 *           - approvalname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             transactionname:
 *               type: string
 *               default: test
 *             name:
 *               type: string
 *               default: test
 *   responses:
 *     '200':
 *       description: Register berhasil.
 *     '401':
 *       description: Email atau password salah.
 */

router.post("/", async (req: Request, res: Response) => {
    const dto = req.body;
    await transactionService.create(dto, res)
});

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'srcItemName:ASC';
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    await transactionService.get(startDate, endDate, page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/transaction":
 *  put:
 *   summary: Update Transaction
 *   tags:
 *   - Transaction
 *   security:
 *   - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description: ID unik pengguna
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *           - email
 *           - password
 *           - name
 *           - transactionname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             transactionname:
 *               type: string
 *               default: test
 *             name:
 *               type: string
 *               default: test
 *   responses:
 *     '200':
 *       description: Login berhasil.
 *     '401':
 *       description: Email atau password salah.
 */
router.put("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const params = req.params
    const dto = req.body

    await transactionService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/transaction":
 *  delete:
 *   summary: Delete Transaction
 *   tags:
 *   - Transaction
 *   security:
 *   - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *      description: ID unik pengguna
 *   responses:
 *     '200':
 *       description: Login berhasil.
 *     '401':
 *       description: Email atau password salah.
 */
router.delete("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const params = req.params
    const dto = req.body

    await transactionService.delete(params.id, res);
})

router.delete("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await transactionService.deleteMany(ids, res);
})

router.patch("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const params = req.params
    const dto = req.body

    await transactionService.transactions(params.id,dto.status,res);
})
export default router;