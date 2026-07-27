# Agents.todo.md — Implementierungsplan `optimus-image-cropper`

Portierung des Image Croppers aus `/Users/florianreisinger/dev/angular-material-extended`
(Quelle: `packages/mat-extended/cropper/`) in ein eigenständiges Projekt auf Basis von
**Optimus UI** (`@openng/optimus-ui`, PrimeNG-kompatibler Fork für Angular 21).

## Rahmenbedingungen / Entscheidungen

- **Workspace:** Nx + pnpm (wie Vorlage), Vitest (`@analogjs/vitest-angular`), Playwright
- **Angular:** 21.x (Optimus UI peerDependency `^21.0.0` — Vorlage nutzt 22, hier bewusst 21!)
- **Nx-Version:** passend zu Angular 21 wählen (Nx 22.x; Nx 23 verlangt Angular 22)
- **npm-Paket:** `@all-the.rest/optimus-image-cropper`
- **Prefix:** `Oic` / `oic-` (statt `Rui` / `rui-`), Token-Prefix `--oic-*`, DI-Token `OIC_*`
- **GitHub:** `reisi007/optimus-image-cropper` (public), Demo-Deploy auf GitHub Pages
- **Demo-Theme:** Aura (`@openng/optimus-ui-themes`)
- **Kein Tailwind** — weder Library noch Demo (Demo-Layout mit eigenem SCSS)
- **Keine Angular-Material-Abhängigkeit** — `--mat-sys-*`-Tokens werden ersetzt
- **Button-/Aria-Strings:** aus **`primelocale`** (npm-Paket) beziehen, nicht hartcodieren

---

## Phase 1 — Scaffold Workspace ✅ Grundlage, blockiert alles andere (Review: PASS 2026-07-27)

- [x] `git init`, `.gitignore`, `.editorconfig`, LICENSE (MIT), `pnpm` als Package Manager
- [x] Nx-Workspace (Angular-21-kompatible Nx-Version 22.7.7) mit pnpm anlegen
- [x] `packages/optimus-image-cropper/` — buildbare Angular-Library
  - ng-packagr (`ng-package.json`, Entry `src/index.ts`), Ziel `dist/packages/optimus-image-cropper`
  - `package.json`: Name `@all-the.rest/optimus-image-cropper`,
    peerDependencies: `@angular/core|common|forms ^21`, `@openng/optimus-ui ^1.0.0-rc.1`
  - dependency: `primelocale` (als dependency, nicht peer — per `allowedNonPeerDependencies` in ng-package.json freigegeben)
- [x] `apps/demo/` — Angular-App (`@angular/build:application`)
- [x] `apps/demo-e2e/` — Playwright-Projekt
- [x] Vitest-Setup: `@analogjs/vitest-angular`, `test-setup.ts`, devDeps `canvas` (node-canvas) + `vitest-canvas-mock`
- [x] ESLint-Setup analog Vorlage; `pnpm nx build|test|lint` laufen durch
- [x] Deps installieren: `@openng/optimus-ui`, `@openng/optimus-ui-themes`, `primelocale`

## Phase 1b — Nacharbeiten Scaffold (neue Anforderungen) (Review: PASS 2026-07-27)

- [x] **Zoneless**: `zone.js` komplett entfernt (package.json, polyfills, test-setup), Demo auf
      `provideZonelessChangeDetection()`, Vitest-Setup ohne zone.js-Imports (zoneless TestBed via `setupTestBed`)
- [x] **Playwright**: zwei Projekte — `chromium-desktop` (Desktop Chrome) und `mobile-chrome` (devices['Pixel 7']),
      beide müssen grün sein (lokal wie CI)
- [x] **Signals-Audit**: kein `@Input()`/`@Output()`-Dekorator, kein RxJS für Zustand — nur Signals (bestätigt: keine Vorkommen in unserem Source)
- [x] Verifikation: build/test/lint Library + build demo + e2e (beide Projekte) grün

