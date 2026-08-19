import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as chemicalsService from './chemicals.service';

export async function searchChemicals(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const q = req.query.q ? String(req.query.q) : undefined;
    const type = req.query.type ? String(req.query.type) : undefined;
    const { chemicals, total } = await chemicalsService.searchChemicals(q, type, page, limit);
    sendList(res, chemicals, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getChemicalById(req: Request, res: Response, next: NextFunction) {
  try {
    const chemical = await chemicalsService.getChemicalById(String(req.params.id));
    sendSuccess(res, chemical);
  } catch (err) {
    next(err);
  }
}

export async function createChemical(req: Request, res: Response, next: NextFunction) {
  try {
    const chemical = await chemicalsService.createChemical(req.body);
    sendSuccess(res, chemical, 201);
  } catch (err) {
    next(err);
  }
}

export async function getChemicalsForSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query.q ? String(req.query.q) : undefined;
    const chemicals = await chemicalsService.getChemicalsForSearch(q);
    sendSuccess(res, chemicals);
  } catch (err) {
    next(err);
  }
}
