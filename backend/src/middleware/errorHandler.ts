import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import logger from '../utils/logger';
import { sendError } from '../utils/apiResponse';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`);

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, errors);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    sendError(res, `Invalid ${err.path}: ${err.value}`, 400);
    return;
  }

  // MongoDB duplicate key
  if ((err as MongoError).code === 11000) {
    const field = Object.keys((err as AppError).keyValue ?? {})[0];
    sendError(res, `${field} already exists`, 409);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401);
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message;

  sendError(res, message, statusCode);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};