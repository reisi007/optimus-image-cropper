# Changelog

## [0.2.0] — 2026-08-05

### Changed

- Upgraded to Angular 22 (`@angular/*` `^22.1.0`, `@angular-devkit/*` `^22.1.3`, TypeScript `~6.0.3`)
- Upgraded `@openng/optimus-ui` / `@openng/optimus-ui-locale` / `@openng/optimus-ui-themes` to `2.0.0-rc.0`; removed deprecated `@angular/animations`
- **Breaking:** library peer dependencies raised to `@angular/*` `^22.0.0` and `@openng/optimus-ui`/`@openng/optimus-ui-locale` `^2.0.0-rc.0` — consumers on Angular 21 / optimus-ui 1.x must upgrade

## [0.1.2] — 2026-08-01

### Added

- Ported upstream panning fix `3cbc903`: crop rectangle now moves with the image during background panning to prevent it leaving image bounds
- `docs/UPSTREAM.md`: documents the exact upstream baseline (`angular-material-extended` cropper @ `2aefa64`) and pending upstream changes

### Changed

- Upgraded `@openng/optimus-ui` / `@openng/optimus-ui-themes` to `1.0.0-rc.2` (Angular 21 stays)
- Replaced `primelocale` with `@openng/optimus-ui-locale` (drop-in); provider renamed from `provideOicCropperIntlFromPrimeLocale` to `provideOicCropperIntlFromLocale`
- Peer dependencies relaxed: `@angular/*` `^21.0.0`, `@openng/optimus-ui`/`@openng/optimus-ui-locale` `^1.0.0-rc.0`

## [0.1.1] — 2026-07-27

### Fixed

- Demo cropper route changed to root path `/`
- E2E test fixture URL updated to match new root route
- Release artifact path and action versions corrected

## [0.1.0] — 2026-07-27

### Added

- Initial release of `@all-the.rest/optimus-image-cropper`
- Canvas-based Angular image cropper (`OicCropper`) on Optimus UI
- Standalone components with Signals (no RxJS)
- Zoneless change detection
- Toolbar with zoom, rotate, aspect ratio, and position controls
- E2E tests for desktop and mobile Chrome via Playwright
- i18n support via `primelocale`