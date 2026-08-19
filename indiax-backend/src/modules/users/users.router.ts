import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import * as usersController from './users.controller';

export const usersRouter = Router();

usersRouter.get('/', authenticate, requireRole('ADMIN'), usersController.listUsers);
usersRouter.get('/:id', authenticate, usersController.getUserById);
usersRouter.put('/:id', authenticate, usersController.updateUser);
usersRouter.delete('/:id', authenticate, requireRole('ADMIN'), usersController.deactivateUser);
