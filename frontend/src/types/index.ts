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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IUserListItem {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: { _id: string; name: string; email: string } | null;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ILeadForm {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export interface ILeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sort: 'latest' | 'oldest';
}

// ─── API ──────────────────────────────────────────────────────────────────────

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
  errors?: Array<{ field: string; message: string }>;
}

export interface ILeadStats {
  statusStats: Array<{ _id: LeadStatus; count: number }>;
  sourceStats: Array<{ _id: LeadSource; count: number }>;
  totalCount: number;
}