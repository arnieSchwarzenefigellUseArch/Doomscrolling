import {Routes} from '@angular/router';
import {Home} from '../pages/home/home';
import {appEntryGuard} from '@core/guards/app-entry-guard';

export const routes: Routes = [
  {
    path: '',
    canMatch: [appEntryGuard],
    pathMatch: 'full',
    children: [],
  },
  {
    path: 'app',
    component: Home,
    title: 'Почему мы листаем бесконечную ленту? - Doomscrolling',
  },
  {
    path: 'mechanics',
    loadComponent: () => import('../pages/mechanics/mechanics').then((m) => m.Mechanics),
    title: 'Механика - Doomscrolling',
  },
  {
    path: '**',
    loadComponent: () => import('../pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Страница не найдена - Doomscrolling',
  },
];
