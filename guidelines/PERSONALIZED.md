# PERSONALIZED.md: how Agas writes

Use this before writing or editing any text in this repo: resume bullets, summaries, UI labels, docs. The goal is copy that reads like the owner wrote it, not like a model did. The anti-slop counterpart is the voice-calibration step in [`antislop/antislop-copywriting.md`](antislop/antislop-copywriting.md): match this profile first, then scrub the tells.

## Where this profile comes from

- The owner's writing guideline (kept at work): BLUF, short sentences, active voice, no hedges, one word per concept, no em dashes.
- The owner's own READMEs and notes: plain, punchy, engineering verbs ("One task in, shipped PR out.").
- How the owner talks to collaborators: short, direct, imperative, no pleasantries. That register is for chat only; resume copy keeps the directness but uses full, correct sentences.

## Voice in one line

A senior backend engineer telling another engineer what he shipped, with the numbers, in as few words as it takes.

## Rules

1. **Lead with the point.** The first two or three words carry the line ("Cut boot memory", "Moved ranking to the server").
2. **Short sentences.** Aim for 15 words or fewer; never over 25. Two actions in one bullet get a semicolon, not a chain of "and".
3. **Numbers, not adjectives.** "cut boot memory ~12%" instead of "significantly reduced memory usage".
4. **Engineer's words, not brochure words.** Use the words used at work (table below).
5. **No hype, no praise, no hedges.** Nothing is "robust", "seamless", or "cutting-edge". Nothing "might" or "helps to".
6. **One word per concept.** If it is a "tech plan" once, it is a "tech plan" everywhere.
7. **Credit honestly.** Say who did what: agents implement, the owner plans, directs, and reviews. Name a tool only when there is evidence it was used.
8. **Plain punctuation.** Colon to explain, semicolon to join two related actions, parentheses for a tech list or an aside, `·` for inline lists, `→` for versions and flows. No em dashes. En dashes only in ranges (`Jan 2025 – Present`, `1–8%`).
9. **Telegraphic is fine in bullets,** as long as it reads cleanly aloud. Full stops at the end of every bullet.

## Word choices

| Avoid (reads AI or corporate) | Use (the owner's word) |
|---|---|
| leveraged, utilized | used |
| spearheaded, championed | led, drove |
| orchestrated, facilitated | ran |
| architected | designed, built |
| delivered | shipped |
| ensured | kept, made sure |
| enhanced, optimized (no number) | the change and its number: "raised cache-hit rates", "cut memory ~12%" |
| robust, seamless, cutting-edge, world-class | cut the word, or name the property ("with a circuit breaker") |
| career spans, worked across | list the jobs |
| revenue-critical, mission-critical | name what it is ("ads services") |
| in order to | to |
| a wide range of, various | list them, or cut |
| passionate about | cut |
| technical design document | tech plan, RFC, HLD (whichever it actually was) |
| monitoring and alerting strategy | post-deploy monitoring |

## Before and after (from this resume)

| Before | After |
|---|---|
| Career spans search-ads ranking at Tokopedia, search-ads delivery at TikTok, and ads ranking at Wego. | Search-ads ranking at Tokopedia (TopAds), then search-ads delivery at TikTok. Now ads ranking and partner monetization at Wego. |
| Re-architected Flight Details ranking: moved sectioning server-side and published grouped sections with full scoring telemetry for analysts. | Moved Flight Details ranking to the server: added Sponsored/Recommended/Other sections and logged full scoring data for analysts. |
| Ran tech plans, implementation, and automated PR review through Claude Code across an unfamiliar polyglot codebase. | Used Claude Code for tech plans, implementation, and automated PR review; the team adopted the automated review. |
| Redesigned the ads container service to meet the integration timeline while preserving the long-term architecture. | Redesigned the ads container service to hit the integration deadline without breaking the long-term architecture. |

## UI copy

Short labels, sentence case, no punctuation flourishes: "Download PDF", "1-page PDF", "Updated Sep 2026", "Skip to content".

## Checklist

- [ ] Reads aloud like the owner explaining it to an engineer.
- [ ] No word from the "Avoid" column.
- [ ] Every sentence ≤ 25 words; most ≤ 15.
- [ ] No em dashes; en dashes only in ranges.
- [ ] No new facts, names, or numbers introduced while rewording.
