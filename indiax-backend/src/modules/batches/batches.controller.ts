import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as batchesService from './batches.service';

export async function createBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const batch = await batchesService.createBatch(req.user!.id, req.body);
    sendSuccess(res, batch, 201);
  } catch (err) {
    next(err);
  }
}

export async function listBatches(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const status = req.query.status ? String(req.query.status) : undefined;
    const { batches, total } = await batchesService.listBatches(req.user!.id, page, limit, status);
    sendList(res, batches, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getBatchById(req: Request, res: Response, next: NextFunction) {
  try {
    const batch = await batchesService.getBatchById(String(req.params.batchId), req.user!.id);
    sendSuccess(res, batch);
  } catch (err) {
    next(err);
  }
}

export async function updateBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const batch = await batchesService.updateBatch(String(req.params.batchId), req.user!.id, req.body);
    sendSuccess(res, batch);
  } catch (err) {
    next(err);
  }
}

export async function generateQR(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await batchesService.generateQRForBatch(String(req.params.batchId), req.user!.id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
