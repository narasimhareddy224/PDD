import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Unhandled Error at ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      sendError(res, 'Uploaded image exceeds maximum size limit of 10MB', 400, 'FILE_TOO_LARGE');
      return;
    }
    sendError(res, `Image upload error: ${err.message}`, 400, 'UPLOAD_ERROR');
    return;
  }

  // Handle Mongoose CastError / ValidationError
  if (err.name === 'ValidationError') {
    sendError(res, err.message || 'Database validation failed', 422, 'VALIDATION_ERROR');
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid entity identifier provided', 400, 'INVALID_ID');
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected internal server error occurred'
    : (err.message || 'Internal server error');

  sendError(res, message, statusCode, err.errorCode || 'INTERNAL_SERVER_ERROR');
};
