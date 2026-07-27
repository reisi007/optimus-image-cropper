import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { OicCropper, OicCropperGridOverlay } from '@all-the.rest/optimus-image-cropper';
import type { OicCropperResult, OicOutputFormat, OicAspectRatioPreset } from '@all-the.rest/optimus-image-cropper';

import { Card } from '@openng/optimus-ui/card';
import { Select } from '@openng/optimus-ui/select';
import { ToggleSwitch } from '@openng/optimus-ui/toggleswitch';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Button } from '@openng/optimus-ui/button';

const VALID_IMAGE = 'https://picsum.photos/800/600';
const INVALID_IMAGE = 'https://invalid.example/nonexistent.jpg';

@Component({
  selector: 'oic-cropper-demo',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    OicCropper, OicCropperGridOverlay,
    Card, Select, ToggleSwitch, InputText, Button,
  ],
  styleUrl: './cropper-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="cropper-demo">

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Basic Cropper (16:9)</h2>
    <p class="cropper-demo__description">Default 16:9 aspect ratio. Drag to crop, zoom with +/-, rotate with the slider.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="max-w-800">
          <oic-cropper
            [src]="basicSrc"
            [rotationMin]="-10"
            [rotationMax]="10"
            [(croppedImage)]="basicOutput"
            (cropChange)="onBasicCrop($event)"
            (loadError)="basicError.set($event)"
          >
            <oic-cropper-grid-overlay />
          </oic-cropper>
        </div>
        <div class="cropper-demo__result">
          <p class="text-sm font-medium cropper-demo__label">Cropped Result</p>
          @if (basicOutput()) {
            <img [src]="basicOutput()" class="cropper-demo__preview" alt="Cropped preview" />
          }
          <p class="text-xs cropper-demo__dimensions">{{ basicDimensions().width }} &times; {{ basicDimensions().height }} px</p>
        </div>
        @if (basicError()) {
          <p class="cropper-demo__error">{{ basicError() }}</p>
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Square 1:1 (Fixed Aspect)</h2>
    <p class="cropper-demo__description">Fixed 1:1 aspect ratio in a 320px square container. No aspect dropdown shown.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="cropper-demo__square-container">
          <oic-cropper
            [src]="basicSrc"
            [aspectRatio]="'1:1'"
            [rotationMin]="-10"
            [rotationMax]="10"
            [(croppedImage)]="squareOutput"
            (cropChange)="onSquareCrop($event)"
          />
        </div>
        @if (squareResult()) {
          <p class="text-xs cropper-demo__dimensions">{{ squareResult()!.width }} &times; {{ squareResult()!.height }} px</p>
        }
        @if (squareOutput()) {
          <img [src]="squareOutput()" class="cropper-demo__preview" alt="Square crop output" />
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Free Aspect Ratio</h2>
    <p class="cropper-demo__description">Container has 4:3 aspect ratio. Aspect ratio selector is visible.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="cropper-demo__free-container">
          <oic-cropper
            [src]="basicSrc"
            [aspectRatio]="'free'"
            [rotationMin]="-10"
            [rotationMax]="10"
            [(croppedImage)]="freeOutput"
            (cropChange)="onFreeCrop($event)"
          >
            <oic-cropper-grid-overlay />
          </oic-cropper>
        </div>
        @if (freeResult()) {
          <p class="text-xs cropper-demo__dimensions">{{ freeResult()!.width }} &times; {{ freeResult()!.height }} px</p>
        }
        @if (freeOutput()) {
          <img [src]="freeOutput()" class="cropper-demo__preview" alt="Free crop output" />
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Fixed Width with Sidebar</h2>
    <p class="cropper-demo__description">Set a fixed width like <code>[width]="600"</code> so the cropper size stays constant regardless of sibling layout changes.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <oic-cropper
          [src]="basicSrc"
          [width]="600"
          [aspectRatio]="'16:9'"
          [rotationMin]="-10"
          [rotationMax]="10"
          (cropChange)="onFixedCrop($event)"
        />
        @if (fixedResult()) {
          <p class="text-xs cropper-demo__dimensions">{{ fixedResult()!.width }} &times; {{ fixedResult()!.height }} px</p>
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Error Handling</h2>
    <p class="cropper-demo__description">When the image fails to load, a <code>loadError</code> event is emitted.</p>
    <p-card>
      <div class="cropper-demo__card-body cropper-demo__card-body--stacked">
        <oic-cropper
          [src]="errorSrc()"
          (loadError)="errorMsg.set($event)"
          [rotationMin]="-10"
          [rotationMax]="10"
        />
        <div class="cropper-demo__button-row">
          <p-button label="Invalid Image" [outlined]="true" (onClick)="errorSrc.set(INVALID_IMAGE)" />
          <p-button label="Restore Valid" severity="primary" (onClick)="errorSrc.set(VALID_IMAGE)" />
        </div>
        @if (errorMsg()) {
          <p class="cropper-demo__error">{{ errorMsg() }}</p>
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Dynamic Configuration</h2>
    <p class="cropper-demo__description">Change aspect ratio, format, quality, and output size on the fly.</p>
    <p-card>
      <div class="cropper-demo__card-body cropper-demo__card-body--stacked">
        <oic-cropper
          [src]="basicSrc"
          [aspectRatio]="dynAspect()"
          [outputFormat]="dynFormat()"
          [outputQuality]="dynQuality()"
          [outputWidth]="dynWidth()"
          [outputHeight]="dynHeight()"
          [rotationMin]="-10"
          [rotationMax]="10"
          [(croppedImage)]="dynOutput"
          (cropChange)="onDynCrop($event)"
        >
          <oic-cropper-grid-overlay />
        </oic-cropper>

        <div class="cropper-demo__controls-grid">
          <div>
            <span class="cropper-demo__control-label">Aspect</span>
            <p-select
              [options]="aspectOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="dynAspect()"
              (ngModelChange)="dynAspect.set($event)"
              styleClass="w-full"
            />
          </div>
          <div>
            <span class="cropper-demo__control-label">Format</span>
            <p-select
              [options]="formatOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="dynFormat()"
              (ngModelChange)="dynFormat.set($event)"
              styleClass="w-full"
            />
          </div>
          <div>
            <span class="cropper-demo__control-label">Quality</span>
            <p-select
              [options]="qualityOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="dynQuality()"
              (ngModelChange)="dynQuality.set($event)"
              styleClass="w-full"
            />
          </div>
          <div>
            <span class="cropper-demo__control-label">Width</span>
            <input
              pInputText
              type="number"
              min="0"
              max="2048"
              [ngModel]="dynWidth()"
              (ngModelChange)="dynWidth.set($event)"
              class="cropper-demo__number-input"
            />
          </div>
          <div>
            <span class="cropper-demo__control-label">Height</span>
            <input
              pInputText
              type="number"
              min="0"
              max="2048"
              [ngModel]="dynHeight()"
              (ngModelChange)="dynHeight.set($event)"
              class="cropper-demo__number-input"
            />
          </div>
        </div>

        @if (dynOutput()) {
          <div class="cropper-demo__result">
            <p class="text-sm font-medium cropper-demo__label">Output</p>
            <img [src]="dynOutput()" class="cropper-demo__preview" alt="Dynamic cropper output" />
            <p class="text-xs cropper-demo__dimensions">{{ dynDimensions().width }} &times; {{ dynDimensions().height }} px</p>
          </div>
        }
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Toolbar Positions</h2>
    <p class="cropper-demo__description">The toolbar can be placed at top, bottom (default), left, or right.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="cropper-demo__toolbar-grid">
          <div>
            <p class="text-xs font-medium cropper-demo__toolbar-label">Bottom (default)</p>
            <oic-cropper [src]="basicSrc" toolbarPosition="bottom" [rotationMin]="-10" [rotationMax]="10" />
          </div>
          <div>
            <p class="text-xs font-medium cropper-demo__toolbar-label">Top</p>
            <oic-cropper [src]="basicSrc" toolbarPosition="top" [rotationMin]="-10" [rotationMax]="10" />
          </div>
          <div>
            <p class="text-xs font-medium cropper-demo__toolbar-label">Left</p>
            <oic-cropper [src]="basicSrc" toolbarPosition="left" [rotationMin]="-10" [rotationMax]="10" />
          </div>
          <div>
            <p class="text-xs font-medium cropper-demo__toolbar-label">Right</p>
            <oic-cropper [src]="basicSrc" toolbarPosition="right" [rotationMin]="-10" [rotationMax]="10" />
          </div>
        </div>
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Constrain to Image</h2>
    <p class="cropper-demo__description">
      When <code>constrainToImage</code> is <code>true</code> (default), the crop selection cannot leave the original image area — even when zooming out or rotating.
    </p>
    <p-card>
      <div class="cropper-demo__card-body cropper-demo__card-body--stacked">
        <div class="cropper-demo__toggle-row">
          <p-toggleSwitch
            [ngModel]="constrainEnabled()"
            (ngModelChange)="constrainEnabled.set($event)"
          />
          <span class="cropper-demo__toggle-label">
            constrainToImage: <strong>{{ constrainEnabled() }}</strong>
          </span>
        </div>
        <div class="max-w-800">
          <oic-cropper
            [src]="basicSrc"
            [constrainToImage]="constrainEnabled()"
            [aspectRatio]="'free'"
            [rotationMin]="-180"
            [rotationMax]="180"
            (cropChange)="onConstrainCrop($event)"
          />
        </div>
        @if (constrainResult()) {
          <p class="text-xs cropper-demo__dimensions">{{ constrainResult()!.width }} x {{ constrainResult()!.height }} px</p>
        }
        <p class="text-xs cropper-demo__dimensions">
          Try zooming out (<kbd>-</kbd>) or rotating (<kbd>r</kbd>).
          @if (constrainEnabled()) { The crop stays inside the image. }
          @else { The crop can extend into the dark letterbox area. }
        </p>
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Template-driven Form</h2>
    <p class="cropper-demo__description">Using ngModel with the cropper. The model value is the cropped image data URL.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="max-w-800">
          <oic-cropper
            [src]="basicSrc"
            ngModel
            name="cropperModel"
            #cropperModelRef="ngModel"
            [rotationMin]="-10"
            [rotationMax]="10"
            (cropChange)="onTemplateCrop($event)"
          />
        </div>
        <p class="text-xs cropper-demo__dimensions">Model value: {{ cropperModelRef.value?.length ? (cropperModelRef.value.length + ' chars') : 'none' }}</p>
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Reactive Form</h2>
    <p class="cropper-demo__description">Using formControl with the cropper. The control value is the cropped image data URL.</p>
    <p-card>
      <div class="cropper-demo__card-body cropper-demo__card-body--stacked">
        <div class="max-w-800">
          <oic-cropper
            [src]="basicSrc"
            [formControl]="cropControl"
            [rotationMin]="-10"
            [rotationMax]="10"
            (cropChange)="onReactiveCrop($event)"
          />
        </div>
        <p class="text-xs cropper-demo__dimensions">Control value: {{ cropControl.value?.length ? (cropControl.value!.length + ' chars') : 'none' }}</p>
        <p class="text-sm cropper-demo__dimensions">Control enabled: {{ cropControl.enabled }}</p>
        <div class="cropper-demo__button-row">
          <p-button label="Toggle disabled" [outlined]="true" (onClick)="cropControl.disabled ? cropControl.enable() : cropControl.disable()" />
        </div>
      </div>
    </p-card>
  </section>

  <section class="cropper-demo__section">
    <h2 class="cropper-demo__heading">Signal Form</h2>
    <p class="cropper-demo__description">Using model() signal directly — no FormsModule or ReactiveFormsModule needed.</p>
    <p-card>
      <div class="cropper-demo__card-body">
        <div class="max-w-800">
          <oic-cropper
            [src]="basicSrc"
            [(croppedImage)]="signalCropped"
            [rotationMin]="-10"
            [rotationMax]="10"
            (cropChange)="onSignalCrop($event)"
          />
        </div>
        <p class="text-xs cropper-demo__dimensions">Signal value: {{ signalCropped().length ? (signalCropped().length + ' chars') : 'none' }}</p>
      </div>
    </p-card>
  </section>

</div>
  `,
})
export class CropperDemo {
  protected readonly VALID_IMAGE = VALID_IMAGE;
  protected readonly INVALID_IMAGE = INVALID_IMAGE;

  readonly basicSrc = VALID_IMAGE;
  readonly basicOutput = signal('');
  readonly basicDimensions = signal({ width: 0, height: 0 });
  readonly basicError = signal('');

  readonly squareResult = signal<OicCropperResult | null>(null);
  readonly squareOutput = signal('');
  readonly freeResult = signal<OicCropperResult | null>(null);
  readonly freeOutput = signal('');

  readonly errorSrc = signal(VALID_IMAGE);
  readonly errorMsg = signal('');

  readonly dynAspect = signal<OicAspectRatioPreset>('16:9');
  readonly dynFormat = signal<OicOutputFormat>('image/png');
  readonly dynQuality = signal(0.92);
  readonly dynWidth = signal(0);
  readonly dynHeight = signal(0);
  readonly dynOutput = signal('');
  readonly dynDimensions = signal({ width: 0, height: 0 });

  readonly fixedResult = signal<OicCropperResult | null>(null);

  readonly constrainEnabled = signal(true);
  readonly constrainResult = signal<OicCropperResult | null>(null);

  readonly cropControl = new FormControl<string>('');
  readonly signalCropped = signal('');

  readonly aspectOptions: { label: string; value: OicAspectRatioPreset }[] = [
    { label: 'Free', value: 'free' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '16:9', value: '16:9' },
  ];

  readonly formatOptions: { label: string; value: OicOutputFormat }[] = [
    { label: 'PNG', value: 'image/png' },
    { label: 'JPEG', value: 'image/jpeg' },
    { label: 'WebP', value: 'image/webp' },
  ];

  readonly qualityOptions: { label: string; value: number }[] = [
    { label: '0.1', value: 0.1 },
    { label: '0.5', value: 0.5 },
    { label: '0.75', value: 0.75 },
    { label: '0.92', value: 0.92 },
    { label: '1', value: 1 },
  ];

  onBasicCrop(result: OicCropperResult): void {
    this.basicDimensions.set({ width: result.width, height: result.height });
  }

  onSquareCrop(result: OicCropperResult): void {
    this.squareResult.set(result);
  }

  onFreeCrop(result: OicCropperResult): void {
    this.freeResult.set(result);
  }

  onFixedCrop(result: OicCropperResult): void {
    this.fixedResult.set(result);
  }

  onDynCrop(result: OicCropperResult): void {
    this.dynDimensions.set({ width: result.width, height: result.height });
  }

  onConstrainCrop(result: OicCropperResult): void {
    this.constrainResult.set(result);
  }

  onTemplateCrop(result: OicCropperResult): void {
    void result;
  }

  onReactiveCrop(result: OicCropperResult): void {
    void result;
  }

  onSignalCrop(result: OicCropperResult): void {
    void result;
  }
}
