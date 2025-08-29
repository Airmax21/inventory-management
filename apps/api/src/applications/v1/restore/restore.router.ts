import { AppDataSource } from "@/database/datasource";
import adminMiddleware from "@/middleware/admin";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import { Router, Response } from "express";
import * as path from "path";
import * as fs from 'fs';
import multer from "multer";

const router = Router()

const upload = multer({ dest: 'uploads/' });
const RESTORE_ORDER = [
    'locations',
    'category',
    'masters',
    'items', 
    'transactions',
];

router.post("/", authMiddleware, adminMiddleware, upload.single('backupFile'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        
        const rawData = fs.readFileSync(filePath, 'utf8');
        const backupData: { [key: string]: any[] } = JSON.parse(rawData);
        
        for (const tableName of RESTORE_ORDER.reverse()) {
            try {
                await AppDataSource.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
                console.log(`Truncated table: ${tableName}`);
            } catch (e) {
                console.error(`Error truncating table ${tableName}:`, e);
            }
        }
        
        for (const tableName of RESTORE_ORDER.reverse()) {
            const dataToRestore = backupData[tableName];
            const repository = AppDataSource.getRepository(tableName);
            
            await repository.save(dataToRestore);
            console.log(`Restored ${dataToRestore.length} rows to table: ${tableName}`);
        }
        
        fs.unlinkSync(filePath);

        console.log('All data successfully restored.');
        return res.status(200).json({ message: 'Restore successful.' });

    } catch (error) {
        console.error('Restore failed:', error);        
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: 'Restore failed', error: error });
    }
})

export default router;