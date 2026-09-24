# anti-slop (vendored)

A copy of the rule files from [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop), used as the filter for this repo's design and copy. MIT licensed (see `LICENSE`).

- **Version:** 3.2.15
- **Upstream commit:** `0e384b7bff33` (2026-09-23)

## Which file pairs with which guideline

| Our guideline | Anti-slop counterpart | Covers |
|---|---|---|
| [`../DESIGN.md`](../DESIGN.md) | [`antislop-ui.md`](antislop-ui.md) | Color, layout, components, decoration, motion |
| [`../DESIGN.md`](../DESIGN.md) | [`antislop-layoutmobile.md`](antislop-layoutmobile.md) | Reflow, overflow, tap targets |
| [`../DESIGN.md`](../DESIGN.md) | [`antislop-human.md`](antislop-human.md) + [`contrast-check.py`](contrast-check.py) | Contrast, zoom, keyboard |
| [`../RESUME-BEST-PRACTICE-CONTENT.md`](../RESUME-BEST-PRACTICE-CONTENT.md) | [`antislop-copywriting.md`](antislop-copywriting.md) | Voice, rhythm, honesty, hygiene of text |
| [`../PERSONALIZED.md`](../PERSONALIZED.md) | [`antislop-copywriting.md`](antislop-copywriting.md) § Voice calibration | Matching the owner's own voice before scrubbing tells |
| All of the above | [`antislop.md`](antislop.md) | The core: rules R-01 to R-38, dials, Delivery Gate |

Our guidelines win when they disagree with anti-slop; the disagreement gets written down in our file.

## Contrast checker

```bash
python3 guidelines/antislop/contrast-check.py "#66645C" "#FAF9F5"
```

Prints the ratio and a PASS/FAIL for normal (4.5:1) and large (3:1) text. The `--selftest` flag needs the upstream `SKILL.md` layout and does not work in this copy.

## Updating

Re-download the files from the upstream `skills/` folder, keep the names above, and update the version and commit here.
