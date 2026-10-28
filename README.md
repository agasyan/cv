# Agas Yanpratama · Resume

My resume as code. One YAML file per version builds a web page and two PDFs: a full resume (up to 2 pages) and a 1-page version. It deploys as a static site on Cloudflare Pages.

- Each version is one file, such as `src/data/resumes/2026-09.yaml`; `src/config.ts` picks the live one.
- The build makes two ATS-safe PDFs with selectable text and fails if either runs past its page budget.
- The phone number stays in a local `.env`. It never reaches the site, the public PDFs or this repo.
- The site has light and dark themes, works from phone to desktop, and meets WCAG AA contrast.

Built with [Astro](https://astro.build) 7, [Tailwind CSS](https://tailwindcss.com) 4, [daisyUI](https://daisyui.com) 5 and [pdfmake](https://pdfmake.github.io/docs/).

## Run it locally

You need **Node.js 22.12 or newer** (`.node-version` pins Node 22) and npm.

```bash
git clone https://github.com/agasyan/cv.git
cd cv
npm install
npm run dev
```

Open <http://localhost:4321>. The page reloads when you edit files. Stop it with `Ctrl+C`.

If an AI coding agent runs `npm run dev`, Astro starts it in the background. Stop it with `npx astro dev stop`; read its output with `npx astro dev logs`.

To check the production build:

```bash
npm run build     # static site and both PDFs in dist/
npm run preview   # serve dist/ at http://localhost:4321
```

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the local site with hot reload, version previews and the local-only phone PDFs |
| `npm run build` | Build `dist/`: the site, `/resume.pdf` (full, ≤ 2 pages) and `/resume-compact.pdf` (1 page) |
| `npm run preview` | Serve the built `dist/` |
| `npm run check` | Type-check the Astro and TypeScript code |
| `npm run deploy` | On `main` only: build, upload `dist/` to Cloudflare Pages, then commit `deploy.json` (see [Deploy](#deploy-to-cloudflare-pages)) |

## Edit the resume

All content lives in `src/data/resumes/YYYY-MM.yaml`, validated by the schema in `src/content.config.ts`. A missing or malformed field fails the build with a clear message (unknown field names are ignored, so check spelling).

| Field | What it holds |
|---|---|
| `profile` | Name, headline, email, LinkedIn, GitHub, location |
| `summary`, `summaryCompact` | Summary for the full resume, and a shorter one for the 1-page PDF |
| `highlights` | The headline numbers in the band under the summary (web only) |
| `experience` | Companies, each with `roles` and their `bullets`; optional `stack` line |
| `projects` | Side projects with bullets and a stack list |
| `education`, `publications`, `certifications`, `skills` | The rest |

Writing rules:

- `**text**` marks the one number in a bullet a recruiter should see. It becomes a highlight on the web and bold in the PDF.
- `compact: [1, 3]` on a role or project picks which bullets (1-based) the 1-page PDF keeps. Without it, only the first bullet is kept. `compact: false` on a skill group leaves it out of the 1-page PDF.
- Content rules, voice and design rules are in [`guidelines/`](#guidelines).

## Versions

1. Copy the latest file to the new month, e.g. `src/data/resumes/2026-11.yaml`.
2. Bump `version` and replace the `changes` list.
3. Edit, then preview locally at `/v/2026-11/` (PDFs at `/resume/2026-11.pdf` and `/resume/2026-11-compact.pdf`).
4. Publish by leaving `PUBLISHED_VERSION = 'latest'` in `src/config.ts`, or pin an older id such as `'2026-10'` to roll back.

Preview routes exist only in `npm run dev`; production builds only the published version.

## PDFs

| | Full | Compact |
|---|---|---|
| URL | `/resume.pdf` | `/resume-compact.pdf` |
| Page budget | 2 pages max | exactly 1 page |
| Content | everything | `summaryCompact` and the `compact` picks; no publications, certifications, company stack lines or project taglines |

Both are A4, single column, with embedded fonts and no tables or images, so applicant tracking systems can read them. If an edit pushes a PDF past its budget, `npm run build` stops with a message such as `Resume 2026-09 compact PDF is 2 pages; the limit is 1.` Shorten bullets or change the `compact` picks.

## Phone number (local only)

1. `cp .env.example .env`, then set `RESUME_PHONE` in `.env`.
2. Run `npm run dev` (restart it after editing `.env`). A bar under the header offers the full and 1-page PDFs with your number in the contact line.

`.env` is gitignored, and production builds never use the phone value.

## Deploy to Cloudflare Pages

The site deploys from my laptop with `npm run deploy`, not through Cloudflare's Git integration. `wrangler.toml` names the Pages project (`agasyan`, so the address is <https://agasyan.pages.dev>).

**Once:**

```bash
npx wrangler@4 login
npx wrangler@4 pages project create agasyan --production-branch main
```

Project names are global on `pages.dev`. If `agasyan` is taken, Cloudflare adds a suffix; check the address it prints. With a suffix, run every deploy as `SITE_URL=<that address> npm run deploy`, so the canonical URL and `deploy.json` point at your site.

**Each deploy**, from an up-to-date `main`:

```bash
git checkout main && git pull
npm run deploy
git push
```

`npm run deploy` (`scripts/deploy.js`):

1. Stops unless the branch is `main`, the working tree is clean, and `main` is not behind `origin/main`.
2. Stops with "nothing changed" when no file but `deploy.json` changed since the last deploy. `npm run deploy -- --force` deploys anyway.
3. Builds, then uploads `dist/` as a production deploy tagged with the commit hash and message.
4. Writes `deploy.json` (project, address, commit, time) and commits it on `main`. Push `main` to share it.

The footer's "Updated" date is the last commit's date, not counting `deploy.json` commits. Set `SITE_URL` in the shell before `npm run deploy` once a custom domain is attached; it changes the canonical URL and the address in `deploy.json`. A `SITE_URL` change alone is not a new commit, so deploy it with `--force`.

## Project structure

```
src/
  config.ts                    PUBLISHED_VERSION: which version is live
  content.config.ts            resume schema (Zod)
  data/resumes/YYYY-MM.yaml    one file per version
  lib/resume.ts                version loading, dates, PDF page budgets
  lib/git.ts                   last commit date for the footer
  assets/profile.jpg           photo (web only)
  components/                  page sections, header, footer, icons
  layouts/Base.astro           <head>, theme boot script, skip link
  pages/index.astro            the published resume
  pages/resume.pdf.ts          full PDF
  pages/resume-compact.pdf.ts  1-page PDF
  pages/v/, pages/resume/      dev-only previews and phone PDFs
  pages/404.astro              not-found page
  pdf/build.ts                 PDF layout (pdfmake)
  pdf/fonts/                   fonts embedded in the PDFs
  styles/global.css            theme tokens (light and dark)
guidelines/                    design, content and voice rules
public/                        favicon, Cloudflare headers
scripts/deploy.js              npm run deploy (main only)
wrangler.toml                  Cloudflare Pages project
deploy.json                    the last deploy; written and committed by npm run deploy
```

## Guidelines

| File | Read it before |
|---|---|
| [`guidelines/DESIGN.md`](guidelines/DESIGN.md) | Changing the UI or the PDFs |
| [`guidelines/RESUME-BEST-PRACTICE-CONTENT.md`](guidelines/RESUME-BEST-PRACTICE-CONTENT.md) | Changing resume text |
| [`guidelines/PERSONALIZED.md`](guidelines/PERSONALIZED.md) | Writing any copy, so it reads in my voice |
| [`guidelines/antislop/`](guidelines/antislop/README.md) | The anti-slop counterparts of the three files above |

## Troubleshooting

- **Content edits don't show up in dev** (usually after changing the schema): restart with `npm run dev -- --force` to clear Astro's content cache.
- **Build stops with "PDF is N pages; the limit is M"**: see [PDFs](#pdfs).
- **npm warns (`EBADENGINE`) or Astro won't start**: install Node 22.12 or newer.
- **"Another astro dev server is already running"**: stop the old one with `npx astro dev stop`.

## License

- **Code:** MIT, see [`LICENSE`](LICENSE). Fork it for your own resume.
- **Resume content and photo** (`src/data/resumes/`, `src/assets/profile.jpg`): mine, all rights reserved. Replace them with your own.
- **Third-party parts** (fonts, icons, Tailwind CSS, daisyUI, anti-slop rules) keep their own licenses; see [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
