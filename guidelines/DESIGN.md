# DESIGN.md: Agas Yanpratama resume

The design direction for the resume site and its PDF. Read it before any UI or PDF change, then run the checklist at the bottom. Content rules live in [`RESUME-BEST-PRACTICE-CONTENT.md`](RESUME-BEST-PRACTICE-CONTENT.md); voice in [`PERSONALIZED.md`](PERSONALIZED.md).

> Reading this as: a personal resume (web page + downloadable PDF) for recruiters and hiring managers, in a warm editorial "paper document" style, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

## Where this direction comes from

| Source | What it contributes |
|---|---|
| Owner's HTML design guideline | Ivory, oat and pine-teal palette, serif headings, daisyUI-first components, OS-aware dark toggle, skip link, light theme when printing |
| Owner's writing guideline | No em dashes, verb-first lines, same word per concept, no hedging |
| Anti-slop counterparts in [`antislop/`](antislop/README.md): [`antislop-ui.md`](antislop/antislop-ui.md), [`antislop-layoutmobile.md`](antislop/antislop-layoutmobile.md), [`antislop-human.md`](antislop/antislop-human.md) | The filter: dials, dose caps, contrast and tap-target minimums, banned default patterns |

When these disagree, the owner's own guidelines win, and the conflict gets written down here.

## Identity

- **Personality:** calm, precise, senior. The page reads like a well-set document, not a landing page.
- **Mood:** warm paper on an ivory desk. Quiet until you look closer, then dense with evidence.
- **Identity motif:** *the sheet*. The resume sits on one paper surface that mirrors the PDF. Dates live in a right-aligned tabular column, like a ledger, on the web and in the PDF.
- **Focal point:** the name and photo at the top. The only filled primary control is **Download PDF** (the full resume); **1-page PDF** sits next to it as an outline button.

## Dials

| Dial | Value | What it means here |
|---|---|---|
| ENERGY | 1 (calm) | No gradients, orbs, glow, or glass. Color comes from the palette, not effects. |
| RHYTHM | 2 (consistent, a few breaks) | Header (photo and name left, contacts right), numbers band, experience rail beside a reference sidebar, then a full-width projects panel. Each has its own composition. |
| MOTION | 1 (hover only) | Color transitions on hover and focus. No scroll reveals, no loops, no transforms. |

## Palette

Two to three core colors plus one accent. Every text pairing below is computed with [`antislop/contrast-check.py`](antislop/contrast-check.py) (WCAG AA needs 4.5:1).

| Token | Light | Dark | Role |
|---|---|---|---|
| `base-200` | `#FAF9F5` ivory | `#1A1815` | Page (the desk) |
| `base-100` | `#FFFFFF` | `#2A2824` | The sheet |
| `base-300` | `#E7E3D8` | `#3A3630` | Hairlines and borders |
| `base-content` | `#3D3D3A` (10.9:1) | `#D8D6CE` (10.1:1) | Body text and headings |
| `muted` | `#66645C` (5.9:1) | `#A3A096` (5.6:1) | Dates, locations, labels |
| `primary` | `#0F766E` pine teal (5.5:1) | `#2DD4BF` (7.9:1) | Download button, links on hover, current-employer dot |
| `accent` | `#EFE7D8` oat, ink text 8.9:1 | `#4A4033`, text 8.5:1 | Highlight behind key metrics only |

Rules:

- Use theme tokens only (`src/styles/global.css`). No raw hex in components and no Tailwind palette colors (`text-gray-500`).
- Never make muted text with opacity. Use `text-muted`, which passes AA on both surfaces.
- **One deliberate accent:** the oat highlight marks the numbers a recruiter should see (`**bold**` in the YAML). Nothing else gets it.
- Primary is for action and state: the Download button, link hover, and the dot for the current employer. Role titles stay ink.

## Typography

| Use | Family | Why |
|---|---|---|
| Name, section and company headings | **Source Serif 4** (600) | Serif headings come from the owner's guideline. Optical sizing keeps it crisp at 64px and at 12pt in the PDF. |
| Body, UI, dates | **Source Sans 3** (400/600) | Designed as Source Serif's partner: matched x-height, open shapes, tabular figures for dates. Reads well in dense bullets. |

Both are embedded in the PDF too (`src/pdf/fonts/`, OFL), so web and PDF are one type system. Inter, Geist and monospace were rejected as the default picks anti-slop flags. The web loads Source Serif 4 with its optical-size axis (about 70KB more than weight-only) on purpose.

daisyUI is built with `include: button, badge, timeline, alert` only. Add a component to that list before using it.

Scale (web):

| Role | Size | Notes |
|---|---|---|
| Name | `clamp(2.5rem, 6vw, 4rem)`, serif 600 | Leading 1.05 |
| Section heading | 1.5rem serif 600, then a hairline to the right | Sentence case: "Experience", never "EXPERIENCE" |
| Sidebar heading | 1.25rem serif 600 | One step below section headings: the sidebar is reference material |
| Company, project | 1.375rem serif 600 | |
| Role title | body size, sans 600 | Ink, not primary |
| Body and bullets | 17px from 640px up, 16px below, line-height 1.65 | Measure capped at 68ch |
| Meta (dates, places) | 0.9375rem, `text-muted`, tabular figures | |

No uppercase wide-tracked labels. No all-caps anywhere on the web.

## Layout and rhythm

The sheet is `max-w-5xl`, centered on the ivory desk. Spacing follows Tailwind's 4px scale; sections separate with space first and a hairline second.

Three responsive states, set where the content breaks, not at device widths:

