import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<AppNotification[]>([
    {
      id: 'n1',
      type: 'weather',
      icon: 'partly-sunny-outline',
      iconColor: '#5FD97A',
      title: 'Weather Alert: Cordillera',
      message: 'Clear skies expected for the next 48h. Perfect for Mt. Ulap Traverse.',
      time: 'Just now',
      read: false,
    },
    {
      id: 'n2',
      type: 'tip',
      icon: 'bag-check-outline',
      iconColor: '#4dabf7',
      title: 'Pro Tip: Packing Gear',
      message: 'Based on your recent hikes, we recommend updating your first-aid kit before the rainy season.',
      time: 'Yesterday',
      read: false,
    },
    {
      id: 'n3',
      type: 'maintenance',
      icon: 'construct-outline',
      iconColor: '#ffa94d',
      title: 'Trail Maintenance: Dulang-Dulang',
      message: 'Section 4 will be closed for trail restoration work. Plan accordingly.',
      time: '2d ago',
      read: false,
    },
    {
      id: 'n4',
      type: 'social',
      icon: 'heart-outline',
      iconColor: '#ff5b5b',
      title: 'Marcus Chen liked your post',
      message: 'Your Mt. Ulap Traverse photo is getting attention in the community.',
      time: '3d ago',
      read: true,
    },
  ]);

  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  markAsRead(id: string) {
    this._notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead() {
    this._notifications.update(list => list.map(n => ({ ...n, read: true })));
  }
}
