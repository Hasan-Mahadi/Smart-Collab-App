import { api } from '@/lib/api';
import type { PaginatedResponse, User } from '@/types';

export const usersService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api
      .get<PaginatedResponse<User>>('/users', { params })
      .then((r) => r.data),

  getSummary: (id: string) =>
    api
      .get<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        overdueTasks: number;
      }>(`/users/${id}/summary`)
      .then((r) => r.data),
};