## Verifikations-Prozess (gilt für ALLE Phasen)

Nach jeder abgeschlossenen Phase prüft ein separater Review-Agent:
1. Sind alle Checkboxen der Phase wirklich erfüllt (Code inspizieren + Befehle ausführen)?
2. Werden die Konventionen aus `AGENTS.md` eingehalten (Signals statt Dekoratoren/RxJS,
   zoneless, kein Tailwind/Material, Prefixe, Tokens, primelocale)?
3. Ergebnis: Checkboxen in dieser Datei aktualisieren — erledigte Punkte abhaken,
   nicht erledigte Punkte präzise umformulieren, sodass der echte Stand sichtbar ist.

## Phase 2 — Shared Utils portieren (aus `packages/mat-extended/src/common/`)

- [ ] `control-value-accessor.ts` → `OicValueAccessor` (+ Spec)
- [ ] `platform.ts` → `ensureBrowser` etc. (+ Spec)
- [ ] `a11y.ts` (+ Spec) — nur was der Cropper braucht
- [ ] Ablage unter `packages/optimus-image-cropper/src/common/`, Export nur intern (nicht zwingend public API)

## Phase 3 — Core-Port (framework-neutral, 1:1 mit Rename)

Quelle: `packages/mat-extended/cropper/src/`

- [ ] `cropper-canvas.ts` → `OicCropperCanvas` (pure TS, unverändert außer Rename)
- [ ] `cropper-interaction.ts` → `OicCropperInteraction` (pure TS, unverändert außer Rename)
- [ ] `cropper.types.ts` → `OicOutputFormat`, `OicAspectRatioPreset`, `OicCropperOptions`, `OicCropRect`, `OicCropperResult`
- [ ] `cropper.config.ts` → `OIC_CROPPER_DEFAULT_OPTIONS`
- [ ] Rename-Regeln: `Rui`→`Oic`, `RUI_`→`OIC_`, `rui-`→`oic-`, `--rui-`→`--oic-`

## Phase 4 — Komponenten mit Optimus UI

- [ ] `OicCropper` (`cropper.ts` + `cropper.html` + SCSS): Port; CVA, Signals, SSR-Guards,
      Pointer/Keyboard/Touch-Logik unverändert; CSS-Custom-Properties `--oic-crop-*`, `--oic-rotation`
- [ ] `OicCropperGridOverlay` (SVG): 1:1-Port
- [ ] `OicCropperToolbar` **neu mit Optimus UI**:
  - Zoom +/− und Rotate ±90° als Optimus `Button` (`@openng/optimus-ui/button`, Icons aus `@openng/optimus-ui/icons/*` z.B. searchplus/searchminus/refresh/undo)
  - Feinrotation als Optimus `Slider` (`@openng/optimus-ui/slider`) statt `<input type="range">`
  - Aspect-Auswahl als Optimus `Select` (`@openng/optimus-ui/select`) statt nativem `<select>`
  - API (Inputs/Outputs) identisch zur Vorlage halten (`imageLoaded`, `zoomLevel`, `rotationAngle`, `totalRotation`, `isAspectRatioFixed`, `effectiveAspectRatio`, `rotationMin/Max`, `orientation`; Outputs `zoomIn`, `zoomOut`, `rotateLeft`, `rotateRight`, `rotationChange`, `aspectChange`, `rotationStart`, `rotationEnd`)
- [ ] **i18n via `primelocale`:** Aria-Labels/Beschriftungen (Zoom in, Zoom out, Rotate left, Rotate right, Aspect ratio, Fine rotation) nicht hartcodieren:
  - Injection-Token `OIC_CROPPER_INTL` mit Default-Strings aus `primelocale/en.json` (Keys `aria.zoomIn`, `aria.zoomOut`, `aria.rotateLeft`, `aria.rotateRight`; fehlende Keys mit eigenen Defaults ergänzen)
  - README-Beispiel: anderes Locale (z.B. `primelocale/de.json`) via Provider setzen
