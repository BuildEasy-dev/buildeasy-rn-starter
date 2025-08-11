import type { DemoItem } from './types';

export const DEMO_DATA: DemoItem[] = [
  {
    id: '1',
    title: 'Document Item',
    subtitle: 'Subtitle for first item',
    description:
      'This is a longer description that can span multiple lines if needed for demonstration',
    badge: 3,
    icon: 'doc.text',
  },
  {
    id: '2',
    title: 'User Profile',
    subtitle: 'John Doe',
    description: 'Active user account',
    badge: 1,
    icon: 'person.circle',
  },
  {
    id: '3',
    title: 'Settings',
    subtitle: 'Application preferences',
    icon: 'gear',
  },
  {
    id: '4',
    title: 'Notifications',
    description: 'You have new messages',
    badge: 12,
    icon: 'bell.circle',
  },
  {
    id: '5',
    title: 'Featured Item',
    subtitle: 'Premium content',
    badge: 5,
    icon: 'star.fill',
  },
];
