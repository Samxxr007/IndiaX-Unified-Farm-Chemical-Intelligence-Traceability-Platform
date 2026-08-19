import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as farmsService from './farms.service';

export async function createFarm(req: Request, res: Response, next: NextFunction) {
  try {
    const farm = await farmsService.createFarm(req.user!.id, req.body);
    sendSuccess(res, farm, 201);
  } catch (err) {
    next(err);
  }
}

export async function listFarms(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const { farms, total } = await farmsService.listFarms(req.user!.id, page, limit);
    sendList(res, farms, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getFarmById(req: Request, res: Response, next: NextFunction) {
  try {
    const farm = await farmsService.getFarmById(String(req.params.farmId), req.user!.id);
    sendSuccess(res, farm);
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req: Request, res: Response, next: NextFunction) {
  try {
    const farm = await farmsService.updateFarm(String(req.params.farmId), req.user!.id, req.body);
    sendSuccess(res, farm);
  } catch (err) {
    next(err);
  }
}
