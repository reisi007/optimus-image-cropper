# AGENTS.md — optimus-image-cropper

Canvas-basierter Angular Image Cropper (`OicCropper`) auf Basis von **Optimus UI**
(`@openng/optimus-ui`, PrimeNG-kompatibler Fork). Portiert aus
`angular-material-extended` (`packages/mat-extended/cropper`).

## Tech-Stack

- Nx Monorepo + **pnpm** (Node >= 22)
- **Angular 21** (Vorgabe durch Optimus UI peerDependency `^21.0.0` — NICHT auf 22 heben)
- Library: `packages/optimus-image-cropper` → npm `@all-the.rest/optimus-image-cropper` (ng-packagr)
- Demo: `apps/demo` (Aura-Theme aus `@openng/optimus-ui-themes`), E2E: `apps/demo-e2e` (Playwright)
- Tests: **Vitest** (`@analogjs/vitest-angular`), node-canvas (`canvas`) für Canvas-Tests
- i18n-Strings (Aria/Buttons): **`primelocale`**

## Befehle

```bash
pnpm install
pnpm nx build optimus-image-cropper   # Library-Build (dist/packages/optimus-image-cropper)
pnpm nx test optimus-image-cropper    # Unit-Tests (Vitest)
pnpm nx lint optimus-image-cropper    # ESLint
pnpm nx serve demo                    # Demo-App lokal
pnpm nx build demo                    # Demo-Build
pnpm nx e2e demo-e2e                  # Playwright E2E
```

Nach jeder Code-Änderung: build + test + lint der Library ausführen.

## Konventionen

- Prefix: Klassen `Oic*`, Selektoren `oic-*`, DI-Token `OIC_*`, CSS-Vars `--oic-*`
- Standalone Components, Signals (`input()`, `output()`, `model()`), `ChangeDetectionStrategy.OnPush`
- **Kein Tailwind** (weder Library noch Demo), **kein Angular Material**
- Styling über Optimus-Design-Tokens `var(--p-*)` (Aura-kompatibel), keine `--mat-sys-*`
- Core-Klassen `OicCropperCanvas` / `OicCropperInteraction` bleiben framework-neutral (pure TS)
- SSR-sicher: DOM/Canvas-Zugriffe nur hinter `ensureBrowser()`
- Aria-Labels der Toolbar aus `primelocale` (Token `OIC_CROPPER_INTL`), nicht hartcodieren
- Keine Kommentare im Code, sofern nicht explizit gefordert

## Release / CI

- CI: `.github/workflows/ci.yml` — test, lint, build, e2e, Demo-Deploy auf GitHub Pages (main)
- Release: Tag `v*` → `.github/workflows/release.yml` → npm publish (`--provenance --access public`)
- Versionierung: Nx release mit `currentVersionResolver: "git-tag"`

## Arbeitsliste

Der vollständige Implementierungsplan mit Status steht in **`Agents.todo.md`** —
dort abhaken, was erledigt ist.
