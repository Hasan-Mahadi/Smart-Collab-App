'use client';

import { Header } from '@/components/layout/header';
import { Badge, getStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { tasksService } from '@/services/tasks.service';
import { commentsService } from '@/services/comments.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import type { Comment, Task, TaskStatus } from '@/types';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTask = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, commentsData] = await Promise.all([
        tasksService.getById(id),
        commentsService.getByTask(id),
      ]);
      setTask(taskData);
      setComments(commentsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await tasksService.update(id, { status });
      fetchTask();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      alert(msg || 'Failed to update status');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await commentsService.create(id, newComment);
      setNewComment('');
      const updated = await commentsService.getByTask(id);
      setComments(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return <div className="p-8">Task not found</div>;
  }

  return (
    <div>
      <Header title={task.title} subtitle={task.project?.name || ''} />
      <div className="space-y-6 p-8">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {task.description || 'No description provided'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-4 font-semibold">
                Comments ({comments.length})
              </h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  loading={submitting}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-4 font-semibold">Details</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">Status</dt>
                  <dd className="mt-1">
                    <Select
                      options={[
                        { value: 'TODO', label: 'Todo' },
                        { value: 'IN_PROGRESS', label: 'In Progress' },
                        { value: 'COMPLETED', label: 'Completed' },
                      ]}
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as TaskStatus)
                      }
                      disabled={
                        user?.role === 'TEAM_MEMBER' &&
                        task.assignedToId !== user?.id
                      }
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Priority</dt>
                  <dd className="mt-1">
                    <Badge variant={getStatusBadge(task.priority)}>
                      {task.priority}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Assigned To</dt>
                  <dd>{task.assignedTo?.name || 'Unassigned'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Due Date</dt>
                  <dd>{formatDate(task.dueDate)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Created By</dt>
                  <dd>{task.createdBy?.name}</dd>
                </div>
              </dl>
            </div>

            {task.attachments && task.attachments.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-4 font-semibold">Attachments</h3>
                <div className="space-y-2">
                  {task.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-indigo-600 hover:underline"
                    >
                      {att.fileName || 'Attachment'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
