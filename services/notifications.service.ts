import { api } from '@/lib/api';
import type { Notification } from '@/types';

export const notificationsService = {
  getAll: () =>
    api.get<Notification[]>('/notifications').then((r) => r.data),

  getUnreadCount: () =>
    api.get<number>('/notifications/unread-count').then((r) => r.data),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch('/notifications/read-all'),
};
