'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/notification-context';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

function formatDistanceToNow(date: string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return target.toLocaleDateString();
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotification();

  const handleViewDetail = () => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const icon = notification.type === 'system'
    ? <AlertTriangle className="h-4 w-4 text-amber-500" />
    : <RefreshCw className="h-4 w-4 text-blue-500" />;

  return (
    <div
      className={cn(
        'mb-3 p-4 rounded-lg border bg-card transition-all hover:shadow-sm last:mb-0',
        'border-border'
      )}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm truncate',
              !notification.isRead ? 'font-medium text-foreground' : 'text-foreground'
            )}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-1.5" />
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {notification.content}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.createdAt)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleViewDetail}
            >
              Go Now
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
