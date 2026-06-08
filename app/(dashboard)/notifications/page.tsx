'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { notificationsService } from '@/services/notifications.service';
import type { Notification } from '@/types';
import { Bell, CheckCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
    fetchNotifications();
  };

  const handleMarkRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    fetchNotifications();
  };

  return (
    <div>
      <Header
        title="Notifications"
        subtitle="Stay updated on project activities"
      />
      <div className="p-8">
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Bell className="mb-4 h-12 w-12" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between rounded-xl border p-4 ${
                  n.isRead
                    ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                    : 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                }`}
              >
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
