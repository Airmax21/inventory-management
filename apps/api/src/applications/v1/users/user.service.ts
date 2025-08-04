import { User } from "@database/entity/user.entity";
import { Router, Request, Response } from "express";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';

export default class UserService {
    private readonly userRepository: Repository<User>;

    constructor(
        userRepository: Repository<User>
    ) {
        this.userRepository = userRepository
    }

    async login(dto: any, res: Response) {
        try {
            const user = await this.userRepository.findOne({ where: { email: dto.email }, select: ['email', 'username', 'password'] });
            if (!user) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            const isPasswordValid = await bcrypt.compare(dto.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
            const data = {
                user: {
                    email: user.email,
                    username: user.username
                },
                token
            }

            res.status(200).json({ message: "Sign-in berhasil", data });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Sign-in gagal" });
        }
    }

    async register(dto: any, res: Response) {
        try {

            const existingUser = await this.userRepository.findOneBy({ email: dto.email });
            if (existingUser) {
                return res.status(409).json({ message: "Email sudah terdaftar" });
            }


            const user = this.userRepository.create(dto);
            await this.userRepository.save(user);


            res.status(201).json({ message: "Registrasi berhasil", user: user });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Registrasi gagal" });
        }
    }

    async me(res: Response) {

    }

    async update(id: string, dto: Partial<User>, res: Response) {
        try {
            let user = await this.userRepository.findOneBy({ id });

            if (!user) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan." });
            }

            Object.assign(user, dto);
            const result = await this.userRepository.save(user)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const user = await this.userRepository.findOneBy({ id })
            if (user) {
                await this.userRepository.softRemove(user)
                return res.status(200).json({message: 'Delete user Successful'})
            }

            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }
} 