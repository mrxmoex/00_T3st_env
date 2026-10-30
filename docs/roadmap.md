# Roadmap: polish and truth, one phase at a time

This file holds the phased UX work. It lives in git so every agent, fork, and VM reads the same instructions. Handoffs live in `docs/handoffs/`.

## Current state

| | |
|---|---|
| Branch | `cursor/compare-nutrient-groups-b80f` |
| Pull request | [#15](https://github.com/mrxmoex/00_T3st_env/pull/15), open until Phase 8 |
| Last confirmed phase | 1 (truth audit and copy contract) |
| Active phase | 2, awaiting review (`docs/handoffs/phase-2.md`) |

At the end of a phase, set *Active phase* to "N, awaiting review". Only the user's go moves *Last confirmed phase*.

## Principles

1. **Truth before polish, polish before merge.** A sentence the code or a cited source cannot back is a bug, however well it reads.
2. **Display is not scoring.** Charts, groups, and copy may change. Axis, composite, and tier formulas in `src/scoring/` change only when the user asks, with tests.
3. **One worker per phase.** It owns the whole scope of its phase and nothing outside it. Problems found elsewhere go into the handoff under *Found, not fixed*, routed to a phase.
4. **Every phase leaves ground for the next.** A handoff with seeds, shared components instead of page copies, and EN and DE keys that mean the same thing.

## How to run a phase

1. **Entry.** Check out the branch in *Current state*, pull, confirm a clean tree and a green `npm test`.
2. **Read, in order.** `AGENTS.md`; this file's *Current state*, *Principles*, and your phase; every handoff your phase lists under *Reads*; the truth anchors your phase names.
3. **Work.** Stay in scope. Prefer removing a wrong claim to adding a disclaimer.
4. **Verify.** `npm test`, `npm run build`, eslint on touched files, then each route your phase lists, in EN and DE. Screenshots go to `/opt/cursor/artifacts/` (VM-local evidence; not committed).
5. **Hand off.** Write `docs/handoffs/phase-<N>.md` from the template below. Set *Active phase* to "N, awaiting review".
6. **Ship.** Conventional commits, push, and add one line for the phase to the PR #15 description without removing human edits.
7. **Gate.** Stop. The user says go, adjust, or redo.

### Handoff template

```markdown
# Phase <N> handoff: <name>

## Intent
One paragraph: what this phase set out to do and which inputs (IDs) it served.

## Truth ledger
- <UI claim, EN key> → <code path, data field, or citation>; limits stated in the UI: <yes/no>

## Decisions
What shape we chose, what we refused, and why.

## Files

## Verified
Commands run and routes checked (EN and DE), with screenshot paths.

## Found, not fixed
- <issue> → Phase <N>

## Seeds for the next phase
Concrete items with file or key names.
```

## Annotation intake

The user gives feedback by selecting elements in the browser preview and commenting on them (annotate mode). When a batch arrives:

1. Add each item to the *Input log* with the next ID, the surface it points at, and its intent in one line.
2. Route each item to a phase. Do not implement during intake unless the user asks.
3. If an item conflicts with a principle or with `docs/non-claims.md`, note the conflict next to it.

## Input log

Status describes where each item stood after Phase 0.

**Batch A: first annotation round on Compare**

| ID | Surface | Intent | Status | Next |
|---|---|---|---|---|
| A1 | Axis radar, protein spoke | Group amino-acid sources logically; add digestibility and availability; rank valuable sources against merely available ones | Done: protein split into pattern, ileal digestibility, density | 4 |
| A2 | Axis table, carbohydrate type | A 0–100 cell says little for protein-rich foods; show a small pie, size for amount, colour for composition | Done: `CarbTypePie` | 3 |
| A3 | Nutrient radar, energy label | Label covered the triangle; explanation redundant; show what 100 g or 100 kcal of the food is made of | Done, v1 | 3 |
| A4 | NOVA badge | Smaller status marker, like a small green supernova | Done: `NovaMarker` | none |
| A5 | Food card line | No zeros without a positive to weigh them; honorary mentions of what is good; fibre sources get a stamp | Done: `FoodHonorsList` | 6 |
| A6 | Degradation axis | Nutrient loss over time needs a name people remember; many mechanisms; not every nutrient is at risk | Done: "Nutrient keeping power" | 4 |
| A7 | Bioactive compound grid | Half empty, half dull; profile what is inside each food and explain it; make it engaging | Partly: `BioactivesProfile` | 6 |
| A8 | Whole app | Match the other pages to Compare; keep what was good | Done, v1 | 5 |
| A9 | Axis table | The changes extend to the axis table under the radar | Done | none |

**Batch B: second annotation round on Compare**

| ID | Surface | Intent | Status | Next |
|---|---|---|---|---|
| B1 | Bioactive cards, "What's inside" line | Put descriptions in the header, not on every card | Done | 2 |
| B2 | Bioactives heading "(mg per 100 g)" | Do not lead with absolute amounts: storage, daily need, essential or not, what is best about this food | Partly | 1, 6 |
| B3 | Nutrient radar, basis toggle and hint | The toggle changed nothing; spokes displaced and misaligned | Toggle fixed | 1, 3 |
| B4 | Nutrient radar | Add water and other so the makeup reaches 100 %; energy and nutrient density; show nutritional value | v1 | 3 |
| B5 | Macro legend | A proper legend: what the colours are, total amounts, which food; no logical fallacies | v1 | 1, 3 |
| B6 | Carbohydrate type row | Rename (DE: Kohlenhydrat-Zusammensetzung, Qualität); colour key for better and worse, with a legend; a friendly mark for none | Done | 1, 3 |
| B7 | DIGESTIBILITY group | Its own category: a necessity and impact vector covering sourcing, exposure, short- and long-term effects, storage, environment; always sourced and linked | v1: "Necessity & impact" group | 1, 4 |
| B8 | Micronutrient % cells | More uniform; a short description per nutrient | Done | 2 |

**Direction**

| ID | Intent | Where it lands |
|---|---|---|
| C1 | Compare works but carries too much text; fine-tune later | Phase 2 |
| C2 | Polish and truth first; this is only the beginning; phases must compound | Principles |
| C3 | One strong worker per phase | How to run a phase |

## Phases

### Phase 0: Baseline (done)

Working Compare page from batches A and B, carried to Food, Matrix, Method, and panels. See `docs/handoffs/phase-0.md`.

### Phase 1: Truth audit and copy contract

**Intent.** Every claim on `/compare` is true to the code and the data, in EN and DE, and the rules for future copy are written down. This phase changes words, and the display math behind numbers that appear in words. It does not shorten, restyle, or regroup.

**Inputs.** C2, B2, B3, B5, B6, B7.

**Reads.** `docs/handoffs/phase-0.md`.

**Truth anchors.** `docs/non-claims.md`, `docs/scoring-formulas.md`, `docs/data-sources.md`, `src/scoring/`, `src/data/bioactives.ts`, `src/data/absorption.ts` (`BODY_STORAGE`), `src/data/coefficients.ts`.

**In scope.**
- Every user-visible string on `/compare` in EN and DE: headings, hints, legends, table labels, empty states, `title` and `aria-label` text.
- Display code that produces a number or label inside those strings: macro shares, radar full-scale values, carb pie segments, micronutrient percentages, group labels. Display helpers such as `src/scoring/macroEnergy.ts` and `src/scoring/generalNutrients.ts` may be fixed, with tests.
- A new `docs/ux-copy-contract.md`.

**Out of scope.**
- Shortening true text (Phase 2). Deleting a false sentence is allowed.
- Layout, colour, chart geometry (Phase 3).
- Regrouping the axis table (Phase 4).
- Food and Matrix pages (Phase 5). A shared key fixed here changes there too; list those keys in the handoff.
- Axis, composite, and tier formulas. Deleting unused keys or components (Phase 7).

**Method.**
1. **Inventory.** Render `/compare` with contrasting foods: egg boiled, lentils boiled, salmon oven-roasted, plus a NOVA 4 food and a fat-free plant when the catalog has them. List each visible string with its i18n key and component.
2. **Trace.** For each string that states a fact, number, unit, basis, or cause, find the code or data that produces it.
3. **Classify.** TRUE; IMPRECISE (true, but missing its basis or unit, or easy to misread); FALSE; UNBACKED (no code or source behind it); DRIFT (DE means something else than EN); STALE (describes UI that no longer exists).
4. **Fix** every FALSE, UNBACKED, DRIFT, and STALE string, and IMPRECISE ones where a few words fix it. Same meaning in EN and DE.
5. **Contract.** Write `docs/ux-copy-contract.md`: vocabulary, units and basis labels, the "shown, not scored" convention, what colour may mean, how to phrase need, storage, and essentiality, and how to say "no data". Link `docs/non-claims.md` instead of restating it.
6. **Ledger.** In the handoff, list each claim kept or changed and what backs it.
7. **Seeds.** In the handoff, list true but redundant strings, with key and proposed treatment (cut, merge, move to a tooltip), for Phase 2.

**Done when.**
- No FALSE, UNBACKED, DRIFT, or STALE string remains on `/compare` in EN or DE.
- Every number inside a sentence (scale maxima, thresholds) equals the constant in code.
- No axis, composite, or tier formula changed in this phase.
- `docs/ux-copy-contract.md` exists and links the non-claims instead of copying them.
- The handoff has the truth ledger, the Phase 2 list, and the keys shared with Food and Matrix.
- `npm test` and `npm run build` pass; `/compare` checked in EN and DE, including the per-100-g / per-100-kcal toggle.

**Worker prompt.**

```
Run Phase 1 of docs/roadmap.md on branch cursor/compare-nutrient-groups-b80f.
Read AGENTS.md, then docs/roadmap.md (Current state, Principles, How to run a phase, Phase 1), then docs/handoffs/phase-0.md.
Audit every visible string on /compare (EN and DE) against the code and the truth anchors. Fix what is false, unbacked, drifted, stale, or imprecise. Write docs/ux-copy-contract.md and docs/handoffs/phase-1.md (truth ledger, Phase 2 list, shared keys).
Do not shorten true text, restyle, regroup, or change formulas. Stop at the gate.
```

### Phase 2: Compare density and hierarchy

**Intent.** Same truth, fewer words. At most one hint per block; detail moves into tooltips or expandable rows.

**Inputs.** C1, B1, B8, A3.

**Reads.** `docs/handoffs/phase-1.md` (its Phase 2 list), `docs/ux-copy-contract.md`.

**In scope.** The strings on Phase 1's list; spacing on `/compare` where text leaves; a "hint hierarchy" section added to the contract.

**Out of scope.** Chart geometry and new visuals (3), regrouping (4), other pages (5).

**Done when.** Every item on Phase 1's list is cut, merged, moved, or kept with a reason; no new paragraph appears; EN and DE agree; before and after screenshots exist.

**Worker prompt.**

```
Run Phase 2 of docs/roadmap.md. Read AGENTS.md, docs/roadmap.md, docs/handoffs/phase-1.md, docs/ux-copy-contract.md.
Work through the Phase 2 list in the Phase 1 handoff on /compare. Keep every claim in the truth ledger true. Add a hint hierarchy section to the contract. Stop at the gate.
```

### Phase 3: Compare visual calibration

**Intent.** The charts read at a glance: radar geometry and label alignment, a legend that names colours and amounts, the carbohydrate colour key, a clear mark for "none".

**Inputs.** B3, B4, B5, B6, A2, A3.

**Reads.** Handoffs 1 and 2, the contract.

**In scope.** `RadarChart`, `NutrientRadar`, `MacroCompositionPie`, `MassCompositionBar`, `CarbTypePie`, their CSS, and the Compare tables at narrow widths. Start from the seeds in `docs/handoffs/phase-2.md`.

**Out of scope.** Copy beyond chart labels, scoring, grouping.

**Done when.** Spokes and labels align at 1280, 1024, 768, and 390 px; the legend shows a colour key and per-food amounts; the makeup sums to 100 % including water and other; screenshots in EN and DE, light and dark.

### Phase 4: Necessity and impact vector

**Intent.** One place per food that says why it matters: what the body needs and stores, how well it absorbs it, how long nutrients keep, what exposure comes with it. Every row sourced and linked.

**Inputs.** B7, A6, A1, B2 (storage).

**Reads.** Handoffs 1 to 3, the contract, `docs/scoring-formulas.md` (body-store column, exposure), `docs/data-sources.md`.

**In scope.** `src/pages/compareAxisGroups.ts` and its tests, group labels, links to Method, Exposure, and Limits, display of `BODY_STORAGE`.

**Out of scope.** New scores or weights without the user's sign-off; Food and Matrix (5).

**Done when.** Every row in the group links a source or a Method anchor; no statement of need goes beyond the Daily Values and EFSA limits the code uses; tests updated.

### Phase 5: Carry the patterns to Food and Matrix

**Intent.** Food and Matrix speak and look like Compare: same words, same hint hierarchy, same shared components. Compare-only legends are not copied where they do not fit.

**Inputs.** A8, C1.

**Reads.** Handoffs 1 to 4, the contract.

**In scope.** `FoodPage`, `MatrixPage`, `MatrixTable`, shared components.

**Done when.** `/`, `/food/<id>`, and `/compare` use the same components for the same facts; EN and DE checked; screenshots of all three.

### Phase 6: Bioactives story layer

**Intent.** Each food's profile explains what is special about it: what a compound does, whether the body makes it, where it is stored. Sourced, with no empty grids.

**Inputs.** A7, B2, A5.

**Reads.** Handoffs 1 to 5, the contract, the sources in `src/data/bioactives.ts`.

**In scope.** `BioactivesProfile`, compound role texts, how honours and profiles relate.

**Out of scope.** Pictures, animation, or 3D until the user specifies them; log ideas in the handoff.

**Done when.** Every role statement carries a citation; nothing is called essential without a source.

### Phase 7: Hygiene

**Intent.** Remove what earlier phases left unused: `BioactivesTable` if nothing imports it, display helpers no longer called (`generalNutrientScores`), keys that no longer match their content (`compare.necessityImpact*`), stale CSS.

**Done when.** A search shows no remaining references; tests and build pass.

### Phase 8: Merge gate

Not a polish phase. PR #15 is ready to merge when the user signs off on the polish, the Phase 1 truth ledger re-checks clean on Compare, Food, and Matrix in EN and DE, and tests and build pass. The user merges.
