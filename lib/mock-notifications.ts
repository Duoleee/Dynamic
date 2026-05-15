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
    title: 'FRU Substitute Audit',
    content: '8 pending substitution relationships (+3 since yesterday). Please review and resolve.',
    type: 'business',
    isRead: false,
    link: '/fru-bom/mt-fru-management',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'PPN Mapping Update',
    content: '5 pending PPN mappings need approval. Please review and confirm.',
    type: 'business',
    isRead: true,
    link: '/bom/ppn-mapping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];
