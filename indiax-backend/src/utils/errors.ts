export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Predefined errors ──────────────────────────────────────────────────────

export const Errors = {
  // Auth
  INVALID_CREDENTIALS: () => new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.'),
  UNAUTHORIZED: () => new AppError(401, 'UNAUTHORIZED', 'Authentication required.'),
  TOKEN_EXPIRED: () => new AppError(401, 'TOKEN_EXPIRED', 'Your session has expired. Please log in again.'),
  FORBIDDEN: (msg = 'You do not have permission to perform this action.') =>
    new AppError(403, 'FORBIDDEN', msg),

  // Resources
  NOT_FOUND: (resource: string) => new AppError(404, `${resource.toUpperCase()}_NOT_FOUND`, `The requested ${resource} does not exist.`),
  ALREADY_EXISTS: (resource: string) => new AppError(409, `${resource.toUpperCase()}_ALREADY_EXISTS`, `A ${resource} with this information already exists.`),

  // Validation
  VALIDATION_ERROR: (details?: unknown) => new AppError(400, 'VALIDATION_ERROR', 'Request validation failed.', details),
  BAD_REQUEST: (message: string) => new AppError(400, 'BAD_REQUEST', message),

  // Authorization
  FARM_ACCESS_DENIED: () => new AppError(403, 'FARM_ACCESS_DENIED', 'You do not have access to this farm.'),
  FIELD_ACCESS_DENIED: () => new AppError(403, 'FIELD_ACCESS_DENIED', 'You do not have access to this field.'),

  // Server
  INTERNAL: () => new AppError(500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred. Please try again.'),
  SERVICE_UNAVAILABLE: (service: string) =>
    new AppError(503, 'SERVICE_UNAVAILABLE', `The ${service} service is currently unavailable.`),
};
