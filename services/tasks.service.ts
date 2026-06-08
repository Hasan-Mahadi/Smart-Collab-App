import { api } from '@/lib/api';
import type {
  PaginatedResponse,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/types';

export const tasksService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedToId?: string;
    deadlineStatus?: string;
    sort?: string;
  }) =>
    api
      .get<PaginatedResponse<Task>>('/tasks', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Task>(`/tasks/${id}`).then((r) => r.data),

  create: (data: {
    title: string;
    description?: string;
    projectId: string;
    assignedToId?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  }) => api.post<Task>('/tasks', data).then((r) => r.data),

  update: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/tasks/${id}`),
};
