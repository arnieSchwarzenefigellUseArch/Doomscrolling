import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
    title: 'Почему мы листаем бесконечную ленту? - Doomscrolling',
  },
  {
    path: 'mechanics',
    loadComponent: () => import('../pages/mechanics/mechanics').then((m) => m.Mechanics),
    title: 'Механика Doomscrolling',
  },
  {
    path: '**',
    loadComponent: () => import('../pages/not-found/not-found').then((m) => m.NotFound),
  },
];
