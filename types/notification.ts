export type NotificationType = 'system' | 'business';
export type NotificationFilterType = 'all' | 'unread' | 'system' | 'business';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
