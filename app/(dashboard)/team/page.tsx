'use client';

import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';
import { usersService } from '@/services/users.service';
import type { User } from '@/types';
import { useEffect, useState } from 'react';

interface UserWithSummary extends User {
  summary?: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
}

export default function TeamPage() {
  const [users, setUsers] = useState<UserWithSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersService
      .getAll({ limit: 50 })
      .then(async (res) => {
        const withSummary = await Promise.all(
          res.data.map(async (user) => {
            const summary = await usersService.getSummary(user.id);
            return { ...user, summary };
          }),
        );
        setUsers(withSummary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header title="Team" subtitle="Manage team members and workload" />
      <div className="p-8">
        <Table
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (u) => (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium dark:bg-indigo-900/30">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              render: (u) => (
                <Badge variant="info">
                  {u.role.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'totalTasks',
              header: 'Total Tasks',
              render: (u) => u.summary?.totalTasks ?? 0,
            },
            {
              key: 'completed',
              header: 'Completed',
              render: (u) => u.summary?.completedTasks ?? 0,
            },
            {
              key: 'pending',
              header: 'Pending',
              render: (u) => u.summary?.pendingTasks ?? 0,
            },
            {
              key: 'overdue',
              header: 'Overdue',
              render: (u) => (
                <span
                  className={
                    (u.summary?.overdueTasks ?? 0) > 0
                      ? 'text-red-500 font-medium'
                      : ''
                  }
                >
                  {u.summary?.overdueTasks ?? 0}
                </span>
              ),
            },
          ]}
          data={users}
          keyExtractor={(u) => u.id}
          loading={loading}
          emptyMessage="No team members found"
        />
      </div>
    </div>
  );
}
