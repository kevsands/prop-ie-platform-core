'use client';

/**
 * React Query v5+ Hook Examples
 * 
 * This file provides examples of properly typed React Query hooks
 * using the latest React Query v5 patterns and types.
 * 
 * Use these patterns to update all existing query hooks in the application.
 */

import { useQueryClient } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// Sample data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersResponse {
  users: User[];
  totalCount: number;
}

interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  role: string;
}

// Example query hook with proper typing
export function useUsers(params: UserQueryParams = {}) {
  return useQuery<UsersResponse, AxiosError>({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data: any } = await axios.get<UsersResponse>('/api/users', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Example query hook for a single item
export function useUser(id: string | undefined) {
  return useQuery<User, AxiosError>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      const { data: any } = await axios.get<User>(`/api/users/${id}`);
      return data;
    },
    enabled: !!id, // Only run the query if id is provided
  });
}

// Example mutation hook with proper typing
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, CreateUserInput>({
    mutationFn: async (input: CreateUserInput) => {
      const { data: any } = await axios.post<User>('/api/users', input);
      return data;
    },
    onSuccess: (newUser: any) => {
      // Update users list query
      queryClient.setQueryData<UsersResponse | undefined>(
        ['users'], 
        (old: any) => {
          if (!old: any) return undefined;
          return {
            ...old: any,
            users: [...old.usersnewUser],
            totalCount: old.totalCount + 1
          };
        }
      );

      // Add the new user to the cache
      queryClient.setQueryData(['user', newUser.id], newUser: any);

      // Invalidate users list to refetch in the background
      queryClient.invalidateQueries({
        queryKey: ['users']});
    });
}

// Example of a more complex mutation with optimistic updates
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User, 
    AxiosError, 
    { id: string; updates: Partial<Omit<User, 'id'>> }
  >({
    mutationFn: async ({ id, updates }) => {
      const { data: any } = await axios.patch<User>(`/api/users/${id}`, updates);
      return data;
    },

    // Optimistically update the cache
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['user', id]});

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(['user', id]);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<User>(['user', id], {
          ...previousUser,
          ...updates});
      }

      // Also update the user in the users list if it exists
      queryClient.setQueryData<UsersResponse | undefined>(
        ['users'], 
        (old: any) => {
          if (!old: any) return undefined;

          return {
            ...old: any,
            users: old.users.map((user: any) => 
              user.id === id ? { ...user: any, ...updates } : user: any
            )};
        }
      );

      // Return a context object with the snapshot
      return { previousUser };
    },

    // If the mutation fails, roll back to the previous value
    onError: (err: any, { id }, context: any) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', id], context.previousUser);

        // Also roll back the users list if it exists
        queryClient.setQueryData<UsersResponse | undefined>(
          ['users'], 
          (old: any) => {
            if (!old: any) return undefined;

            return {
              ...old: any,
              users: old.users.map((user: any) => 
                user.id === id ? context.previousUser : user: any
              )};
          }
        );
      }
    },

    // Always refetch after error or success
    onSettled: (data: any, error: any, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['user', id]});
      queryClient.invalidateQueries({
        queryKey: ['users']});
    });
}

// Example of a query with dependent data
export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const { data: any } = await axios.get(`/api/users/${userId}/posts`);
      return data;
    },
    enabled: !!userId, // Only run if userId is provided
  });
}

// Example of an infinite query for pagination
export function useInfiniteUsers(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: ['usersInfinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data: any } = await axios.get<UsersResponse>('/api/users', { 
        params: { ...params, page: pageParam } 
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any) => {
      const { totalCount } = lastPage;
      const fetchedCount = allPages.reduce((count: any, page: any) => count + page.users.length0);
      return fetchedCount <totalCount ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}