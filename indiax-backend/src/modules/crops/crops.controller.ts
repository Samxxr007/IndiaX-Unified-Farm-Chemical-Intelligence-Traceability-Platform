import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as cropsService from './crops.service';

export async function listCrops(_req: Request, res: Response, next: NextFunction) {
  try {
    const crops = await cropsService.listCrops();
    sendSuccess(res, crops);
  } catch (err) {
    next(err);
  }
}

export async function getCropById(req: Request, res: Response, next: NextFunction) {
  try {
    const crop = await cropsService.getCropById(String(req.params.id));
    sendSuccess(res, crop);
  } catch (err) {
    next(err);
  }
}

export async function createCropCycle(req: Request, res: Response, next: NextFunction) {
  try {
    const cycle = await cropsService.createCropCycle(String(req.params.fieldId), req.user!.id, req.body);
    sendSuccess(res, cycle, 201);
  } catch (err) {
    next(err);
  }
}

export async function listCropCycles(req: Request, res: Response, next: NextFunction) {
  try {
    const cycles = await cropsService.listCropCycles(String(req.params.fieldId), req.user!.id);
    sendSuccess(res, cycles);
  } catch (err) {
    next(err);
  }
}

export async function getCropCycleById(req: Request, res: Response, next: NextFunction) {
  try {
    const cycle = await cropsService.getCropCycleById(String(req.params.id), req.user!.id);
    sendSuccess(res, cycle);
  } catch (err) {
    next(err);
  }
}

export async function updateCropCycle(req: Request, res: Response, next: NextFunction) {
  try {
    const cycle = await cropsService.updateCropCycle(String(req.params.id), req.user!.id, req.body);
    sendSuccess(res, cycle);
  } catch (err) {
    next(err);
  }
}
