# CLAUDE.md

- UI or PDF work: read `guidelines/DESIGN.md` first, then `guidelines/antislop/antislop-ui.md`, `antislop-layoutmobile.md`, `antislop-human.md` as the filter.
- Resume text: read `guidelines/RESUME-BEST-PRACTICE-CONTENT.md` and `guidelines/PERSONALIZED.md` (the owner's voice), then `guidelines/antislop/antislop-copywriting.md`.
- Never invent numbers. Every figure needs a source.
- This repo is public: no phone number, internal ticket IDs, client names, or other people's data in committed files. The phone lives only in `.env`. Open items live in the gitignored `guidelines/OPEN-ITEMS.local.md`.
- Which version is live is set in `src/config.ts`, never on the page.
- Two PDFs: full (≤ 2 pages) and compact (1 page). `npm run build` fails if either runs over; fix it with `compact` picks or shorter bullets.
- Verify with `npm run build`, then check `dist/index.html` and the extracted text of both PDFs (`dist/resume.pdf`, `dist/resume-compact.pdf`; PDF text is compressed, so extract it) have no phone number.
