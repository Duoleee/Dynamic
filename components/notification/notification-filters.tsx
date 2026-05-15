'use client';

import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/notification-context';
import { NotificationFilterType } from '@/types/notification';

const filters: { value: NotificationFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
];

export function NotificationFilters() {
  const { filter, setFilter } = useNotification();

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
