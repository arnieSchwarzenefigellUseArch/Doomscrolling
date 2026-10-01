import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'mechanics',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    status: 404,
    renderMode: RenderMode.Server,
  },
];
