import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '@/utils/ApiError';

/** Validates req.body/query/params against a Zod schema and replaces them with parsed output. */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const detail = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        throw ApiError.badRequest(detail, 'VALIDATION_ERROR');
      }
      throw err;
    }
  };
