import { Router, Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Master } from "@/database/entity/master.entity";

export default class MasterService {
    private readonly masterRepository: Repository<Master>;

    constructor(
        masterRepository: Repository<Master>
    ) {
        this.masterRepository = masterRepository
    }


    async create(dto: any, res: Response) {
        try {

            const existingMaster = await this.masterRepository.findOneBy({ name: dto.name });
            if (existingMaster) {
                return res.status(409).json({ message: "Nama sudah terdaftar" });
            }


            const master = this.masterRepository.create(dto);
            await this.masterRepository.save(master);


            res.status(201).json({ message: "Registrasi berhasil", master: master });

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
            where?: FindOptionsWhere<Master>[];
            order?: FindOptionsOrder<Master>;
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
            const [masters, totalItems] = await this.masterRepository.findAndCount({
                ...findOptions,
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                data: masters,
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

    async update(id: string, dto: Partial<Master>, res: Response) {
        try {
            let master = await this.masterRepository.findOneBy({ id });

            if (!master) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan." });
            }

            Object.assign(master, dto);
            const result = await this.masterRepository.save(master)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const master = await this.masterRepository.findOneBy({ id })
            if (master) {
                await this.masterRepository.softRemove(master)
                return res.status(200).json({ message: 'Delete master Successful' })
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
            const items = await this.masterRepository.findBy({ id: In(stringIds) });
            await this.masterRepository.softRemove(items)

            res.status(200).json({ message: `${items.length} masters successfully removed.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }
} 