import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { Category } from "@database/entity/category.entity";
import CategoryService from "./category.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";


const router = Router();
const categoryRepository = AppDataSource.getRepository(Category);
const categoryService = new CategoryService(categoryRepository);
/**
 * @swagger
 * "/category":
 *  post:
 *   summary: Register Category
 *   tags:
 *   - Category
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
 *           - categoryname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             categoryname:
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
    await categoryService.create(dto, res)
});

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'name:ASC';

    await categoryService.get(page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/category":
 *  put:
 *   summary: Update Category
 *   tags:
 *   - Category
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
 *           - categoryname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             categoryname:
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

    await categoryService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/category":
 *  delete:
 *   summary: Delete Category
 *   tags:
 *   - Category
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

    await categoryService.delete(params.id, res);
})

router.delete("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await categoryService.deleteMany(ids, res);
})

router.get("/export",authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    
})

export default router;