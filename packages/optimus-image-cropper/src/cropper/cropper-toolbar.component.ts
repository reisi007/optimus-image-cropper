import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@openng/optimus-ui/button';
import { Slider } from '@openng/optimus-ui/slider';
import { Select } from '@openng/optimus-ui/select';
import { SearchPlusIcon } from '@openng/optimus-ui/icons/searchplus';
import { SearchMinusIcon } from '@openng/optimus-ui/icons/searchminus';
import { RefreshIcon } from '@openng/optimus-ui/icons/refresh';
import { UndoIcon } from '@openng/optimus-ui/icons/undo';
import { OicAspectRatioPreset } from '../core/cropper.types';
import { OIC_CROPPER_INTL } from './cropper.intl';

@Component({
  selector: 'oic-cropper-toolbar',
  standalone: true,
  imports: [FormsModule, Button, Slider, Select, SearchPlusIcon, SearchMinusIcon, RefreshIcon, UndoIcon],
  styleUrl: './cropper-toolbar.component.scss',
  template: `
    @if (imageLoaded()) {
      <div
        class="oic-cropper-toolbar"
        [class.oic-cropper-toolbar--horizontal]="orientation() === 'horizontal'"
        [class.oic-cropper-toolbar--vertical]="orientation() === 'vertical'">
        <div class="oic-cropper-toolbar__group">
          <p-button rounded text severity="secondary" [ariaLabel]="intl.zoomIn" (onClick)="zoomIn.emit()">
            <svg data-p-icon="search-plus"></svg>
          </p-button>
          <p-button rounded text severity="secondary" [ariaLabel]="intl.zoomOut" (onClick)="zoomOut.emit()">
            <svg data-p-icon="search-minus"></svg>
          </p-button>
          <span class="oic-cropper-toolbar__value">{{ zoomLevel() }}%</span>
        </div>
        <div class="oic-cropper-toolbar__group">
          <p-button rounded text severity="secondary" [ariaLabel]="intl.rotateLeft" (onClick)="rotateLeft.emit()">
            <svg data-p-icon="undo"></svg>
          </p-button>
          <p-button rounded text severity="secondary" [ariaLabel]="intl.rotateRight" (onClick)="rotateRight.emit()">
            <svg data-p-icon="refresh"></svg>
          </p-button>
          <p-slider
            class="oic-cropper-toolbar__slider"
            [min]="rotationMin()"
            [max]="rotationMax()"
            [step]="1"
            [ngModel]="rotationAngle()"
            (ngModelChange)="onSliderChange($event)"
            (onSlideEnd)="onSliderSlideEnd()"
            [ariaLabel]="intl.fineRotation"
          />
          <span class="oic-cropper-toolbar__value oic-cropper-toolbar__value--narrow">{{ rotationAngle() }}°</span>
          <span class="oic-cropper-toolbar__rotation-info">/ {{ totalRotation() }}°</span>
        </div>
        @if (!isAspectRatioFixed()) {
          <div class="oic-cropper-toolbar__group">
            <span class="oic-cropper-toolbar__label">{{ intl.aspectRatio }}</span>
          <p-select
            [options]="aspectOptions"
            optionLabel="label"
            optionValue="value"
            [ngModel]="effectiveAspectRatio()"
            (ngModelChange)="onAspectChange($event)"
            appendTo="body"
            [ariaLabel]="intl.aspectRatio"
          />
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OicCropperToolbar {
  readonly imageLoaded = input(false);
  readonly zoomLevel = input(0);
  readonly rotationAngle = input(0);
  readonly totalRotation = input(0);
  readonly isAspectRatioFixed = input(false);
  readonly effectiveAspectRatio = input<OicAspectRatioPreset>('free');
  readonly rotationMin = input<number>(-45);
  readonly rotationMax = input<number>(45);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly rotateLeft = output<void>();
  readonly rotateRight = output<void>();
  readonly rotationChange = output<number>();
  readonly aspectChange = output<OicAspectRatioPreset>();
  readonly rotationStart = output<void>();
  readonly rotationEnd = output<void>();

  readonly intl = inject(OIC_CROPPER_INTL);

  readonly aspectOptions: { label: string; value: OicAspectRatioPreset }[] = [
    { label: 'Free', value: 'free' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '16:9', value: '16:9' },
  ];

  private _sliderDragging = false;

  onSliderChange(value: number): void {
    if (!this._sliderDragging) {
      this._sliderDragging = true;
      this.rotationStart.emit();
    }
    this.rotationChange.emit(value);
  }

  onSliderSlideEnd(): void {
    this._sliderDragging = false;
    this.rotationEnd.emit();
  }

  onAspectChange(value: OicAspectRatioPreset): void {
    this.aspectChange.emit(value);
  }
}
