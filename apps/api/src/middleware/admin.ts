import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Akses ditolak. User tidak terautentikasi.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak. Membutuhkan role admin.' });
    }

    next();
};

export default adminMiddleware;
