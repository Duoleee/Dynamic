'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotification } from '@/contexts/notification-context';
import { NotificationItem } from './notification-item';
import { NotificationEmpty } from './notification-empty';

export function NotificationList() {
  const { filteredNotifications } = useNotification();

  if (filteredNotifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <ScrollArea className="h-[320px]">
      <div className="p-4">
        {filteredNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </ScrollArea>
  );
}
