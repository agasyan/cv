# RESUME-BEST-PRACTICE-CONTENT.md

How to write and edit the resume content in `src/data/resumes/*.yaml`. Read it before changing any text, then run the checklist at the bottom. Design lives in [`DESIGN.md`](DESIGN.md); the owner's voice in [`PERSONALIZED.md`](PERSONALIZED.md). The anti-slop counterpart for this file is [`antislop/antislop-copywriting.md`](antislop/antislop-copywriting.md).

Research date: September 2026. Sources are linked inline and listed at the end.

## Hard rules

1. **Never invent a number.** Every figure comes from a ticket, doc, dashboard, repo command, or the owner's own stated claim. No source, no number. Write "needs a real number" in the open items below instead.
2. **Every bullet is XYZ:** accomplished X, as measured by Y, by doing Z ([Bock](https://www.linkedin.com/pulse/20140929001534-24454816-my-personal-formula-for-a-better-resume/)).
3. **The first two or three words carry the bullet.** Start with a strong verb and the object ("Cut production boot memory", not "Was responsible for"). Readers scanning a page read line starts far more than the rest ([NN/g](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/)).
4. **No em dashes** (`—`). Use a comma, colon, period, or parentheses. En dashes stay in ranges (`Jan 2025 – Present`, `1–8%`).
5. **The phone number is never public.** It lives only in the local `.env` (`RESUME_PHONE`) and appears only in the local "PDF with phone" download. Scam recruiters target published numbers ([World Privacy Forum](https://worldprivacyforum.org/posts/consumer-tips-job-seekers-guide-to-resumes/), [FTC 2026](https://consumer.ftc.gov/consumer-alerts/2026/04/job-offer-text-probably-scam)).
6. **Public repo.** This repo is public. No internal ticket IDs, client or employer-confidential names, internal URLs, or personal data of other people in any committed file.

## Structure and length

- **Two PDFs, A4, single column.** The **full** resume is at most two pages: at about six years of experience, two pages is preferred over one ([ResumeGo](https://www.resumego.net/research/one-or-two-page-resumes/)). The **compact** resume is exactly one page, for applications and recruiters that ask for one. Page 1 must carry the strongest, most recent material ([Orosz](https://stackoverflow.blog/2020/11/25/how-to-write-an-effective-developer-resume-advice-from-a-hiring-manager/)).
- **Compact picks.** Each role and project has `compact: [n, …]`, the 1-based bullets the 1-page PDF keeps (default: the first; `[]` keeps none). Pick the bullets with the strongest numbers for the target role. `summaryCompact` is a three-line version of the summary. The build fails if the compact PDF runs past one page, so trim picks until it fits.
- **Order (PDF):** header, summary, experience, projects, skills, education, publication. The web page shows skills and education in a sidebar.
- Recruiters look at current title and company first, then earlier roles, then dates ([Ladders](https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/)). Keep titles and dates easy to find.
- **Public titles drop internal level suffixes** such as "Senior Software Engineer 1". "Software Engineer 2" stays because it shows the promotion path.

## Header

- Name, one-line headline, email, LinkedIn, GitHub, city. No phone (see hard rule 5).
- The headline states the role and the domain: "Senior Software Engineer, Ads Ranking & Search Systems".

## Summary

- Three to five short sentences. State the two or three most impressive facts in plain words ([interviewing.io](https://interviewing.io/blog/stop-trying-to-make-recruiters-think-or-why-your-resume-is-bad-and-how-to-fix-it)).
- Implied first person ("Ships…", "Directs…"). No "I", no buzzwords, no "passionate".
- Keep the numbers honest: 6 years total, 5+ in ads and search (since March 2021).

## Bullets

- **Budget by recency:** current employer about 9 across its roles, the previous one 2, the one before 3, the oldest 1, projects at most 4. Older, off-story bullets shrink or merge first (Orosz).
- **Quantify when a source exists.** Mark the one number a recruiter must see with `**bold**` (it renders as a highlight on the web and bold in the PDF). At most one highlight per bullet.
- **Cut:** duties with no result, routine details, buzzwords (interviewing.io). 72% of recruiters want short bullets ([Enhancv](https://enhancv.com/blog/does-ats-reject-resumes/)).
- One idea per bullet, two lines maximum in the PDF. Lead with the bigger idea ("Drove the Rails 7.2 migration; a YJIT fix cut memory ~12%").
- Typography: curly quotes and apostrophes (“ ” ’), arrows with spaces (`3.1 → 3.4`), en dashes in ranges.
- Name each concept one way: "written plans" and "plan-first workflow", not "specs" in one place and "plans" in another.

## Projects

- Only standout projects, with context (Orosz). Each entry gives: what it is, the owner's role, the result, and the stack.
- Link to something live when there is one and the client agrees to be named. Until then, describe the client generically ("an Indonesian logistics company").

## AI-directed development

Using AI tools is now normal (84% of developers use or plan to use them, [Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)), so the tool alone says nothing. What evaluators look for is judgment: catching and fixing AI mistakes, and explaining trade-offs ([CoderPad 2026](https://coderpad.io/survey-reports/coderpad-state-of-tech-hiring-2026/)). Credible practice looks like written plans, a test suite, CI, and a review of every change ([Willison](https://simonwillison.net/2025/Oct/7/vibe-engineering/)).

- **Say it as a method with evidence:** "Directed AI coding agents … with every staged diff reviewed before commit", plus the gates (tests, boundary rules, CI) and the output (routes, tables, lines removed).
- **Name only tools with evidence.** The logistics platform commits credit Gemini and DeepSeek models run through Gemini CLI and OpenCode, so that project names those. Claude Code belongs to the Wego work.
- **Placement:** one clause in the summary, one line in skills, the proof in projects ([Built In](https://builtin.com/articles/show-ai-skills-resume)).
- **Red flags to avoid:** a tool name on every bullet, anything that sounds like unreviewed "vibe coding", speed claims without quality evidence, and resume text that itself reads as AI-written ([Resume Genius](https://resumegenius.com/blog/job-hunting/ai-impact-on-hiring)).

## Skills

- Grouped lines. Each item is backed by a bullet, a company's stack line (`experience[].stack`), or the owner's stated experience. Use keywords naturally, never as a stuffed list (Enhancv: 76% of recruiters want natural use).
- Ads and search terms seen in real postings: ranking, CTR/CVR, eCPC, ROAS, ANN retrieval, search relevance, A/B experimentation, low latency. Add "auction", "pCTR" or "calibration" only if a bullet proves them.

## Education and extras

- Keep the Master's GPA (3.89). Drop GPAs under about 3.8 (interviewing.io).
- Certifications: only ones that carry weight for the target role. The Qwiklabs badges were cut.

## ATS facts

- Most ATS setups do not auto-reject on format; people and screening questions decide ([Enhancv](https://enhancv.com/blog/does-ats-reject-resumes/)).
- What breaks parsing (per [Greenhouse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse)): tables, text in headers/footers, spaced-out letters, graphics, image-only files, files over 2.5 MB. The PDF keeps all contact data in the body; the footer holds only name and page number.
- Test every PDF by extracting its text and reading it top to bottom.

## Versioning workflow

1. Copy the latest `src/data/resumes/YYYY-MM.yaml` to the new month.
2. Bump `version`, replace `changes`, edit the content.
3. Preview locally with `npm run dev` at `/v/<YYYY-MM>/`.
4. `PUBLISHED_VERSION` in `src/config.ts` decides what the site serves (`'latest'` or a pinned id).

## Open items

Claims that still need a real number or the owner's input are tracked in `guidelines/OPEN-ITEMS.local.md`, which is gitignored so the public repo does not list them. Create it locally if it is missing.

## Anti-slop counterpart: what to check in resume text

From [`antislop/antislop-copywriting.md`](antislop/antislop-copywriting.md), the tells that matter most here:

| Tell | In a resume it looks like | Fix |
|---|---|---|
| Empty AI vocabulary | "leveraged", "robust", "seamless", "cutting-edge" | The concrete verb and object |
| Significance inflation | "revolutionized", "world-class" | The measured result |
| Fabricated specifics | A precise number with no source | Remove it or find the source (hard rule 1) |
| Actorless passive | "Was responsible for migrations" | "Drove the Ruby 3.4 migration" |
| Rule of three overuse | Every list has exactly three items | List what is true, however many |
| Boldface overuse | Several bold phrases per bullet | One highlight per bullet at most |
| Em dashes | "the system — built in Go — …" | Parentheses or a new sentence |
| Filler and hedging | "helped to", "worked on", "various" | Say what you did |

## Delivery checklist

- [ ] Every number traces to a source; nothing invented.
- [ ] Every bullet starts with a verb and follows XYZ.
- [ ] No em dashes, no buzzwords, no "I".
- [ ] No phone number in any committed file, the web page, or the extracted text of either public PDF.
- [ ] No internal ticket IDs, client names, or other people's data in the repo.
- [ ] `npm run build` passes: full PDF ≤ 2 pages, compact PDF = 1 page, extracted text reads in order.
- [ ] The copy passes the [`PERSONALIZED.md`](PERSONALIZED.md) checklist.
- [ ] AI work is shown as method plus evidence, with only tools that have evidence named.

## Sources

- Laszlo Bock, XYZ formula: https://www.linkedin.com/pulse/20140929001534-24454816-my-personal-formula-for-a-better-resume/
- NN/g, F-shaped reading: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/
- ResumeGo, one vs two pages: https://www.resumego.net/research/one-or-two-page-resumes/
- Ladders eye-tracking (2018): https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/
- Gergely Orosz on developer resumes: https://stackoverflow.blog/2020/11/25/how-to-write-an-effective-developer-resume-advice-from-a-hiring-manager/
- interviewing.io on resume signals: https://interviewing.io/blog/stop-trying-to-make-recruiters-think-or-why-your-resume-is-bad-and-how-to-fix-it
- Enhancv recruiter interviews (2025): https://enhancv.com/blog/does-ats-reject-resumes/
- Greenhouse parsing: https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse
- Stack Overflow 2025 survey, AI: https://survey.stackoverflow.co/2025/ai
- CoderPad State of Tech Hiring 2026: https://coderpad.io/survey-reports/coderpad-state-of-tech-hiring-2026/
- Simon Willison, vibe engineering: https://simonwillison.net/2025/Oct/7/vibe-engineering/
- Built In, AI skills on a resume: https://builtin.com/articles/show-ai-skills-resume
- Resume Genius, AI in hiring: https://resumegenius.com/blog/job-hunting/ai-impact-on-hiring
- World Privacy Forum, job seeker privacy: https://worldprivacyforum.org/posts/consumer-tips-job-seekers-guide-to-resumes/
- FTC job-scam alert (2026): https://consumer.ftc.gov/consumer-alerts/2026/04/job-offer-text-probably-scam
