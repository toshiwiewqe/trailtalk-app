export type NotificationType = 'weather' | 'tip' | 'maintenance' | 'social';

export interface AppNotification {
  id: string;
  type: NotificationType;
  icon: string;
  iconColor: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
