import { Router, Request, Response } from "express";
import { AppDataSource } from "@database/datasource";
import { Location } from "@database/entity/location.entity";
import LocationService from "./location.service";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";


const router = Router();
const locationRepository = AppDataSource.getRepository(Location);
const locationService = new LocationService(locationRepository);
/**
 * @swagger
 * "/location":
 *  post:
 *   summary: Register Location
 *   tags:
 *   - Location
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
 *           - locationname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             locationname:
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
    await locationService.create(dto, res)
});

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'name:ASC';

    await locationService.get(page, limit, search, sortBy, res);
})

/**
 * @swagger
 * "/location":
 *  put:
 *   summary: Update Location
 *   tags:
 *   - Location
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
 *           - locationname
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             locationname:
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

    await locationService.update(params.id, dto, res);
})

/**
 * @swagger
 * "/location":
 *  delete:
 *   summary: Delete Location
 *   tags:
 *   - Location
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

    await locationService.delete(params.id, res);
})

router.delete("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const ids: any = req.query.ids;
    console.log(ids)
    await locationService.deleteMany(ids, res);
})

export default router;