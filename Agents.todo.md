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

- [x] `control-value-accessor.ts` → `OicValueAccessor`
- [x] `platform.ts` → `ensureBrowser` (+ Spec in later phase)
- [x] `a11y.ts` → `createKeyboardGridNavigation` (+ Spec in later phase)
- [x] Ablage unter `packages/optimus-image-cropper/src/common/`, über barrel `index.ts` intern exportiert

## Phase 3 — Core-Port (framework-neutral, 1:1 mit Rename)

Quelle: `packages/mat-extended/cropper/src/`

- [x] `cropper-canvas.ts` → `OicCropperCanvas` (pure TS, unverändert außer Rename)
- [x] `cropper-interaction.ts` → `OicCropperInteraction` (pure TS, unverändert außer Rename)
- [x] `cropper.types.ts` → `OicOutputFormat`, `OicAspectRatioPreset`, `OicCropperOptions`, `OicCropRect`, `OicCropperResult`
- [x] `cropper.config.ts` → `OIC_CROPPER_DEFAULT_OPTIONS`
- [x] Rename-Regeln: `Rui`→`Oic`, `RUI_`→`OIC_`, `rui-`→`oic-`, `--rui-`→`--oic-`

## Phase 4 — Komponenten mit Optimus UI

- [x] `OicCropper` (`cropper.ts` + `cropper.html` + SCSS): Port; CVA, Signals, SSR-Guards,
      Pointer/Keyboard/Touch-Logik unverändert; CSS-Custom-Properties `--oic-crop-*`, `--oic-rotation`
- [x] `OicCropperGridOverlay` (SVG): 1:1-Port
- [x] `OicCropperToolbar` **neu mit Optimus UI**:
  - Zoom +/− und Rotate ±90° als Optimus `Button` (`@openng/optimus-ui/button`, Icons `searchplus`/`searchminus`/`refresh`/`undo`)
  - Feinrotation als Optimus `Slider` (`@openng/optimus-ui/slider`, `ngModel` + `(ngModelChange)` + `(onSlideEnd)`)
  - Aspect-Auswahl als Optimus `Select` (`@openng/optimus-ui/select`, `ngModel` + `appendTo="body"`)
  - API (Inputs/Outputs) identisch zur Vorlage
- [x] **i18n via `primelocale`:** Injection-Token `OIC_CROPPER_INTL` mit Default-Strings aus `primelocale/js/en.js` (Keys `aria.zoomIn`, `aria.zoomOut`, `aria.rotateLeft`, `aria.rotateRight`; eigene Defaults für `fineRotation`, `aspectRatio`, `aspectFree`)
- [x] **primelocale optional machen:** `primelocale` als **optionale peerDependency** (`peerDependenciesMeta.optional: true`, aus `dependencies` + `allowedNonPeerDependencies` entfernt); eigebauter **en-US-Fallback** in `cropper.intl.ts` (statischer `OIC_CROPPER_INTL_DEFAULTS`-String-Satz), kein Import von primelocale im Library-Bundel; stattdessen `provideOicCropperIntlFromPrimeLocale(locale)` für Konsumenten, die ein primelocale-Locale-Objekt übergeben; `provideOicCropperIntl(partial)` für direkte Überschreibung
- [x] Public API `src/index.ts`: Alle Komponenten, Core-Klassen, Types, Config, Intl-Token exportiert
- [x] Placeholder `OIC_VERSION`-Export + Spec entfernt
- [x] Minimaler Smoke-Spec (`cropper.smoke.spec.ts`) — instanziiert `OicCropper` via TestBed

## Phase 5 — Theming (Material-Tokens → Optimus-Tokens)

- [x] Alle `var(--mat-sys-*)` durch Optimus-Design-Tokens ersetzt:
  - `var(--p-content-background)` / `var(--p-surface-100)` für Hintergründe
  - `var(--p-content-border-color)` / `var(--p-surface-200)` für Rahmen
  - `var(--p-text-muted-color)` / `var(--p-surface-200)` für Text-Farben
  - Alle mit Fallback-Werten
- [x] Kein Tailwind, keine Material-Imports

## Phase 6 — Unit-Tests (Parität zur Vorlage: ~121 Cropper-Tests) ✅ 172 Tests passing

- [x] Fixtures kopieren: `__fixtures__/input-picsum-800x600.jpg` kopiert; `expected-picsum-1-1-300x300.png` existiert in Quelle nicht (wird zur Laufzeit generiert, SHA-256-Vergleich ist optional via try/catch)
- [x] `cropper.spec.ts` (64 Tests, Quelle: 48 → erweitert um Port aller 48): vollständig portiert, Canvas-Engine gemockt, Aria-Tests an Optimus-p-button/p-slider-Struktur angepasst
- [x] `cropper-canvas.spec.ts` (24 Tests, Quelle: 23): node-canvas, SHA-256-Fixture-Vergleich, `test-output/`; node-canvas `Image` als `globalThis.Image`-Mock (drawImage-Kompatibilität)
- [x] `cropper-interaction.spec.ts` (25 Tests, Quelle: 22): 1:1-Port
- [x] `cropper-toolbar.component.spec.ts` (17 Tests, Quelle: 18): an Optimus-Komponenten angepasst — Button-Klicks via inner `<button>`, Slider/Select-Events via Component-API (p-select appendTo="body" schwer simulierbar — 1 Test-Drop: `rotationSlider#type=range` entfällt da kein native range). Aria-Labels auf inneren Elementen geprüft (p-button button, p-slider-handle).
  - **1 Test adaptiert**: `emits rotationStart on first slider value change` (neu, statt `pointerdown` auf slider → onSliderChange ruft rotationStart bei erstmaligem Aufruf auf)
  - **1 Test entfallen**: `slider type is range` (p-slider ist kein native range)