- [ ] Public API `src/index.ts`: `OicCropper`, `OicCropperCanvas`, `OicCropperInteraction`, `OicCropperGridOverlay`, `OicCropperToolbar`, Types, Config, Intl-Token

## Phase 5 — Theming (Material-Tokens → Optimus-Tokens)

- [ ] Alle `var(--mat-sys-*)`-Referenzen in SCSS ersetzen durch Optimus-Design-Tokens (`--p-*`, Aura-kompatibel) mit sinnvollen Fallbacks, z.B.:
  - `--mat-sys-primary` → `var(--p-primary-color)` / `--mat-sys-on-primary` → `var(--p-primary-contrast-color)`
  - `--mat-sys-surface(-variant|container-lowest)` → `var(--p-content-background)` / `var(--p-surface-100)` etc.
  - `--mat-sys-outline(-variant)` → `var(--p-content-border-color)`
  - `--mat-sys-on-surface(-variant)` → `var(--p-text-color)` / `var(--p-text-muted-color)`
- [ ] Optional eigene Alias-Ebene `--oic-color-*` mit Fallback auf `--p-*` (analog `_tokens.scss` der Vorlage)
- [ ] Kein Tailwind, keine Material-Imports

## Phase 6 — Unit-Tests (Parität zur Vorlage: ~121 Cropper-Tests)

- [ ] Fixtures kopieren: `__fixtures__/input-picsum-800x600.jpg`, `expected-picsum-1-1-300x300.png`
- [ ] `cropper.spec.ts` (48 Tests): Port mit Renames; Canvas-Engine gemockt
- [ ] `cropper-canvas.spec.ts` (23 Tests): node-canvas, SHA-256-Fixture-Vergleich, `test-output/`
- [ ] `cropper-interaction.spec.ts` (22 Tests): 1:1-Port
- [ ] `cropper-toolbar.component.spec.ts` (18 Tests): an Optimus-Komponenten anpassen (Button/Slider/Select-Selektoren, Events), Abdeckung gleichwertig inkl. a11y/Aria aus primelocale
- [ ] `cropper-grid-overlay.component.spec.ts` (10 Tests): 1:1-Port
- [ ] Common-Specs (CVA, platform, a11y) aus Phase 2
- [ ] `pnpm nx test optimus-image-cropper` grün

## Phase 7 — Demo-App (Route `/cropper`, Aura-Theme, kein Tailwind)

- [ ] App-Setup: Optimus-Provider mit **Aura-Preset** aus `@openng/optimus-ui-themes`
- [ ] Alle 11 Szenarien der Vorlage (`apps/demo/src/app/pages/cropper-demo/`) nachbauen:
  Basic 16:9 · Square 1:1 · Free Aspect · Fixed Width · Error Handling · Dynamic Config ·
  Toolbar-Positionen (4×) · Constrain-to-Image · Template-driven Form · Reactive Form · Signal Form
- [ ] Material-Ersatz: `mat-card`→Optimus `Card`, `mat-select`→`Select`, `mat-slide-toggle`→`ToggleSwitch`,
      `mat-form-field/input`→`InputText`/`InputNumber`, `mat-button`→`Button`
- [ ] Tailwind-Klassen durch eigenes Demo-SCSS ersetzen (Grid/Spacing/Container-Utilities)
- [ ] SSR/Prerender analog Vorlage falls ohne Mehraufwand, sonst CSR

## Phase 8 — E2E (Playwright)

- [ ] Smoke-Tests: Demo lädt, Cropper rendert Canvas, Zoom/Rotate über Toolbar, Crop-Ergebnis (Data-URL) erscheint
- [ ] Abdeckung analog `apps/demo-e2e` der Vorlage

## Phase 9 — CI/CD (GitHub Actions, wie Vorlage)

