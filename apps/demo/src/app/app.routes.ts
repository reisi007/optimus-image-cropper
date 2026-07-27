import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/cropper', pathMatch: 'full' },
  { path: 'cropper', loadComponent: () => import('./pages/cropper-demo/cropper-demo').then(m => m.CropperDemo) },
];
