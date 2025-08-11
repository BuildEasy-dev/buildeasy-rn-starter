export interface DemoItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: number;
  icon?: 'doc.text' | 'person.circle' | 'gear' | 'bell.circle' | 'star.fill';
}
