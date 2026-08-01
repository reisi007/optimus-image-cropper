# Upstream-Tracking — `angular-material-extended` Cropper

Dieses Projekt (Optimus-UI-Fork `OicCropper`) ist ein Port des Image Croppers aus
**`@all-the.rest/mat-extended`** (Quell-Repo: `angular-material-extended`,
Package `packages/mat-extended/cropper`).

Ziel dieser Datei: Den **genauen Upstream-Stand** festhalten, auf den der Port
basiert, und Änderungen seit der Portierung sichtbar machen. Bei jedem
Upstream-Sync wird dieser Stand aktualisiert.

## Stand: Basis der Portierung

| | |
|---|---|
| **Upstream-Repo** | `/Users/florianreisinger/dev/angular-material-extended` (origin: `https://github.com/reisi007/angular-material-extended.git`) |
| **Package** | `packages/mat-extended/cropper` |
| **Basis-Commit (Portierung)** | `2aefa64` — `feat(cropper): add image panning and improve rotation/constraint behavior` (2026-07-24) |
| **Vollständige Hash** | `2aefa648cac8e457a01aeffe9c9687b1f17ecec5` |
| **Portierung erfolgt in** | optimus-Commit `da3bd4c` „feat: port cropper library to Optimus UI (phases 2-5)“ (2026-07-27) |

Verifiziert per `git diff` der Core-Dateien (`cropper-canvas.ts`,
`cropper-interaction.ts`, `cropper.config.ts`, `cropper.types.ts`, `cropper.ts`):
identisch zu `2aefa64` bis auf Renames (`Rui`→`Oic`), Zoneless-Umbau
(`NgZone`-Entfernung) und Optimus-UI-/`@openng/optimus-ui-locale`-Anpassungen.

## Upstream-Commits nach der Portierung (relevant für `packages/mat-extended/cropper`)

Seit dem Basis-Commit `2aefa64` hat das Upstream-Repo folgende Änderungen am
Cropper gemacht:

| Commit | Datum | Änderung | Im Port enthalten? |
|---|---|---|---|
| `2aefa64` | 2026-07-24 | `feat(cropper): add image panning and improve rotation/constraint behavior` | ✅ Basis (enthalten) |
| `03ae35e` | 2026-07-29 | `refactor(multi-select)`: u.a. `writeValue`-Signatur `undefined`→`null`, `markAsChanged`-Effect, `MatFormFieldControl`-Provider | ❌ nicht portiert |
| `3cbc903` | 2026-07-30 | **`fix(cropper): move crop rect with image during panning to prevent it leaving image bounds`** | ❌ **nicht portiert** |

### Ausstehend — „Hintergrund verschieben"-Fix (`3cbc903`)

Der Nutzer-nachgefragte Fix zum **Verschieben des Hintergrunds (Panning)** fehlt im
Port. Änderung in `packages/mat-extended/cropper/src/cropper.ts`:

1. **`onPointerMove`**: Beim Panning wird das Crop-Rechteck jetzt **mit dem Bild
   mitbewegt** (Korrektur um `dpx/vw`, `dpy/vh`), damit es nicht aus den
   Bildgrenzen läuft:
   - Alt (`2aefa64`): nur `panX`/`panY` direkt setzen → Crop-Rechteck bleibt stehen.
   - Neu (`3cbc903`): Delta aus altem/neuem Pan berechnen, Crop-Rechteck
     entsprechend verschieben und `_constrainCropRect` erneut anwenden.
2. **`onPointerUp`**: Nach Pan-Ende wird das Crop-Rechteck noch einmal
   `_constrainCropRect`-geconstrained und gesetzt (in `2aefa64` fehlt der
   Engine-/Signal-Update).

Im optimus-Port betrifft das `packages/optimus-image-cropper/src/cropper/cropper.component.ts`,
Methoden `onPointerMove` (Zeile ~241) und `onPointerUp` (Zeile ~271).

### Ausstehend — kleinere Anpassungen aus `03ae35e`

- `writeValue(value: string | undefined)` → `writeValue(value: string | null)`
  (portiert: noch `undefined`, siehe `cropper.component.ts:174`)
- Effect, der bei geändertem `croppedImage()` `markAsChanged(img)` aufruft
- `MatFormFieldControl`-Provider — **nicht relevant** für Optimus-Port (kein
  Angular Material), bewusst nicht übernommen

## Wie der Stand aktualisiert/geprüft wird

```bash
# Neueste Upstream-Commits für den Cropper anzeigen
git -C /Users/florianreisinger/dev/angular-material-extended log --oneline -- packages/mat-extended/cropper

# Diff Basis-Commit → aktueller HEAD im Cropper
git -C /Users/florianreisinger/dev/angular-material-extended diff 2aefa64..HEAD -- packages/mat-extended/cropper

# Aktuellen HEAD (Short-Hash) ermitteln
git -C /Users/florianreisinger/dev/angular-material-extended rev-parse --short HEAD
```

Vorgehen bei Sync:
1. Oben stehende Tabelle um den neuen Stand erweitern (Basis-Commit-Hash, Datum, geänderte Dateien).
2. Neue Upstream-Änderungen in den Port übernehmen und in dieser Datei abhaken.
3. `AGENTS.md` ggf. um neue Konventionen ergänzen.
