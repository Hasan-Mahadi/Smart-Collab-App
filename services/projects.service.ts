import { api } from '@/lib/api';
import type { PaginatedResponse, Project, ProjectStatus } from '@/types';

export const projectsService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProjectStatus;
    sort?: string;
  }) =>
    api
      .get<PaginatedResponse<Project>>('/projects', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: {
    name: string;
    description?: string;
    deadline?: string;
    status?: ProjectStatus;
  }) => api.post<Project>('/projects', data).then((r) => r.data),

  update: (id: string, data: Partial<Project>) =>
    api.patch<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  addMember: (projectId: string, userId: string) =>
    api.post(`/projects/${projectId}/members`, { userId }),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};
