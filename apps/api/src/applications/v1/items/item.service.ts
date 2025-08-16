import { Router, Request, Response } from "express";
import { Between, FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from "typeorm";
import dayjs from 'dayjs';
import { Item } from "@/database/entity/item.entity";
import { Master } from "@/database/entity/master.entity";

export default class ItemService {
    private readonly itemRepository: Repository<Item>;

    constructor(
        itemRepository: Repository<Item>,
        masterRepository: Repository<Master>,
    ) {
        this.itemRepository = itemRepository
    }


    async create(dto: any, res: Response) {
        try {
            const item = this.itemRepository.create(dto);
            await this.itemRepository.save(item);

            res.status(201).json({ message: "Registrasi berhasil", item: item });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Registrasi gagal" });
        }
    }

    async me(res: Response) {

    }

    async get(startDate: string, endDate: string, page: number, limit: number, search: string, sortBy: string, res: Response) {
        const skip = (page - 1) * limit;

        const findOptions: {
            where?: FindOptionsWhere<Item> | FindOptionsWhere<Item>[];
            order?: FindOptionsOrder<Item>;
            relations?: string[];
        } = {};

        if (search) {
            findOptions.where = [
                { master: { name: Like(`%${search}%`) } },
            ];
        }
        const [sortColumn, sortOrder] = sortBy.split(':');
        if (sortColumn && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
            if (sortColumn == 'masterName') findOptions.order = { master: { name: sortOrder } }
            else if (sortColumn == 'locationName') findOptions.order = { location: { name: sortOrder } }
            else findOptions.order = { [sortColumn]: sortOrder };
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            const dateCondition = { createdAt: Between(start, end) };
            
            if (findOptions.where) {                
                if (Array.isArray(findOptions.where)) {
                    findOptions.where.push(dateCondition as FindOptionsWhere<Item>);
                } else {
                    findOptions.where = [findOptions.where, dateCondition as FindOptionsWhere<Item>];
                }
            } else {                
                findOptions.where = [dateCondition as FindOptionsWhere<Item>];
            }
        }

        findOptions.relations = ['master', 'location'];

        try {
            const [items, totalItems] = await this.itemRepository.findAndCount({
                ...findOptions,
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);

            const data = items.map(item => ({
                ...item,
                masterName: item.master?.name,
                locationName: item.location?.name
            }))

            res.status(200).json({
                data,
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

    async update(id: string, dto: Partial<Item>, res: Response) {
        try {
            let item = await this.itemRepository.findOneBy({ id });

            if (!item) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan." });
            }

            Object.assign(item, dto);
            const result = await this.itemRepository.save(item)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const item = await this.itemRepository.findOneBy({ id })
            if (item) {
                await this.itemRepository.softRemove(item)
                return res.status(200).json({ message: 'Delete item Successful' })
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
            const items = await this.itemRepository.findBy({ id: In(stringIds) });
            await this.itemRepository.softRemove(items)

            res.status(200).json({ message: `${items.length} items successfully removed.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }
} 