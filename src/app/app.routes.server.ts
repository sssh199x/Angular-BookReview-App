import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender, // Pages are rendered at build time

  },
  {
    path: 'book/:id',
    renderMode: RenderMode.Server  // Server Side Rendering On-Demand
  },

];
