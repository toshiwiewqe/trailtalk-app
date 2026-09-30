import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', loadComponent: () => import('../pages/home/home.page').then(m => m.HomePage) },
      { path: 'explore', loadComponent: () => import('../pages/explore/explore.page').then(m => m.ExplorePage) },
      { path: 'community', loadComponent: () => import('../pages/community/community.page').then(m => m.CommunityPage) },
      {
  path: 'bookings',
  loadComponent: () =>
    import('../pages/booking-history/booking-history.page').then((m) => m.BookingHistoryPage),
},
{ path: 'planner', redirectTo: 'bookings', pathMatch: 'full' },
      { path: 'profile', loadComponent: () => import('../pages/profile/profile.page').then(m => m.ProfilePage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
