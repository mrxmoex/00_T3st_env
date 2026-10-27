# Agent instructions — Du bist was du isst

This app is **early UX on a real scoring engine**. Prefer **polish and truth** over shipping volume. Treat every phase as **v1 of a longer arc**, not a finished product.

## North star

1. **Truth first** — UI copy must match what the model actually computes. No implied precision (exact daily need, “essential” without caveat) when data is partial. Prefer “measured / not detected / not expected” over filler.
2. **Polish before merge** — Do not optimize for merging PRs. Optimize for patterns the next phase can reuse.
3. **Display ≠ scoring** — Visuals (pies, radars, groups, honors) may evolve without changing tiers unless the user explicitly requests a scoring change.
4. **One worker per phase** — Read the active phase in `/opt/cursor/artifacts/HANDOFF-ROADMAP.md` (or repo-linked copy). Implement **only** that phase.

## Compounding (required every phase)

Each phase must leave behind:

| Artifact | Purpose |
|----------|---------|
| `handoff-phase-<N>.md` | Single run summary: decisions, files, verify, **seeds for next phase** |
| i18n EN ↔ DE | Same keys, same meaning; note intentional asymmetry if any |
| Shared components | Prefer extending `src/components/*` over page-only duplication |
| **Truth ledger** (in handoff) | Bullet list: claims shown in UI → field/formula/source |

Update **Last completed** in `HANDOFF-ROADMAP.md` when the user confirms the phase.

## Verify before handoff

```bash
npm test
npm run build
```

Manual: routes listed in the active phase. Screenshot to `/opt/cursor/artifacts/` when UI changes.

## Scoring

Logic lives in `src/scoring/`. Changing formulas requires tests in `src/scoring/*.test.ts` and explicit user intent.

## Roadmap

Phased work and copy-paste worker prompts: **`/opt/cursor/artifacts/HANDOFF-ROADMAP.md`**
