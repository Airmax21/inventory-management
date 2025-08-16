import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { Item } from "@database/entity/item.entity";
import ItemService from "./item.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import { Master } from "@/database/entity/master.entity";


const router = Router();
const itemRepository = AppDataSource.getRepository(Item);
const masterRepository = AppDataSource.getRepository(Master);
const itemService = new ItemService(itemRepository, masterRepository);
/**
 * @swagger
 * "/item":
 *  post:
 *   summary: Register Item
 *   tags:
 *   - Item
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
 *           - itemname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             itemname:
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
    await itemService.create(dto, res)
});

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'masterName:ASC';
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    await itemService.get(startDate, endDate, page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/item":
 *  put:
 *   summary: Update Item
 *   tags:
 *   - Item
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
 *           - itemname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             itemname:
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

    await itemService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/item":
 *  delete:
 *   summary: Delete Item
 *   tags:
 *   - Item
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

    await itemService.delete(params.id, res);
})

router.delete("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await itemService.deleteMany(ids, res);
})

export default router;