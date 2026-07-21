# LESZEK Központ weboldal

Vite-alapú, többoldalas weboldal Vercel deploymenthez előkészítve.

## Helyi futtatás

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

A build kimenete a `dist` mappa.

## Feltöltés GitHubra

1. Hozz létre egy üres GitHub repositoryt.
2. Töltsd fel a projekt gyökérmappájának tartalmát.
3. A `node_modules`, `dist`, `.env` és egyéb helyi fájlokat a `.gitignore` kizárja.

## Telepítés Vercelre

1. A Vercel irányítópultján válaszd az **Add New > Project** lehetőséget.
2. Importáld a GitHub repositoryt.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Indítsd el a deploymentet.

A route-kezelést és a tiszta aloldali URL-eket a `vercel.json` tartalmazza. A projekt jelenleg nem igényel environment variable-t.
