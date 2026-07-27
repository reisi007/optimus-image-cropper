import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  OIC_CROPPER_INTL,
  OIC_CROPPER_INTL_DEFAULTS,
  provideOicCropperIntl,
  provideOicCropperIntlFromPrimeLocale,
} from './cropper.intl';

describe('OicCropperIntl', () => {
  it('should provide en-US defaults via root token', () => {
    const intl = TestBed.inject(OIC_CROPPER_INTL);
    expect(intl).toEqual(OIC_CROPPER_INTL_DEFAULTS);
  });

  it('should override selected keys via provideOicCropperIntl', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideOicCropperIntl({ zoomIn: 'Vergrößern', zoomOut: 'Verkleinern' })],
    });
    const intl = TestBed.inject(OIC_CROPPER_INTL);
    expect(intl.zoomIn).toBe('Vergrößern');
    expect(intl.zoomOut).toBe('Verkleinern');
    expect(intl.rotateLeft).toBe(OIC_CROPPER_INTL_DEFAULTS.rotateLeft);
    expect(intl.fineRotation).toBe(OIC_CROPPER_INTL_DEFAULTS.fineRotation);
  });

  it('should map primelocale-shaped object via provideOicCropperIntlFromPrimeLocale', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideOicCropperIntlFromPrimeLocale({
          aria: {
            zoomIn: 'Rein',
            zoomOut: 'Uit',
            rotateLeft: 'Links',
            rotateRight: 'Rechts',
          },
        }),
      ],
    });
    const intl = TestBed.inject(OIC_CROPPER_INTL);
    expect(intl.zoomIn).toBe('Rein');
    expect(intl.zoomOut).toBe('Uit');
    expect(intl.rotateLeft).toBe('Links');
    expect(intl.rotateRight).toBe('Rechts');
    expect(intl.fineRotation).toBe(OIC_CROPPER_INTL_DEFAULTS.fineRotation);
    expect(intl.aspectRatio).toBe(OIC_CROPPER_INTL_DEFAULTS.aspectRatio);
    expect(intl.aspectFree).toBe(OIC_CROPPER_INTL_DEFAULTS.aspectFree);
  });

  it('should fall back to en-US for missing primelocale keys', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideOicCropperIntlFromPrimeLocale({
          aria: { zoomIn: 'Rein' },
        }),
      ],
    });
    const intl = TestBed.inject(OIC_CROPPER_INTL);
    expect(intl.zoomIn).toBe('Rein');
    expect(intl.zoomOut).toBe(OIC_CROPPER_INTL_DEFAULTS.zoomOut);
    expect(intl.rotateLeft).toBe(OIC_CROPPER_INTL_DEFAULTS.rotateLeft);
    expect(intl.rotateRight).toBe(OIC_CROPPER_INTL_DEFAULTS.rotateRight);
  });

  it('should handle empty/null primelocale object gracefully', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideOicCropperIntlFromPrimeLocale({})],
    });
    const intl = TestBed.inject(OIC_CROPPER_INTL);
    expect(intl).toEqual(OIC_CROPPER_INTL_DEFAULTS);
  });
});
