# Release-Prozess — `@all-the.rest/optimus-image-cropper`

## Übersicht

Release-Strategie: **Erstes Release manuell lokal**, danach automatisch via CI (Tag-Push)
mit **Trusted Publishing** (npm OIDC) — ohne Token.

npm-Paket: `@all-the.rest/optimus-image-cropper`
GitHub: `reisi007/optimus-image-cropper`

---

## 1. Erstes Release (manuell lokal)

Das Paket muss einmalig manuell auf npmjs.com veröffentlicht werden, damit dort ein
Trusted Publisher konfiguriert werden kann.

```bash
# Library bauen
pnpm install
pnpm nx build optimus-image-cropper

# In das Build-Verzeichnis wechseln und publizieren
cd dist/packages/optimus-image-cropper

# Auf npmjs.com anmelden
npm login

# Paket veröffentlichen
npm publish --access public

# Wieder zurück ins Wurzelverzeichnis
cd ../../..
```

Nach erfolgreichem Pubish den passenden Git-Tag setzen (Version aus `package.json` der Library
übernehmen — z. B. `0.1.0`):

```bash
git tag v0.1.0
```

> **Hinweis:** `git push` erst nach expliziter Freigabe durch den Projektinhaber.

---

## 2. Trusted Publisher auf npmjs.com konfigurieren

Nach dem ersten manuellen Release in den **Package Settings** auf npmjs.com:

1. https://www.npmjs.com/settings/reisi007/packages → `@all-the.rest/optimus-image-croporter`
2. **Access** → **Trusted Publisher** → **Add Publisher**
3. **Provider:** GitHub Actions
4. **Org / Repo:** `reisi007/optimus-image-cropper`
5. **Workflow:** `release.yml`
6. **Environment:** (leer lassen)
7. **Save**

Danach kann das CI mit OIDC publizieren — **kein `NODE_AUTH_TOKEN`/`secrets.NPM_TOKEN` nötig.**

> **Hinweis:** Solange kein Trusted Publisher konfiguriert ist, schlägt der publish-Job
> in CI mit einem npm-Authentifizierungsfehler fehl. Das ist erwartet.

---

## 3. Release via CI (Tag-Push)

Ab dem zweiten Release läuft alles automatisch:

```bash
# 1. Version hochzählen (NX interaktiv oder mit --specifier)
pnpm nx release version

# Oder direkt:
pnpm nx release version --specifier minor   # 0.1.0 → 0.2.0
pnpm nx release version --specifier patch   # 0.1.0 → 0.1.1
pnpm nx release version --specifier major   # 0.1.0 → 1.0.0
```

`nx release version` läuft wie folgt ab:

1. **Pre-version** (laut `nx.json`): `pnpm dlx nx run-many -t build` — stellt sicher,
   dass das Projekt vor der Versionierung baut (Sicherheitsnetz).
2. **Version bump:** Ändert die Version in `packages/optimus-image-cropper/package.json`
   entsprechend dem gewählten Semver.
3. **Changelog-Generierung:** NX erzeugt/aktualisiert `CHANGELOG.md`.
4. **Commit & Tag:** NX erstellt einen Commit (mit Versionsänderung und Changelog)
   und einen Git-Tag `vX.Y.Z`.

```bash
# 2. Tags pushen (triggert CI)
git push --follow-tags origin main
```

Der GitHub-Workflow `.github/workflows/release.yml` (Tag `v*`) baut dann die Library und
publiziert sie über OIDC / Trusted Publishing — ohne Token.

### Version/Tag-Alignment

- `nx.json` verwendet `"currentVersionResolver": "git-tag"` — NX liest die aktuelle Version
  aus dem letzten Git-Tag, nicht aus `package.json`.
- Der Tag `vX.Y.Z` und die Version im veröffentlichten npm-Paket sind immer identisch,
  da CI den Stand zum Tag-Zeitpunkt auscheckt (mit der via `nx release version` gebumpten
  `package.json`) und publiziert.
- Build in CI erzeugt `dist/packages/optimus-image-cropper/package.json` mit der Version
  des getaggten Commits → `npm publish` veröffentlicht exakt diese Version.

---

## Fehlerbehebung CI

| Problem | Ursache | Lösung |
|---|---|---|
| `npm publish` schlägt mit 401/403 fehl | Kein Trusted Publisher konfiguriert | Schritt 2 durchführen |
| OIDC-Token-Fehler (`ERR_NPM_AUTH_TOKEN`) | `permissions.id-token: write` fehlt im Workflow | Workflow prüfen, muss `id-token: write` enthalten |
| `npm ERR! code E409` | Version existiert bereits | Neues Patch/Minor/Major verwenden, Tag anpassen |
| Playwright / Build-Fehler | System-Deps fehlen | CI installiert `libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` |
