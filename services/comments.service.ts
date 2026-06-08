import { api } from '@/lib/api';
import type { Comment } from '@/types';

export const commentsService = {
  create: (taskId: string, content: string) =>
    api
      .post<Comment>('/comments', { taskId, content })
      .then((r) => r.data),

  getByTask: (taskId: string) =>
    api.get<Comment[]>(`/comments/task/${taskId}`).then((r) => r.data),
};
