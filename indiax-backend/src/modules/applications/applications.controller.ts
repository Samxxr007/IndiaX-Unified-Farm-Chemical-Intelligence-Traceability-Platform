import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendList, getPagination } from '../../utils/response';
import * as applicationsService from './applications.service';

export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await applicationsService.createApplication(String(req.params.fieldId), req.user!.id, req.body);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = getPagination(req.query);
    const resolvedFieldId = req.params.fieldId ? String(req.params.fieldId) : req.query.fieldId ? String(req.query.fieldId) : undefined;
    const chemicalId = req.query.chemicalId ? String(req.query.chemicalId) : undefined;
    const from = req.query.from ? String(req.query.from) : undefined;
    const to = req.query.to ? String(req.query.to) : undefined;

    const { applications, total } = await applicationsService.listApplications(
      req.user!.id,
      { fieldId: resolvedFieldId, chemicalId, from, to },
      page,
      limit
    );
    sendList(res, applications, total, page, limit);
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await applicationsService.getApplicationById(String(req.params.id), req.user!.id);
    sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}
