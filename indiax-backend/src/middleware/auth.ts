import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Errors } from '../utils/errors';
import { prisma } from '../config/database';

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        fullName: string;
      };
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw Errors.UNAUTHORIZED();
    }

    const token = authHeader.slice(7);
    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) throw Errors.TOKEN_EXPIRED();
      throw Errors.UNAUTHORIZED();
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, fullName: true, isActive: true },
    });

    if (!user || !user.isActive) throw Errors.UNAUTHORIZED();

    req.user = { id: user.id, email: user.email, role: user.role, fullName: user.fullName };
    next();
  } catch (err) {
    next(err);
  }
}
