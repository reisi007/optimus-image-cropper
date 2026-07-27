# @all-the.rest/optimus-image-cropper

Canvas-based Angular Image Cropper built on Optimus UI

[![npm](https://img.shields.io/npm/v/@all-the.rest/optimus-image-cropper)](https://www.npmjs.com/package/@all-the.rest/optimus-image-cropper)
[![CI](https://img.shields.io/github/actions/workflow/status/reisi007/optimus-image-cropper/ci.yml)](https://github.com/reisi007/optimus-image-cropper/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/reisi007/optimus-image-cropper)](LICENSE)

> **[Live Demo](https://optimus-image-cropper.all-the.rest)** — try it now

---

## Features

- **Canvas-based** crop, zoom, rotate, and pan with real-time preview
- **Touch + keyboard** support — pinch-to-zoom, arrow keys, keyboard shortcuts
- **Angular 21** — standalone, signals-based, zoneless (`provideZonelessChangeDetection`)
- **Optimus UI / PrimeNG theming** — Aura-compatible `--p-*` design tokens
- **SSR-safe** — DOM/Canvas access behind `ensureBrowser()` guard
- **ControlValueAccessor** — works with template-driven and reactive forms
- **i18n** via `primelocale` (optional) with built-in en-US fallback

---

## Install

```sh
pnpm add @all-the.rest/optimus-image-cropper @openng/optimus-ui @openng/optimus-ui-themes
```

**Peer dependencies:**
- `@angular/core`, `@angular/common`, `@angular/forms` — `^21.0.0`
- `@openng/optimus-ui` — `^1.0.0-rc.1`
- `primelocale` — `^2.4.0` (optional, for localized ARIA labels)

---

## Quickstart

```typescript
import { Component } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/core';
import { Aura } from '@openng/optimus-ui-themes';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { OicCropper } from '@all-the.rest/optimus-image-cropper';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideOptimus({ theme: { preset: Aura } }),
  ],
});

@Component({
  standalone: true,
  imports: [OicCropper],
  template: `
    <oic-cropper
      src="https://picsum.photos/800/600"
      aspectRatio="16:9"
      [(croppedImage)]="cropped"
    />
  `,
})
export class AppComponent {
  cropped = '';
}
```

The library is **zoneless-safe** — use `provideZonelessChangeDetection()` in your app (no `zone.js` required).

---

## API

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `''` | Image URL (absolute, relative, or data-URL) |
| `aspectRatio` | `'free' \| '1:1' \| '4:3' \| '16:9'` | `'16:9'` | When not `'free'` the aspect ratio selector is hidden and the crop is locked to the given ratio |
| `overlayTemplate` | `string` | `''` | Reserved for future use — SVG template string for custom overlay |
| `outputFormat` | `'image/png' \| 'image/jpeg' \| 'image/webp'` | `'image/png'` | Output format |
| `outputQuality` | `number` | `0.92` | Quality for JPEG/WebP (`0`–`1`) |
| `minCropWidth` | `number` | `20` | Minimum crop selection width in CSS pixels |
| `minCropHeight` | `number` | `20` | Minimum crop selection height in CSS pixels |
| `outputWidth` | `number` | `0` | Fixed output width in pixels (`0` = auto from crop selection) |
| `outputHeight` | `number` | `0` | Fixed output height in pixels (`0` = auto from crop selection) |
| `rotationMin` | `number` | `-45` | Minimum fine-rotation slider value (degrees) |
| `rotationMax` | `number` | `45` | Maximum fine-rotation slider value (degrees) |
| `rotationStepInput` | `number` | `1` | Fine-rotation slider step (degrees) |
| `constrainToImage` | `boolean` | `true` | When `true`, the crop selection cannot leave the visible image bounds |
| `toolbarPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Toolbar placement relative to the viewport |
| `width` | `string \| number` | `'100%'` | Viewport width (CSS value or pixel number) |

### Outputs

| Output | Type | Description |
|---|---|---|
| `cropChange` | `OicCropperResult` | Emitted on every crop change |
| `loadError` | `string` | Emitted when image loading fails (the URL that failed) |

### Model (two-way binding)

```typescript
readonly croppedImage = model<string>('');
```

Use `[(croppedImage)]` for two-way binding of the base64 data-URL result.

### `OicCropperResult`

```typescript
interface OicCropperResult {
  dataUrl: string;     // base64 data-URL of the cropped output
  blob: Blob | null;   // Blob (null if unavailable in the current environment)
  width: number;        // output image width in pixels
  height: number;       // output image height in pixels
  format: OicOutputFormat;
}
```

### ControlValueAccessor (ngModel / formControl)

The component implements `ControlValueAccessor` for Angular forms — it writes the `src` value:

```html
<oic-cropper [formControl]="ctrl" />
```

```typescript
ctrl = new FormControl<string>('https://example.com/image.jpg');
```

When using CVA the `src` input is set via the form control value. The cropped image data-URL is propagated back through `onChange`.

### Keyboard shortcuts

| Key | Action |
|---|---|
| Arrow keys | Move the crop selection by 5% steps |
| `+` / `=` | Zoom in |
| `-` / `_` | Zoom out |
| `r` | Rotate 90° counter-clockwise |
| `R` | Rotate 90° clockwise |

Focus the component (`tabindex="0"`) for keyboard control.

### CSS custom properties

| Token | Fallback | Usage |
|---|---|---|
| `--p-content-background` | `--p-surface-100` / `#f5f5f5` | Toolbar and viewport background |
| `--p-content-border-color` | `--p-surface-200` / `#e5e7eb` | Toolbar separators / borders |
| `--p-text-muted-color` | `#6b7280` | Toolbar labels and values |

The crop overlay receives percentage-based inline styles for positioning (not CSS custom properties).

### Overlay / content projection

Project custom SVG or HTML into the crop area using the `oicCropperOverlay` attribute selector:

```html
<oic-cropper src="...">
  <svg oicCropperOverlay class="pointer-events-none">
    <!-- custom grid, crosshair, etc. -->
  </svg>
</oic-cropper>
```

The default overlay (`OicCropperGridOverlay`) provides a grid with rule-of-thirds guide lines.

### Exported classes and tokens

| Export | Kind | Description |
|---|---|---|
| `OicCropperCanvas` | class | Framework-agnostic canvas engine (image rendering, zoom, rotation, crop output) |
| `OicCropperInteraction` | class | Framework-agnostic pointer/touch interaction state machine (move, resize, pinch) |
| `OIC_CROPPER_DEFAULT_OPTIONS` | `InjectionToken<OicCropperOptions>` | Override global defaults (zoomStep, rotateStep, outputQuality, etc.) |
| `OIC_CROPPER_INTL` | `InjectionToken<OicCropperIntl>` | Internationalized ARIA labels and UI strings |
| `OIC_CROPPER_INTL_DEFAULTS` | `OicCropperIntl` | Default en-US string constants |
| `provideOicCropperIntl(...)` | provider factory | Merge partial `OicCropperIntl` over defaults |
| `provideOicCropperIntlFromPrimeLocale(...)` | provider factory | Derive strings from a `primelocale` locale object |
| `OicCropperOptions` | interface | Config object for `OIC_CROPPER_DEFAULT_OPTIONS` |
| `OicCropperResult` | interface | Crop result metadata + data-URL + blob |
| `OicCropRect` | interface | Normalized crop rectangle (`0`–`1`) |
| `OicOutputFormat` | type | `'image/png' \| 'image/jpeg' \| 'image/webp'` |
| `OicAspectRatioPreset` | type | `'free' \| '1:1' \| '4:3' \| '16:9'` |
| `OicCropperDragMode` | type | Interaction mode discriminator |

---

## i18n

The library ships with **en-US built-in** defaults. Override individual strings with `provideOicCropperIntl`:

```typescript
import { provideOicCropperIntl } from '@all-the.rest/optimus-image-cropper';

bootstrapApplication(AppComponent, {
  providers: [
    provideOicCropperIntl({
      zoomIn: 'Vergrößern',
      zoomOut: 'Verkleinern',
      rotateLeft: 'Links drehen',
      rotateRight: 'Rechts drehen',
      fineRotation: 'Feinrotation',
      aspectRatio: 'Seitenverhältnis',
      aspectFree: 'Frei',
    }),
  ],
});
```

### primelocale integration (optional)

Install `primelocale` and pass any locale object:

```typescript
import { provideOicCropperIntlFromPrimeLocale } from '@all-the.rest/optimus-image-cropper';
import { de } from 'primelocale/js/de.js';

bootstrapApplication(AppComponent, {
  providers: [
    provideOicCropperIntlFromPrimeLocale(de),
  ],
});
```

The function reads `aria.zoomIn`, `aria.zoomOut`, `aria.rotateLeft`, `aria.rotateRight` from the locale object and falls back to English defaults for the remaining keys (`fineRotation`, `aspectRatio`, `aspectFree`).

---

## Theming

The component is styled with Optimus design tokens (Aura-compatible `--p-*` CSS custom properties). See the [CSS custom properties](#css-custom-properties) table above for the tokens used.

Apply your theme via Optimus UI's theme preset (e.g., Aura, Nora, Lara). The crop overlay uses percentage-based inline styles for positioning.

---

## Using with PrimeNG instead of Optimus UI

**Optimus UI** (`@openng/optimus-ui`) is an API-compatible fork of PrimeNG. If your project uses PrimeNG directly, you can still use this library with a package alias/override — no code changes required.

### Import mapping

| Optimus UI | PrimeNG equivalent |
|---|---|
| `@openng/optimus-ui` | `primeng` |
| `@openng/optimus-ui/button` | `primeng/button` |
| `@openng/optimus-ui/slider` | `primeng/slider` |
| `@openng/optimus-ui/select` | `primeng/select` |
| `@openng/optimus-ui/icons/*` | `primeng/icons/*` |
| `@openng/optimus-ui-themes` | `@primeuix/themes` |
| `provideOptimus(...)` | `providePrimeNG(...)` |
| Design tokens | Identical (`--p-*`) |
| `primelocale` | Works for both |

### Provider swap

```typescript
// Optimus UI
import { provideOptimus } from '@openng/optimus-ui/core';
import { Aura } from '@openng/optimus-ui-themes';

provideOptimus({ theme: { preset: Aura } });

// PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

providePrimeNG({ theme: { preset: Aura } });
```

### pnpm alias / override (zero code change)

Add to `package.json` to use PrimeNG without changing any imports:

```json
{
  "pnpm": {
    "overrides": {
      "primeng": "npm:@openng/optimus-ui@^1.0.0-rc.1"
    }
  }
}
```

Or the reverse — if you are on PrimeNG but want to consume this package (which declares `@openng/optimus-ui` as a peer), alias it:

```json
{
  "pnpm": {
    "overrides": {
      "@openng/optimus-ui": "npm:primeng@^19.0.0"
    }
  }
}
```

> **Note:** This package declares `@openng/optimus-ui` as a **required peer dependency**. To use it with PrimeNG without installing Optimus UI, use the pnpm alias approach above.

---

## Development

```bash
pnpm install
pnpm nx build optimus-image-cropper   # Library build
pnpm nx test optimus-image-cropper    # Unit tests (Vitest)
pnpm nx lint optimus-image-cropper    # ESLint
pnpm nx serve demo                    # Demo application
pnpm nx build demo                    # Demo build
pnpm nx e2e demo-e2e                  # Playwright E2E
```

---

## Release

See [docs/RELEASING.md](docs/RELEASING.md) for the complete release process — first release manually, then CI-based via Tag-Push with Trusted Publishing (npm OIDC).

---

## License

MIT — see [LICENSE](LICENSE).
