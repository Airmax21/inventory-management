import { AppDataSource } from "@/database/datasource";
import adminMiddleware from "@/middleware/admin";
import authMiddleware, { AuthenticatedRequest } from "@/middleware/auth";
import { Router, Response } from "express";
import * as path from "path";
import * as fs from 'fs';

const router = Router()

router.get("/", authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const allEntities = AppDataSource.entityMetadatas;
        const backupDir = path.join(process.cwd(), 'backups');

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const backupData: { [key: string]: any[] } = {};

        for (const entity of allEntities) {
            if(entity.tableName == 'users') continue
            const repository = AppDataSource.getRepository(entity.target);
            const data = await repository.find();
            backupData[entity.tableName] = data;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup-${timestamp}.bkp`;
        const backupFile = path.join(backupDir, fileName);

        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

        res.status(200).json({ message: 'Backup successful', file: fileName });

    } catch (error) {
        res.status(500).json({ message: 'Backup failed', error: error });
    }
})

router.get("/download", authMiddleware, adminMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const fileName = req.query.file as string;

    if (!fileName) {
        return res.status(400).json({ message: 'Filename is required' });
    }

    const backupDir = path.join(process.cwd(), 'backups');
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, fileName, (err) => {
        if (err) {
            res.status(500).json({ message: 'File download failed', error: err.message });
        } else {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
    });
});

export default router;