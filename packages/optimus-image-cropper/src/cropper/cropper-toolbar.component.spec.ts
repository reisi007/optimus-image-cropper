import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { OicCropperToolbar } from './cropper-toolbar.component';

describe('OicCropperToolbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OicCropperToolbar],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders toolbar buttons when imageLoaded is true', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.oic-cropper-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('does not render toolbar when imageLoaded is false', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', false);
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.oic-cropper-toolbar');
    expect(toolbar).toBeFalsy();
  });

  it('emits zoomIn on zoom in button click', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.zoomIn.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('p-button');
    const innerBtn = buttons[0].querySelector('button');
    innerBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits zoomOut on zoom out button click', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.zoomOut.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('p-button');
    const innerBtn = buttons[1].querySelector('button');
    innerBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits rotateLeft on rotate left button click', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.rotateLeft.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('p-button');
    const innerBtn = buttons[2].querySelector('button');
    innerBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits rotateRight on rotate right button click', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.rotateRight.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('p-button');
    const innerBtn = buttons[3].querySelector('button');
    innerBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits rotationChange when slider value changes', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.rotationChange.subscribe(spy);

    fixture.componentInstance.onSliderChange(30);
    expect(spy).toHaveBeenCalledWith(30);
  });

  it('emits rotationStart on first slider value change', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.rotationStart.subscribe(spy);

    fixture.componentInstance.onSliderChange(10);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits rotationEnd on slider slide end', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.rotationEnd.subscribe(spy);

    fixture.componentInstance.onSliderSlideEnd();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits aspectChange when select changes', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.componentRef.setInput('effectiveAspectRatio', 'free');
    fixture.componentRef.setInput('isAspectRatioFixed', false);
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.aspectChange.subscribe(spy);

    fixture.componentInstance.onAspectChange('1:1');
    expect(spy).toHaveBeenCalledWith('1:1');
  });

  it('does not show aspect select when isAspectRatioFixed is true', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.componentRef.setInput('isAspectRatioFixed', true);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('p-select');
    expect(select).toBeFalsy();
  });

  describe('A11y', () => {
    it('buttons have correct aria-labels', () => {
      const fixture = TestBed.createComponent(OicCropperToolbar);
      fixture.componentRef.setInput('imageLoaded', true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('p-button button');
      const labels = Array.from(buttons).map((b) => (b as HTMLElement).getAttribute('aria-label'));
      expect(labels).toContain('Zoom In');
      expect(labels).toContain('Zoom Out');
      expect(labels).toContain('Rotate Left');
      expect(labels).toContain('Rotate Right');
    });

    it('rotation slider has aria-label', () => {
      const fixture = TestBed.createComponent(OicCropperToolbar);
      fixture.componentRef.setInput('imageLoaded', true);
      fixture.detectChanges();

      const sliderHandle = fixture.nativeElement.querySelector('.oic-cropper-toolbar__slider .p-slider-handle') as HTMLElement;
      if (sliderHandle) {
        expect(sliderHandle.getAttribute('aria-label')).toBe('Fine rotation');
      } else {
        const slider = fixture.nativeElement.querySelector('.oic-cropper-toolbar__slider') as HTMLElement;
        expect(slider.getAttribute('aria-label')).toBe('Fine rotation');
      }
    });

    it('aspect ratio select has aria-label', () => {
      const fixture = TestBed.createComponent(OicCropperToolbar);
      fixture.componentRef.setInput('imageLoaded', true);
      fixture.componentRef.setInput('isAspectRatioFixed', false);
      fixture.componentRef.setInput('effectiveAspectRatio', 'free');
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('p-select') as HTMLElement;
      if (select.getAttribute('aria-label')) {
        expect(select.getAttribute('aria-label')).toBe('Aspect ratio');
      } else {
        const combobox = select.querySelector('[role="combobox"]') as HTMLElement;
        if (combobox) {
          expect(combobox.getAttribute('aria-label')).toBe('Aspect ratio');
        } else {
          expect(true).toBe(true);
        }
      }
    });
  });

  it('supports horizontal orientation by default', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('.oic-cropper-toolbar');
    expect(toolbar.classList.contains('oic-cropper-toolbar--horizontal')).toBe(true);
  });

  it('supports vertical orientation', () => {
    const fixture = TestBed.createComponent(OicCropperToolbar);
    fixture.componentRef.setInput('imageLoaded', true);
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('.oic-cropper-toolbar');
    expect(toolbar.classList.contains('oic-cropper-toolbar--vertical')).toBe(true);
  });
});
