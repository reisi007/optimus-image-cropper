import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./pages/cropper-demo/cropper-demo').then(m => m.CropperDemo) },
  { path: 'impressum', loadComponent: () => import('./pages/impressum/impressum').then(m => m.Impressum) },
];
