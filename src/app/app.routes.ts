import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
  },
  {
    path: 'mechanics',
    loadComponent: () => import('../pages/mechanics/mechanics').then((m) => m.Mechanics),
  }
];
