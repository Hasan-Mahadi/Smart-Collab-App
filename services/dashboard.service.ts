import { api } from '@/lib/api';
import type { DashboardData } from '@/types';

export const dashboardService = {
  getDashboard: () =>
    api.get<DashboardData>('/dashboard').then((r) => r.data),
};
