import { Router, Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Location } from "@/database/entity";

export default class LocationService {
    private readonly locationRepository: Repository<Location>;

    constructor(
        locationRepository: Repository<Location>
    ) {
        this.locationRepository = locationRepository
    }


    async create(dto: any, res: Response) {
        try {

            const existingLocation = await this.locationRepository.findOneBy({ name: dto.name });
            if (existingLocation) {
                return res.status(409).json({ message: "Nama sudah terdaftar" });
            }


            const location = this.locationRepository.create(dto);
            await this.locationRepository.save(location);


            res.status(201).json({ message: "Registrasi berhasil", location: location });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Registrasi gagal" });
        }
    }


    async get(page: number, limit: number, search: string, sortBy: string, res: Response) {
        const skip = (page - 1) * limit;

        const findOptions: {
            where?: FindOptionsWhere<Location>[];
            order?: FindOptionsOrder<Location>;
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
            const [locations, totalItems] = await this.locationRepository.findAndCount({
                ...findOptions,
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                data: locations,
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

    async update(id: string, dto: Partial<Location>, res: Response) {
        try {
            let location = await this.locationRepository.findOneBy({ id });

            if (!location) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan." });
            }

            Object.assign(location, dto);
            const result = await this.locationRepository.save(location)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const location = await this.locationRepository.findOneBy({ id })
            if (location) {
                await this.locationRepository.softRemove(location)
                return res.status(200).json({ message: 'Delete location Successful' })
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
            const items = await this.locationRepository.findBy({ id: In(stringIds) });
            await this.locationRepository.softRemove(items)

            res.status(200).json({ message: `${items.length} locations successfully removed.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }


    async getAll() {
        const data = await this.locationRepository.find()
        return data;
    }
} 