import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        sendError(res, `Validation error: ${errorMessages}`, 400, 'VALIDATION_FAILED', {
          issues: error.errors,
        });
        return;
      }
      sendError(res, 'Invalid request body format', 400, 'INVALID_BODY');
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        sendError(res, `Query validation error: ${errorMessages}`, 400, 'INVALID_QUERY', {
          issues: error.errors,
        });
        return;
      }
      sendError(res, 'Invalid query parameters', 400, 'INVALID_QUERY');
    }
  };
};
