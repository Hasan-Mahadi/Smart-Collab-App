'use client';

import { Header } from '@/components/layout/header';
import { Badge, getStatusBadge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Pagination, Table } from '@/components/ui/table';
import { tasksService } from '@/services/tasks.service';
import { formatDate } from '@/lib/utils';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sort, setSort] = useState('latest_created');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: (statusFilter as TaskStatus) || undefined,
        priority: (priorityFilter as TaskPriority) || undefined,
        sort,
      });
      setTasks(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, priorityFilter, sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <Header
        title="Tasks"
        subtitle="View and manage all tasks"
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'TODO', label: 'Todo' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-40"
          />
          <Select
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="w-40"
          />
          <Select
            options={[
              { value: 'latest_created', label: 'Latest Created' },
              { value: 'nearest_deadline', label: 'Nearest Deadline' },
              { value: 'highest_priority', label: 'Highest Priority' },
              { value: 'recently_updated', label: 'Recently Updated' },
            ]}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-48"
          />
        </div>

        <Table
          columns={[
            { key: 'title', header: 'Title' },
            {
              key: 'project',
              header: 'Project',
              render: (t) => t.project?.name || '-',
            },
            {
              key: 'assignedTo',
              header: 'Assigned To',
              render: (t) => t.assignedTo?.name || 'Unassigned',
            },
            {
              key: 'priority',
              header: 'Priority',
              render: (t) => (
                <Badge variant={getStatusBadge(t.priority)}>
                  {t.priority}
                </Badge>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (t) => (
                <Badge variant={getStatusBadge(t.status)}>
                  {t.status.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'dueDate',
              header: 'Due Date',
              render: (t) => formatDate(t.dueDate),
            },
            {
              key: 'actions',
              header: '',
              render: (t) => (
                <Link href={`/tasks/${t.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              ),
            },
          ]}
          data={tasks}
          keyExtractor={(t) => t.id}
          loading={loading}
          emptyMessage="No tasks found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
