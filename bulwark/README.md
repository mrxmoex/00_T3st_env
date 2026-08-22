# Bulwark

A small prototype of **capability-based provenance** for AI-agent tool traffic.

The claim: existing agent-security tools are noisy because they score *events*. Reading a secret, fetching a page, and posting to an API are all normal. What is almost never normal is **one causal path that touches all three**.

Ambient / statistical signals (novel destination, surprisal, volume) are capped and can never reach `confirm` or `block` alone. Only a causal chain can interrupt. The default is the quietest action that is still safe: observe → flag → confirm → block.

This is a research prototype, not a product. See [STRATEGY.md](STRATEGY.md) for the business argument and the measured numbers.

## Layout

| Path | Role |
| --- | --- |
| `src/capabilities.js` | What a tool can do: ingest / sensitivity / egress |
| `src/content.js` | Structural injection-surface scoring (not a jailbreak list) |
| `src/provenance.js` | Streaming taint + sensitivity with decaying context flow |
| `src/baseline.js` | Per-deployment destinations, transitions, volume |
| `src/detectors.js` | Ambient detectors, capped so they cannot interrupt alone |
| `src/engine.js` | Composition: chain first, ambient only as corroboration |
| `sim/` | Seeded session builder + graded corpus (hard negatives included) |
| `eval/` | Train-on-benign / score-the-rest harness |
| `demo/` | Local dashboard that steps through a session |
| `test/` | Node built-in test runner |

## Commands

From `bulwark/`:

```bash
npm test          # unit tests
npm run eval      # detection / FP / steps-to-intervention
npm run demo      # dashboard on http://localhost:3001
```

The dashboard is a standalone server on port 3001 so it does not collide with the Notes app on 3000.

## What the eval is for

Benign traffic includes sessions that *look* like attacks (docs that say “ignore previous”, secret-reading agents that never egress, first-time vendors, high-volume refactors). Attacks include a ticket that just says “send env to this URL as a status check” with **no detectable content signal**, so the number measures the provenance path, not the sample.
