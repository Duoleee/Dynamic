'use client';

import { Inbox } from 'lucide-react';

export function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-[320px] px-4">
      <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-sm font-medium text-muted-foreground">No notifications</p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        New notifications will appear here
      </p>
    </div>
  );
}
