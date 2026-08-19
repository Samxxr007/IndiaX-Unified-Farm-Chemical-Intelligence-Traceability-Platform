import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createFarmSchema, updateFarmSchema } from './farms.schema';
import * as farmsController from './farms.controller';

// Note: fieldsRouter and livestockRouter will be mounted here in the main index router to avoid circular dependencies
export const farmsRouter = Router();

farmsRouter.post('/', authenticate, validate(createFarmSchema), farmsController.createFarm);
farmsRouter.get('/', authenticate, farmsController.listFarms);
farmsRouter.get('/:farmId', authenticate, farmsController.getFarmById);
farmsRouter.put('/:farmId', authenticate, validate(updateFarmSchema), farmsController.updateFarm);
