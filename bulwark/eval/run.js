import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { learnBaseline } from "../src/baseline.js";
import { DEFAULT_THRESHOLDS, assessSession, summarize } from "../src/engine.js";
import { buildCorpus, splitCorpus } from "../sim/index.js";

/**
 * The evaluation harness.
 *
 * Two numbers decide whether a detector of this kind is usable, and they pull
 * against each other:
 *
 *   detection rate      attacks that reach confirm or block
 *   interference rate   benign sessions that reach confirm or block
 *
 * Reporting the first without the second is how agent-security tools end up
 * shipped and then switched off. Both are reported here per session and per
 * action, along with how deep into a session the intervention lands, because
 * catching an exfiltration on its last step is an incident report rather than
 * a prevention.
 *
 * The baseline is learned from held-out benign sessions only. Hard negatives
 * and attacks never appear in training.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const INTERRUPT = new Set(["confirm", "block"]);

export function runEval({ seed = 1, thresholds = DEFAULT_THRESHOLDS } = {}) {
  const sessions = buildCorpus(seed);
  const { train, test } = splitCorpus(sessions);
  const baseline = learnBaseline(train);

  const rows = test.map((row) => score(row, { baseline, thresholds }));

  const attacks = rows.filter((row) => row.label === "attack");
  const benign = rows.filter((row) => row.label === "benign");
  const hardNegatives = benign.filter((row) => row.hardNegative);
  const ordinary = benign.filter((row) => !row.hardNegative);

  const detected = attacks.filter((row) => INTERRUPT.has(row.action));
  const missed = attacks.filter((row) => !INTERRUPT.has(row.action));
  const interrupted = benign.filter((row) => INTERRUPT.has(row.action));
  const stepsToIntervention = detected
    .map((row) => row.stepsToIntervention)
    .filter((value) => value != null);

  // Action-level interference: what fraction of everything a benign agent
  // tried to do actually got stopped. The session rate overstates the cost of
  // a single late confirm in a forty-step session.
  const benignSteps = benign.reduce((sum, row) => sum + row.steps, 0);
  const benignInterruptedSteps = benign.reduce((sum, row) => sum + row.interruptedSteps, 0);
  const benignFlaggedSteps = benign.reduce((sum, row) => sum + row.flaggedSteps, 0);

  const report = {
    seed,
    generatedAt: new Date().toISOString(),
    thresholds,
    counts: {
      trainSessions: train.length,
      trainSteps: train.reduce((sum, row) => sum + row.steps.length, 0),
      testSessions: test.length,
      attacks: attacks.length,
      benign: benign.length,
      ordinaryBenign: ordinary.length,
      hardNegatives: hardNegatives.length,
    },
    metrics: {
      detectionRate: ratio(detected.length, attacks.length),
      falsePositiveRate: ratio(interrupted.length, benign.length),
      hardNegativeInterruptionRate: ratio(
        hardNegatives.filter((row) => INTERRUPT.has(row.action)).length,
        hardNegatives.length,
      ),
      ordinaryBenignInterruptionRate: ratio(
        ordinary.filter((row) => INTERRUPT.has(row.action)).length,
        ordinary.length,
      ),
      flagOnlyRateBenign: ratio(
        benign.filter((row) => row.action === "flag").length,
        benign.length,
      ),
      flagOnlyRateAttack: ratio(
        attacks.filter((row) => row.action === "flag").length,
        attacks.length,
      ),
      meanStepsToIntervention: mean(stepsToIntervention),
      medianStepsToIntervention: median(stepsToIntervention),
      actionLevelInterference: ratio(benignInterruptedSteps, benignSteps),
      actionLevelFlagging: ratio(benignFlaggedSteps, benignSteps),
      attacksDetected: detected.length,
      attacksMissed: missed.length,
      benignInterrupted: interrupted.length,
      benignSteps,
      benignInterruptedSteps,
    },
    confusion: {
      attack: countByAction(attacks),
      ordinaryBenign: countByAction(ordinary),
      hardNegative: countByAction(hardNegatives),
    },
    byFamily: groupBy(attacks, (row) => row.family ?? "unclassified"),
    byArchetype: groupBy(benign, (row) => row.archetype),
    failures: {
      missedAttacks: missed.map(explain),
      interruptedBenign: interrupted.map(explain),
    },
    ablation: ablate(test, { baseline, thresholds }),
    rows,
  };

  return report;
}

function score(session, { baseline, thresholds }) {
  const assessments = assessSession(session, { baseline, thresholds });
  const summary = summarize(assessments);
  return {
    id: session.id,
    label: session.label,
    archetype: session.archetype,
    family: session.family ?? null,
    hardNegative: Boolean(session.hardNegative),
    steps: session.steps.length,
    action: summary.action,
    risk: summary.risk,
    intervened: summary.intervened,
    stepsToIntervention: summary.stepsToIntervention,
    interruptedSteps: assessments.filter((row) => INTERRUPT.has(row.action)).length,
    flaggedSteps: assessments.filter((row) => row.action === "flag").length,
    worstTool: summary.worst?.tool ?? null,
    chain: summary.worst?.chain ?? 0,
    ambient: summary.worst?.ambient ?? 0,
    reasons: summary.worst?.reasons ?? [],
    chainPath: (summary.worst?.chainPath ?? []).map((node) => `${node.id}:${node.tool}`),
  };
}

/**
 * The empirical form of the central claim: statistical signals corroborate a
 * chain but must never be able to interrupt on their own.
 *
 * `chainOnly` re-decides every step from the causal score with the ambient
 * contribution removed. `ambientOnly` does the reverse. If the ambient-only
 * arm can reach confirm at all, the cap is not doing its job.
 */
