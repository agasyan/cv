# Agas Yanpratama: resume

Resume as code. One YAML file per version renders to a web page and an ATS-safe PDF, deployed on Cloudflare Pages.

Built with Astro 7, Tailwind CSS 4, daisyUI 5, and pdfmake (PDF generated at build time, no headless browser).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 22.12+) |
| `npm run dev` | Local site at `localhost:4321`, with version previews and the phone PDFs |
| `npm run build` | Build the static site, `/resume.pdf` (full, ≤ 2 pages) and `/resume-compact.pdf` (1 page) into `dist/`. Fails if a PDF runs past its page budget. |
| `npm run preview` | Serve the built `dist/` |
| `npm run check` | Type-check Astro and TypeScript |
| `npm run deploy` | Build and upload `dist/` to Cloudflare Pages with Wrangler |

## Versions

- Each version is `src/data/resumes/YYYY-MM.yaml` with a `version` number and a `changes` list. v1 is `2026-09`.
- `src/config.ts` → `PUBLISHED_VERSION` decides what the site serves: `'latest'` (highest `version`) or a pinned id such as `'2026-09'`. Visitors never switch versions.
- New version: copy the latest file to the new month, bump `version`, replace `changes`, edit. Preview it with `npm run dev` at `/v/YYYY-MM/` (PDFs at `/resume/YYYY-MM.pdf` and `/resume/YYYY-MM-compact.pdf`). These preview routes are not built for production.
- `compact: [1, 3]` on a role or project picks the bullets the 1-page PDF keeps; `summaryCompact` is its shorter summary.

## Phone number (local only)

The phone number is never on the site or in the public PDFs.

1. `cp .env.example .env` and set `RESUME_PHONE`.
2. `npm run dev`. A bar under the navbar offers the **full** and **1-page** PDFs with your number in the contact line.

`.env` is gitignored.

## Deploy (Cloudflare Pages)

Git integration: connect `agasyan/cv` and name the Pages project `agas-cv` (it matches `wrangler.toml` and the default `SITE_URL`; otherwise the repo name `cv` becomes the project name). Framework preset Astro, build command `npm run build`, output directory `dist`, root directory left empty (the build runs from the repo root). `.node-version` pins Node 22. Optional env var `SITE_URL` sets the canonical URL once a custom domain is attached (default `https://agas-cv.pages.dev`).

Direct upload instead: `npx wrangler login`, then `npm run deploy` (project name in `wrangler.toml`).

## Guidelines

| File | Read it before |
|---|---|
| [`guidelines/DESIGN.md`](guidelines/DESIGN.md) | Any UI or PDF change |
| [`guidelines/RESUME-BEST-PRACTICE-CONTENT.md`](guidelines/RESUME-BEST-PRACTICE-CONTENT.md) | Any change to resume text |
| [`guidelines/PERSONALIZED.md`](guidelines/PERSONALIZED.md) | Writing any copy, so it reads in the owner's voice |
| [`guidelines/antislop/`](guidelines/antislop/README.md) | The anti-slop counterparts (vendored, MIT) |

## Layout

```
src/
  config.ts                  PUBLISHED_VERSION
  content.config.ts          resume schema (Zod)
  data/resumes/YYYY-MM.yaml  one file per version
  lib/resume.ts              version loading, dates, PDF page budgets
  assets/profile.jpg         photo (web only)
  layouts/Base.astro         <head>, theme boot script, skip link
  pages/index.astro          the published resume
  pages/404.astro            not-found page
  pages/resume.pdf.ts        the published full PDF (≤ 2 pages)
  pages/resume-compact.pdf.ts  the published 1-page PDF
  pages/v/, pages/resume/    dev-only previews and the phone PDF
  pdf/build.ts, pdf/fonts/   PDF renderer and embedded fonts (OFL)
  components/, styles/       UI
```
