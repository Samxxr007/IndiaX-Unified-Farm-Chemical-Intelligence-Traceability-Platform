import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createFieldSchema, updateFieldSchema } from './fields.schema';
import * as fieldsController from './fields.controller';
import { cropCyclesRouter } from '../crops/crops.router';
import { fieldApplicationsRouter } from '../applications/applications.router';

export const fieldsRouter = Router({ mergeParams: true }); // Important for nested farmId param

fieldsRouter.post('/', authenticate, validate(createFieldSchema), fieldsController.createField);
fieldsRouter.get('/', authenticate, fieldsController.listFieldsByFarm);
fieldsRouter.get('/:fieldId', authenticate, fieldsController.getFieldById);
fieldsRouter.put('/:fieldId', authenticate, validate(updateFieldSchema), fieldsController.updateField);

// Mount nested routes
fieldsRouter.use('/:fieldId/crop-cycles', cropCyclesRouter);
fieldsRouter.use('/:fieldId/applications', fieldApplicationsRouter);

