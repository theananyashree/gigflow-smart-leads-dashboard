import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IRegisterBody, ILoginBody, IAuthRequest, IUserPayload } from '../types';
import { sendSuccess, sendError } from '../utils/apiResponse';

const signToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as IRegisterBody;

  const existing = await User.findOne({ email });
  if (existing) {
    sendError(res, 'Email already registered', 409);
    return;
  }

  const user = await User.create({ name, email, password, role });

  const payload: IUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);
  sendSuccess(res, 'Registration successful', { token, user: payload }, 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as ILoginBody;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const payload: IUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);
  sendSuccess(res, 'Login successful', { token, user: payload });
};

export const getMe = async (req: IAuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id).select('-password');
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, 'User fetched', user);
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  sendSuccess(res, 'Users fetched', users);
};