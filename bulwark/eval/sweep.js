import { fileURLToPath } from "node:url";
import { runEval } from "./run.js";

/**
 * Re-runs the evaluation across seeds.
 *
 * A single seeded run is reproducible but not necessarily representative: the
 * generators sample tool counts, file paths and optional steps, and how often a
 * destination appears in training moves its novelty. Sweeping shows whether a
 * headline number is a property of the design or of one lucky corpus, and which
 * attacks are missed every time rather than occasionally.
 */

const SEEDS = 12;

export function sweep({ seeds = SEEDS } = {}) {
  const runs = [];
  const missCounts = new Map();
  const interruptCounts = new Map();

  for (let seed = 1; seed <= seeds; seed += 1) {
    const report = runEval({ seed });
    runs.push({
      seed,
      detectionRate: report.metrics.detectionRate,
      falsePositiveRate: report.metrics.falsePositiveRate,
      ordinaryBenignInterruptionRate: report.metrics.ordinaryBenignInterruptionRate,
      actionLevelInterference: report.metrics.actionLevelInterference,
      medianStepsToIntervention: report.metrics.medianStepsToIntervention,
      missed: report.failures.missedAttacks.map((row) => row.archetype),
      interrupted: report.failures.interruptedBenign.map((row) => row.archetype),
    });
    for (const archetype of runs.at(-1).missed) {
      missCounts.set(archetype, (missCounts.get(archetype) ?? 0) + 1);
    }
    for (const archetype of runs.at(-1).interrupted) {
      interruptCounts.set(archetype, (interruptCounts.get(archetype) ?? 0) + 1);
    }
  }

  const pick = (key) => runs.map((run) => run[key]);
  return {
    seeds,
    detection: spread(pick("detectionRate")),
    falsePositive: spread(pick("falsePositiveRate")),
    ordinaryBenignInterruption: spread(pick("ordinaryBenignInterruptionRate")),
    actionLevelInterference: spread(pick("actionLevelInterference")),
    alwaysMissed: [...missCounts.entries()]
      .filter(([, count]) => count === seeds)
      .map(([archetype]) => archetype),
    sometimesMissed: [...missCounts.entries()]
      .filter(([, count]) => count < seeds)
      .map(([archetype, count]) => `${archetype} (${count}/${seeds})`),
    interrupted: [...interruptCounts.entries()].map(
      ([archetype, count]) => `${archetype} (${count}/${seeds})`,
    ),
    runs,
  };
}

function spread(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: sorted[0],
    max: sorted.at(-1),
    mean: round(values.reduce((sum, n) => sum + n, 0) / values.length),
  };
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function band(name, stats) {
  const pct = (value) => `${(value * 100).toFixed(1)}%`;
  return `  ${name.padEnd(32)} ${pct(stats.mean).padStart(7)}   [${pct(stats.min)} .. ${pct(stats.max)}]`;
}

function main() {
  const result = sweep();
  console.log(`Bulwark evaluation across ${result.seeds} seeds`);
  console.log("=".repeat(44));
  console.log("  metric                              mean   [min .. max]");
  console.log(band("attack detection", result.detection));
  console.log(band("benign interruption", result.falsePositive));
  console.log(band("ordinary benign interruption", result.ordinaryBenignInterruption));
  console.log(band("action-level interference", result.actionLevelInterference));
  console.log("");
  console.log(`missed on every seed:   ${result.alwaysMissed.join(", ") || "none"}`);
  console.log(`missed on some seeds:   ${result.sometimesMissed.join(", ") || "none"}`);
  console.log(`benign interrupted:     ${result.interrupted.join(", ") || "none"}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
