import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as laboratoryService from './laboratory.service';

export async function addLabResult(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await laboratoryService.addLabResult(String(req.params.batchId), req.user!.id, req.body);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function listLabResults(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await laboratoryService.listLabResults(String(req.params.batchId), req.user!.id);
    sendSuccess(res, results);
  } catch (err) {
    next(err);
  }
}
