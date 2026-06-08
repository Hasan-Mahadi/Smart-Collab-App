'use client';

import { Header } from '@/components/layout/header';
import { KpiCard } from '@/components/ui/kpi-card';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from '@/features/dashboard/charts';
import { dashboardService } from '@/services/dashboard.service';
import { formatDate } from '@/lib/utils';
import type { DashboardData } from '@/types';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your projects and tasks" />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Total Projects"
            value={data.kpis.totalProjects}
            icon={FolderKanban}
            color="indigo"
          />
          <KpiCard
            title="Total Tasks"
            value={data.kpis.totalTasks}
            icon={CheckSquare}
            color="blue"
          />
          <KpiCard
            title="Completed"
            value={data.kpis.completedTasks}
            icon={CheckCircle}
            color="green"
          />
          <KpiCard
            title="Pending"
            value={data.kpis.pendingTasks}
            icon={Clock}
            color="amber"
          />
          <KpiCard
            title="Overdue"
            value={data.kpis.overdueTasks}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        <DashboardCharts {...data.charts} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold">Recent Activities</h3>
            <div className="space-y-3">
              {data.widgets.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30">
                    {activity.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-slate-500">
                      {activity.user.name} ·{' '}
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {data.widgets.upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming deadlines</p>
              ) : (
                data.widgets.upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-slate-500">
                        {task.project?.name}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold">High Priority Tasks</h3>
            <div className="space-y-3">
              {data.widgets.highPriorityTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {task.assignedTo?.name || 'Unassigned'}
                    </p>
                  </div>
                  <Badge variant="danger">HIGH</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold">Member Workload</h3>
            <div className="space-y-3">
              {data.widgets.memberWorkload.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium dark:bg-slate-800">
                      {member.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>{member.pendingTasks} pending</span>
                    <span className="text-red-500">
                      {member.overdueTasks} overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
