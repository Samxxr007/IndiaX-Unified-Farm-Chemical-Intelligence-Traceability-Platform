import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as usersService from './users.service';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const { users, total } = await usersService.listUsers(page, limit);
    sendList(res, users, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getUserById(String(req.params.id));
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateUser(String(req.params.id), req.body);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function deactivateUser(req: Request, res: Response, next: NextFunction) {
  try {
    await usersService.deactivateUser(String(req.params.id));
    sendSuccess(res, { message: 'User deactivated successfully' });
  } catch (err) {
    next(err);
  }
}
