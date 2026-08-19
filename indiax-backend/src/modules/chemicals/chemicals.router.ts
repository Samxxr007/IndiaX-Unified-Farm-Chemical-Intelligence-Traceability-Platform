import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validate';
import { createChemicalSchema, searchQuerySchema } from './chemicals.schema';
import * as chemicalsController from './chemicals.controller';

export const chemicalsRouter = Router();

chemicalsRouter.get('/', authenticate, validate(searchQuerySchema, 'query'), chemicalsController.searchChemicals);
chemicalsRouter.get('/search', authenticate, chemicalsController.getChemicalsForSearch);
chemicalsRouter.get('/:id', authenticate, chemicalsController.getChemicalById);
chemicalsRouter.post('/', authenticate, requireRole('ADMIN'), validate(createChemicalSchema), chemicalsController.createChemical);
