import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as dashboardService from './dashboard.service';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getDashboardData(req.user!.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