| Width | Layout |
|---|---|
| < 640px | Full-bleed sheet (no side border or radius). One column. Navbar shows the photo without the name. Contacts stack. Numbers band is 2 × 2. Sidebar content follows the experience. |
| 640–1023px | Rounded sheet with margins. One main column. Sidebar content becomes a two-column block under experience. Numbers band is 4 across. |
| ≥ 1024px | Experience plus a 17rem sidebar (skills, education, publication). The sidebar scrolls with the page (it is taller than the viewport, so it is not sticky). Projects span the full sheet width below, bullets left and stack right. |

Section order follows the resume's story: header, summary, numbers band, experience with sidebar, projects. No template sections.

## Components (daisyUI 5)

| Need | Component | Notes |
|---|---|---|
| Top bar | `navbar`-style header | Solid `base-100`, one hairline, 64px. Photo, name, theme toggle, 1-page PDF, Download PDF. |
| Actions | `btn` | `btn-primary` only for Download PDF (full). `btn-outline` for 1-page PDF. Theme toggle is `btn-ghost` with `aria-pressed`. |
| Employment history | `timeline timeline-vertical timeline-compact timeline-snap-icon` | Set `[&>li]:[--timeline-col-start:0]` (daisyUI's compact rule loses the cascade otherwise and squeezes the content), `[&>li>hr]:w-px` (1px rail like every other hairline) and `m-0` on `timeline-end`. Filled primary dot = current employer; hollow dot with a `muted` border (3:1+) = past. |
| Title and date rows | `grid-cols-[minmax(0,1fr)_auto]` from 640px | The date always sits in the right-hand ledger column, even when the title is long. |
| Inline lists (skills, stacks) | `Inline` component | " · " separators; wraps only between items, never inside one. |
| Status labels | `badge badge-outline` | Only real states ("Promoted"). Always `whitespace-nowrap`. |
| Local notices | `alert alert-soft alert-warning` | Only on dev-only version previews. |

**Versions are decided in code, never on the page.** There is no version picker. `src/config.ts` sets `PUBLISHED_VERSION`; other versions are previewable only in `npm run dev` at `/v/<YYYY-MM>/`.

**Local-only phone PDFs.** In `npm run dev`, a thin bar under the navbar offers the full and 1-page PDFs with `RESUME_PHONE` from `.env`. It never renders in a production build, and the phone never appears on the page.

Doses (anti-slop caps):

- **Elevation:** only the sheet has a shadow, and it is faint. It is the one raised surface because it stands for paper.
- **Radius:** `12px` sheet and panels, `8px` buttons, `4px` badges. Round only the photo.
- **Glass and glow:** none.
- **Icons:** only where they label a control or a contact channel (mail, LinkedIn, GitHub, location, download, theme, phone on the local bar). No decorative section icons. No arrows on buttons.
- **Borders:** 1px hairlines in `base-300`. No colored left stripes.

## Photo

- The owner's photo (`src/assets/profile.jpg`) appears in the sheet header (96–112px circle) and the navbar (36px). Astro's `<Image>` serves resized WebP.
- The photo is web only. The PDF has no images, for ATS safety.

## PDF

Two variants, both built from the same YAML: **full** (`/resume.pdf`, 2 pages max) and **compact** (`/resume-compact.pdf`, exactly 1 page). The build fails if either runs past its budget (`PDF_MAX_PAGES` in `src/lib/resume.ts`).

- A4, single column, real selectable text, ATS-safe: no tables, text boxes or images.
- Same fonts as the web (embedded). Name, section, company and project headings in Source Serif 4, sentence case.
- One accent: the headline under the name in pine teal. Metrics are bold (and never split across lines), not highlighted.
- Every bullet is unbreakable across pages, and a heading never sits alone at a page bottom.

| | Full | Compact |
|---|---|---|
| Body size / line height | 9.8pt / 1.1 | 9.2pt / 1.05 |
| Summary | `summary` | `summaryCompact` |
| Bullets | all | the `compact` picks per role and project (default: the first) |
| Company stack lines, project tagline, publications, certifications | shown | left out |
| Skills | all groups | groups without `compact: false` |
| Education | one line per degree | one combined line |

## Accessibility

- WCAG AA contrast for every text pairing (see the palette table). Re-run the checker when a color changes.
- Tap targets are at least 44 × 44px at every width, with gaps between them.
- Skip link first in `<body>`. Visible focus rings. Dark mode follows the OS until the visitor picks one, and the choice persists.
- Long slash-joined terms (18+ characters) get a `<wbr>` after each slash so they wrap on phones instead of overflowing. Highlighted metrics never wrap inside.
- The skip link is `position: fixed` and at least 44px tall; its target has `scroll-margin-top` so the sticky header does not cover it.
- Smooth scrolling only under `prefers-reduced-motion: no-preference`.
- Printing forces the light palette and hides the navbar and footer.

## Banned here

Blurred radial orbs, gradients as decoration, glassmorphism, glow, bento grids, stat cards with invented numbers, eyebrow pills above the name, decorative status dots or pulses, uppercase tracked labels, monospace as decoration, emoji, pill-shaped skill clouds, arrows on every button, fake terminal windows, on-page version pickers.

## Delivery checklist

- [ ] Palette from this file only, accent on metrics only, primary on actions and state only.
- [ ] Headings are serif, sentence case. No all-caps labels.
- [ ] No em dashes in page copy or PDF text.
- [ ] Holds up at 360px, 768px, and 1280px, in light and dark, with zero horizontal scroll.
- [ ] Tap targets ≥ 44px. Keyboard-only use works (toggle, links, download).
- [ ] No phone number in `dist/index.html` or in the extracted text of `/resume.pdf` and `/resume-compact.pdf`.
- [ ] `npm run build` passes (full PDF ≤ 2 pages, compact PDF = 1 page); text extracts in reading order; no bullet splits across pages.
