import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { Master } from "@database/entity/master.entity";
import MasterService from "./master.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";


const router = Router();
const masterRepository = AppDataSource.getRepository(Master);
const masterService = new MasterService(masterRepository);
/**
 * @swagger
 * "/master":
 *  post:
 *   summary: Register Master
 *   tags:
 *   - Master
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
 *           - mastername
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             mastername:
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
    await masterService.create(dto, res)
});

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'name:ASC';

    await masterService.get(page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/master":
 *  put:
 *   summary: Update Master
 *   tags:
 *   - Master
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
 *           - mastername
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             mastername:
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

    await masterService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/master":
 *  delete:
 *   summary: Delete Master
 *   tags:
 *   - Master
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

    await masterService.delete(params.id, res);
})

router.delete("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await masterService.deleteMany(ids, res);
})

export default router;