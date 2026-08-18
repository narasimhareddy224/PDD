import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  meta?: Record<string, any>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200,
  meta?: Record<string, any>
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {})
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 400,
  errorCode: string = 'GENERAL_ERROR',
  meta?: Record<string, any>
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    errorCode,
    ...(meta ? { meta } : {})
  };
  return res.status(statusCode).json(payload);
};
