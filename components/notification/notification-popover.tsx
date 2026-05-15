'use client';

import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotification } from '@/contexts/notification-context';
import { NotificationFilters } from './notification-filters';
import { NotificationList } from './notification-list';
import { toast } from 'sonner';

export function NotificationPopover() {
  const { unreadCount, markAllAsRead } = useNotification();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-lg h-9 w-9"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-[360px] p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="font-medium text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Mark all as read
          </Button>
        </div>

        {/* Filters */}
        <NotificationFilters />

        {/* List */}
        <NotificationList />

        {/* Footer */}
        <div className="border-t border-border p-2 text-center">
          <span className="text-xs text-muted-foreground">
            Only shows notifications from the last 7 days
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
