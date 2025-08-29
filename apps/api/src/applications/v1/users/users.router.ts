import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { User } from "@database/entity/user.entity";
import UserService from "./user.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import adminMiddleware from "@/middleware/admin";


const router = Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
/**
 * @swagger
 * "/user/register":
 *  post:
 *   summary: Register User
 *   tags:
 *   - User
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
 *           - username
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             username:
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

router.post("/register", async (req: Request, res: Response) => {
    const dto = req.body;
    await userService.register(dto, res)
});

/**
 * @swagger
 * "/user/login":
 *  post:
 *   summary: Login User
 *   tags:
 *   - User
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *           - email
 *           - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *   responses:
 *     '200':
 *       description: Login berhasil.
 *     '401':
 *       description: Email atau password salah.
 */

router.post("/login", async (req: Request, res: Response) => {
    const dto = req.body;
    await userService.login(dto, res);
});

/**
 * @swagger
 * "/user/me":
 *  get:
 *   summary: Get Info User
 *   tags:
 *   - User
 *   security:
 *   - bearerAuth: []
 *   responses:
 *     '200':
 *       description: Login berhasil.
 *     '401':
 *       description: Email atau password salah.
 */
router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const user = await userRepository.findOneBy({ email: req.user?.email });
    res.json(user);
});

router.get("/", authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'name:ASC';

    await userService.get(page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/user":
 *  put:
 *   summary: Update User
 *   tags:
 *   - User
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
 *           - username
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             username:
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
router.put("/:id", authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const params = req.params
    const dto = req.body

    await userService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/user":
 *  delete:
 *   summary: Delete User
 *   tags:
 *   - User
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
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const params = req.params
    const dto = req.body

    await userService.delete(params.id, res);
})

router.delete("/", authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await userService.deleteMany(ids, res);
})

export default router;