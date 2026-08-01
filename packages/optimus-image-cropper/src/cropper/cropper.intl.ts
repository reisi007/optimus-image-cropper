import { InjectionToken, Provider } from '@angular/core';

export interface OicCropperIntl {
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  fineRotation: string;
  aspectRatio: string;
  aspectFree: string;
}

export const OIC_CROPPER_INTL_DEFAULTS: OicCropperIntl = {
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  rotateLeft: 'Rotate Left',
  rotateRight: 'Rotate Right',
  fineRotation: 'Fine rotation',
  aspectRatio: 'Aspect ratio',
  aspectFree: 'Free',
};

export const OIC_CROPPER_INTL = new InjectionToken<OicCropperIntl>(
  'OIC_CROPPER_INTL',
  {
    providedIn: 'root',
    factory: () => OIC_CROPPER_INTL_DEFAULTS,
  },
);

export function provideOicCropperIntl(intl: Partial<OicCropperIntl>): Provider[] {
  return [
    { provide: OIC_CROPPER_INTL, useValue: { ...OIC_CROPPER_INTL_DEFAULTS, ...intl } },
  ];
}

export function provideOicCropperIntlFromLocale(locale: {
  aria?: Record<string, string>;
}): Provider[] {
  const aria = locale?.aria ?? {};
  return [
    {
      provide: OIC_CROPPER_INTL,
      useValue: {
        zoomIn: aria['zoomIn'] ?? OIC_CROPPER_INTL_DEFAULTS.zoomIn,
        zoomOut: aria['zoomOut'] ?? OIC_CROPPER_INTL_DEFAULTS.zoomOut,
        rotateLeft: aria['rotateLeft'] ?? OIC_CROPPER_INTL_DEFAULTS.rotateLeft,
        rotateRight: aria['rotateRight'] ?? OIC_CROPPER_INTL_DEFAULTS.rotateRight,
        fineRotation: OIC_CROPPER_INTL_DEFAULTS.fineRotation,
        aspectRatio: OIC_CROPPER_INTL_DEFAULTS.aspectRatio,
        aspectFree: OIC_CROPPER_INTL_DEFAULTS.aspectFree,
      },
    },
  ];
}
