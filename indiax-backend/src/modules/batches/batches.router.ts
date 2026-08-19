import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createBatchSchema, updateBatchSchema } from './batches.schema';
import * as batchesController from './batches.controller';
import { laboratoryRouter } from '../laboratory/laboratory.router';

export const batchesRouter = Router();

batchesRouter.post('/', authenticate, validate(createBatchSchema), batchesController.createBatch);
batchesRouter.get('/', authenticate, batchesController.listBatches);
batchesRouter.get('/:batchId', authenticate, batchesController.getBatchById);
batchesRouter.put('/:batchId', authenticate, validate(updateBatchSchema), batchesController.updateBatch);
batchesRouter.post('/:batchId/qr', authenticate, batchesController.generateQR);

// Mount laboratory routes
batchesRouter.use('/:batchId/lab-results', laboratoryRouter);
