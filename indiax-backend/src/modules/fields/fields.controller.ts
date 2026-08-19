import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as fieldsService from './fields.service';

export async function createField(req: Request, res: Response, next: NextFunction) {
  try {
    const field = await fieldsService.createField(String(req.params.farmId), req.user!.id, req.body);
    sendSuccess(res, field, 201);
  } catch (err) {
    next(err);
  }
}

export async function listFieldsByFarm(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const { fields, total } = await fieldsService.listFieldsByFarm(String(req.params.farmId), req.user!.id, page, limit);
    sendList(res, fields, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getFieldById(req: Request, res: Response, next: NextFunction) {
  try {
    const field = await fieldsService.getFieldById(String(req.params.fieldId), req.user!.id);
    sendSuccess(res, field);
  } catch (err) {
    next(err);
  }
}

export async function updateField(req: Request, res: Response, next: NextFunction) {
  try {
    const field = await fieldsService.updateField(String(req.params.fieldId), req.user!.id, req.body);
    sendSuccess(res, field);
  } catch (err) {
    next(err);
  }
}
