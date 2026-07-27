import { InjectionToken } from '@angular/core';
import { en } from 'primelocale/js/en.js';

export interface OicCropperIntl {
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  fineRotation: string;
  aspectRatio: string;
  aspectFree: string;
}

export const OIC_CROPPER_INTL = new InjectionToken<OicCropperIntl>(
  'OIC_CROPPER_INTL',
  {
    providedIn: 'root',
    factory: () => {
      const aria = en?.aria ?? {};
      return {
        zoomIn: (aria['zoomIn'] as string) ?? 'Zoom in',
        zoomOut: (aria['zoomOut'] as string) ?? 'Zoom out',
        rotateLeft: (aria['rotateLeft'] as string) ?? 'Rotate left',
        rotateRight: (aria['rotateRight'] as string) ?? 'Rotate right',
        fineRotation: 'Fine rotation',
        aspectRatio: 'Aspect ratio',
        aspectFree: 'Free',
      };
    },
  },
);
