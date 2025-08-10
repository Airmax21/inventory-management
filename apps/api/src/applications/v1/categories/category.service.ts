import { Router, Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from "typeorm";
import { Category } from "@/database/entity/category.entity";

export default class CategoryService {
    private readonly categoryRepository: Repository<Category>;

    constructor(
        categoryRepository: Repository<Category>
    ) {
        this.categoryRepository = categoryRepository
    }


    async create(dto: any, res: Response) {
        try {

            const existingCategory = await this.categoryRepository.findOneBy({ name: dto.name });
            if (existingCategory) {
                return res.status(409).json({ message: "Nama sudah terdaftar" });
            }


            const category = this.categoryRepository.create(dto);
            await this.categoryRepository.save(category);


            res.status(201).json({ message: "Registrasi berhasil", category: category });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Registrasi gagal" });
        }
    }

    async me(res: Response) {

    }

    async get(page: number, limit: number, search: string, sortBy: string, res: Response) {
        const skip = (page - 1) * limit;

        const findOptions: {
            where?: FindOptionsWhere<Category>[];
            order?: FindOptionsOrder<Category>;
        } = {};

        if (search) {
            findOptions.where = [
                { name: Like(`%${search}%`) },
            ];
        }

        const [sortColumn, sortOrder] = sortBy.split(':');
        if (sortColumn && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
            findOptions.order = { [sortColumn]: sortOrder };
        }

        try {
            const [categories, totalItems] = await this.categoryRepository.findAndCount({
                ...findOptions,
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                data: categories,
                meta: {
                    totalItems: totalItems,
                    currentPage: page,
                    itemsPerPage: limit,
                    totalPages: totalPages,
                },
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal mengambil data.' });
        }
    }

    async update(id: string, dto: Partial<Category>, res: Response) {
        try {
            let category = await this.categoryRepository.findOneBy({ id });

            if (!category) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan." });
            }

            Object.assign(category, dto);
            const result = await this.categoryRepository.save(category)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const category = await this.categoryRepository.findOneBy({ id })
            if (category) {
                await this.categoryRepository.softRemove(category)
                return res.status(200).json({ message: 'Delete category Successful' })
            }

            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }

    async deleteMany(dto: string[], res: Response) {
        try {
            if (!dto || (Array.isArray(dto) && dto.length === 0)) {
                return res.status(400).json({ message: "An array of ID is required." });
            }
            const idArray = Array.isArray(dto) ? dto : String(dto).split(',');
            const stringIds = idArray.filter(id => id.trim() !== '');
            const items = await this.categoryRepository.findBy({ id: In(stringIds) });
            await this.categoryRepository.softRemove(items)

            res.status(200).json({ message: `${items.length} categories successfully removed.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }
} 