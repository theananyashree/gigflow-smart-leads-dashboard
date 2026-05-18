import apiClient from './client';
import {
  IApiResponse,
  ILead,
  ILeadForm,
  ILeadFilters,
  ILeadStats,
} from '../types';

const buildParams = (filters: Partial<ILeadFilters>): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;
  return params;
};

export const leadsApi = {
  getAll: (filters: Partial<ILeadFilters>) =>
    apiClient.get<IApiResponse<ILead[]>>('/leads', { params: buildParams(filters) }),

  getById: (id: string) =>
    apiClient.get<IApiResponse<ILead>>(`/leads/${id}`),

  create: (data: ILeadForm) =>
    apiClient.post<IApiResponse<ILead>>('/leads', data),

  update: (id: string, data: Partial<ILeadForm>) =>
    apiClient.put<IApiResponse<ILead>>(`/leads/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<IApiResponse>(`/leads/${id}`),

  getStats: () =>
    apiClient.get<IApiResponse<ILeadStats>>('/leads/stats'),

  exportCSV: (filters: Partial<ILeadFilters>) =>
    apiClient.get('/leads/export/csv', {
      params: buildParams(filters),
      responseType: 'blob',
    }),
};