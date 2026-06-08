'use client';

import { Header } from '@/components/layout/header';
import { Badge, getStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Pagination, Table } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { projectsService } from '@/services/projects.service';
import { useAuthStore } from '@/store/auth.store';
import { projectSchema, type ProjectFormData } from '@/utils/validation';
import { formatDate } from '@/lib/utils';
import type { Project, ProjectStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ProjectsPage() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canCreate =
    user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'ACTIVE' as const },
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectsService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: (statusFilter as ProjectStatus) || undefined,
      });
      setProjects(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onCreate = async (data: ProjectFormData) => {
    setSubmitting(true);
    try {
      await projectsService.create(data);
      setShowModal(false);
      reset();
      fetchProjects();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header
        title="Projects"
        subtitle="Manage and track all your projects"
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'ON_HOLD', label: 'On Hold' },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />
          {canCreate && (
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )}
        </div>

        <Table
          columns={[
            { key: 'name', header: 'Name' },
            {
              key: 'status',
              header: 'Status',
              render: (p) => (
                <Badge variant={getStatusBadge(p.status)}>
                  {p.status.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'deadline',
              header: 'Deadline',
              render: (p) => formatDate(p.deadline),
            },
            {
              key: 'tasks',
              header: 'Tasks',
              render: (p) => p._count?.tasks ?? 0,
            },
            {
              key: 'members',
              header: 'Members',
              render: (p) => p._count?.members ?? 0,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (p) => (
                <Link href={`/projects/${p.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              ),
            },
          ]}
          data={projects}
          keyExtractor={(p) => p.id}
          loading={loading}
          emptyMessage="No projects found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create Project"
      >
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input
            label="Project Name"
            error={errors.name?.message}
            {...register('name')}
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
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register('deadline')}
          />
          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'ON_HOLD', label: 'On Hold' },
            ]}
            {...register('status')}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