function ablate(test, { baseline, thresholds }) {
  const arms = {
    full: { detected: 0, interrupted: 0 },
    chainOnly: { detected: 0, interrupted: 0 },
    ambientOnly: { detected: 0, interrupted: 0 },
    noContextFlow: { detected: 0, interrupted: 0 },
  };
  let attacks = 0;
  let benign = 0;
  let ambientCeiling = 0;

  for (const session of test) {
    const assessments = assessSession(session, { baseline, thresholds });
    const flat = assessSession(session, { baseline, thresholds, contextFlow: false });

    const worst = (rows, pick) =>
      rows.reduce((max, row) => Math.max(max, pick(row)), 0);

    const chainOnly = worst(assessments, (row) => row.chain);
    const ambientOnly = worst(assessments, (row) => row.risk - row.chain > 0 ? row.risk - row.chain : 0);
    const full = worst(assessments, (row) => row.risk);
    const flatFull = worst(flat, (row) => row.risk);
    ambientCeiling = Math.max(ambientCeiling, ambientOnly);

    const interrupts = {
      full: full >= thresholds.confirm,
      chainOnly: chainOnly >= thresholds.confirm,
      ambientOnly: ambientOnly >= thresholds.confirm,
      noContextFlow: flatFull >= thresholds.confirm,
    };

    if (session.label === "attack") {
      attacks += 1;
      for (const arm of Object.keys(arms)) {
        if (interrupts[arm]) {
          arms[arm].detected += 1;
        }
      }
    } else {
      benign += 1;
      for (const arm of Object.keys(arms)) {
        if (interrupts[arm]) {
          arms[arm].interrupted += 1;
        }
      }
    }
  }

  const summary = {};
  for (const [arm, counts] of Object.entries(arms)) {
    summary[arm] = {
      detectionRate: ratio(counts.detected, attacks),
      falsePositiveRate: ratio(counts.interrupted, benign),
    };
  }
  summary.maxAmbientOnlyRisk = round(ambientCeiling);
  summary.ambientCanInterruptAlone = ambientCeiling >= thresholds.confirm;
  return summary;
}

function groupBy(rows, key) {
  const groups = {};
  for (const row of rows) {
    const name = key(row);
    const group = (groups[name] ??= { sessions: 0, interrupted: 0, flagged: 0 });
    group.sessions += 1;
    if (INTERRUPT.has(row.action)) {
      group.interrupted += 1;
    } else if (row.action === "flag") {
      group.flagged += 1;
    }
  }
  return groups;
}

function countByAction(rows) {
  const counts = { observe: 0, flag: 0, confirm: 0, block: 0 };
  for (const row of rows) {
    counts[row.action] += 1;
  }
  return counts;
}

function explain(row) {
  return {
    id: row.id,
    archetype: row.archetype,
    family: row.family,
    action: row.action,
    risk: row.risk,
    chain: row.chain,
    ambient: row.ambient,
    tool: row.worstTool,
    stepsToIntervention: row.stepsToIntervention,
    reasons: row.reasons,
    chainPath: row.chainPath,
  };
}

function ratio(numerator, denominator) {
  return denominator === 0 ? 0 : round(numerator / denominator);
}

function mean(values) {
  return values.length === 0 ? null : round(values.reduce((sum, n) => sum + n, 0) / values.length);
}

