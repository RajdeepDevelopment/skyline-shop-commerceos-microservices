import {
  QueryClient,
  QueryClientProvider,
  useQuery as useReactQuery,
  useMutation as useReactMutation,
} from '@tanstack/react-query';
import React from 'react';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data remains fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that inactive queries will remain in cache (renamed to gcTime in v5)
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Number of times to retry a failed request
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors

        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Delay between retries (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations
      retry: 1,
      // Delay between retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// Custom hooks for common query patterns
export const useQueryWithErrorHandler = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: any,
) => {
  return useReactQuery({
    queryKey,
    queryFn,
    ...options,
  });
};

export const useMutationWithErrorHandler = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: any,
) => {
  return useReactMutation({
    mutationFn,
    ...options,
  });
};

// Utility functions for cache management
export const invalidateQueries = (queryKey: string[]) => {
  return queryClient.invalidateQueries({ queryKey });
};

export const setQueryData = <T>(queryKey: string[], data: T) => {
  return queryClient.setQueryData(queryKey, data);
};

export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData<T>(queryKey);
};

export default queryClient;
