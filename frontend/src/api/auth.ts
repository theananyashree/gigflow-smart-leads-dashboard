import apiClient from './client';
import { IApiResponse, IUser, ILoginForm, IRegisterForm, IUserListItem } from '../types';

interface IAuthData {
  token: string;
  user: IUser;
}

export const authApi = {
  register: (data: IRegisterForm) =>
    apiClient.post<IApiResponse<IAuthData>>('/auth/register', data),

  login: (data: ILoginForm) =>
    apiClient.post<IApiResponse<IAuthData>>('/auth/login', data),

  getMe: () =>
    apiClient.get<IApiResponse<IUser>>('/auth/me'),

  getUsers: () =>
    apiClient.get<IApiResponse<IUserListItem[]>>('/auth/users'),
};