import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { authenticate } from '../../middleware/auth';
import { registerSchema, loginSchema } from './auth.schema';
import * as authController from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authRateLimiter, validate(loginSchema), authController.login);
authRouter.get('/me', authenticate, authController.getMe);
