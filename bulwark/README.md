# Bulwark

Bulwark is a research prototype that monitors AI-agent tool-call traces. It scores causal paths that combine untrusted input, sensitive data, and egress rather than treating one unusual event as an attack.

The response levels are `observe`, `flag`, `confirm`, and `block`. Novel destinations, unusual volume, and other ambient signals may raise attention, but they cannot interrupt an agent by themselves. Structural content signals affect taint weight; they are not a prompt-injection verdict.

This package uses simulated traces. It is not a production security boundary. Read [STRATEGY.md](STRATEGY.md) for the market analysis, limits, and evidence required before making product claims.

## Requirements

- Node.js 20 or newer.
- Port 3001 available for the demo.

The package currently has no third-party runtime dependencies.

## Operator commands

Run commands from the repository root:

```bash
cd bulwark && npm test
npm run eval
npm run demo
```

The commands are the package contract:

| Command | Purpose |
| --- | --- |
| `npm test` | Run the unit tests with Node's built-in test runner |
| `npm run eval` | Run the seeded simulator evaluation and print detection, interruption, and timing metrics |
| `npm run demo` | Start the local trace walkthrough at [http://localhost:3001](http://localhost:3001) |

If a checkout does not yet contain the corresponding `package.json` scripts, treat these names as the intended interface rather than inventing replacement commands.

Stop the demo with `Ctrl+C`. It uses port 3001 so the root Notes app can continue using port 3000.

## Reading the evaluation

The included corpus is synthetic. It contains benign sessions, attack sessions, and hard negatives such as first-time destinations or secret reads without external egress. Use the run to check engine behavior, not to claim a production detection rate.

Before quoting a result, retain the generated eval artifact with its seed, corpus version, configuration, counts, and timestamp. `STRATEGY.md` deliberately leaves its eval numbers blank when `eval/last-run.json` is absent.

## Package map

| Path | Operator relevance |
| --- | --- |
| `src/` | Trace scoring, capabilities, provenance, baseline, and detectors |
| `sim/` | Seeded trace scenarios |
| `eval/` | Evaluation runner and output |
| `test/` | Unit tests |
| `demo/` | Local server and walkthrough |

Do not send production prompts, credentials, source code, or personal data through this prototype.
