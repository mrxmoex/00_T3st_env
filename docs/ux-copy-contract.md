# UX copy contract

How words, numbers, colours, and marks in the app may make claims. This file sits beside [`non-claims.md`](non-claims.md) (what the system never claims) and [`scoring-formulas.md`](scoring-formulas.md) (what it computes). If this file disagrees with the code or those two, the code and those two win and this file gets fixed.

## 1. Every claim has a backing

A sentence, number, colour, or mark is a claim. It needs one of these backings, preferred in this order:

1. **Code** that computes it: `src/scoring/` or a display helper. Name the function in the phase's truth ledger.
2. **Curated data with a citation**: `src/data/bioactives.ts`, `src/data/absorption.ts`, `src/data/coefficients.ts`, [`data-sources.md`](data-sources.md).
3. **The source mapping**: which database a nutrient comes from (`scripts/data/build_snapshot.py`).
4. **Reference-level physiology** (standard references such as NIH ODS fact sheets or EFSA opinions), for general one-liners only. Never for a number, a food-specific statement, or a ranking.

No backing, no claim. Remove a claim rather than add a disclaimer.

## 2. Numbers

- A number in a sentence that comes from a constant is interpolated from that constant, not typed into the string.
- Every amount states its basis where it appears, or once per block: per 100 g, per 100 kcal, mg per 100 g, %DV per 100 kcal.
- A percentage names its whole, for example "share of the energy from protein, fat, and available carbs".
- A share does not depend on a serving basis. Never label a share "per 100 g", and never offer a basis toggle that cannot change what it claims to change.
- A derived value says it is derived (kJ converted from kcal). It is not shown as if a database reported it.

## 3. Colour and marks

| Mark | Means | Never |
|---|---|---|
| Heat colour (red → green) | Higher scores better on a scored axis: axis scores, ileal digestibility, DIAAS, %DV coverage | On raw amounts that are neither good nor bad (grams of protein, fat, sugar; kcal) |
| Category colour (carb pie, macro donut, mass bar) | A type of component; each chart carries a key | A verdict such as good or bad |
| Radar ring numbers | Shared 0–100 scale | On a radar whose spokes have different full scales |
| ⚠ | 100 kcal exceed the adult whole-day EFSA upper limit (`upperLimitExceedances`) | Lowering a score; implying a single portion is harmful |
| `*` on a compound amount | Raw-tissue value shown for a cooked or processed food, wherever the amount appears (profile chips, honours) | Leaving it off anywhere the amount is shown (non-claim 18) |
| — | No database reports the value | Writing 0 for it (non-claim 14) |
| n.d. | An analysis looked and found none | Standing in for "no data" |
| × (carbohydrate row) | Under 0.5 g carbohydrate per 100 g | Implying a score of 0 |
| Fibre stamp | The honour rule in `foodHonors.ts` | A regulatory "source of fibre" claim |

## 4. Words

| EN | DE | Means | Use instead of |
|---|---|---|---|
| available carbs | verfügbare KH | sugars + digestible starch | "carbs" where fibre matters |
| passive carbs | passive KH | fibre + resistant starch | |
| complete | vollständig | AAS ≥ 1, as the engine flags it | "limiting X" when AAS ≥ 1 |
| limiting X | limitierend X | AAS < 1; X has the lowest ratio | |
| ileal digestibility | ileale Verdaulichkeit | share of protein absorbed by the end of the small intestine | "what the gut delivers" |
| nutrient keeping power | Nährstoff-Haltbarkeit | the stability / nutrient-loss axis | |
| shown, not scored | gezeigt, nicht bewertet | enters no axis, composite, or tier | |
| not detected / not expected / no data | nicht nachgewiesen / nicht zu erwarten / keine Daten | as defined in `src/data/bioactives.ts` | "nothing notable" |

Avoid until something computes or cites it: "necessity" or "need" (no Daily Value shown), "storage" (no `BODY_STORAGE` shown), "essential" for compounds without a dietary reference, "metabolically quiet", "fast" sugars, "plain available".

## 5. Need, storage, essentiality

- **Need** only with the Daily Value or EFSA limit the code uses.
- **Storage** only from `BODY_STORAGE`: years, months, weeks, or none, and the site.
- **Essential** only for nutrients with a dietary reference value. Bioactive compounds are not called essential. "The body makes it" only where the role text says so.

## 6. EN and DE

- Same meaning, same claims, same numbers. A German line may be longer, never broader.
- Bilingual tables that are not sentences live once in `src/i18n/labels.ts` as `LocalizedText`, not copied into `en.ts` and `de.ts`.
- English words in German copy are untranslated, except abbreviations and units (AAS, DIAAS, NOVA, RAE, DV, EFSA, kcal).

## 7. Sources and links

- A compound value shows its source when its chip is expanded, on every page that shows it.
- A hint that names a method links to `/method`.

## 8. Hint hierarchy

Each piece of explanation lives at the lowest level that still keeps the page true.

| Level | Where | Holds | Limit |
|---|---|---|---|
| 0 Label | Headings, row and axis labels | Name, unit, basis | A few words |
| 1 Hint | One line per block (panel, chart, table) | What a reader needs to read the block correctly: basis, scale, what is left out | Two short sentences |
| 2 Key | Beside the marks it explains | Colours and marks (`*`, n.d., ×, ⚠) | Shown only while its mark is on screen |
| 3 Detail | `title` tooltip, or an expandable chip or row | Constants, formulas, caveats, what was measured, the source | Never the only home of something needed to avoid a misreading; touch screens have no hover |
| 4 Method | `/method` | Derivations | Linked from the block's hint or group header |

- **One fact, one place per screen.** If a fact shows twice, keep the copy nearest to what it explains. On Compare the cards carry AAS and DIAAS, so the axis radar does not repeat them.
- **A key sits next to its marks.** The carbohydrate key lives in the carbohydrate row.
- **Explain a mark where and when it appears.** The ⚠ sentence shows only when a ⚠ cell does; the `*` and n.d. key only when a chip uses them.
- **Moving text down a level keeps it true.** Record each move in the phase's truth ledger.

## Checklist for new copy

1. Backing named (section 1) and added to the phase's truth ledger.
2. Basis stated; numbers interpolated from constants.
3. Colour and marks used as in section 3.
4. EN and DE say the same thing.
5. Placed at the lowest level of section 8 that keeps it true; no fact twice on one screen.
