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
 * "/master/register":
 *  post:
 *   summary: Register Master
 *   tags:
 *   - Master
 *   security:
 *   - bearerAuth: []
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

router.post("/",authMiddleware ,async (req: AuthenticatedRequest, res: Response) => {
    const dto = req.body;
    await masterService.create(dto, res)
});

/**
 * @swagger
 * "/master":
 *  get:
 *   summary: Get Info Master
 *   tags:
 *   - Master
 *   security:
 *   - bearerAuth: []
 *   responses:
 *     '200':
 *       description: Login berhasil.
 *     '401':
 *       description: Email atau password salah.
 */
router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const master = await masterRepository.find();
    res.json(master);
});

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
router.put("/:id",authMiddleware, async(req: AuthenticatedRequest, res: Response) => {
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
router.delete("/:id",authMiddleware,async(req: AuthenticatedRequest, res:Response) => {
    const params = req.params
    const dto = req.body

    await masterService.delete(params.id, res);
})

export default router;