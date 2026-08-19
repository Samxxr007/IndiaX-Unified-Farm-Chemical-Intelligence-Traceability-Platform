import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createLabResultSchema } from './laboratory.schema';
import * as laboratoryController from './laboratory.controller';

export const laboratoryRouter = Router({ mergeParams: true }); // Mounted under batchesRouter

laboratoryRouter.post('/', authenticate, validate(createLabResultSchema), laboratoryController.addLabResult);
laboratoryRouter.get('/', authenticate, laboratoryController.listLabResults);
