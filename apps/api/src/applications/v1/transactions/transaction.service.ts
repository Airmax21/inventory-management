import e, { Router, Request, Response } from "express";
import { Between, FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from "typeorm";
import { StatusEnum, Transaction } from "@/database/entity/transaction.entity";
import dayjs from 'dayjs'
import { Item } from "@/database/entity/item.entity";

export default class TransactionService {
    private readonly transactionRepository: Repository<Transaction>;
    private readonly itemRepository: Repository<Item>

    constructor(
        transactionRepository: Repository<Transaction>,
        itemRepository: Repository<Item>,
    ) {
        this.transactionRepository = transactionRepository,
            this.itemRepository = itemRepository
    }


    async create(dto: any, res: Response) {
        try {
            const transaction = this.transactionRepository.create(dto);
            await this.transactionRepository.save(transaction);

            res.status(201).json({ message: "Registrasi berhasil", transaction: transaction });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Registrasi gagal" });
        }
    }


    async get(startDate: string, endDate: string, page: number, limit: number, search: string, sortBy: string, res: Response) {
        const skip = (page - 1) * limit;

        const findOptions: {
            where?: FindOptionsWhere<Transaction> | FindOptionsWhere<Transaction>[];
            order?: FindOptionsOrder<Transaction>;
            relations?: string[];
        } = {};

        if (search) {
            findOptions.where = [
                { item: { master: { name: Like(`%${search}%`) } } },
            ];
        }
        const [sortColumn, sortOrder] = sortBy.split(':');

        if (sortColumn && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
            if (sortColumn == 'dstLocationName') findOptions.order = { location: { name: sortOrder } }
            else if (sortColumn == 'srcItemLocation') findOptions.order = { item: { location: { name: sortOrder } } }
            else if (sortColumn == 'srcItemName') findOptions.order = { item: { master: { name: sortOrder } } }
            else findOptions.order = { [sortColumn]: sortOrder };
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const dateCondition = { createdAt: Between(start, end) };

            if (findOptions.where) {
                if (Array.isArray(findOptions.where)) {
                    findOptions.where.push(dateCondition as FindOptionsWhere<Transaction>);
                } else {
                    findOptions.where = [findOptions.where, dateCondition as FindOptionsWhere<Transaction>];
                }
            } else {
                findOptions.where = [dateCondition as FindOptionsWhere<Transaction>];
            }
        }

        findOptions.relations = ['location', 'item', 'item.master', 'item.location']

        try {
            const [transactions, totalTransactions] = await this.transactionRepository.findAndCount({
                ...findOptions,
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalTransactions / limit);

            const data = transactions.map(transaction => ({
                ...transaction,
                srcItemName: transaction.item?.master?.name,
                srcItemLocation: transaction.item?.location?.name,
                dstLocationName: transaction.location?.name
            }))

            res.status(200).json({
                data,
                meta: {
                    totalTransactions: totalTransactions,
                    currentPage: page,
                    transactionsPerPage: limit,
                    totalPages: totalPages,
                },
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal mengambil data.' });
        }
    }

    async update(id: string, dto: Partial<Transaction>, res: Response) {
        try {
            let transaction = await this.transactionRepository.findOneBy({ id });

            if (!transaction) {
                return res.status(404).json({ message: "Pengguna tidak dtransactionukan." });
            }

            Object.assign(transaction, dto);
            const result = await this.transactionRepository.save(transaction)

            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update gagal" });
        }
    }

    async delete(id: string, res: Response) {
        try {

            const transaction = await this.transactionRepository.findOneBy({ id })
            if (transaction) {
                await this.transactionRepository.softRemove(transaction)
                return res.status(200).json({ message: 'Delete transaction Successful' })
            }

            return res.status(404).json({ message: "Pengguna tidak dtransactionukan." });
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
            const transactions = await this.transactionRepository.findBy({ id: In(stringIds) });
            await this.transactionRepository.softRemove(transactions)

            res.status(200).json({ message: `${transactions.length} transactions successfully removed.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Delete gagal" });
        }
    }

    async transactions(id: string, status: StatusEnum, res: Response) {
        try {
            let transaction = await this.transactionRepository.findOne({ 
                where: { id }, 
                relations: ['location', 'item', 'item.master', 'item.location'] 
            })
            if (!transaction) return res.status(404).json({ message: 'Transactions is Not Found' })
            if (status == StatusEnum.APPROVE) {
                const itemSrc = await this.itemRepository.findOneBy({ id: transaction.item?.id });
                if (!itemSrc) return res.status(404).json({ message: 'Item Source is Not Found' })
                const qty = transaction.qty
                itemSrc.stock -= qty                
                await this.itemRepository.save(itemSrc)                
                const itemDst = await this.itemRepository.findOneBy({ masterId: transaction.item?.master?.id, locationId: transaction.location?.id, expDate: transaction.item?.expDate })                
                if (itemDst) {
                    itemDst.stock += qty
                    await this.itemRepository.save(itemDst)
                } else {
                    const item = this.itemRepository.create({
                        masterId: transaction.item?.master?.id,
                        locationId: transaction.location?.id,
                        expDate: transaction.item?.expDate,
                        stock: qty,
                    })                    
                    await this.itemRepository.save(item)
                }
            }            
            await this.update(id, {
                status: status,
                approveAt: dayjs().toDate()
            }, res)

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Transaksi gagal" });
        }
    }
} 