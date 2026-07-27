import { InjectionToken } from '@angular/core';
import { OicCropperOptions } from './cropper.types';

export const OIC_CROPPER_DEFAULT_OPTIONS = new InjectionToken<OicCropperOptions>(
  'OIC_CROPPER_DEFAULT_OPTIONS',
  {
    providedIn: 'root',
    factory: () => OIC_CROPPER_DEFAULTS,
  },
);

export const OIC_CROPPER_DEFAULTS: OicCropperOptions = {
  aspectRatio: '16:9',
  outputFormat: 'image/png',
  outputQuality: 0.92,
  maintainAspectRatio: true,
  minCropWidth: 20,
  minCropHeight: 20,
  outputWidth: 0,
  outputHeight: 0,
  zoomStep: 0.1,
  rotateStep: 90,
  rotationMin: -45,
  rotationMax: 45,
  constrainToImage: true,
};
