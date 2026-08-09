import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
  });
};

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: (userData) => authService.register(userData),
  });
};

export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
  });
};

export const useRefreshToken = () => {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: (refreshToken) => authService.refreshToken(refreshToken),
  });
};