- [x] `cropper-grid-overlay.component.spec.ts` (10 Tests, Quelle: 10): 1:1-Port, Selektoren rui→oic
- [x] `cropper.intl.spec.ts` (5 Tests): Intl-Token und Fallback-Prüfung
- [x] Common-Specs: `control-value-accessor.spec.ts` (7), `platform.spec.ts` (6), `a11y.spec.ts` (14)
- [x] `pnpm nx test optimus-image-cropper` → 172 Tests, 9 Files (inkl. intl spec), alle grün
- [x] `pnpm nx lint optimus-image-cropper` → keine Fehler
- [x] `pnpm nx build optimus-image-cropper` → unverändert, Build OK

## Phase 7 — Demo-App (Route `/cropper`, Aura-Theme, kein Tailwind)

- [x] App-Setup: Optimus-Provider mit **Aura-Preset** aus `@openng/optimus-ui-themes`
- [x] Alle 11 Szenarien der Vorlage (`apps/demo/src/app/pages/cropper-demo/`) nachbauen:
  Basic 16:9 · Square 1:1 · Free Aspect · Fixed Width · Error Handling · Dynamic Config ·
  Toolbar-Positionen (4×) · Constrain-to-Image · Template-driven Form · Reactive Form · Signal Form
- [x] Material-Ersatz: `mat-card`→Optimus `Card`, `mat-select`→`Select`, `mat-slide-toggle`→`ToggleSwitch`,
      `mat-form-field/input`→`InputText`, `mat-button`→`Button`
- [x] Tailwind-Klassen durch eigenes Demo-SCSS ersetzen (Grid/Spacing/Container-Utilities)
- [x] CSR (kein SSR — SSR nicht in der Vorlage)

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
- [x] **Versions-Parität lokal ↔ CI:** Node-Major (lokal 26 → CI 26), pnpm via `packageManager`-Feld (`pnpm@11.10.0`), engines.node auf `>=26` gesetzt; CI nutzt `pnpm/action-setup@v4` ohne Version-Input (liest automatisch aus `packageManager`)
- [x] Dateien erstellt, YAML-Syntax geprüft, initialer Commit `ci: add CI and release workflows`
- [ ] **HINWEIS:** Tatsächliche CI/CD-Ausführung kann erst nach `git push` und GitHub-Setup verifiziert werden (Repo anlegen, Remote setzen, Secrets hinterlegen)

### Phase 9b — Trusted Publishing (npm OIDC, nach erstem manuellem Release)

Release-Strategie: **Erstes Release manuell lokal** (Paket muss auf npmjs existieren, bevor
Trusted Publishing konfigurierbar ist), danach CI-Publish ohne Token via OIDC.

- [x] `docs/RELEASING.md` erstellt: Erstes Release lokal, dann Trusted Publisher auf
      npmjs.com konfigurieren, danach CI-Publish via Tag-Push; NX-Release-Versionierung
      (git-tag-resolver) dokumentiert; Fehlerbehebung
- [ ] **Manueller Schritt (User):** Nach erstem Release auf npmjs.com für
      `@all-the.rest/optimus-image-cropper` **Trusted Publisher** konfigurieren:
      GitHub Actions, Repo `reisi007/optimus-image-cropper`, Workflow `release.yml`
      (Anleitung in `docs/RELEASING.md`)
- [x] `release.yml` auf OIDC umgestellt: `permissions: id-token: write` (war vorhanden),
      `NODE_AUTH_TOKEN`/`secrets.NPM_TOKEN` entfernt, `npm --version`-Echo-Step vor
      Publish eingefügt, `--provenance` bleibt für explizite Provenance-Deklaration
- [x] Publish-Guard: Step-Name erwähnt „requires Trusted Publisher configured on npmjs.com";
      bei fehlender Konfiguration schlägt npm publish mit 401/403 fehl (erwartet)

## Phase 10 — README, Doku & GitHub-Repo

- [ ] `README.md`: Install, Quickstart, komplette API-Tabelle (Inputs/Outputs/CVA/CSS-Vars) aus Vorlagen-README adaptiert, Theming-Hinweise (Aura/Tokens), primelocale-Beispiel (Locale wechseln)
- [ ] **README-Abschnitt „Using with PrimeNG instead of Optimus UI"** (nur dokumentieren, NICHT umsetzen):
  Optimus UI ist ein API-kompatibler PrimeNG-Fork — Migration per Organisations-/Paket-Rewrite:
  - `@openng/optimus-ui` → `primeng` (Sub-Imports identisch: `…/button`, `…/slider`, `…/select`, `…/icons/*`)
  - `@openng/optimus-ui-themes` → `@primeuix/themes` (Aura-Preset gleichnamig)
  - Provider: Optimus-Theme-Provider → `providePrimeNG({ theme: { preset: Aura } })`
  - Design-Tokens (`--p-*`) sind identisch, primelocale funktioniert für beide
  - Optional: Hinweis auf pnpm-Override/Alias-Ansatz (`"primeng": "npm:@openng/optimus-ui@…"` bzw. umgekehrt), damit ohne Codeänderung gewechselt werden kann
- [ ] `gh repo create reisi007/optimus-image-cropper --public`, Remote setzen — **PUSH ERST NACH MANUELLER FREIGABE durch den User** (Gate: vor `git push` explizit nachfragen)
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
