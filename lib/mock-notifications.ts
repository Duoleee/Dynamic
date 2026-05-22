import { Notification } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Conflict Audit',
    content: '10 pending conflicts (+3 since yesterday). Please review and resolve.',
    type: 'system',
    isRead: false,
    link: '/bom/conflict-management',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    title: 'Substitute Audit',
    content: '8 pending substitution relationships (+3 since yesterday). Please review and resolve.',
    type: 'business',
    isRead: false,
    link: '/bom/substitution-audit',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
