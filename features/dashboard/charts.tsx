'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

interface ChartsProps {
  tasksByPriority: { name: string; value: number }[];
  projectProgressTrend: { month: string; progress: number }[];
  teamProductivity: { week: string; completed: number; created: number }[];
  taskStatusDistribution: { name: string; value: number }[];
}

export function DashboardCharts({
  tasksByPriority,
  projectProgressTrend,
  teamProductivity,
  taskStatusDistribution,
}: ChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Tasks by Priority
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tasksByPriority}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Project Progress Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={projectProgressTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Team Productivity
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={teamProductivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Task Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={taskStatusDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {taskStatusDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