function median(values) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : round((sorted[middle - 1] + sorted[middle]) / 2);
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatReport(report) {
  const { metrics, counts, confusion, ablation, failures } = report;
  const lines = [];

  lines.push("Bulwark evaluation");
  lines.push("==================");
  lines.push(
    `baseline: ${counts.trainSessions} benign sessions / ${counts.trainSteps} steps (held out)`,
  );
  lines.push(
    `scored:   ${counts.testSessions} sessions — ${counts.attacks} attacks, ${counts.ordinaryBenign} ordinary benign, ${counts.hardNegatives} hard negatives`,
  );
  lines.push("");
  lines.push("headline");
  lines.push(
    `  attack detection (confirm/block)   ${percent(metrics.detectionRate)}  (${metrics.attacksDetected}/${counts.attacks})`,
  );
  lines.push(
    `  benign interruption                ${percent(metrics.falsePositiveRate)}  (${metrics.benignInterrupted}/${counts.benign})`,
  );
  lines.push(
    `    of which ordinary benign         ${percent(metrics.ordinaryBenignInterruptionRate)}`,
  );
  lines.push(
    `    of which hard negatives          ${percent(metrics.hardNegativeInterruptionRate)}`,
  );
  lines.push(
    `  action-level interference          ${percent(metrics.actionLevelInterference)}  (${metrics.benignInterruptedSteps}/${metrics.benignSteps} benign steps)`,
  );
  lines.push(`  action-level flagging              ${percent(metrics.actionLevelFlagging)}`);
  lines.push(
    `  benign sessions ending at flag     ${percent(metrics.flagOnlyRateBenign)}`,
  );
  lines.push(
    `  attacks ending at flag only        ${percent(metrics.flagOnlyRateAttack)}`,
  );
  lines.push(
    `  steps to intervention (detected)   mean ${metrics.meanStepsToIntervention ?? "n/a"}, median ${metrics.medianStepsToIntervention ?? "n/a"}`,
  );
  lines.push("");
  lines.push("confusion");
  lines.push("  action      attack  ordinary  hard-neg");
  for (const action of ["observe", "flag", "confirm", "block"]) {
    lines.push(
      `  ${action.padEnd(11)}${String(confusion.attack[action]).padStart(6)}${String(
        confusion.ordinaryBenign[action],
      ).padStart(10)}${String(confusion.hardNegative[action]).padStart(10)}`,
    );
  }
  lines.push("");
  lines.push("attack families");
  for (const [family, group] of Object.entries(report.byFamily)) {
    lines.push(
      `  ${family.padEnd(24)} ${group.interrupted}/${group.sessions} interrupted, ${group.flagged} flagged only`,
    );
  }
  lines.push("");
  lines.push("ablation (session-level, confirm or above)");
  lines.push("  arm              detection  interference");
  for (const arm of ["full", "chainOnly", "ambientOnly", "noContextFlow"]) {
    lines.push(
      `  ${arm.padEnd(16)} ${percent(ablation[arm].detectionRate).padStart(9)}  ${percent(
        ablation[arm].falsePositiveRate,
      ).padStart(12)}`,
    );
  }
  lines.push(
    `  highest risk reachable from ambient signals alone: ${ablation.maxAmbientOnlyRisk} (confirm is ${report.thresholds.confirm})`,
  );
  lines.push("");
  lines.push("missed attacks");
  if (failures.missedAttacks.length === 0) {
    lines.push("  none");
  }
  for (const row of failures.missedAttacks) {
    lines.push(`  - ${row.id}: ended at ${row.action}, risk ${row.risk} (chain ${row.chain})`);
    for (const reason of row.reasons.slice(0, 2)) {
      lines.push(`      ${reason}`);
    }
  }
  lines.push("");
  lines.push("interrupted benign");
  if (failures.interruptedBenign.length === 0) {
    lines.push("  none");
  }
  for (const row of failures.interruptedBenign) {
    lines.push(
      `  - ${row.id}: ${row.action} at step ${row.stepsToIntervention} on ${row.tool}, risk ${row.risk}`,
    );
    for (const reason of row.reasons.slice(0, 2)) {
      lines.push(`      ${reason}`);
    }
  }
  lines.push("");
  lines.push("hard negatives");
  for (const row of report.rows.filter((candidate) => candidate.hardNegative)) {
    lines.push(`  ${row.action.padEnd(8)} ${row.risk.toFixed(3)}  ${row.id}`);
  }
  return lines.join("\n");
}

function main() {
  const report = runEval({ seed: 1 });
  const outPath = join(__dirname, "last-run.json");
  mkdirSync(__dirname, { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(formatReport(report));
  console.log(`\nwrote ${outPath}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
