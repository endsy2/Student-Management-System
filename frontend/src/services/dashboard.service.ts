import { api } from './api';
import type { ActivityEntry, DashboardAnalytics, DashboardOverview } from '@/types';

export const dashboardService = {
  async overview(): Promise<DashboardOverview> {
    const { data } = await api.get('/dashboard/overview');
    return data.data as DashboardOverview;
  },

  async analytics(): Promise<DashboardAnalytics> {
    const { data } = await api.get('/dashboard/analytics');
    return data.data as DashboardAnalytics;
  },

  async recentActivity(): Promise<ActivityEntry[]> {
    const { data } = await api.get('/dashboard/recent-activity');
    return data.data as ActivityEntry[];
  },
};
