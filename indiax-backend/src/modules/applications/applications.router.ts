import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createApplicationSchema, listApplicationsQuerySchema } from './applications.schema';
import * as applicationsController from './applications.controller';

export const applicationsRouter = Router();

applicationsRouter.get('/', authenticate, validate(listApplicationsQuerySchema, 'query'), applicationsController.listApplications);
applicationsRouter.get('/:id', authenticate, applicationsController.getApplicationById);

// Mounted under fieldsRouter
export const fieldApplicationsRouter = Router({ mergeParams: true });

fieldApplicationsRouter.post('/', authenticate, validate(createApplicationSchema), applicationsController.createApplication);
fieldApplicationsRouter.get('/', authenticate, applicationsController.listApplications);
