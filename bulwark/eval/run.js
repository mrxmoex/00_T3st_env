import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { learnBaseline } from "../src/baseline.js";
import { assessSession, summarize } from "../src/engine.js";
import { buildCorpus, splitCorpus } from "../sim/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INTERRUPT = new Set(["confirm", "block"]);

export function runEval({ seed = 1 } = {}) {
  const sessions = buildCorpus(seed);
  const { train, test } = splitCorpus(sessions);
  const baseline = learnBaseline(train);

  const rows = test.map((session) => {
    const assessments = assessSession(session, { baseline });
    const summary = summarize(assessments);
    return {
      id: session.id,
      label: session.label,
      archetype: session.archetype,
      hardNegative: Boolean(session.hardNegative),
      action: summary.action,
      risk: summary.risk,
      intervened: summary.intervened,
      stepsToIntervention: summary.stepsToIntervention,
      flagged: summary.flagged,
      reasons: summary.worst?.reasons ?? [],
      chain: summary.worst?.chain ?? 0,
      ambient: summary.worst?.ambient ?? 0,
    };
  });

  const attacks = rows.filter((row) => row.label === "attack");
  const benign = rows.filter((row) => row.label === "benign");
  const hardNegatives = benign.filter((row) => row.hardNegative);

  const detected = attacks.filter((row) => INTERRUPT.has(row.action));
  const interruptedBenign = benign.filter((row) => INTERRUPT.has(row.action));
  const flagOnlyBenign = benign.filter((row) => row.action === "flag");
  const flagOnlyAttack = attacks.filter((row) => row.action === "flag");
  const missed = attacks.filter((row) => !INTERRUPT.has(row.action));

  const detectionRate = ratio(detected.length, attacks.length);
  const falsePositiveRate = ratio(interruptedBenign.length, benign.length);
  const flagOnlyRate = ratio(flagOnlyBenign.length + flagOnlyAttack.length, rows.length);
  const meanSteps = mean(detected.map((row) => row.stepsToIntervention).filter((n) => n != null));

  const confusion = {
    attack: countByAction(attacks),
    benign: countByAction(benign),
    hardNegative: countByAction(hardNegatives),
  };

  const report = {
    seed,
    generatedAt: new Date().toISOString(),
    counts: {
      train: train.length,
      test: test.length,
      attacks: attacks.length,
      benign: benign.length,
      hardNegatives: hardNegatives.length,
    },
    metrics: {
      detectionRate,
      falsePositiveRate,
      flagOnlyRate,
      meanStepsToIntervention: meanSteps,
      attacksDetected: detected.length,
      attacksMissed: missed.length,
      benignInterrupted: interruptedBenign.length,
    },
    confusion,
    missedAttacks: missed.map(brief),
    interruptedBenign: interruptedBenign.map(brief),
    hardNegativeActions: hardNegatives.map((row) => ({
      id: row.id,
      action: row.action,
      risk: row.risk,
    })),
    rows,
  };

  return report;
}

function countByAction(rows) {
  const counts = { observe: 0, flag: 0, confirm: 0, block: 0 };
  for (const row of rows) {
    counts[row.action] += 1;
  }
  return counts;
}

function brief(row) {
  return {
    id: row.id,
    action: row.action,
    risk: row.risk,
    chain: row.chain,
    ambient: row.ambient,
    reasons: row.reasons,
  };
}

function ratio(num, den) {
  if (den === 0) {
    return 0;
  }
  return Math.round((num / den) * 1000) / 1000;
}

function mean(values) {
  if (values.length === 0) {
    return null;
  }
  return Math.round((values.reduce((sum, n) => sum + n, 0) / values.length) * 100) / 100;
}

export function formatReport(report) {
  const lines = [];
  const { metrics, counts, confusion } = report;
  lines.push("Bulwark evaluation");
  lines.push("==================");
  lines.push(
    `train ${counts.train} benign sessions · test ${counts.test} (${counts.attacks} attacks, ${counts.benign} benign, ${counts.hardNegatives} hard negatives)`,
  );
  lines.push("");
  lines.push(`detection rate (attacks → confirm/block): ${(metrics.detectionRate * 100).toFixed(1)}%  (${metrics.attacksDetected}/${counts.attacks})`);
  lines.push(`false-positive rate (benign → confirm/block): ${(metrics.falsePositiveRate * 100).toFixed(1)}%  (${metrics.benignInterrupted}/${counts.benign})`);
  lines.push(`flag-only rate (any session ending at flag): ${(metrics.flagOnlyRate * 100).toFixed(1)}%`);
  lines.push(`mean steps-to-intervention on detected attacks: ${metrics.meanStepsToIntervention ?? "n/a"}`);
  lines.push("");
  lines.push("confusion");
  lines.push("  action     attack  benign  hard-neg");
  for (const action of ["observe", "flag", "confirm", "block"]) {
    lines.push(
      `  ${action.padEnd(10)}${String(confusion.attack[action]).padStart(6)}  ${String(confusion.benign[action]).padStart(6)}  ${String(confusion.hardNegative[action]).padStart(8)}`,
    );
  }
  lines.push("");
  if (report.missedAttacks.length === 0) {
    lines.push("missed attacks: none");
  } else {
    lines.push("missed attacks:");
    for (const row of report.missedAttacks) {
      lines.push(`  - ${row.id} ended at ${row.action} (risk ${row.risk}, chain ${row.chain})`);
      for (const reason of row.reasons.slice(0, 3)) {
        lines.push(`      ${reason}`);
      }
    }
  }
  lines.push("");
  if (report.interruptedBenign.length === 0) {
    lines.push("interrupted benign: none");
  } else {
    lines.push("interrupted benign:");
    for (const row of report.interruptedBenign) {
      lines.push(`  - ${row.id} ended at ${row.action} (risk ${row.risk})`);
      for (const reason of row.reasons.slice(0, 3)) {
        lines.push(`      ${reason}`);
      }
    }
  }
  lines.push("");
  lines.push("hard negatives:");
  for (const row of report.hardNegativeActions) {
    lines.push(`  - ${row.id}: ${row.action} (risk ${row.risk})`);
  }
  return lines.join("\n");
}

function main() {
  const report = runEval({ seed: 1 });
  const outPath = join(__dirname, "last-run.json");
  mkdirSync(__dirname, { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(formatReport(report));
  console.log(`\nwrote ${outPath}`);
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invoked) {
  main();
}
