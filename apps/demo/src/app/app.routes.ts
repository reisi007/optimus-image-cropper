import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./pages/cropper-demo/cropper-demo').then(m => m.CropperDemo) },
];
