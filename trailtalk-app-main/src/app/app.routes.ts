import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.tabsRoutes),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
  },
  {
    path: 'personal-info',
    loadComponent: () => import('./pages/personal-info/personal-info.page').then(m => m.PersonalInfoPage),
  },
  {
    path: 'trail/:id',
    loadComponent: () => import('./pages/trail-detail/trail-detail.page').then(m => m.TrailDetailPage),
  },
  {
  path: 'booking/:id',
  loadComponent: () => import('./pages/booking/booking.page').then(m => m.BookingPage),
},
{
  path: 'checkout',
  loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage),
},
{
  path: 'booking-confirmed/:id',
  loadComponent: () => import('./pages/booking-confirmed/booking-confirmed.page').then(m => m.BookingConfirmedPage),
},
];
