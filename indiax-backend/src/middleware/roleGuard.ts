import { Request, Response, NextFunction } from 'express';
import { Errors } from '../utils/errors';

type UserRole = 'FARMER' | 'VETERINARIAN' | 'LABORATORY' | 'PROCESSOR' | 'REGULATOR' | 'ADMIN';

/**
 * Role guard middleware factory.
 * Usage: router.get('/admin', authenticate, requireRole('ADMIN'), controller)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(Errors.UNAUTHORIZED());
      return;
    }
    if (!roles.includes(req.user.role as UserRole)) {
      next(Errors.FORBIDDEN(`This action requires one of these roles: ${roles.join(', ')}.`));
      return;
    }
    next();
  };
}
