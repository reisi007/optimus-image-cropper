import { describe, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { OicCropper } from './cropper.component';

describe('OicCropper', () => {
  it('should instantiate via TestBed', () => {
    const fixture = TestBed.createComponent(OicCropper);
    fixture.detectChanges();
  });
});
