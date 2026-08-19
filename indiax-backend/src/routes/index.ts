import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.router';
import { usersRouter } from '../modules/users/users.router';
import { farmsRouter } from '../modules/farms/farms.router';
import { fieldsRouter } from '../modules/fields/fields.router';
import { cropsRouter } from '../modules/crops/crops.router';
import { chemicalsRouter } from '../modules/chemicals/chemicals.router';
import { applicationsRouter } from '../modules/applications/applications.router';
import { livestockRouter } from '../modules/livestock/livestock.router';
import { treatmentsRouter } from '../modules/treatments/treatments.router';
import { riskRouter } from '../modules/risk/risk.router';
import { batchesRouter } from '../modules/batches/batches.router';
import { laboratoryRouter } from '../modules/laboratory/laboratory.router';
import { traceabilityRouter } from '../modules/traceability/traceability.router';
import { notificationsRouter } from '../modules/notifications/notifications.router';
import { dashboardRouter } from '../modules/dashboard/dashboard.router';
import { searchRouter } from '../modules/search/search.router';
import { publicRouter } from '../modules/traceability/public.router';
import { regulationsRouter } from '../modules/regulations/regulations.router';
import { aiRouter } from '../modules/ai/ai.router';

export const apiRouter = Router();

// ── Public routes (no auth required) ────────────────────────────────────────
apiRouter.use('/auth', authRouter);
apiRouter.use('/public', publicRouter);

// ── Protected routes ─────────────────────────────────────────────────────────
apiRouter.use('/users', usersRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/farms', farmsRouter);
apiRouter.use('/fields', fieldsRouter);
apiRouter.use('/crops', cropsRouter);
apiRouter.use('/chemicals', chemicalsRouter);
apiRouter.use('/applications', applicationsRouter);
apiRouter.use('/livestock', livestockRouter);
apiRouter.use('/treatments', treatmentsRouter);
apiRouter.use('/risk', riskRouter);
apiRouter.use('/harvest-batches', batchesRouter);
apiRouter.use('/batches', batchesRouter);
apiRouter.use('/lab-results', laboratoryRouter);
apiRouter.use('/traceability', traceabilityRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/regulations', regulationsRouter);
apiRouter.use('/ai', aiRouter);
