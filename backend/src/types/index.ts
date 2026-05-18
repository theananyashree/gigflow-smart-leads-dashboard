import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

// ─── User Interfaces ──────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── Lead Interfaces ──────────────────────────────────────────────────────────

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLeadBody {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export interface IUpdateLeadBody extends Partial<ICreateLeadBody> {}

// ─── Query Interfaces ─────────────────────────────────────────────────────────

export interface ILeadQuery {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}

// ─── API Response Interfaces ──────────────────────────────────────────────────

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IPaginationMeta;
  errors?: IValidationError[];
}

export interface IValidationError {
  field: string;
  message: string;
}

// ─── Auth Interfaces ──────────────────────────────────────────────────────────

export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserPayload;
}

// ─── Request Extension ────────────────────────────────────────────────────────

export interface IAuthRequest extends Request {
  user?: IUserPayload;
}