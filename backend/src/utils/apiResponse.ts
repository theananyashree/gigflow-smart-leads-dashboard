import { Response } from 'express';
import { IApiResponse, IPaginationMeta, IValidationError } from '../types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: IPaginationMeta
): Response => {
  const response: IApiResponse<T> = { success: true, message, data, meta };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: IValidationError[]
): Response => {
  const response: IApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(response);
};