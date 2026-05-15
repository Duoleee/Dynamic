'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Notification, NotificationFilterType } from '@/types/notification';
import { mockNotifications } from '@/lib/mock-notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  filter: NotificationFilterType;
  setFilter: (filter: NotificationFilterType) => void;
  filteredNotifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotificationFilterType>('all');

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (filter === 'system') {
      filtered = filtered.filter((n) => n.type === 'system');
    } else if (filter === 'business') {
      filtered = filtered.filter((n) => n.type === 'business');
    }

    return filtered.slice(0, 10);
  }, [notifications, filter]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      filter,
      setFilter,
      filteredNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, filter, filteredNotifications, markAsRead, markAllAsRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
