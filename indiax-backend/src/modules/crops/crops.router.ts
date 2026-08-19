import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createCropCycleSchema, updateCropCycleSchema } from './crops.schema';
import * as cropsController from './crops.controller';

export const cropsRouter = Router();

cropsRouter.get('/', authenticate, cropsController.listCrops);
cropsRouter.get('/:id', authenticate, cropsController.getCropById);

// Mounted under fieldsRouter
export const cropCyclesRouter = Router({ mergeParams: true });

cropCyclesRouter.post('/', authenticate, validate(createCropCycleSchema), cropsController.createCropCycle);
cropCyclesRouter.get('/', authenticate, cropsController.listCropCycles);
cropCyclesRouter.get('/:id', authenticate, cropsController.getCropCycleById);
cropCyclesRouter.put('/:id', authenticate, validate(updateCropCycleSchema), cropsController.updateCropCycle);
