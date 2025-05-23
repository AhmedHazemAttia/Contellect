import { Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET_KEY || 'test123'

export const authenticateToken = (req: Request, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, SECRET, (err:any, user:any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    (req as any).user = user;
    next();
  });
};


export const authorizeRole = (requiredRole: string) => {
  return (req: Request, res: any, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied, UnAuthorized Role' });
    }
    next();
  };
};

