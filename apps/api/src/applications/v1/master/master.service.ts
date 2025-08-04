import { Master } from "@database/entity/master.entity";
import { Router, Request, Response } from "express";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';

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
                return res.status(409).json({ message: "Barang sudah terdaftar" });
            }

            const master = this.masterRepository.create(dto);
            await this.masterRepository.save(master);

            res.status(201).json({ message: "Create master berhasil", master: master });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Create master gagal" });
        }
    }

    async me(res: Response) {

    }

    async update(id: string, dto: Partial<Master>, res: Response) {
        try {
            let master = await this.masterRepository.findOneBy({ id });

            if (!master) {
                return res.status(404).json({ message: "Master tidak ditemukan." });
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
                return res.status(200).json({message: 'Delete master Successful'})
            }

            return res.status(404).json({ message: "Master tidak ditemukan." });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }
} 