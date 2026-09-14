import { Injectable, signal, computed } from '@angular/core';
import { UserProfile, UpcomingAdventure } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _profile = signal<UserProfile>({
    name: 'Alex Rivera',
    location: 'Manila, Philippines',
    bio: 'Passionate mountaineer and nature photographer. Exploring the peaks of Southeast Asia one trail at a time.',
    avatar: 'https://i.pravatar.cc/300?img=68',
    totalHikes: 24,
    totalDistanceKm: 12.4,
    highestPeakM: 2954,
    email: 'alex.rivera@example.com',
    phone: '+63 912 345 6789',
    dob: '1992-05-12',
    gender: 'Male',
    emergencyContactName: '',
    emergencyContactPhone: '+63 000 000 0000',
  });

  readonly profile = computed(() => this._profile());

  private readonly _upcoming = signal<UpcomingAdventure[]>([
    {
      id: 'u1',
      trailId: 't2',
      name: 'Mt. Dulang-Dulang',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      date: 'Sep 15, 2026',
      duration: '2 - 3 Days',
    },
    {
      id: 'u2',
      trailId: 't4',
      name: 'Mt. Kitanglad',
      image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800&auto=format&fit=crop',
      date: 'Oct 12, 2026',
      duration: '1 Day',
    },
  ]);

  readonly upcoming = computed(() => this._upcoming());

  private readonly _isAuthenticated = signal<boolean>(true);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  updateProfile(partial: Partial<UserProfile>) {
    this._profile.update(p => ({ ...p, ...partial }));
  }

  updateAvatar(dataUrl: string) {
    this._profile.update(p => ({ ...p, avatar: dataUrl }));
  }

  addUpcoming(adv: UpcomingAdventure) {
    this._upcoming.update(list => [adv, ...list]);
  }

  removeUpcoming(id: string) {
    this._upcoming.update(list => list.filter(a => a.id !== id));
  }

  signOut() {
    this._isAuthenticated.set(false);
  }

  signIn() {
    this._isAuthenticated.set(true);
  }
}
