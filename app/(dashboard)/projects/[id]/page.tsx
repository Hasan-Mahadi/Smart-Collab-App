'use client';

import { Header } from '@/components/layout/header';
import { Badge, getStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { projectsService } from '@/services/projects.service';
import { tasksService } from '@/services/tasks.service';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/store/auth.store';
import { taskSchema, type TaskFormData } from '@/utils/validation';
import { formatDate } from '@/lib/utils';
import type { Project, Task, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canManage =
    user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: 'MEDIUM', status: 'TODO' },
  });

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectsService.getById(id);
      setProject(data);
      setValue('projectId', id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    fetchProject();
    if (canManage) {
      usersService.getAll({ limit: 50 }).then((r) => setUsers(r.data));
    }
  }, [fetchProject, canManage]);

  const onCreateTask = async (data: TaskFormData) => {
    setSubmitting(true);
    try {
      await tasksService.create({ ...data, projectId: id });
      setShowTaskModal(false);
      reset();
      fetchProject();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      alert(msg || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const onAddMember = async () => {
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      await projectsService.addMember(id, selectedUserId);
      setShowMemberModal(false);
      setSelectedUserId('');
      fetchProject();
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

  if (!project) {
    return <div className="p-8">Project not found</div>;
  }

  return (
    <div>
      <Header title={project.name} subtitle={project.description || ''} />
      <div className="space-y-6 p-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 font-semibold">Project Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <Badge variant={getStatusBadge(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Deadline</dt>
                <dd>{formatDate(project.deadline)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Created by</dt>
                <dd>{project.createdBy?.name}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">
                Team Members ({project.members?.length || 0})
              </h3>
              {canManage && (
                <Button size="sm" onClick={() => setShowMemberModal(true)}>
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.members?.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                >
                  <span>{m.user.name}</span>
                  <span className="text-xs text-slate-500">
                    {m.user.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              Tasks ({project.tasks?.length || 0})
            </h3>
            {canManage && (
              <Button size="sm" onClick={() => setShowTaskModal(true)}>
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {project.tasks?.length === 0 ? (
              <p className="text-sm text-slate-500">No tasks yet</p>
            ) : (
              project.tasks?.map((task: Task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {task.assignedTo?.name || 'Unassigned'} ·{' '}
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadge(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusBadge(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create Task"
      >
        <form onSubmit={handleSubmit(onCreateTask)} className="space-y-4">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title')}
          />
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              rows={3}
              {...register('description')}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
          <Select
            label="Priority"
            options={[
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
            {...register('priority')}
          />
          <Select
            label="Assign To"
            options={[
              { value: '', label: 'Unassigned' },
              ...(project.members?.map((m) => ({
                value: m.userId,
                label: m.user.name,
              })) || []),
            ]}
            {...register('assignedToId')}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowTaskModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title="Add Team Member"
      >
        <div className="space-y-4">
          <Select
            label="Select User"
            options={[
              { value: '', label: 'Select a user' },
              ...users
                .filter(
                  (u) =>
                    !project.members?.some((m) => m.userId === u.id),
                )
                .map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
            ]}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowMemberModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={onAddMember} loading={submitting}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
