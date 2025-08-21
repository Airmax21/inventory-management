import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export interface AuthenticatedRequest extends Request {
    user?: { id: number; email: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid atau tidak ada.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number;
            email: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid.' });
    }
};

export default authMiddleware;