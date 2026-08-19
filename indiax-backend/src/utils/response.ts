import { Response } from 'express';

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiList<T = unknown> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data } as ApiSuccess<T>);
}

export function sendList<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  } as ApiList<T>);
}

export function getPagination(query: Record<string, unknown>): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
