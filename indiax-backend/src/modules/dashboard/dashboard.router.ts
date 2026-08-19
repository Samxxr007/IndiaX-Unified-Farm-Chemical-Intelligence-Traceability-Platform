import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as dashboardController from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/', authenticate, dashboardController.getDashboard);
