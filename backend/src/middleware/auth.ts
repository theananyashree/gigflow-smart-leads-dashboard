import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IUserPayload, UserRole } from '../types';
import { sendError } from '../utils/apiResponse';

export const authenticate = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }
    next();
  };
};