import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import { apiClient } from '../../../lib/axios';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/api/v1/auth/logout');
  }
}

export const authService = new AuthService();
