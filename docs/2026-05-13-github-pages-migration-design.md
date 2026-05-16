# GitHub Pages Migration Design

**Date:** 2026-05-13  
**Target:** `linearwings.github.io/OrbitAN`  
**Repo:** `LinearWings/OrbitAN`

## Summary

Convert OrbitAN from a Vercel-deployed Next.js app to a static site served via GitHub Pages. The app is already purely client-side (no API routes, no database, all state in localStorage), making it a strong fit for static export.

## Section 1 — `next.config.ts`

- Add `output: "export"` to produce a static `out/` directory
- Add `basePath: "/OrbitAN"` for the project-page URL prefix
- Add `images: { unoptimized: true }` since GitHub Pages has no image optimization server

No trailingSlash needed — default behavior is fine.

## Section 2 — Server Component → Client Component Migration

**Problem:** 7 pages use `cookies()` + `headers()` from `next/headers` to detect language. These are Server Component APIs unavailable at static-export build time.

**Affected files:**
- `src/app/(landing)/layout.tsx`
- `src/app/(landing)/page.tsx`
- `src/app/(landing)/docs/page.tsx`
- `src/app/(landing)/docs/tutorial/page.tsx`
- `src/app/(landing)/docs/methodology/page.tsx`
- `src/app/(landing)/docs/usage/page.tsx`
- `src/app/(landing)/docs/changelog/page.tsx`

**Solution:** Add `"use client"` directive to each page, replace cookie/header reads with a `useLanguage()` hook:

```tsx
// New hook in src/hooks/useLanguage.ts
function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("zh");
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)orbit_lang=([^;]+)/);
    const cookieLang = match?.[1] as Lang | undefined;
    setLang(cookieLang || detectLang(navigator.language));
  }, []);
  return lang;
}
```

Each page that currently reads `cookies()`/`headers()` in the component body switches to calling `useLanguage()` and passing the result into `getT()`. The page component itself becomes a client component, dropping `async`.

`(landing)/layout.tsx` adds `"use client"`, replaces `await cookies()` / `await headers()` with `useLanguage()`, removes `async` from the function signature, and **removes** the `export const metadata` block (client components cannot export metadata). The root layout's metadata will serve all pages — the landing layout's metadata was identical anyway.

**Risk:** This adds a brief flash of default language (zh) before the hook runs on first paint. Acceptable for a static site; can be mitigated later with a `<script>` in `<head>` that sets a CSS class based on `document.cookie` before React hydrates.

## Section 3 — Link Fixes

**Problem:** Native `<a href="/orbit">` links break under `basePath: "/OrbitAN"` because they resolve to `/orbit` instead of `/OrbitAN/orbit`.

**Solution:** Replace raw `<a>` tags with Next.js `<Link>` component throughout the landing and docs pages. `<Link>` automatically prepends `basePath`.

**Files affected:** `(landing)/layout.tsx`, `(landing)/page.tsx`, and all docs pages.

**Edge case:** `<a href="#section">` hash links and external links stay as raw `<a>` — they don't need basePath.

## Section 4 — GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

Uses the official `actions/deploy-pages` which handles the GitHub Pages deployment with proper authentication via `GITHUB_TOKEN`.

## Section 5 — Fonts

- `next/font/google` for JetBrains Mono — works with static export, no change needed
- `api.fontshare.com` external stylesheet links — fine as-is (they're just `<link>` tags)

## Verification Checklist

- [ ] `pnpm build` succeeds with no errors
- [ ] `out/` directory contains `index.html`, `orbit.html`, and all docs pages
- [ ] All internal links in `out/` HTML use `/OrbitAN/...` prefix
- [ ] Open `out/index.html` locally — landing page renders (with zh default)
- [ ] Push to main triggers GitHub Actions deploy
- [ ] `linearwings.github.io/OrbitAN` loads correctly
- [ ] Language switcher works (cookie persists across pages)
- [ ] Orbit mode page loads and functions (Canvas rendering, localStorage)

## Out of Scope

- Custom domain setup (CNAME)
- Any feature changes to the app
- SEO / meta tag adjustments beyond what static export provides
