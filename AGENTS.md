# Agent instructions: Du bist was du isst

Early UX on a real scoring engine. Prefer polish and truth over volume; every phase is v1 of a longer arc.

## Start here

1. `docs/roadmap.md`: current state, principles, how to run a phase, the input log of user feedback, and one brief per phase.
2. The latest `docs/handoffs/phase-<N>.md`.
3. Truth anchors: `docs/non-claims.md`, `docs/scoring-formulas.md`, `docs/data-sources.md`.

## Rules

- **Truth first.** UI copy states only what the code computes or a cited source says. No implied precision. Missing stays missing (—), never 0.
- **Display is not scoring.** Axis, composite, and tier formulas in `src/scoring/` change only on an explicit user request, with tests.
- **One worker per phase.** Stay in scope; log what you find outside it in the handoff.
- **EN and DE mean the same.** Copy follows `docs/ux-copy-contract.md` (written in Phase 1).
- **Shared components** in `src/components/` over page-local copies.

## Verify

```bash
npm test
npm run build
```

Then eslint on touched files and the routes your phase lists, in EN and DE.

## Cursor Cloud specific instructions

- Dev server: `npm run dev` (Vite on port 3000 with `--host`); run it in tmux.
- `/opt/cursor/artifacts/` holds screenshots and does not survive forks or new VMs. Anything a later phase needs belongs in `docs/`.
