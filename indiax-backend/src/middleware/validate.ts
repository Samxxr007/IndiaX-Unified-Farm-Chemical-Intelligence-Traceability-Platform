import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { Errors } from '../utils/errors';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(Errors.VALIDATION_ERROR(result.error.flatten().fieldErrors));
      return;
    }
    // Replace target with parsed (coerced) values
    req[target] = result.data;
    next();
  };
}