- [x] `.github/workflows/ci.yml` (push/PR auf `main`):
  1. test-and-lint: `pnpm install --frozen-lockfile` → system deps für node-canvas → `nx test` → `nx lint` → `nx build`
  2. e2e: Lib+Demo bauen → Playwright (beide Projekte chromium-desktop + mobile-chrome per Default) → Report + Dist-Artefakte
  3. deploy-demo (nur main push, `needs: [test-and-lint, e2e]`): Rebuild Demo mit `--base-href=/optimus-image-cropper/` → `actions/configure-pages` → `upload-pages-artifact` → `deploy-pages`
- [x] `.github/workflows/release.yml` (Tag `v*`):
  - test-and-build: System-Deps für node-canvas → `pnpm install --frozen-lockfile` → build + test + lint lib → build demo → Playwright → Upload `dist`-Artefakt
  - publish (needs test-and-build): `setup-node` mit npm registry → Download dist → `cd dist/packages/optimus-image-cropper && npm publish --provenance --access public` (mit `NODE_AUTH_TOKEN` aus `secrets.NPM_TOKEN`)
- [x] Nx release: `currentVersionResolver: "git-tag"` in `nx.json` gesetzt
- [x] Dateien erstellt, YAML-Syntax geprüft, initialer Commit `ci: add CI and release workflows`
- [ ] **HINWEIS:** Tatsächliche CI/CD-Ausführung kann erst nach `git push` und GitHub-Setup verifiziert werden (Repo anlegen, Remote setzen, Secrets hinterlegen)

## Phase 10 — README, Doku & GitHub-Repo

- [ ] `README.md`: Install, Quickstart, komplette API-Tabelle (Inputs/Outputs/CVA/CSS-Vars) aus Vorlagen-README adaptiert, Theming-Hinweise (Aura/Tokens), primelocale-Beispiel (Locale wechseln)
- [ ] **README-Abschnitt „Using with PrimeNG instead of Optimus UI"** (nur dokumentieren, NICHT umsetzen):
  Optimus UI ist ein API-kompatibler PrimeNG-Fork — Migration per Organisations-/Paket-Rewrite:
  - `@openng/optimus-ui` → `primeng` (Sub-Imports identisch: `…/button`, `…/slider`, `…/select`, `…/icons/*`)
  - `@openng/optimus-ui-themes` → `@primeuix/themes` (Aura-Preset gleichnamig)
  - Provider: Optimus-Theme-Provider → `providePrimeNG({ theme: { preset: Aura } })`
  - Design-Tokens (`--p-*`) sind identisch, primelocale funktioniert für beide
  - Optional: Hinweis auf pnpm-Override/Alias-Ansatz (`"primeng": "npm:@openng/optimus-ui@…"` bzw. umgekehrt), damit ohne Codeänderung gewechselt werden kann
- [ ] `gh repo create reisi007/optimus-image-cropper --public`, Remote setzen, initial push
- [ ] GitHub Pages aktivieren (Workflow-basiert), Badge/Links in README

---

## Orchestrierung (Subagenten)

| Schritt | Agent | Abhängig von |
|---|---|---|
| Phase 1 | Scaffold-Agent | — |
| Phase 2–5 | Library-Port-Agent | Phase 1 |
| Phase 9 (Workflows) + LICENSE/Repo-Meta | CI-Agent (parallel zu Library-Port) | Phase 1 |
| Phase 6 | Test-Agent (ggf. im Library-Agent) | Phase 2–5 |
| Phase 7 | Demo-Agent | Phase 2–5 |
| Phase 8 | E2E-Agent | Phase 7 |
| Phase 10 | Doku/Release-Agent | alles |

Verifikation nach jeder Phase: `pnpm nx build optimus-image-cropper && pnpm nx test optimus-image-cropper && pnpm nx lint optimus-image-cropper`, am Ende `nx build demo` + Playwright.
